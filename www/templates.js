(function (global) {
  var templates = {};
  var env = null;

  (function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["auth/_layout.html"] = (function() {
function root(env, context, frame, runtime, cb) {
var lineno = 0;
var colno = 0;
var output = "";
try {
var parentTemplate = null;
output += "\n<div class=\"container\">\n    <div class=\"row justify-content-center align-items-center min-vh-100 py-5\">\n        <div class=\"col-12 col-sm-10 col-md-8 col-lg-10 col-xl-6\">\n            ";
(parentTemplate ? function(e, c, f, r, cb) { cb(""); } : context.getBlock("content"))(env, context, frame, runtime, function(t_2,t_1) {
if(t_2) { cb(t_2); return; }
output += t_1;
output += "\n        </div>\n    </div>\n</div>\n\n";
(parentTemplate ? function(e, c, f, r, cb) { cb(""); } : context.getBlock("extra_js"))(env, context, frame, runtime, function(t_4,t_3) {
if(t_4) { cb(t_4); return; }
output += t_3;
output += "\n";
if(parentTemplate) {
parentTemplate.rootRenderFunc(env, context, frame, runtime, cb);
} else {
cb(null, output);
}
})});
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
function b_content(env, context, frame, runtime, cb) {
var lineno = 5;
var colno = 15;
var output = "";
try {
var frame = frame.push(true);
cb(null, output);
;
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
function b_extra_js(env, context, frame, runtime, cb) {
var lineno = 10;
var colno = 3;
var output = "";
try {
var frame = frame.push(true);
cb(null, output);
;
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
return {
b_content: b_content,
b_extra_js: b_extra_js,
root: root
};

})();
})();

(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["auth/login.html"] = (function() {
function root(env, context, frame, runtime, cb) {
var lineno = 0;
var colno = 0;
var output = "";
try {
var parentTemplate = null;
env.getTemplate("auth/_layout.html", true, "auth/login.html", false, function(t_3,t_2) {
if(t_3) { cb(t_3); return; }
parentTemplate = t_2
for(var t_1 in parentTemplate.blocks) {
context.addBlock(t_1, parentTemplate.blocks[t_1]);
}
output += "\n\n";
(parentTemplate ? function(e, c, f, r, cb) { cb(""); } : context.getBlock("title"))(env, context, frame, runtime, function(t_5,t_4) {
if(t_5) { cb(t_5); return; }
output += t_4;
output += "\n\n";
(parentTemplate ? function(e, c, f, r, cb) { cb(""); } : context.getBlock("content"))(env, context, frame, runtime, function(t_7,t_6) {
if(t_7) { cb(t_7); return; }
output += t_6;
output += "\n\n";
(parentTemplate ? function(e, c, f, r, cb) { cb(""); } : context.getBlock("extra_js"))(env, context, frame, runtime, function(t_9,t_8) {
if(t_9) { cb(t_9); return; }
output += t_8;
if(parentTemplate) {
parentTemplate.rootRenderFunc(env, context, frame, runtime, cb);
} else {
cb(null, output);
}
})})})});
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
function b_title(env, context, frame, runtime, cb) {
var lineno = 2;
var colno = 3;
var output = "";
try {
var frame = frame.push(true);
output += "Авторизация — ";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "appName"), env.opts.autoescape);
cb(null, output);
;
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
function b_content(env, context, frame, runtime, cb) {
var lineno = 4;
var colno = 3;
var output = "";
try {
var frame = frame.push(true);
output += "\n<div class=\"card shadow-lg border-0 rounded-4\">\n    <div class=\"card-body p-4 p-md-5\">\n\n        <div class=\"text-center mb-4\">\n            <div class=\"d-inline-flex align-items-center justify-content-center bg-primary bg-opacity-10 text-primary rounded-circle mb-3\"\n                 style=\"width:64px;height:64px;\">\n                <i class=\"bi bi-shield-lock fs-2\"></i>\n            </div>\n            <h1 class=\"h3 fw-bold mb-2\">Вход в аккаунт</h1>\n            <p class=\"text-body-secondary small mb-0\">Введите свои данные для входа</p>\n        </div>\n\n        <!-- Общая ошибка -->\n        <div class=\"alert alert-danger d-none align-items-center gap-2 py-2 small\"\n             id=\"nonFieldAlert\" role=\"alert\">\n            <i class=\"bi bi-exclamation-triangle-fill\"></i>\n            <div id=\"nonFieldText\"></div>\n        </div>\n\n        <!-- Успех -->\n        <div class=\"alert alert-success d-none align-items-center gap-2\"\n             id=\"successAlert\" role=\"alert\">\n            <i class=\"bi bi-check-circle-fill\"></i>\n            <div>Успешный вход! Перенаправляем…</div>\n        </div>\n\n        <form id=\"loginForm\" novalidate>\n\n            <!-- Логин -->\n            <div class=\"mb-3\">\n                <label for=\"username\" class=\"form-label\">Имя пользователя</label>\n                <div class=\"input-group input-group-lg has-validation\">\n                    <span class=\"input-group-text\"><i class=\"bi bi-person\"></i></span>\n                    <input type=\"text\"\n                           class=\"form-control\"\n                           id=\"username\"\n                           name=\"username\"\n                           placeholder=\"username\"\n                           autocomplete=\"username\"\n                           required>\n                    <div class=\"invalid-feedback\" id=\"usernameError\">\n                        Введите имя пользователя.\n                    </div>\n                </div>\n            </div>\n\n            <!-- Пароль -->\n            <div class=\"mb-3\">\n                <label for=\"password\" class=\"form-label\">Пароль</label>\n                <div class=\"input-group input-group-lg has-validation\">\n                    <span class=\"input-group-text\"><i class=\"bi bi-key\"></i></span>\n                    <input type=\"password\"\n                           class=\"form-control\"\n                           id=\"password\"\n                           name=\"password\"\n                           placeholder=\"••••••••\"\n                           minlength=\"6\"\n                           autocomplete=\"current-password\"\n                           required>\n                    <button class=\"btn btn-outline-secondary\"\n                            type=\"button\"\n                            id=\"togglePassword\"\n                            aria-label=\"Показать пароль\">\n                        <i class=\"bi bi-eye\" id=\"toggleIcon\"></i>\n                    </button>\n                    <div class=\"invalid-feedback\" id=\"passwordError\">\n                        Пароль должен содержать минимум 6 символов.\n                    </div>\n                </div>\n            </div>\n\n            <button type=\"submit\" class=\"btn btn-primary btn-lg w-100 mb-3\" id=\"submitBtn\">\n                <span class=\"spinner-border spinner-border-sm me-2 d-none\"\n                      id=\"submitSpinner\" role=\"status\" aria-hidden=\"true\"></span>\n                <i class=\"bi bi-box-arrow-in-right me-1\" id=\"submitIcon\"></i>\n                <span id=\"submitText\">Войти</span>\n            </button>\n        </form>\n\n        <div class=\"text-center\">\n            <span class=\"text-body-secondary small\">Нет аккаунта?</span>\n            <a href=\"#/register\" class=\"text-decoration-none small\">Зарегистрироваться</a>\n        </div>\n\n    </div>\n</div>\n";
cb(null, output);
;
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
function b_extra_js(env, context, frame, runtime, cb) {
var lineno = 93;
var colno = 3;
var output = "";
try {
var frame = frame.push(true);
output += "\n<script>\n(() => {\n    const form = document.getElementById('loginForm');\n    if (!form) return; // DOM ещё не готов (скрипт пересоздаётся при рендере)\n\n    const username      = document.getElementById('username');\n    const password      = document.getElementById('password');\n    const usernameError = document.getElementById('usernameError');\n    const passwordError = document.getElementById('passwordError');\n\n    const toggleBtn     = document.getElementById('togglePassword');\n    const toggleIcon    = document.getElementById('toggleIcon');\n\n    const submitBtn     = document.getElementById('submitBtn');\n    const submitSpinner = document.getElementById('submitSpinner');\n    const submitIcon    = document.getElementById('submitIcon');\n    const submitText    = document.getElementById('submitText');\n\n    const successAlert  = document.getElementById('successAlert');\n    const nonFieldAlert = document.getElementById('nonFieldAlert');\n    const nonFieldText  = document.getElementById('nonFieldText');\n\n    // ----- Показать/скрыть пароль -----\n    toggleBtn.addEventListener('click', () => {\n        const hidden = password.type === 'password';\n        password.type = hidden ? 'text' : 'password';\n        toggleIcon.classList.toggle('bi-eye', !hidden);\n        toggleIcon.classList.toggle('bi-eye-slash', hidden);\n        toggleBtn.setAttribute('aria-label', hidden ? 'Скрыть пароль' : 'Показать пароль');\n    });\n\n    // ----- Валидация -----\n    const validators = {\n        username() {\n            return username.value.trim() ? '' : 'Введите имя пользователя.';\n        },\n        password() {\n            if (!password.value) return 'Введите пароль.';\n            if (password.value.length < 6) return 'Пароль должен содержать минимум 6 символов.';\n            return '';\n        }\n    };\n\n    function setFieldState(input, errorEl, message) {\n        if (message) {\n            input.classList.add('is-invalid');\n            input.classList.remove('is-valid');\n            errorEl.textContent = message;\n        } else {\n            input.classList.remove('is-invalid');\n            input.classList.add('is-valid');\n        }\n    }\n\n    function validateField(name) {\n        const input   = name === 'username' ? username : password;\n        const errorEl = name === 'username' ? usernameError : passwordError;\n        const msg     = validators[name]();\n        setFieldState(input, errorEl, msg);\n        return !msg;\n    }\n\n    ['username', 'password'].forEach(name => {\n        const input = name === 'username' ? username : password;\n        input.addEventListener('blur', () => validateField(name));\n        input.addEventListener('input', () => {\n            if (input.classList.contains('is-invalid')) validateField(name);\n        });\n    });\n\n    function showError(msg) {\n        nonFieldText.textContent = msg;\n        nonFieldAlert.classList.remove('d-none');\n        nonFieldAlert.classList.add('d-flex');\n    }\n\n    // ----- Отправка -----\n    form.addEventListener('submit', async (e) => {\n        e.preventDefault();\n\n        nonFieldAlert.classList.add('d-none');\n        nonFieldAlert.classList.remove('d-flex');\n\n        const okUser = validateField('username');\n        const okPass = validateField('password');\n        if (!okUser || !okPass) {\n            (!okUser ? username : password).focus();\n            return;\n        }\n\n        submitBtn.disabled = true;\n        submitIcon.classList.add('d-none');\n        submitSpinner.classList.remove('d-none');\n        submitText.textContent = 'Проверяем…';\n\n        try {\n            await window.taskflowAuth.login(username.value.trim(), password.value);\n            successAlert.classList.remove('d-none');\n            successAlert.classList.add('d-flex');\n            setTimeout(() => window.navigate('/'), 400);\n        } catch (error) {\n            showError(error.message || 'Не удалось войти');\n            submitBtn.disabled = false;\n            submitSpinner.classList.add('d-none');\n            submitIcon.classList.remove('d-none');\n            submitText.textContent = 'Войти';\n        }\n    });\n})();\n</script>\n";
cb(null, output);
;
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
return {
b_title: b_title,
b_content: b_content,
b_extra_js: b_extra_js,
root: root
};

})();
})();

(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["auth/reg.html"] = (function() {
function root(env, context, frame, runtime, cb) {
var lineno = 0;
var colno = 0;
var output = "";
try {
var parentTemplate = null;
env.getTemplate("auth/_layout.html", true, "auth/reg.html", false, function(t_3,t_2) {
if(t_3) { cb(t_3); return; }
parentTemplate = t_2
for(var t_1 in parentTemplate.blocks) {
context.addBlock(t_1, parentTemplate.blocks[t_1]);
}
output += "\n\n";
(parentTemplate ? function(e, c, f, r, cb) { cb(""); } : context.getBlock("title"))(env, context, frame, runtime, function(t_5,t_4) {
if(t_5) { cb(t_5); return; }
output += t_4;
output += "\n\n";
(parentTemplate ? function(e, c, f, r, cb) { cb(""); } : context.getBlock("content"))(env, context, frame, runtime, function(t_7,t_6) {
if(t_7) { cb(t_7); return; }
output += t_6;
output += "\n\n";
(parentTemplate ? function(e, c, f, r, cb) { cb(""); } : context.getBlock("extra_js"))(env, context, frame, runtime, function(t_9,t_8) {
if(t_9) { cb(t_9); return; }
output += t_8;
if(parentTemplate) {
parentTemplate.rootRenderFunc(env, context, frame, runtime, cb);
} else {
cb(null, output);
}
})})})});
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
function b_title(env, context, frame, runtime, cb) {
var lineno = 2;
var colno = 3;
var output = "";
try {
var frame = frame.push(true);
output += "Регистрация — ";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "appName"), env.opts.autoescape);
cb(null, output);
;
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
function b_content(env, context, frame, runtime, cb) {
var lineno = 4;
var colno = 3;
var output = "";
try {
var frame = frame.push(true);
output += "\n<div class=\"card shadow-lg border-0 rounded-4\">\n    <div class=\"card-body p-4 p-md-5\">\n\n        <div class=\"text-center mb-4\">\n            <div class=\"d-inline-flex align-items-center justify-content-center bg-primary bg-opacity-10 text-primary rounded-circle mb-3\"\n                 style=\"width:64px;height:64px;\">\n                <i class=\"bi bi-person-plus fs-2\"></i>\n            </div>\n            <h1 class=\"h3 fw-bold mb-2\">Создать аккаунт</h1>\n            <p class=\"text-body-secondary small mb-0\">Заполните форму, чтобы начать</p>\n        </div>\n\n        <div class=\"alert alert-success d-none align-items-center gap-2\"\n             id=\"successAlert\" role=\"alert\">\n            <i class=\"bi bi-check-circle-fill\"></i>\n            <div>Аккаунт создан! Перенаправляем…</div>\n        </div>\n\n        <div class=\"alert alert-danger d-none align-items-center gap-2 py-2 small\"\n             id=\"nonFieldAlert\" role=\"alert\">\n            <i class=\"bi bi-exclamation-triangle-fill\"></i>\n            <div id=\"nonFieldText\"></div>\n        </div>\n\n        <form id=\"registerForm\" novalidate>\n\n            <!-- Имя -->\n            <div class=\"mb-3\">\n                <label for=\"username\" class=\"form-label\">Имя пользователя</label>\n                <div class=\"input-group input-group-lg has-validation\">\n                    <span class=\"input-group-text\"><i class=\"bi bi-person\"></i></span>\n                    <input type=\"text\"\n                           class=\"form-control\"\n                           id=\"username\"\n                           name=\"username\"\n                           placeholder=\"username\"\n                           minlength=\"3\"\n                           maxlength=\"150\"\n                           required>\n                    <div class=\"invalid-feedback\" id=\"nameError\">\n                        Введите имя пользователя (минимум 3 символа).\n                    </div>\n                </div>\n            </div>\n\n            <!-- Email -->\n            <div class=\"mb-3\">\n                <label for=\"email\" class=\"form-label\">Email</label>\n                <div class=\"input-group input-group-lg has-validation\">\n                    <span class=\"input-group-text\"><i class=\"bi bi-envelope\"></i></span>\n                    <input type=\"email\"\n                           class=\"form-control\"\n                           id=\"email\"\n                           name=\"email\"\n                           placeholder=\"name@example.com\"\n                           required>\n                    <div class=\"invalid-feedback\" id=\"emailError\">\n                        Введите корректный email.\n                    </div>\n                </div>\n            </div>\n\n            <!-- Имя -->\n            <div class=\"row g-3 mb-3\">\n                <div class=\"col-12 col-sm-6\">\n                    <label for=\"firstName\" class=\"form-label\">Имя</label>\n                    <input type=\"text\" class=\"form-control\" id=\"firstName\"\n                           name=\"first_name\" placeholder=\"John\" maxlength=\"150\">\n                </div>\n                <div class=\"col-12 col-sm-6\">\n                    <label for=\"lastName\" class=\"form-label\">Фамилия</label>\n                    <input type=\"text\" class=\"form-control\" id=\"lastName\"\n                           name=\"last_name\" placeholder=\"Doe\" maxlength=\"150\">\n                </div>\n            </div>\n\n            <!-- Пароль -->\n            <div class=\"mb-3\">\n                <label for=\"password\" class=\"form-label\">Пароль</label>\n                <div class=\"input-group input-group-lg has-validation\">\n                    <span class=\"input-group-text\"><i class=\"bi bi-key\"></i></span>\n                    <input type=\"password\"\n                           class=\"form-control\"\n                           id=\"password\"\n                           name=\"password1\"\n                           placeholder=\"••••••••\"\n                           minlength=\"8\"\n                           required>\n                    <button class=\"btn btn-outline-secondary\"\n                            type=\"button\"\n                            id=\"togglePassword\"\n                            aria-label=\"Показать пароль\">\n                        <i class=\"bi bi-eye\" id=\"toggleIcon\"></i>\n                    </button>\n                    <div class=\"invalid-feedback\" id=\"passwordError\">\n                        Пароль должен содержать минимум 8 символов.\n                    </div>\n                </div>\n\n                <div class=\"progress mt-2\" style=\"height:6px;\" role=\"progressbar\"\n                     aria-label=\"Надёжность пароля\" aria-valuemin=\"0\" aria-valuemax=\"4\" aria-valuenow=\"0\">\n                    <div class=\"progress-bar\" id=\"strengthBar\" style=\"width:0%\"></div>\n                </div>\n                <div class=\"form-text\" id=\"strengthText\">Минимум 8 символов, буквы и цифры</div>\n            </div>\n\n            <!-- Подтверждение пароля -->\n            <div class=\"mb-3\">\n                <label for=\"password2\" class=\"form-label\">Подтвердите пароль</label>\n                <div class=\"input-group input-group-lg has-validation\">\n                    <span class=\"input-group-text\"><i class=\"bi bi-shield-check\"></i></span>\n                    <input type=\"password\"\n                           class=\"form-control\"\n                           id=\"password2\"\n                           name=\"password2\"\n                           placeholder=\"••••••••\"\n                           required>\n                    <button class=\"btn btn-outline-secondary\"\n                            type=\"button\"\n                            id=\"togglePassword2\"\n                            aria-label=\"Показать пароль\">\n                        <i class=\"bi bi-eye\" id=\"toggleIcon2\"></i>\n                    </button>\n                    <div class=\"invalid-feedback\" id=\"password2Error\">\n                        Пароли не совпадают.\n                    </div>\n                </div>\n            </div>\n\n            <button type=\"submit\" class=\"btn btn-primary btn-lg w-100 mb-3\" id=\"submitBtn\">\n                <span class=\"spinner-border spinner-border-sm me-2 d-none\"\n                      id=\"submitSpinner\" role=\"status\" aria-hidden=\"true\"></span>\n                <i class=\"bi bi-person-plus me-1\" id=\"submitIcon\"></i>\n                <span id=\"submitText\">Зарегистрироваться</span>\n            </button>\n        </form>\n\n        <div class=\"text-center\">\n            <span class=\"text-body-secondary small\">Уже есть аккаунт?</span>\n            <a href=\"#/login\" class=\"text-decoration-none small\">Войти</a>\n        </div>\n\n    </div>\n</div>\n";
cb(null, output);
;
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
function b_extra_js(env, context, frame, runtime, cb) {
var lineno = 151;
var colno = 3;
var output = "";
try {
var frame = frame.push(true);
output += "\n<script>\n(() => {\n    const form = document.getElementById('registerForm');\n    if (!form) return; // DOM ещё не готов (скрипт пересоздаётся при рендере)\n\n    const nonFieldAlert = document.getElementById('nonFieldAlert');\n    const nonFieldText  = document.getElementById('nonFieldText');\n\n    function showNonField(msg) {\n        nonFieldText.textContent = msg;\n        nonFieldAlert.classList.remove('d-none');\n        nonFieldAlert.classList.add('d-flex');\n    }\n\n    const fields = {\n        username:  document.getElementById('username'),\n        email:     document.getElementById('email'),\n        password:  document.getElementById('password'),\n        password2: document.getElementById('password2'),\n    };\n\n    const errors = {\n        username:  document.getElementById('nameError'),\n        email:     document.getElementById('emailError'),\n        password:  document.getElementById('passwordError'),\n        password2: document.getElementById('password2Error'),\n    };\n\n    const strengthBar  = document.getElementById('strengthBar');\n    const strengthText = document.getElementById('strengthText');\n\n    const submitBtn     = document.getElementById('submitBtn');\n    const submitSpinner = document.getElementById('submitSpinner');\n    const submitIcon    = document.getElementById('submitIcon');\n    const submitText    = document.getElementById('submitText');\n    const successAlert  = document.getElementById('successAlert');\n\n    // ----- Просмотр пароля -----\n    function setupToggle(btnId, iconId, input) {\n        const btn  = document.getElementById(btnId);\n        const icon = document.getElementById(iconId);\n        btn.addEventListener('click', () => {\n            const hidden = input.type === 'password';\n            input.type = hidden ? 'text' : 'password';\n            icon.classList.toggle('bi-eye', !hidden);\n            icon.classList.toggle('bi-eye-slash', hidden);\n            btn.setAttribute('aria-label', hidden ? 'Скрыть пароль' : 'Показать пароль');\n        });\n    }\n    setupToggle('togglePassword',  'toggleIcon',  fields.password);\n    setupToggle('togglePassword2', 'toggleIcon2', fields.password2);\n\n    // ----- Валидаторы -----\n    const validators = {\n        username() {\n            const v = fields.username.value.trim();\n            if (!v) return 'Введите имя пользователя.';\n            if (v.length < 3) return 'Минимум 3 символа.';\n            if (!/^[\\w.@+-]+$/.test(v)) return 'Только буквы, цифры и @/./+/-/_.';\n            return '';\n        },\n        email() {\n            const v = fields.email.value.trim();\n            if (!v) return 'Введите email.';\n            if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(v)) return 'Введите корректный email.';\n            return '';\n        },\n        password() {\n            const v = fields.password.value;\n            if (!v) return 'Введите пароль.';\n            if (v.length < 8) return 'Минимум 8 символов.';\n            if (!/[a-zA-Zа-яА-Я]/.test(v) || !/\\d/.test(v)) return 'Пароль должен содержать буквы и цифры.';\n            return '';\n        },\n        password2() {\n            const v = fields.password2.value;\n            if (!v) return 'Подтвердите пароль.';\n            if (v !== fields.password.value) return 'Пароли не совпадают.';\n            return '';\n        }\n    };\n\n    function setFieldState(name, message) {\n        const input   = fields[name];\n        const errorEl = errors[name];\n        if (message) {\n            input.classList.add('is-invalid');\n            input.classList.remove('is-valid');\n            if (errorEl) errorEl.textContent = message;\n        } else {\n            input.classList.remove('is-invalid');\n            input.classList.add('is-valid');\n        }\n    }\n\n    function validateField(name) {\n        const msg = validators[name]();\n        setFieldState(name, msg);\n        return !msg;\n    }\n\n    // ----- Индикатор надёжности -----\n    function calcStrength(pwd) {\n        let score = 0;\n        if (pwd.length >= 8) score++;\n        if (pwd.length >= 12) score++;\n        if (/[a-z]/.test(pwd) && /[A-ZА-Я]/.test(pwd)) score++;\n        if (/\\d/.test(pwd)) score++;\n        if (/[^A-Za-zА-Яа-я0-9]/.test(pwd)) score++;\n        return Math.min(score, 4);\n    }\n\n    function updateStrength() {\n        const pwd = fields.password.value;\n        const score = calcStrength(pwd);\n        const colors = ['bg-danger', 'bg-danger', 'bg-warning', 'bg-info', 'bg-success'];\n        const labels = ['Очень слабый', 'Слабый', 'Средний', 'Хороший', 'Надёжный'];\n        const widths = [0, 25, 50, 75, 100];\n\n        strengthBar.className = 'progress-bar ' + colors[score];\n        strengthBar.style.width = widths[score] + '%';\n        strengthText.textContent = pwd\n            ? 'Надёжность: ' + labels[score]\n            : 'Минимум 8 символов, буквы и цифры';\n    }\n\n    // ----- Слушатели -----\n    ['username', 'email', 'password', 'password2'].forEach(name => {\n        const input = fields[name];\n        input.addEventListener('blur', () => validateField(name));\n        input.addEventListener('input', () => {\n            if (input.classList.contains('is-invalid')) validateField(name);\n        });\n    });\n\n    fields.password.addEventListener('input', () => {\n        updateStrength();\n        if (fields.password2.value) validateField('password2');\n    });\n\n    // ----- Отправка -----\n    form.addEventListener('submit', async (e) => {\n        e.preventDefault();\n        nonFieldAlert.classList.add('d-none');\n        nonFieldAlert.classList.remove('d-flex');\n\n        const names = ['username', 'email', 'password', 'password2'];\n        const results = names.map(validateField);\n        const firstInvalid = names.find((n, i) => !results[i]);\n\n        if (firstInvalid) {\n            fields[firstInvalid].focus();\n            return;\n        }\n\n        submitBtn.disabled = true;\n        submitIcon.classList.add('d-none');\n        submitSpinner.classList.remove('d-none');\n        submitText.textContent = 'Создаём аккаунт…';\n\n        try {\n            await window.taskflowAuth.register({\n                username: fields.username.value.trim(),\n                email: fields.email.value.trim(),\n                first_name: document.getElementById('firstName').value.trim(),\n                last_name: document.getElementById('lastName').value.trim(),\n                password: fields.password.value,\n                password2: fields.password2.value,\n            });\n            successAlert.classList.remove('d-none');\n            successAlert.classList.add('d-flex');\n            setTimeout(() => window.navigate('/'), 500);\n        } catch (error) {\n            showNonField(error.message || 'Не удалось зарегистрироваться');\n            submitBtn.disabled = false;\n            submitSpinner.classList.add('d-none');\n            submitIcon.classList.remove('d-none');\n            submitText.textContent = 'Зарегистрироваться';\n        }\n    });\n})();\n</script>\n";
cb(null, output);
;
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
return {
b_title: b_title,
b_content: b_content,
b_extra_js: b_extra_js,
root: root
};

})();
})();

(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["base.html"] = (function() {
function root(env, context, frame, runtime, cb) {
var lineno = 0;
var colno = 0;
var output = "";
try {
var parentTemplate = null;
var tasks = [];
tasks.push(
function(callback) {
env.getTemplate("navbar.html", false, "base.html", false, function(t_2,t_1) {
if(t_2) { cb(t_2); return; }
callback(null,t_1);});
});
tasks.push(
function(template, callback){
template.render(context.getVariables(), frame, function(t_4,t_3) {
if(t_4) { cb(t_4); return; }
callback(null,t_3);});
});
tasks.push(
function(result, callback){
output += result;
callback(null);
});
env.waterfall(tasks, function(){
output += "\n<main class=\"container py-4\">\n    ";
(parentTemplate ? function(e, c, f, r, cb) { cb(""); } : context.getBlock("content"))(env, context, frame, runtime, function(t_6,t_5) {
if(t_6) { cb(t_6); return; }
output += t_5;
output += "\n</main>\n";
if(parentTemplate) {
parentTemplate.rootRenderFunc(env, context, frame, runtime, cb);
} else {
cb(null, output);
}
})});
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
function b_content(env, context, frame, runtime, cb) {
var lineno = 2;
var colno = 7;
var output = "";
try {
var frame = frame.push(true);
cb(null, output);
;
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
return {
b_content: b_content,
root: root
};

})();
})();

(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["home.html"] = (function() {
function root(env, context, frame, runtime, cb) {
var lineno = 0;
var colno = 0;
var output = "";
try {
var parentTemplate = null;
env.getTemplate("base.html", true, "home.html", false, function(t_3,t_2) {
if(t_3) { cb(t_3); return; }
parentTemplate = t_2
for(var t_1 in parentTemplate.blocks) {
context.addBlock(t_1, parentTemplate.blocks[t_1]);
}
output += "\n\n";
(parentTemplate ? function(e, c, f, r, cb) { cb(""); } : context.getBlock("content"))(env, context, frame, runtime, function(t_5,t_4) {
if(t_5) { cb(t_5); return; }
output += t_4;
output += "\n";
if(parentTemplate) {
parentTemplate.rootRenderFunc(env, context, frame, runtime, cb);
} else {
cb(null, output);
}
})});
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
function b_content(env, context, frame, runtime, cb) {
var lineno = 2;
var colno = 3;
var output = "";
try {
var frame = frame.push(true);
output += "\n<main class=\"flex-grow-1 overflow-hidden\" style=\"min-height: 70vh;\">\n    <div class=\"container-fluid p-3 p-lg-4 d-flex flex-column gap-3\" style=\"max-width:1100px;\">\n\n        <div class=\"d-flex gap-1 flex-column px-4 py-4 card border-0 shadow-sm rounded-4\" style=\"min-height: 100px;\">\n            <div class=\"d-flex\" role=\"search\">\n                <input id=\"search-input\" class=\"form-control me-2\" type=\"search\" placeholder=\"Search\" aria-label=\"Search\"/>\n                <button class=\"btn btn-outline-success\" type=\"submit\">Search</button>\n            </div>\n            <div class=\"d-flex flex-wrap\">\n                <div class=\"dropdown\">\n                    <button id=\"btn-stack\" class=\"btn btn-outline-secondary dropdown-toggle\" type=\"button\" data-bs-toggle=\"dropdown\" aria-expanded=\"false\">\n                        Все\n                    </button>\n                    <ul id=\"btns-stack\" class=\"dropdown-menu\">\n                        <li><button data-stack-type=\"all\" class=\"dropdown-item\" type=\"button\">Все</button></li>\n                        <li><button data-stack-type=\"mobile\" class=\"dropdown-item\" type=\"button\">Мобилки</button></li>\n                        <li><button data-stack-type=\"server\" class=\"dropdown-item\" type=\"button\">Сервер</button></li>\n                        <li><button data-stack-type=\"desctop\" class=\"dropdown-item\" type=\"button\">Десктоп</button></li>\n                    </ul>\n                </div>\n            </div>\n        </div>\n\n        <div class=\"card border-0 shadow-sm rounded-4\">\n            <div class=\"card-header bg-transparent border-bottom d-flex justify-content-between align-items-center\">\n                <h2 class=\"h6 fw-bold mb-0\">\n                    <i class=\"bi bi-link-45deg me-2 text-primary\"></i>Ссылки\n                </h2>\n            </div>\n            <div class=\"col\">\n                <div class=\"card h-100 border-0 shadow-sm rounded-4 overflow-hidden\">\n                    <img src=\"/media/cars/example.jpg\" alt=\"Toyota Camry\" class=\"w-100 object-fit-cover bg-secondary-subtle\" style=\"aspect-ratio:16/10;\">\n\n                    <div class=\"card-body\">\n\n                        <h3 class=\"h6 fw-bold mb-1\">Toyota Camry</h3>\n                        <div class=\"text-body-secondary small mb-2\">VIN JTNB11HK103000001</div>\n                        <div class=\"d-flex flex-wrap gap-2\">\n                            <span class=\"badge text-bg-secondary\">2021</span>\n                            <span class=\"badge text-bg-light border\">Чёрный</span>\n                        </div>\n                    </div>\n                    <div class=\"card-footer bg-transparent border-0 pt-0 pb-3 d-flex gap-2\">\n                        <button class=\"btn btn-sm btn-outline-primary flex-grow-1\" type=\"button\" data-bs-toggle=\"modal\" data-bs-target=\"#info-1\">\n                            <i class=\"bi bi-info-circle me-1\"></i>Инфо\n                        </button>\n                        <button class=\"btn btn-sm btn-outline-danger\" type=\"button\" data-bs-toggle=\"modal\" data-bs-target=\"#delete-1\" aria-label=\"Списать\">\n                            <i class=\"bi bi-trash\"></i>\n                        </button>\n                    </div>\n                </div>\n            </div>\n\n        </div>\n    </div>\n</main>\n";
cb(null, output);
;
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
return {
b_content: b_content,
root: root
};

})();
})();

(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["navbar.html"] = (function() {
function root(env, context, frame, runtime, cb) {
var lineno = 0;
var colno = 0;
var output = "";
try {
var parentTemplate = null;
output += "<nav class=\"navbar navbar-expand-lg bg-body-tertiary border-bottom sticky-top px-3 px-lg-4\">\n    <div class=\"container-fluid px-3 px-lg-4\">\n\n        <!-- ЛОГО -->\n        <a class=\"navbar-brand fw-bold d-flex align-items-center gap-2 me-auto me-lg-0\" href=\"#/\">\n            <span class=\"d-inline-flex align-items-center justify-content-center bg-primary text-white rounded-3\"\n                  style=\"width:32px;height:32px;\">\n                <i class=\"bi bi-kanban\"></i>\n            </span>\n            <span>";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "appName"), env.opts.autoescape);
output += "</span>\n        </a>\n        <button class=\"navbar-toggler\" type=\"button\" data-bs-toggle=\"collapse\"\n                data-bs-target=\"#navMain\" aria-controls=\"navMain\"\n                aria-expanded=\"false\" aria-label=\"Показать меню\">\n            <span class=\"navbar-toggler-icon\"></span>\n        </button>\n        \n    </div>\n        \n\n        <!-- СВОРАЧИВАЕМАЯ ЧАСТЬ -->\n        <div class=\"collapse navbar-collapse\" id=\"navMain\">\n            <div class=\"d-flex flex-column flex-lg-row align-items-stretch align-items-lg-center\n                        gap-2 ms-lg-3 mt-3 mt-lg-0\">\n\n                <!-- ==================== АВТОРИЗОВАН ==================== -->\n                <div class=\"d-flex flex-row justify-content-end align-items-center gap-2\" id=\"userBlock\">\n\n                    <!-- Тема -->\n                    <button type=\"button\"\n                            class=\"btn btn-outline-secondary border-0\"\n                            id=\"themeToggle\" aria-label=\"Переключить тему\">\n                        <i class=\"bi bi-moon-stars\" id=\"themeIcon\"></i>\n                    </button>\n\n                    <!-- Профиль -->\n                    <div class=\"dropdown\">\n                        <button class=\"btn p-0 border-0 d-flex align-items-center gap-2\"\n                                type=\"button\" data-bs-toggle=\"dropdown\" aria-expanded=\"false\"\n                                aria-label=\"Профиль\">\n                            <span id=\"avatar\"\n                                  class=\"avatar-circle bg-primary bg-opacity-25 text-primary fw-bold rounded-circle\">";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "user")),"initial"), env.opts.autoescape);
output += "</span>\n                        </button>\n\n                        <ul class=\"dropdown-menu dropdown-menu-end shadow rounded-4 p-2 dropdown-profile\"\n                            style=\"width:min(240px, calc(100vw - 1rem));\">\n                            <li class=\"px-3 py-2\">\n                                <div id=\"username\" class=\"fw-semibold text-truncate\">";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "user")),"first_name") || runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "user")),"username"), env.opts.autoescape);
output += "</div>\n                                <div id=\"email\" class=\"text-body-secondary small text-truncate\">";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "user")),"email") || "—", env.opts.autoescape);
output += "</div>\n                            </li>\n                            <li><hr class=\"dropdown-divider\"></li>\n                            <li>\n                                <a id=\"account\" class=\"dropdown-item rounded-3\" href=\"#/profile\">\n                                    <i class=\"bi bi-person me-2\"></i>Профиль\n                                </a>\n                            </li>\n                            <li><hr class=\"dropdown-divider\"></li>\n                            <li>\n                                <a class=\"dropdown-item rounded-3 text-danger\" href=\"#/login\" data-logout>\n                                    <i id=\"logout\" class=\"bi bi-box-arrow-right me-2\"></i>Выйти\n                                </a>\n                            </li>\n                        </ul>\n                    </div>\n                </div>\n\n            </div>\n        </div>\n</nav>\n";
if(parentTemplate) {
parentTemplate.rootRenderFunc(env, context, frame, runtime, cb);
} else {
cb(null, output);
}
;
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
return {
root: root
};

})();
})();

(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["profile.html"] = (function() {
function root(env, context, frame, runtime, cb) {
var lineno = 0;
var colno = 0;
var output = "";
try {
var parentTemplate = null;
env.getTemplate("base.html", true, "profile.html", false, function(t_3,t_2) {
if(t_3) { cb(t_3); return; }
parentTemplate = t_2
for(var t_1 in parentTemplate.blocks) {
context.addBlock(t_1, parentTemplate.blocks[t_1]);
}
output += "\n\n";
(parentTemplate ? function(e, c, f, r, cb) { cb(""); } : context.getBlock("content"))(env, context, frame, runtime, function(t_5,t_4) {
if(t_5) { cb(t_5); return; }
output += t_4;
output += "\n";
if(parentTemplate) {
parentTemplate.rootRenderFunc(env, context, frame, runtime, cb);
} else {
cb(null, output);
}
})});
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
function b_content(env, context, frame, runtime, cb) {
var lineno = 2;
var colno = 3;
var output = "";
try {
var frame = frame.push(true);
output += "\n<div style=\"max-width:900px;margin:0 auto;\">\n\n    <!-- Шапка профиля -->\n    <div class=\"card border-0 shadow-sm rounded-4 mb-4\">\n        <div class=\"card-body p-4\">\n\n            <div class=\"d-flex flex-column flex-sm-row align-items-center align-items-sm-start gap-4\">\n\n                <!-- Аватар -->\n                <div class=\"d-flex align-items-center justify-content-center\n                            bg-primary bg-opacity-25 text-primary fw-bold rounded-circle flex-shrink-0\"\n                     style=\"width:96px;height:96px;font-size:2rem;\">\n                    ";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "user")),"initials"), env.opts.autoescape);
output += "\n                </div>\n\n                <!-- Имя, email -->\n                <div class=\"flex-grow-1 text-center text-sm-start\">\n                    <h1 class=\"h4 fw-bold mb-1\">\n                        ";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "user")),"first_name") || runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "user")),"username"), env.opts.autoescape);
output += "\n                    </h1>\n                    <p class=\"text-body-secondary mb-0\">\n                        <i class=\"bi bi-envelope me-1\"></i>";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "user")),"email") || "email не указан", env.opts.autoescape);
output += "\n                    </p>\n                </div>\n\n                <!-- Дата регистрации + кнопку выйти -->\n                <div class=\"d-flex flex-column justify-content-between align-items-center align-items-sm-end gap-2 flex-shrink-0 align-self-stretch\">\n\n                    <div class=\"text-body-secondary small text-center text-sm-end\">\n                        <i class=\"bi bi-calendar3 me-1\"></i>\n                        Дата регистрации\n                        <div class=\"badge text-bg-secondary rounded-pill mt-1\">\n                            ";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "user")),"date_joined_label") || "—", env.opts.autoescape);
output += "\n                        </div>\n                    </div>\n\n                    <form method=\"post\" action=\"/logout/\" class=\"m-0\">\n                        <button type=\"submit\" class=\"btn btn-outline-danger btn-sm\">\n                            <i class=\"bi bi-box-arrow-right me-1\"></i>Выйти\n                        </button>\n                    </form>\n\n                </div>\n            </div>\n        </div>\n    </div>\n\n    <!-- Основная инфа -->\n    <div class=\"row g-4\">\n        <div class=\"col-12\">\n            <div class=\"card border-0 shadow-sm rounded-4 h-100\">\n                <div class=\"card-body p-4\">\n                    <h2 class=\"h6 text-body-secondary text-uppercase mb-3\">Основная информация</h2>\n\n                    <dl class=\"row mb-0\">\n                        <dt class=\"col-sm-4 text-body-secondary fw-normal\">Имя пользователя</dt>\n                        <dd class=\"col-sm-8\">";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "user")),"username") || "—", env.opts.autoescape);
output += "</dd>\n\n                        <dt class=\"col-sm-4 text-body-secondary fw-normal\">Имя</dt>\n                        <dd class=\"col-sm-8\">";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "user")),"first_name") || "—", env.opts.autoescape);
output += "</dd>\n\n                        <dt class=\"col-sm-4 text-body-secondary fw-normal\">Фамилия</dt>\n                        <dd class=\"col-sm-8\">";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "user")),"last_name") || "—", env.opts.autoescape);
output += "</dd>\n\n                        <dt class=\"col-sm-4 text-body-secondary fw-normal\">Email</dt>\n                        <dd class=\"col-sm-8 mb-0\">";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "user")),"email") || "—", env.opts.autoescape);
output += "</dd>\n                    </dl>\n                </div>\n            </div>\n        </div>\n    </div>\n\n</div>\n";
cb(null, output);
;
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
return {
b_content: b_content,
root: root
};

})();
})();



  function getEnv() {
    if (env) return env;
    env = new nunjucks.Environment(null, { autoescape: true });
    for (var key in templates) {
      if (Object.prototype.hasOwnProperty.call(templates, key)) {
        env.templates[key] = templates[key];
      }
    }
    return env;
  }

  global.renderPage = function (name, context) {
    return getEnv().render(name, context || {});
  };
})(window);
