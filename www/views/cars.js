// Автомобили: загрузка, поиск, приём и списание.
// Контракт с сервером (api/urls.py):
//   GET  /api/GetCars/    -> [{car_id, vin, model, year, color, status, img, created_at}]
//   POST /api/AcceptCar/  {vin, model, year?, color?} -> 201
//   POST /api/DeleteCar/  {car_id} -> 200 (car.status = 'sold')

import { data } from "../conf/state.js";
import { authenticatedRequest } from "../conf/api.js";
import { ApiError } from "../conf/errors.js";
import { showToast, confirmDialog } from "../conf/ui.js";

function normalizeCar(raw = {}) {
    const status = String(raw.status || 'in_stock');
    return {
        car_id: raw.car_id,
        vin: String(raw.vin || ''),
        model: String(raw.model || ''),
        year: raw.year || null,
        color: String(raw.color || ''),
        status,
        img: raw.img || '',
        created_at: raw.created_at || '',
        title: `${raw.model || 'Без названия'} (${raw.vin || '—'})`,
        sold: status === 'sold',
    };
}


export function filterCars(list, query) {
    const q = String(query || '').trim().toLowerCase();
    if (!q) return list.slice();
    return list.filter((car) =>
        [car.vin, car.model, car.year, car.color, car.status]
            .some((field) => String(field ?? '').toLowerCase().includes(q)),
    );
}

export async function loadCars({ silent = false } = {}) {
    if (!silent) {
        data.carsLoading = true;
        data.carsError = '';
        renderCarsUi();
    }
    try {
        const payload = await authenticatedRequest('/GetCars/');
        data.allCars = (Array.isArray(payload) ? payload : []).map(normalizeCar);
        data.cars = filterCars(data.allCars, data.carsQuery);
        data.carsLoaded = true;
        data.carsError = '';
    } catch (error) {
        console.error('Не удалось загрузить автомобили:', error);
        data.carsError = error.message || 'Не удалось загрузить список автомобилей';
    } finally {
        data.carsLoading = false;
        renderCarsUi();
    }
}

export async function searchCars(query) {
    data.carsQuery = String(query || '').trim();

    if (!data.carsLoaded) {
        await loadCars();
        return;
    }

    data.cars = filterCars(data.allCars, data.carsQuery);
    renderCarsUi();
}

export async function addCar({ vin, model, year, color }) {
    await authenticatedRequest('/AcceptCar/', {
        method: 'POST',
        body: JSON.stringify({
            vin,
            model,
            year: year || null,
            color: color || '',
        }),
    });
    await loadCars({ silent: true });
    showToast('Автомобиль принят на учёт', 'success');
}

export async function sellCar(car) {
    const confirmed = await confirmDialog({
        title: 'Списать автомобиль',
        body: `${car.title} будет списан с учёта. Действие необратимо.`,
        okText: 'Списать',
        okClass: 'btn-danger',
    });
    if (!confirmed) return;

    try {
        await requestSell(car.car_id);
        await loadCars({ silent: true });
        showToast('Автомобиль списан', 'success');
    } catch (error) {
        console.error('Не удалось списать автомобиль:', error);
        showToast(error.message || 'Не удалось списать автомобиль', 'danger');
    }
}


const SELL_ENDPOINTS = ['/DeleteCar/', '/SellCar/'];

async function requestSell(carId) {
    let lastError = null;

    for (const endpoint of SELL_ENDPOINTS) {
        try {
            return await authenticatedRequest(endpoint, {
                method: 'POST',
                body: JSON.stringify({ car_id: carId }),
            });
        } catch (error) {
            const endpointMissing =
                error.status === 404 && !String(error.message).includes('Car not found');
            if (!endpointMissing) throw error;
            lastError = error;
        }
    }

    throw lastError || new ApiError('Сервер не отвечает за списание автомобиля', 0);
}


export function renderCarsUi() {
    const root = document.getElementById('root');
    if (!root) return;

    const wrap = root.querySelector('#carListWrap');
    if (wrap) wrap.innerHTML = window.renderPage('components/cars_list.html', data);

    const shown = root.querySelector('#carsShown');
    if (shown) shown.textContent = String(data.cars.length);

    const total = root.querySelector('#carsTotal');
    if (total) total.textContent = String(data.allCars.length);
}


