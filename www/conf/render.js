import { routes, titles, PUBLIC_ROUTES, ADMIN_ROUTES } from "./routing.js";
import { data, authReady, startupError, authenticated } from "./state.js";
let lastRender = '';
let pendingRender = 0;

export function rehydrateScripts(root) {
    root.querySelectorAll('script').forEach((old) => {
        const next = document.createElement('script');
        for (const attr of [...old.attributes]) next.setAttribute(attr.name, attr.value);
        if (old.src) next.src = old.src;
        else next.textContent = old.textContent;
        old.replaceWith(next);
    });
}

export function disposeModals(root) {
    const B = window.bootstrap;
    if (B) {
        root.querySelectorAll('.modal').forEach((el) => {
            const inst = B.Modal.getInstance(el);
            if (inst) inst.dispose();
        });
    }
    document.querySelectorAll('.modal-backdrop').forEach((el) => el.remove());
    document.body.classList.remove('modal-open');
    document.body.style.removeProperty('overflow');
    document.body.style.removeProperty('padding-right');
}

export function getCurrentPath() {
    if (location.hash && location.hash.startsWith('#/')) {
        return location.hash.slice(1) || '/';
    }
    return location.pathname || '/';
}


export function render(force = false) {
    if (pendingRender) {
        cancelAnimationFrame(pendingRender);
        pendingRender = 0;
    }
    if (!authReady) return;

    const path = getCurrentPath();
    const isPublic = PUBLIC_ROUTES.includes(path);

    if (!authenticated && !isPublic) {
        redirect('/login');
        return;
    }

    if (authenticated && isPublic) {
        redirect('/');
        return;
    }

    if (ADMIN_ROUTES.includes(path) && !data.isAdmin) {
        redirect('/');
        return;
    }

    if (!location.hash) {
        location.hash = '#/';
        return;
    }

    if (!routes[path]) {
        redirect('/');
        return;
    }

    const key = `${path}|${authenticated ? 1 : 0}`;
    if (!force && key === lastRender) return;
    lastRender = key;

    data.title = titles[path] || data.appName;
    data.path = path;                      
    document.title = `${data.title} — ${data.appName}`;

    const root = document.getElementById('root');
    const template = routes[path];

    disposeModals(root);
    root.innerHTML = window.renderPage(template, data);
    rehydrateScripts(root);

    if (isPublic && path.includes('login') && startupError) {
        const alert = root.querySelector('#nonFieldAlert');
        const text = root.querySelector('#nonFieldText');
        if (alert && text) {
            text.textContent = startupError;
            alert.classList.remove('d-none');
            alert.classList.add('d-flex');
        }
    }
}

export function scheduleRender() {
    if (pendingRender) return;
    pendingRender = requestAnimationFrame(() => {
        pendingRender = 0;
        render();
    });
}

export function redirect(path) {
    const target = `#${path.startsWith('/') ? path : `/${path}`}`;
    lastRender = '';
    if (location.hash === target) render(true);
    else location.hash = target;
}
