/* Runtime-смоук web-клиента.
 *
 * Запускает СОБРАННЫЙ бандл (dist/assets/index-*.js) в Node с заглушками
 * window/document/fetch и проверяет, что:
 *   1. модули загружаются без ReferenceError (опечатки в импортах);
 *   2. холодный старт без токенов уводит на страницу входа;
 *   3. login() тянет профиль, роль, права администратора и список машин,
 *      и данные оказываются в state (то, что рендерят шаблоны).
 *
 * Не заменяет браузерные тесты, но ловит класс ошибок «собралось, а упало».
 * Требует собранного клиента: npm run build && node build/smoke-runtime.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';

const ROOT = path.join(path.dirname(url.fileURLToPath(import.meta.url)), '..');
const ASSETS = path.join(ROOT, 'dist', 'assets');

/* ------------------------------ DOM-заглушки ------------------------------ */

function fakeElement(id) {
    return {
        id,
        value: '',
        textContent: '',
        innerHTML: '',
        className: '',
        style: {},
        classList: { add() {}, remove() {}, toggle() {}, contains() { return false; } },
        setAttribute() {},
        getAttribute() { return null; },
        addEventListener() {},
        removeEventListener() {},
        querySelector() { return null; },
        querySelectorAll() { return []; },
        appendChild() {},
        append() {},
        remove() {},
        focus() {},
        reset() {},
        closest() { return null; },
        matches() { return false; },
        disabled: false,
    };
}

const elements = new Map();
const getElementById = (id) => {
    if (!elements.has(id)) elements.set(id, fakeElement(id));
    return elements.get(id);
};

globalThis.window = {
    addEventListener() {},
    removeEventListener() {},
    location: { hash: '', pathname: '/' },
    confirm: () => false,
    renderPage: () => '<div></div>',
};
globalThis.location = window.location;
globalThis.document = {
    readyState: 'complete',
    title: '',
    addEventListener() {},
    removeEventListener() {},
    getElementById,
    createElement: (tag) => fakeElement(tag),
    querySelector: () => null,
    querySelectorAll: () => [],
    documentElement: fakeElement('html'),
    body: fakeElement('body'),
};
// В Node 22 navigator — getter-only: переопределяем через defineProperty
Object.defineProperty(globalThis, 'navigator', {
    value: { userAgent: 'node-smoke' },
    configurable: true,
});
const storage = new Map();
const sessionStorage = {
    getItem: (key) => (storage.has(key) ? storage.get(key) : null),
    setItem: (key, value) => storage.set(key, String(value)),
    removeItem: (key) => storage.delete(key),
};
globalThis.sessionStorage = sessionStorage;
globalThis.localStorage = { ...sessionStorage };
globalThis.requestAnimationFrame = (fn) => setTimeout(fn, 0);
// Vite-полифил modulepreload дёргает MutationObserver на старте
globalThis.MutationObserver = class { observe() {} disconnect() {} };
// nunjucks в приложении — глобальный скрипт (см. index.html), в Node его нет.
// Заглушка Environment достаточна: смоуку важен поток данных, а не HTML.
globalThis.nunjucks = {
    Environment: class {
        constructor() { this.templates = {}; }
        render() { return '<div></div>'; }
    },
};

/* -------------------------------- fetch --------------------------------- */

const calls = [];

const CAR_FIXTURE = [
    {
        car_id: 1, vin: 'JTDKB20U697777777', model: 'Toyota Camry', year: 2019,
        color: 'Белый', status: 'in_stock', img: null, created_at: '2026-10-01T10:00:00Z',
    },
    {
        car_id: 2, vin: 'WAUZZZ8K0AA000001', model: 'Audi A6', year: 2020,
        color: 'Чёрный', status: 'sold', img: null, created_at: '2026-10-02T10:00:00Z',
    },
];

let authenticatedApi = true; // снимается, чтобы проверить уход на /login

