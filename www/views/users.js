

import { data } from "../conf/state.js";
import { authenticatedRequest } from "../conf/api.js";
import { showToast } from "../conf/ui.js";

function normalizeUserRow(raw = {}) {
    return {
        profile_id: raw.profile_id,
        user_id: raw.user_id,
        username: String(raw.username || ''),
    };
}

export function filterUsers(list, query) {
    const q = String(query || '').trim().toLowerCase();
    if (!q) return list.slice();
    return list.filter((row) => row.username.toLowerCase().includes(q));
}

export async function loadUsers({ silent = false } = {}) {
    if (!silent) {
        data.usersLoading = true;
        data.usersError = '';
        renderUsersUi();
    }
    try {
        const payload = await authenticatedRequest('/all-users/');
        data.allUsers = (Array.isArray(payload) ? payload : []).map(normalizeUserRow);
        data.users = filterUsers(data.allUsers, data.usersQuery);
        data.usersLoaded = true;
        data.usersError = '';
    } catch (error) {
        console.error('Не удалось загрузить пользователей:', error);
        data.usersError = error.message || 'Не удалось загрузить список пользователей';
        showToast(data.usersError, 'danger');
    } finally {
        data.usersLoading = false;
        renderUsersUi();
    }
}

export async function searchUsers(query) {
    data.usersQuery = String(query || '').trim();

    if (!data.usersLoaded) {
        await loadUsers();
        return;
    }

    data.users = filterUsers(data.allUsers, data.usersQuery);
    renderUsersUi();
}

export function renderUsersUi() {
    const root = document.getElementById('root');
    if (!root) return;

    const wrap = root.querySelector('#userListWrap');
    if (wrap) wrap.innerHTML = window.renderPage('components/users_list.html', data);

    const shown = root.querySelector('#usersShown');
    if (shown) shown.textContent = String(data.users.length);

    const total = root.querySelector('#usersTotal');
    if (total) total.textContent = String(data.allUsers.length);
}

export function initUsersHandlers() {
    document.addEventListener('submit', (event) => {
        if (event.target.id !== 'userSearchForm') return;
        event.preventDefault();
        const input = document.getElementById('userSearchInput');
        searchUsers(input ? input.value : '');
    });

    document.addEventListener('click', (event) => {
        if (event.target.closest('#userSearchReset')) {
            const input = document.getElementById('userSearchInput');
            if (input) input.value = '';
            searchUsers('');
            return;
        }

        if (event.target.closest('#usersRefresh')) {
            loadUsers();
        }
    });
}
