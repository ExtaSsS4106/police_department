import { API_BASE } from "./conf/conf.js";
import { render, scheduleRender, redirect} from "./conf/render.js"
import { 
        data,
        authReady, 
        startupError, 
        markAuthReady, 
        setStartupError, 
        set_authenticated, 
        tokens, 
        setTokens,
        readTokens,
        saveTokens,
        clearTokens
     } from "./conf/state.js";

import { loadProfile, login, register, logout } from "./views/auth.js";
import { loadCars, renderCarsUi } from "./views/cars.js";
/* ======================= Ошибки ======================= */

class ApiError extends Error {
    constructor(message, status) {
        super(message);
        this.status = status;
    }
}

// DRF отдаёт ошибки вложенной структурой — разворачиваем в читаемую строку
function flattenMessages(value) {
    if (value === null || value === undefined) return [];
    if (typeof value === 'string') return [value];
    if (Array.isArray(value)) return value.flatMap(flattenMessages);
    if (typeof value === 'object') return Object.values(value).flatMap(flattenMessages);
    return [String(value)];
}


/* ======================= Auth ======================= */


/* ======================= Обработчики ======================= */

// Один раз на документе, делегированием: переживает любую перерисовку #root
// и не требует повторного attach после каждого render().
document.addEventListener('click', (event) => {
    const logoutBtn = event.target.closest('[data-logout]');
    if (!logoutBtn) return;
    event.preventDefault();
    logout();
});

document.addEventListener('submit', (event) => {
    if (!event.target.matches('form[action="/logout/"]')) return;
    event.preventDefault();
    logout();
});

/* ======================= Инициализация ======================= */

async function initialize() {
    if (!window.bootstrap) {
        console.error('[Template] window.bootstrap не определён — модалки и уведомления не работают.');
    }

    try {
        setTokens(await readTokens());
        if (tokens?.access) {
            data.user = await loadProfile();
            set_authenticated(true);
            data.authenticated = true;
            await loadCars({ silent: true });
        }
    } catch (error) {
        if (error.status === 401) {
            // Токен протух и не восстановился — чистим сессию и уходим на вход
            await clearTokens();
            setTokens(null);
            set_authenticated(false);
        } else {
            // Сетевая ошибка (status 0) — покажем её на странице входа
            setStartupError(error.message);
        }
    }

    markAuthReady();
    render(true);
}

/* ======================= Экспорт для inline-скриптов ======================= */
// Шаблоны (auth/login.html, auth/reg.html) зовут эти функции из своих <script>,
// которые оживляет rehydrateScripts(). Объявляем ДО запуска initialize().

window.taskflowAuth = { login, register, logout };
window.logout = logout;
window.navigate = (path) => redirect(path.startsWith('/') ? path : `/${path}`);

// Для отладки из DevTools
window.__debug = {
    loadProfile,
    login,
    logout,
    getData: () => data,
    getApiBase: () => API_BASE,
    getStartupError: () => startupError,
    isReady: () => authReady,
};

window.addEventListener('hashchange', scheduleRender);
window.addEventListener('popstate', scheduleRender);

if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', initialize, { once: true });
} else {
    initialize();
}
