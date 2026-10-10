import {
        data,
        setStartupError,
        set_authenticated,
        tokens,
        saveTokens,
        clearTokens,
        resetSessionData,
     } from "../conf/state.js";
import { apiRequest, authenticatedRequest } from "../conf/api.js";
import { redirect } from "../conf/render.js";
import { loadCars } from "./cars.js";

export function normalizeUser(profile) {
    const user = { ...(profile && typeof profile === 'object' ? profile : {}) };
    const first = String(user.first_name || '').trim();
    const last = String(user.last_name || '').trim();
    const username = String(user.username || '').trim();

    const base = first || username || '?';
    const second = last || (first ? '' : username);
    user.initial = (base.charAt(0) || '?').toUpperCase();
    user.initials = `${base.charAt(0)}${second ? second.charAt(0) : ''}`.toUpperCase() || '?';

    user.role = String(user.role || '').trim();

    user.date_joined_label = '';
    if (user.date_joined) {
        const d = new Date(user.date_joined);
        user.date_joined_label = Number.isNaN(d.getTime())
            ? String(user.date_joined)
            : d.toLocaleDateString('ru-RU');
    }
    return user;
}


export async function loadProfile() {
    const profile = normalizeUser(await authenticatedRequest('/profile/'));

    if (profile.id) {
        try {
            const info = await authenticatedRequest(`/profile-info/${profile.id}/`);
            profile.role = info?.role || '';
            profile.email = profile.email || info?.email || '';
        } catch (error) {
            console.warn('Не удалось загрузить роль пользователя:', error);
        }
    }
    return profile;
}

export async function loadIsAdmin() {
    try {
        const payload = await authenticatedRequest('/amisuperuser/');
        data.isAdmin = !!(payload && payload.status_admin);
    } catch (error) {
        console.warn('Не удалось определить права пользователя:', error);
        data.isAdmin = false;
    }
    return data.isAdmin;
}

export async function login(username, password) {
    const result = await apiRequest('/login/', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
    });
    await saveTokens({ access: result.access, refresh: result.refresh });
    data.user = await loadProfile();
    set_authenticated(true);
    data.authenticated = true;
    setStartupError('');


    await Promise.allSettled([loadIsAdmin(), loadCars({ silent: true })]);
}

export async function register(user) {
    await apiRequest('/register/', {
        method: 'POST',
        body: JSON.stringify(user),
    });
    await login(user.username, user.password);
}

export async function logout() {
    const refresh = tokens?.refresh;
    if (refresh) {
        try {
            await apiRequest('/logout/', {
                method: 'POST',
                body: JSON.stringify({ refresh_token: refresh }),
            }, tokens?.access || '');
        } catch {
        }
    }
    await clearTokens();
    set_authenticated(false);
    resetSessionData();
    redirect('/login');
}