const VIN_LENGTH = 17;

function validateAddCarForm(form) {
    const fields = {
        vin: form.querySelector('#carVin'),
        model: form.querySelector('#carModel'),
        year: form.querySelector('#carYear'),
        color: form.querySelector('#carColor'),
    };
    const errors = {};

    const vin = fields.vin.value.trim().toUpperCase();
    if (!vin) errors.vin = 'Укажите VIN.';
    else if (vin.length !== VIN_LENGTH) errors.vin = `VIN должен содержать ровно ${VIN_LENGTH} символов.`;
    else if (!/^[A-Z0-9]+$/.test(vin)) errors.vin = 'VIN может содержать только буквы и цифры.';

    const model = fields.model.value.trim();
    if (!model) errors.model = 'Укажите модель.';

    const yearRaw = fields.year.value.trim();
    let year = null;
    if (yearRaw) {
        year = Number(yearRaw);
        if (!Number.isInteger(year) || year < 1900 || year > 2100) {
            errors.year = 'Год выпуска — целое число от 1900 до 2100.';
        }
    }

    const map = { vin: fields.vin, model: fields.model, year: fields.year, color: fields.color };
    for (const [name, input] of Object.entries(map)) {
        input.classList.toggle('is-invalid', Boolean(errors[name]));
    }
    const firstInvalid = Object.keys(map).find((name) => errors[name]);
    if (firstInvalid) map[firstInvalid].focus();

    return {
        ok: !firstInvalid,
        fields,
        values: {
            vin,
            model,
            year,
            color: fields.color.value.trim(),
        },
    };
}

async function submitAddCar(form) {
    const alertEl = form.querySelector('#addCarAlert');
    const alertText = form.querySelector('#addCarAlertText');
    const submitBtn = form.querySelector('#addCarSubmit');
    const spinner = form.querySelector('#addCarSpinner');
    const icon = form.querySelector('#addCarIcon');

    alertEl.classList.add('d-none');
    alertEl.classList.remove('d-flex');

    const check = validateAddCarForm(form);
    if (!check.ok) return;

    submitBtn.disabled = true;
    icon.classList.add('d-none');
    spinner.classList.remove('d-none');

    try {
        await addCar(check.values);

        form.reset();
        for (const input of form.querySelectorAll('.is-invalid, .is-valid')) {
            input.classList.remove('is-invalid', 'is-valid');
        }

        const modalEl = document.getElementById('addCarModal');
        const instance = modalEl && window.bootstrap
            ? window.bootstrap.Modal.getInstance(modalEl)
            : null;
        if (instance) instance.hide();
    } catch (error) {
        console.error('Не удалось принять автомобиль:', error);
        alertText.textContent = error.message || 'Не удалось принять автомобиль';
        alertEl.classList.remove('d-none');
        alertEl.classList.add('d-flex');
    } finally {
        submitBtn.disabled = false;
        spinner.classList.add('d-none');
        icon.classList.remove('d-none');
    }
}


export function initCarHandlers() {
    document.addEventListener('submit', (event) => {
        if (event.target.id === 'carSearchForm') {
            event.preventDefault();
            const input = document.getElementById('carSearchInput');
            searchCars(input ? input.value : '');
            return;
        }
        if (event.target.id === 'addCarForm') {
            event.preventDefault();
            submitAddCar(event.target);
        }
    });

    document.addEventListener('click', (event) => {
        if (event.target.closest('#carSearchReset')) {
            const input = document.getElementById('carSearchInput');
            if (input) input.value = '';
            searchCars('');
            return;
        }

        if (event.target.closest('#carsRefresh')) {
            loadCars();
            return;
        }

        const sellBtn = event.target.closest('[data-sell-car]');
        if (!sellBtn) return;

        const carId = sellBtn.getAttribute('data-sell-car');
        const car = data.allCars.find((item) => String(item.car_id) === String(carId));
        if (car) sellCar(car);
    });
}
