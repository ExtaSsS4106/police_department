import { API_BASE } from "./conf/conf.js";
import { render, scheduleRender, redirect, getCurrentPath } from "./conf/render.js";
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
        clearTokens,
     } from "./conf/state.js";

import { loadProfile, loadIsAdmin, login, register, logout } from "./views/auth.js";
import { loadCars, initCarHandlers } from "./views/cars.js";
import { loadUsers, initUsersHandlers } from "./views/users.js";

/* ======================= Обработчики ======================= */


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

initCarHandlers();
initUsersHandlers();

/* ======================= Данные страницы ======================= */


function loadPageData() {
    if (!data.authenticated) return;

    const path = getCurrentPath();
    if (path === '/' && !data.carsLoaded && !data.carsLoading) {
        loadCars();
    }
    if ((path === '/users' || path === '/users/') && !data.usersLoaded && !data.usersLoading) {
        loadUsers();
    }
}

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

            await Promise.allSettled([loadIsAdmin(), loadCars({ silent: true })]);
        }
    } catch (error) {
        if (error.status === 401) {
            await clearTokens();
            setTokens(null);
            set_authenticated(false);
            data.authenticated = false;
        } else {
            setStartupError(error.message);
        }
    }

    markAuthReady();
    render(true);
    loadPageData();
}

window.taskflowAuth = { login, register, logout };
window.logout = logout;
window.navigate = (path) => redirect(path.startsWith('/') ? path : `/${path}`);

// Для отладки из DevTools
window.__debug = {
    loadProfile,
    loadIsAdmin,
    loadCars,
    loadUsers,
    login,
    logout,
    getData: () => data,
    getApiBase: () => API_BASE,
    getStartupError: () => startupError,
    isReady: () => authReady,
};

function onRouteChange() {
    scheduleRender();
    loadPageData();
}

window.addEventListener('hashchange', onRouteChange);
window.addEventListener('popstate', onRouteChange);

if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', initialize, { once: true });
} else {
    initialize();
}