globalThis.fetch = async (target, options = {}) => {
    // Адрес API может быть любым (www/conf/conf.js) — отрезаем префикс по маске
    const path = String(target).replace(/^https?:\/\/[^/]+\/api/, '');
    calls.push(`${options.method || 'GET'} ${path}`);

    const respond = (status, body) => ({
        ok: status >= 200 && status < 300,
        status,
        json: async () => body,
    });

    // Публичные эндпоинты (без Bearer)
    if (path === '/login/' && options.method === 'POST') {
        return respond(200, { access: 'access-token', refresh: 'refresh-token' });
    }

    if (authenticatedApi || options.headers?.Authorization) {
        switch (`${options.method || 'GET'} ${path}`) {
            case 'GET /profile/':
                return respond(200, {
                    id: 7, username: 'ivanov', first_name: 'Иван', last_name: 'Иванов',
                    email: 'ivanov@example.com', date_joined: '2026-10-01T10:00:00Z',
                });
            case 'GET /profile-info/7/':
                return respond(200, { user_id: 7, profile_id: 3, username: 'ivanov', role: 'admin' });
            case 'GET /amisuperuser/':
                return respond(200, { status_admin: true });
            case 'GET /GetCars/':
                return respond(200, CAR_FIXTURE);
            case 'GET /all-users/':
                return respond(200, [{ profile_id: 3, username: 'ivanov', user_id: 7 }]);
            default:
                return respond(404, { error: 'Not found' });
        }
    }
    return respond(401, { detail: 'Given token not valid' });
};

/* -------------------------------- тесты --------------------------------- */

let failed = 0;
const check = (name, condition, extra = '') => {
    if (condition) {
        console.log(`ok   ${name}`);
    } else {
        failed += 1;
        console.log(`FAIL ${name}${extra ? ` — ${extra}` : ''}`);
    }
};

const bundle = fs.readdirSync(ASSETS).find((f) => /^index-.*\.js$/.test(f));
if (!bundle) {
    console.error('dist/assets/index-*.js не найден — сначала выполните npm run build');
    process.exit(1);
}

await import(url.pathToFileURL(path.join(ASSETS, bundle)));

// initialize() работает асинхронно — даём ему отработать
await new Promise((resolve) => setTimeout(resolve, 50));

const debug = globalThis.window.__debug;
check('бандл загрузился, window.__debug доступен', Boolean(debug));
if (!debug) process.exit(1);

check('инициализация завершилась (authReady)', debug.isReady() === true);
check('без токенов ушли на /login', globalThis.window.location.hash === '#/login',
    `hash=${globalThis.window.location.hash}`);

// --- вход ---
authenticatedApi = true;
await globalThis.window.taskflowAuth.login('ivanov', 'Str0ngPass!2026');
await new Promise((resolve) => setTimeout(resolve, 50));

const data = debug.getData();
check('после login сессия активна', data.authenticated === true);
check('профиль загружен', data.user?.username === 'ivanov');
check('роль подтянулась из profile-info', data.user?.role === 'admin',
    `role=${JSON.stringify(data.user?.role)}`);
check('вычислены initials для навбара', data.user?.initials === 'ИИ',
    `initials=${JSON.stringify(data.user?.initials)}`);
check('права администратора', data.isAdmin === true);
check('машины нормализованы', data.cars?.length === 2 && data.allCars?.length === 2,
    `cars=${JSON.stringify(data.cars?.map((c) => c.car_id))}`);
check('списанная машина помечена sold', data.cars?.[1]?.sold === true);
check('карточке машины собрано название', data.cars?.[0]?.title === 'Toyota Camry (JTDKB20U697777777)',
    `title=${JSON.stringify(data.cars?.[0]?.title)}`);
check('запросы ушли по нужным путям',
    calls.includes('POST /login/') && calls.includes('GET /profile/') &&
    calls.includes('GET /profile-info/7/') && calls.includes('GET /amisuperuser/') &&
    calls.includes('GET /GetCars/'),
    calls.join(', '));

console.log(failed ? `\n${failed} ошибок` : '\nRuntime-смоук прошёл');
process.exit(failed ? 1 : 0);
