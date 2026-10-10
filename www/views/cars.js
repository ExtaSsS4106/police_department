import { 
        data,
        setStartupError, 
        set_authenticated, 
        tokens, 
        saveTokens,
        clearTokens
     } from "../conf/state.js";
import { apiRequest, authenticatedRequest} from "../conf/api.js";
import { redirect } from "../conf/render.js";


export async function getData(){
    try{
        data.data = await authenticatedRequest('/GetCars/');
    }catch(error){
        data.data = {message: error.message || 'Не удалось загрузить'};
        console.error('about', error);
    }
    render(true);
}

export async function loadCars({ silent = false } = {}) {
    if (!silent) {
        data.loading = true;
        renderCarsUi();
    }
    try {
        const payload = await authenticatedRequest('/GetCars/');
        tasks = (Array.isArray(payload) ? payload : []).map(normalizeTask);

        const alive = new Set(tasks.map((t) => String(t.id)));
        for (const id of [...selected]) {
            if (!alive.has(id)) selected.delete(id);
        }
    } catch (error) {
        console.error('Не удалось загрузить данные:', error);
        notify(error.message || 'Не удалось загрузить данные', 'danger');
    } finally {
        data.loading = false;
        renderCarsUi();
    }
}


export function renderCarsUi() {
    const root = document.getElementById('root');
    if (!root) return;

    const statsRow = root.querySelector('#statsRow');
    if (statsRow) statsRow.innerHTML = window.renderPage('partials/stats.html', data);

    const listWrap = root.querySelector('#taskListWrap');
    if (listWrap) {
        listWrap.innerHTML = window.renderPage('partials/task_list.html', data);
        attachListHandlers(root);
    }

    syncControls(root);
}