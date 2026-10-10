

export function showToast(message, type = 'success') {
    const host = document.getElementById('toastHost');
    if (!host) return;

    const palette = {
        success: 'text-bg-success',
        danger: 'text-bg-danger',
        warning: 'text-bg-warning',
        info: 'text-bg-info',
    };

    const el = document.createElement('div');
    el.className = `toast align-items-center ${palette[type] || palette.info} border-0`;
    el.setAttribute('role', 'alert');
    el.setAttribute('aria-live', 'assertive');
    el.setAttribute('aria-atomic', 'true');

    const wrapper = document.createElement('div');
    wrapper.className = 'd-flex';

    const body = document.createElement('div');
    body.className = 'toast-body';
    body.textContent = message;

    const close = document.createElement('button');
    close.type = 'button';
    close.className = 'btn-close btn-close-white me-2 m-auto';
    close.setAttribute('data-bs-dismiss', 'toast');
    close.setAttribute('aria-label', 'Закрыть');

    wrapper.append(body, close);
    el.appendChild(wrapper);
    host.appendChild(el);

    if (!window.bootstrap) {
        setTimeout(() => el.remove(), 4000);
        return;
    }

    el.addEventListener('hidden.bs.toast', () => el.remove(), { once: true });
    new window.bootstrap.Toast(el, { delay: 4000 }).show();
}


export function confirmDialog({
    title = 'Подтверждение',
    body = '',
    okText = 'Удалить',
    okClass = 'btn-danger',
} = {}) {
    return new Promise((resolve) => {
        const modalEl = document.getElementById('confirmModal');
        const okBtn = document.getElementById('confirmModalOk');
        const titleEl = document.getElementById('confirmModalTitle');
        const bodyEl = document.getElementById('confirmModalBody');

        if (!modalEl || !okBtn || !window.bootstrap) {
            resolve(window.confirm(body));
            return;
        }

        titleEl.textContent = title;
        bodyEl.textContent = body;
        okBtn.textContent = okText;
        okBtn.className = `btn btn-sm ${okClass}`;

        const modal = window.bootstrap.Modal.getOrCreateInstance(modalEl);
        let settled = false;

        const finish = (value) => {
            if (settled) return;
            settled = true;
            okBtn.removeEventListener('click', onOk);
            modalEl.removeEventListener('hidden.bs.modal', onHide);
            resolve(value);
        };

        const onOk = () => {
            modal.hide();
            finish(true);   
        };
        const onHide = () => finish(false);

        okBtn.addEventListener('click', onOk);
        modalEl.addEventListener('hidden.bs.modal', onHide);
        modal.show();
    });
}
