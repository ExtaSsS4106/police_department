const { app, BrowserWindow, ipcMain, safeStorage } = require('electron');
const fs = require('fs/promises');
const http = require('http');
const path = require('path');
const os = require('os');



function ipv4ToNumber(address) {
    return address.split('.').reduce((value, octet) => ((value << 8) | Number(octet)) >>> 0, 0);
}

function numberToIPv4(value) {
    return [24, 16, 8, 0].map((shift) => (value >>> shift) & 255).join('.');
}

function getCandidateIPs() {
    const candidates = new Set();

    for (const devices of Object.values(os.networkInterfaces())) {
        for (const device of devices ?? []) {
            if (device.family !== 'IPv4' || device.internal || !device.netmask) continue;

            const address = ipv4ToNumber(device.address);
            const mask = ipv4ToNumber(device.netmask);
            let network = (address & mask) >>> 0;
            let broadcast = (network | (~mask >>> 0)) >>> 0;

            if (broadcast - network > 4097) {
                network = (address & 0xffffff00) >>> 0;
                broadcast = (network | 255) >>> 0;
            }

            for (let host = network + 1; host < broadcast; host += 1) {
                candidates.add(numberToIPv4(host));
            }
        }
    }

    return [...candidates];
}

function probeApi(host) {
    return new Promise((resolve) => {
        const request = http.get({
            hostname: host,
            port: 8080,
            // На бэке нет /api/ping/ — GET /api/ отвечает 404 + {"error": "Not found"}.
            // Любого HTTP-ответа достаточно, чтобы считать сервер найденным.
            path: '/api/',
            timeout: 700,
        }, (response) => {
            response.resume();
            resolve(response.statusCode >= 200 && response.statusCode < 500
                ? `http://${host}:8080/api`
                : null);
        });

        request.on('timeout', () => request.destroy());
        request.on('error', () => resolve(null));
    });
}

async function findApiBase() {
    const candidates = getCandidateIPs();
    const deadline = Date.now() + 4000; // не блокируем запуск дольше 4 секунд
    let nextIndex = 0;
    let found = null;

    const workers = Array.from({ length: 48 }, async () => {
        while (!found && nextIndex < candidates.length && Date.now() < deadline) {
            found = await probeApi(candidates[nextIndex++]) || found;
        }
    });

    await Promise.all(workers);
    console.log('API base found:', found);
    return found;
}


const authFile = () => path.join(app.getPath('userData'), 'auth.json');

function registerAuthStorage() {
    ipcMain.handle('auth:load', async () => {
        try {
            const encrypted = await fs.readFile(authFile(), 'utf8');
            if (!safeStorage.isEncryptionAvailable()) {
                throw new Error('Зашифрованное хранилище недоступно');
            }
            return JSON.parse(safeStorage.decryptString(Buffer.from(encrypted, 'base64')));
        } catch (error) {
            if (error.code === 'ENOENT') return null;
            throw error;
        }
    });
    ipcMain.handle('auth:save', async (_event, tokens) => {
        if (!safeStorage.isEncryptionAvailable()) {
            throw new Error('Зашифрованное хранилище недоступно');
        }
        const encrypted = safeStorage.encryptString(JSON.stringify(tokens));
        await fs.mkdir(app.getPath('userData'), { recursive: true });
        await fs.writeFile(authFile(), encrypted.toString('base64'), { mode: 0o600 });
    });

    ipcMain.handle('auth:clear', async () => {
        await fs.rm(authFile(), { force: true });
    });
}

function createWindow() {
    const win = new BrowserWindow({
        width: 1200,
        height: 800,
        minWidth: 360,
        minHeight: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false,
            // Десктоп-клиент ходит по file:// на Django в локальной сети.
            // Отключаем SOP/CORS, чтобы API работал без cors-headers на сервере.
            // Граница renderer/node (contextIsolation) при этом сохраняется.
            webSecurity: false,
        },
    });

    win.loadFile(path.join(__dirname, '..', 'dist', 'index.html'));

    if (process.env.NODE_ENV === 'development') {
        win.webContents.openDevTools();
    }
}

app.whenReady().then(() => {
    registerAuthStorage();
    createWindow();
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});