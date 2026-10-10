# basic_template_mobile_desctop

[![docs](https://img.shields.io/badge/docs-online-brightgreen)](https://extasss4106.github.io/electron_desctop_mobile_template/)
[![GitHub](https://img.shields.io/badge/github-repo-blue?logo=github)](https://github.com/ExtaSsS4106/electron_desctop_mobile_template)

Шаблон кроссплатформенного приложения-«задачника» (Tasker): **одна веб-часть — три платформы** (web в браузере, десктоп через Electron, Android через Capacitor). Веб-часть — SPA на чистом JS: страницы собираются на клиенте из Nunjucks-шаблонов, маршруты живут в адресе после `#`, данные берутся у Django REST API по LAN.

Документация ниже описывает текущее устройство кода: архитектуру web-клиента, жизненный цикл, контракт с backend, сборку под каждую платформу, диагностику и известные проблемы.

---

## Содержание

1. [Идея и стек](#1-идея-и-стек)
2. [Структура проекта](#2-структура-проекта)
3. [Web-клиент: как устроен](#3-web-клиент-как-устроен)
4. [Жизненный цикл приложения](#4-жизненный-цикл-приложения)
5. [Состояние и контекст шаблонов](#5-состояние-и-контекст-шаблонов)
6. [Шаблоны Nunjucks](#6-шаблоны-nunjucks)
7. [Хранение токенов](#7-хранение-токенов)
8. [Конвейер сборки](#8-конвейер-сборки)
9. [Electron (десктоп)](#9-electron-десктоп)
10. [Android (Capacitor)](#10-android-capacitor)
11. [Запуск backend (Django) и контракт API](#11-запуск-backend-django-и-контракт-api)
12. [Диагностика](#12-диагностика)
13. [Известные проблемы и хвосты](#13-известные-проблемы-и-хвосты)
14. [Полезные команды](#14-полезные-команды)

---

## 1. Идея и стек

Весь интерфейс написан один раз на HTML/CSS/JS и собирается Vite в папку `dist/`. Дальше:

| Платформа | Обёртка | Что грузит |
|---|---|---|
| Браузер | — | любой статик-хостинг каталога `dist/` |
| Desktop | Electron 33 | `electron/main.js` открывает `dist/index.html` |
| Android | Capacitor 8 | `cap sync android` копирует `dist/` в Android-проект |

Технологии web-части:

- **Nunjucks** — шаблоны страниц (`templates/*.html`), но не на сервере, а **предскомпилированные в JS** (`www/templates.js`) и рендерящиеся на клиенте;
- **Vite** — сборка ES-модулей `www/` в `dist/`;
- **Bootstrap 5.3** + **Bootstrap Icons** — UI-библиотеки, подключаются как обычные скрипты из `www/vendor/`;
- **ES-модули без фреймворков** — ни React, ни Vue; маршрутизация своя (hash-based).

Ключевое свойство: **страница `dist/index.html` загружается один раз и больше никогда не перезагружается.** Смена «страницы» — это замена содержимого `<div id="root">` на HTML, собранный из шаблона.

---

## 2. Структура проекта

```text
.
├── package.json              # entry point: electron/main.js, npm-скрипты
├── vite.config.js            # root=www, publicDir=www/vendor, сборка в dist/
├── capacitor.config.json     # webDir=dist, androidScheme=http, cleartext=true
│
├── main.js                   # ⚠️ legacy, НЕ entry point (см. раздел 9)
│
├── electron/
│   ├── main.js               # процесс main Electron: окно, IPC auth:*
│   └── preload.js            # contextBridge → window.authStorage
│
├── www/                      # исходники web-клиента (root для Vite)
│   ├── index.html            # оболочка: #root, тосты, модалка, порядок скриптов
│   ├── app.js                # точка входа web-приложения
│   ├── auth-storage.js       # выбор хранилища токенов (Electron/Android/браузер)
│   ├── templates.js          # ⚠️ СГЕНЕРИРОВАН (npm run precompile), не править руками
│   ├── styles.css            # минимальные глобальные стили (подключены в index.html)
│   ├── conf/                 # «инфраструктура» приложения
│   │   ├── conf.js           # API_BASE, REQUEST_TIMEOUT_MS
│   │   ├── state.js          # data, authReady, authenticated, tokens, токены в хранилище
│   │   ├── api.js            # apiRequest / authenticatedRequest / refresh / sessionExpired
│   │   ├── render.js         # render / scheduleRender / redirect / rehydrateScripts
│   │   └── routing.js        # routes, titles, PUBLIC_ROUTES
│   ├── views/
│   │   └── auth.js           # login / register / logout / loadProfile / normalizeUser
│   ├── vendor/               # nunjucks.min.js, bootstrap.bundle.min.js (publicDir → dist/)
│   └── static/
│       ├── bootstrap-5.3.8-dist/   # CSS, JS, шрифты Bootstrap
│       └── custom/
│           ├── css/app.css   # переменные, шторка, дропдауны, аватар
│           └── js/app.js     # переключатель темы
│
├── templates/                # исходники Nunjucks-шаблонов (править ИМЕННО их)
│   ├── base.html             # навбар + {% block content %}
│   ├── navbar.html           # шапка: логотип, тема, дропдаун профиля, «Выйти»
│   ├── home.html             # приветствие
│   ├── profile.html          # карточка пользователя + «Выйти»
│   └── auth/
│       ├── _layout.html      # центрированная колонка для входа/регистрации
│       ├── login.html        # форма входа + её инлайн-JS
│       └── reg.html          # форма регистрации + её инлайн-JS
│
├── build/
│   ├── precompile.js         # templates/*.html → www/templates.js
│   └── smoke-templates.js    # npm test: рендер всех шаблонов тестовым контекстом
│
├── android/                  # ⚠️ сгенерирован Capacitor, в git не входит
├── dist/                     # ⚠️ результат сборки, в git не входит
├── DOCX/index.html           # офлайн-копия документации (сайт проекта)
├── android_build.md          # отдельная инструкция по сборке APK
└── linux.txt                 # заметка: --ozone-platform=x11 для Wayland
```

`.gitignore` отключает `/android`, `/dist`, `/node_modules`.

---

## 3. Web-клиент: как устроен

### 3.1 Оболочка — `www/index.html`

Единственный реальный HTML-файл. Содержимое по порядку:

- **`<div id="root">`** — сюда рендерятся все страницы. До готовности внутри спиннер «Подключаемся к серверу…», который полностью заменяется первым `render()`.
- **`<div id="toastHost">`** — контейнер уведомлений, живёт **вне** `#root`, чтобы пережить перерисовку. Сейчас это только разметка: JS-хелпера `showToast()` в коде ещё нет.
- **`<div id="confirmModal">`** — модалка подтверждения вместо `window.confirm`. Тоже пока только разметка.
- **Порядок скриптов важен**:
  ```html
  <script src="nunjucks.min.js"></script>        <!-- обычные скрипты: -->
  <script src="bootstrap.bundle.min.js"></script><!--  выполняются ДО модулей -->
  <script type="module" src="templates.js"></script>
  <script type="module" src="./app.js"></script>
  <script type="module" src="static/custom/js/app.js"></script>
  ```
  `templates.js` (предскомпилированные шаблоны) требует глобальный `nunjucks`, поэтому подключается не-модульным скриптом первым. Bootstrap тоже намеренно не-модульный: в модульном виде Vite оборачивает его UMD в CommonJS и `window.bootstrap` не появляется.

### 3.2 Точка входа — `www/app.js`

Делает ровно шесть вещей:

1. Импортирует конфиг, состояние, рендер и auth-логику.
2. Вешает **два делегированных обработчика на `document`** — логаут по клику на `[data-logout]` и по отправке `form[action="/logout/"]`. Они переживают любую перерисовку `#root` (innerHTML убивает слушатели, навешанные на элементы).
3. Запускает `initialize()` — восстановление сессии (см. раздел 4).
4. Экспортирует функции для **инлайн-скриптов внутри шаблонов**:
   - `window.taskflowAuth = { login, register, logout }`,
   - `window.logout`,
   - `window.navigate(path)` — переход по hash-роуту.
5. Экспортирует `window.__debug` для отладки из DevTools: `getData()`, `getApiBase()`, `getStartupError()`, `isReady()`, `login/logout/loadProfile`.
6. Слушает `hashchange` и `popstate` → `scheduleRender()`.

### 3.3 Конфиг — `www/conf/conf.js`

```js
export const API_BASE = ('http://127.0.0.1:8080/api').replace(/\/+$/, '');
export const REQUEST_TIMEOUT_MS = 10000;
```

**Адрес backend захардкожен здесь.** Для телефона/Android поменяйте IP на LAN-адрес компьютера с Django (например `http://192.168.1.192:8080/api`) и пересоберите. На телефоне `127.0.0.1` — это сам телефон, туда писать нельзя.

### 3.4 Состояние — `www/conf/state.js`

Единственный источник данных для шаблонов и для рендера:

- `data` — объект контекста шаблонов (раздел 5);
- `authReady` — флаг «инициализация завершена, можно рисовать»; устанавливается `markAuthReady()`;
- `startupError` — текст ошибки старта (например, «сервер не отвечает»), показывается на странице входа;
- `authenticated` + `set_authenticated()` — текущий статус сессии;
- `tokens` + `setTokens()` — `{access, refresh}` в памяти;
- `readTokens() / saveTokens() / clearTokens()` — работа с платформенным хранилищем (`auth-storage.js`).

Зачем всё в модуле, а не аргументами: `render()` вызывается ещё и из слушателей `hashchange`/`popstate`, где передать состояние некому. Импортированные ES-биндинги «живые» — изменение видно сразу во всех модулях.

### 3.5 HTTP-слой — `www/conf/api.js`

- `apiRequest(path, options, accessToken)` — базовый вызов: ставит `Content-Type: application/json` (кроме `FormData`), `Authorization: Bearer …`, **таймаут** `AbortSignal.timeout(REQUEST_TIMEOUT_MS)`, парсит JSON, ошибки сервера превращает в `ApiError(message, status)`; `204/205` возвращаются как `null`.
- `refreshTokens()` — `POST /token/refresh/`, сохраняет новую пару токенов.
- `authenticatedRequest(path, options)` — вызов для авторизованных страниц: при `401` **один раз** молча обновляет токен и повторяет запрос; если рефреш не удался — `sessionExpired()`.
- `sessionExpired()` — чистит токены, сбрасывает `authenticated`, уводит на `/login`.

Ошибки старта (`status === 0`) — «не подключились / таймаут» — не роняют инициализацию: они попадают в `startupError` и показываются алертом на странице входа.

### 3.6 Рендер и роутинг — `www/conf/render.js` + `www/conf/routing.js`

- `routing.js`: `routes` (путь → имя шаблона), `titles` (путь → заголовок вкладки), `PUBLIC_ROUTES` (`/login`, `/register` и их варианты с завершающим слэшем).
- `render(force)` — сердце SPA:
  1. выходит, если `!authReady` (ещё идёт инициализация);
  2. нормализует путь: `location.hash` вида `#/profile` → `/profile`, без хэша берётся `location.pathname`;
  3. **стражи**: не залогинен + приватный маршрут → `redirect('/login')`; залогинен + публичный → `redirect('/')`; неизвестный маршрут → `redirect('/')`;
  4. сбрасывает `#root`, ставит `document.title`, вызывает `window.renderPage(шаблон, data)`, заливает HTML через `innerHTML`;
  5. вызывает `rehydrateScripts(root)` — пересоздаёт все `<script>` внутри свежего DOM (**`innerHTML` скрипты не исполняет**), поэтому инлайн-код в шаблонах оживает;
  6. `disposeModals(root)` перед перерисовкой убивает старые Bootstrap-модалки и бэкдропы;
  7. если это `/login` и есть `startupError` — показывает его в `#nonFieldAlert`.
- `scheduleRender()` — отложенный на `requestAnimationFrame` вызов `render()`; склеивает несколько событий навигации в одну отрисовку.
- `redirect(path)` — сбрасывает `lastRender` и меняет `location.hash` (или рисует сразу, если хэш уже целевой). Смена хэша сама вызовет `hashchange` → `scheduleRender` → `render()`.
- Защита от двойной отрисовки: `lastRender = "путь|флаг авторизации"`, повторный `render()` того же экрана пропускается.

### 3.7 Хранилище токенов — `www/auth-storage.js`

Адаптер выбирает реализацию в таком порядке:

1. `window.authStorage` (Electron, из `preload.js`) — токены в зашифрованном `auth.json` через `safeStorage`;
2. `Capacitor.isNativePlatform()` (Android) — `@aparajita/capacitor-secure-storage`;
3. иначе — `sessionStorage` (отладка в браузере).

У всех трёх одинаковый интерфейс: `load() / save(tokens) / clear()`.

### 3.8 Тема — `www/static/custom/js/app.js`

Переключатель светлой/тёмной темы: атрибут `data-bs-theme` на `<html>` + `localStorage['theme']`. Работает независимо от рендера, кнопку ищет через делегирование (`#themeToggle`).

---

## 4. Жизненный цикл приложения

### 4.1 Старт

```text
index.html загрузился
  → templates.js: window.renderPage = (name, context) => …
  → app.js: initialize()
       1. readTokens()          — достаёт {access, refresh} из хранилища
       2. если есть access      — loadProfile() → GET /api/profile/ (Bearer)
       3. при 401               — токены чистятся, считаем неавторизованным
          при сетевой ошибке    — запоминаем текст в startupError
       4. markAuthReady()       — authReady = true
       5. render(true)          — первая отрисовка
  → #root (со спиннером) заменяется страницей входа или главной
```

До шага 4 `render()` ничего не рисует — на экране спиннер. Именно поэтому любой сетевой вызов на старте ограничен таймаутом 10 секунд: иначе приложение могло бы «зависнуть на загрузке».

### 4.2 Переход по страницам

Например, клик по «Профиль» в дропдауне:

1. Ссылка `href="#/profile"` — меняется только хэш, перезагрузки нет.
2. Браузер эмитит `hashchange` → `scheduleRender()` → в ближайший кадр `render()`.
3. `render()` видит `/profile`: маршрут известен, авторизация есть.
4. `window.renderPage('profile.html', data)` возвращает HTML-строку с данными пользователя.
5. `root.innerHTML = …` — содержимое мгновенно заменяется, затем пересоздаются `<script>`.

Ни одного запроса к серверу за вёрсткой; сервер нужен только за данными. Кнопка «назад» браузера работает штатно — это тот же `hashchange`/`popstate`.

### 4.3 Вход

Форма `auth/login.html` (инлайн-JS внутри шаблона):

1. Клиентская валидация полей (логин непустой, пароль ≥ 6 символов).
2. `window.taskflowAuth.login(username, password)` → `POST /api/login/`.
3. Ответ `{access, refresh}` сохраняется через `saveTokens()` (в зашифрованное хранилище платформы).
4. `loadProfile()` подтягивает профиль, `authenticated = true`.
5. Спиннер на кнопке, затем «Успешный вход!» и `window.navigate('/')` через 400 мс.

Регистрация (`auth/reg.html`) — то же самое плюс клиентская проверка email и надёжности пароля, затем `POST /api/register/` и авто-вход.

### 4.4 Выход

Два входа (клик по `[data-logout]` в навбаре, отправка `form[action="/logout/"]` в профиле) сходятся в `logout()`:

1. `POST /api/logout/` с `{refresh_token}` — сетевая ошибка здесь намеренно **проглатывается**;
2. `clearTokens()` — токены удаляются из хранилища;
3. `authenticated = false`, `data.user = {}`;
4. `redirect('/login')`.

`preventDefault()` в обоих обработчиках обязателен: без него ссылка успела бы сменить хэш до сброса авторизации (роутер подумает «залогинен и попал на вход» → вернёт на главную), а форма на `file://` вообще свалила бы приложение на `file:///logout/`.

### 4.5 Протухание access-токена

Любой авторизованный запрос идёт через `authenticatedRequest()`: `401` → `POST /token/refresh/` → повтор исходного запроса. Если refresh тоже невалиден → `sessionExpired()` → чистка и `/login`. Повторная попытка делается **только один раз**, зацикливания нет.

---

## 5. Состояние и контекст шаблонов

Всё, что видит Nunjucks, лежит в объекте `data` (`www/conf/state.js`):

| Поле | Кем меняется | Назначение |
|---|---|---|
| `appName` | вручную | название проекта: логотип в навбаре и заголовок вкладки |
| `title` | `render()` | заголовок текущей страницы (`titles[path]`) |
| `authenticated` | `app.js`, `views/auth.js` | статус сессии для шаблонов |
| `user` | `views/auth.js` | профиль: `username`, `first_name`, `last_name`, `email`, `date_joined` + вычисляемые `initial`, `initials`, `date_joined_label` |

Поля `initial` / `initials` / `date_joined_label` считает `normalizeUser()` в `www/views/auth.js` — из «сырого» ответа API их взять нельзя, шаблоны рассчитывают именно на них (`{{ user.initial }}` в аватарке навбара, `{{ user.initials }}` в профиле).

Переименовывать `appName`, `user`, `authenticated` нельзя — на них завязаны шаблоны и код. Добавлять свои поля можно: они автоматически станут доступны в шаблонах как `{{ myField }}`.

---

## 6. Шаблоны Nunjucks

### 6.1 Правило

**Шаблоны правятся только в `templates/`.** Файл `www/templates.js` — артефакт сборки; его перезаписывает `npm run precompile` (и `npm run build`, `npm start`, `npm run dev` — они делают это первым шагом).

Что делает `build/precompile.js`: рекурсивно находит все `templates/**/*.html`, компилирует каждый через `nunjucks.precompileString` и оборачивает в самодостаточный JS-файл, который кладёт шаблоны в `window.nunjucksPrecompiled` и выставляет `window.renderPage(name, context)`. Среда — `new nunjucks.Environment(null, { autoescape: true })`.

### 6.2 Наследование

```text
navbar.html  ─┐
              ├─ base.html  ── home.html, profile.html   (extends base)
auth/_layout.html ── auth/login.html, auth/reg.html      (extends _layout)
```

- `base.html` — включает навбар и даёт `{% block content %}`;
- `auth/_layout.html` — центрированная карточка + блоки `content` и `extra_js`.

### 6.3 Инлайн-скрипты в шаблонах

`auth/login.html` и `auth/reg.html` содержат весь JS своих форм в `{% block extra_js %}` — валидацию, показ/скрытие пароля, индикатор надёжности, отправку. Такой подход выбран, чтобы страница входа была полностью самодостаточной.

Важные следствия:

- `render()` заливает HTML через `innerHTML`, который `<script>` **не исполняет** → `rehydrateScripts()` пересоздаёт каждый `<script>` заново, чтобы браузер его выполнил;
- поэтому инлайн-код начинается с проверки `if (!form) return;` — защита от выполнения в неподходящий момент;
- инлайн-скрипты работают только с глобальным API из `app.js` (`window.taskflowAuth`, `window.navigate`), а не с ES-импортами.

### 6.4 Smoke-тест

`npm test` (`build/smoke-templates.js`) рендерит шаблоны **серверным** nunjucks с тестовым контекстом (пользователь, пустой пользователь, варианты списков) и падает, если какой-то шаблон не собирается. Запускайте перед коммитом, который трогает `templates/`.

---

## 7. Хранение токенов

| Платформа | Реализация | Где физически |
|---|---|---|
| Electron | `window.authStorage` (preload → IPC) | `auth.json` в `app.getPath('userData')`, зашифрован `safeStorage`, права `0600` |
| Android | `@aparajita/capacitor-secure-storage` | Keystore системы |
| Браузер | `sessionStorage['auth']` | отладочный fallback, токены живут до закрытия вкладки |

IPC-канал Electron (зарегистрирован в `electron/main.js`, проброшен в `electron/preload.js`):

| Канал | Назначение |
|---|---|
| `auth:load` | прочитать и расшифровать `auth.json` (`null`, если файла нет) |
| `auth:save` | зашифровать и записать токены (`0600`) |
| `auth:clear` | удалить `auth.json` |

Правило безопасности: **Node.js API и `preload.js` не должны попадать в web-часть.** Браузерный код общается с платформой только через адаптер `www/auth-storage.js`.

---

## 8. Конвейер сборки

```text
templates/*.html
    │  npm run precompile   (build/precompile.js)
    ▼
www/templates.js
    │  vite build           (root=www, publicDir=www/vendor, base=./)
    ▼
dist/  ← index.html, assets/*, nunjucks.min.js, bootstrap.bundle.min.js, статика
    ├── электроном грузится напрямую:  electron/main.js → dist/index.html
    └── кладётся в Android:            npx cap sync android
```

Скрипты `package.json`:

| Скрипт | Что делает |
|---|---|
| `npm run precompile` | только компиляция шаблонов |
| `npm run build` | precompile + `vite build` → `dist/` |
| `npm start` | build + запуск Electron |
| `npm run dev` | precompile + Vite dev-сервер на `http://127.0.0.1:4173` (web-версия, Electron не запускает) |
| `npm test` | smoke-тест шаблонов |

После **каждого** изменения `www/` или `templates/` десктоп-сборку нужно обновлять (`npm start` или `npm run build`), а Android — ещё и синхронизировать (`npx cap sync android`) и пересобирать APK.

---

## 9. Electron (десктоп)

Entry point берётся из `package.json` → `"main": "electron/main.js"`.

`electron/main.js`:

- создаёт `BrowserWindow` 1200×800, минимум 360×600;
- грузит `dist/index.html`;
- регистрирует IPC-обработчики `auth:*` (см. раздел 7);
- при `NODE_ENV=development` открывает DevTools;
- стандартное поведение окон: `window-all-closed` → выход (кроме macOS).

Настройки безопасности окна:

```js
webPreferences: {
    preload: path.join(__dirname, 'preload.js'),
    contextIsolation: true,   // изоляция контекста сохранена
    nodeIntegration: false,
    webSecurity: false,       // отключены SOP/CORS для запросов к LAN-backend
}
```

`webSecurity: false` — осознанный компромисс шаблона: клиент ходит по `http://<LAN-IP>:8080` с `file://`-origin, а backend без cors-headers отвечал бы отказом. Граница renderer/node при этом сохраняется (`contextIsolation`), в renderer нет доступа к Node. Для production-сборки стоит вернуть `webSecurity` и настроить CORS на сервере.

Про корневой `main.js` в корне репозитория: это **старый вариант, он не используется** — в `package.json` указан `electron/main.js`. Запускайте приложение через `npm start` или `electron .`, а не `electron main.js`.

Linux/Wayland: если Electron падает или не рисуется на Wayland, запускайте с принудительным X11:

```bash
npm run build
electron --ozone-platform=x11 .
```

---

## 10. Android (Capacitor)

`capacitor.config.json`:

```json
{
  "appId": "com.example.nunjucksstarter",
  "appName": "basic_template_mobile_desctop",
  "webDir": "dist",
  "server": { "androidScheme": "http", "cleartext": true }
}
```

`webDir: "dist"` — Capacitor кладёт **результат сборки Vite**, а не `www/`.

Полный цикл сборки APK:

```bash
npm install
npm run build          # шаблоны + vite → dist/
npx cap sync android   # dist/ → android/app/src/main/assets/public
cd android && ./gradlew assembleDebug
adb install -r app/build/outputs/apk/debug/app-debug.apk
```

Требования: JDK 17, Android Studio с SDK. Release подписывается через Android Studio (**Build → Generate Signed Bundle / APK**); keystore в репозиторий не класть.

Требования к backend для Android:

- `androidScheme: "http"` ⇒ origin приложения обычно `http://localhost` — он должен быть в `CORS_ALLOWED_ORIGINS`;
- `cleartext: true` разрешает незашифрованный HTTP — **только для локальной разработки**;
- Django должен слушать `0.0.0.0:8080`, а не `127.0.0.1`;
- адрес API — LAN-IP компьютера, указанный в `www/conf/conf.js` (на телефоне `localhost` — это сам телефон).

Дополнительно: `pip install django-cors-headers`, добавить `corsheaders` в `INSTALLED_APPS` и middleware **до** `CommonMiddleware`. Не используйте `CORS_ALLOW_ALL_ORIGINS = True` и `ALLOWED_HOSTS = ['*']` в production.

Подробности сборки — в `android_build.md`.

---

## 11. Запуск backend (Django) и контракт API

Запуск для разработки:

```bash
python manage.py runserver 0.0.0.0:8080
```

Проверка доступности (ожидается `404` + `{"error": "Not found"}` — это норма):

```text
http://<LAN-IP>:8080/api/
```

Контракт, на который рассчитан клиент:

| Вызов | Метод и путь | Тело / заголовки | Ответ |
|---|---|---|---|
| Вход | `POST /login/` | `{username, password}` | `{access, refresh}` |
| Регистрация | `POST /register/` | `{username, email, first_name, last_name, password, password2}` | `2xx` (дальше идёт авто-вход) |
| Профиль | `GET /profile/` | `Authorization: Bearer <access>` | `{username, first_name, last_name, email, date_joined, …}` |
| Обновление токена | `POST /token/refresh/` | `{refresh}` | `{access, refresh?}` |
| Выход | `POST /logout/` | `Authorization: Bearer …`, `{refresh_token}` | `2xx` |

Формат ошибок: клиент ожидает DRF — JSON, у которого ошибки могут быть вложены (объект/массив); `flattenMessages()` разворачивает их в строку для алерта. Пустые ответы `204/205` поддерживаются.

---

## 12. Диагностика

### Вечный спиннер «Подключаемся к серверу…»

`render()` не был вызван или вышел по guard-у. По порядку:

1. Откройте DevTools и посмотрите Console на ошибки JS (например, `ApiError is not defined` — см. раздел 13).
2. Проверьте `window.__debug.isReady()` — если `false`, `initialize()` не дошёл до конца (обычно висящий fetch — смотрите таймауты в Network).
3. Проверьте `window.__debug.getStartupError()` — там текст сетевой ошибки, он же должен показаться алертом на странице входа.
4. Убедитесь, что `dist/index.html` существует и собран свежий: `npm run build`.

### Пустая страница в Electron

1. Пересоберите: `npm start` (или `npm run build && electron .`).
2. Проверьте наличие `dist/index.html` и `dist/assets/*`.
3. Не запускайте корневой `main.js` — это legacy entry point без настроенного preload.
4. На Wayland добавьте `--ozone-platform=x11`.

### Не логинит / «Сервер не отвечает (таймаут 10 с)»

1. Backend поднят и слушает `0.0.0.0`, а не `127.0.0.1`.
2. Адрес в `www/conf/conf.js` совпадает с реальным LAN-IP (пересоберите после правки).
3. С телефона откройте `http://<LAN-IP>:8080/api/` в браузере.
4. Firewall пропускает порт 8080, Wi-Fi не изолирует клиентов.
5. В Android — CORS (`http://localhost` origin) и `cleartext`.

### Изменения не появились в приложении

Полный цикл, а не только правка `www/`:

```bash
npm run build
npx cap sync android      # только для Android
cd android && ./gradlew assembleDebug && cd ..
adb install -r android/app/build/outputs/apk/debug/app-debug.apk   # только для Android
```

`dist/` и `android/` в git не входят — старая копия в APK обновляется только через `cap sync` + пересборку.

### `window.bootstrap не определён`

В `index.html` Bootstrap подключается не-модульным скриптом из `dist/bootstrap.bundle.min.js`. Если файла нет или он переименован — модалки и тосты не заработают (сам рендер при этом продолжит функционировать).

---

## 13. Известные проблемы и хвосты

Список того, что стоит починить/разобрать (по состоянию на текущую версию кода):

1. **`www/conf/api.js` ссылается на несуществующие в своём модуле идентификаторы.** `ApiError`, `flattenMessages` и `redirect` используются, но не импортированы и не объявлены (они остались в `app.js`/`views/auth.js`). Сейчас это проявляется как `ReferenceError: ApiError is not defined` в момент ошибки запроса, вместо аккуратного сообщения на странице входа. Нужно объявить `ApiError`/`flattenMessages` в общем модуле и импортировать `redirect`.
2. **Мусор в `www/conf/api.js:24`** — «висячий» идентификатор `REQUEST_TIMEOUT_MS` после `const headers = { ...options.headers };`. Не ломает парсинг, но должен быть удалён.
3. **`electron/preload.js` пробрасывает `findApiBase()`** (канал `api:find-base`), а обработчика в `electron/main.js` для него нет — вызов зареджектится с «No handler registered». Функцию никто не вызывает.
4. **Мёртвый код автопоиска API** в `electron/main.js`: `getCandidateIPs()`, `probeApi()`, `findApiBase()` (сканирование подсети с дедлайном 4 с) нигде не вызываются — адрес API захардкожен в `www/conf/conf.js`. Либо вернуть вызов, либо удалить.
5. **Устаревшие упоминания `window.TASKFLOW_API_URL`** — в комментариях `www/conf/conf.js`, `www/index.html` и в `DOCX/index.html`. Фактически адрес задаётся только константой в `www/conf/conf.js`.
6. **Разметка без логики**: `#toastHost` и `#confirmModal` в `index.html` есть, а JS-хелперов (`showToast()`, `confirmDialog()`) в коде пока нет.
7. **Пустая/лишняя инфраструктура**: пустая папка `www/modules/` (переехала в `www/conf/`), файл `u2.js` в корне, не подключённый `www/static/style.css` (дублирует назначение `www/styles.css` и `custom/css/app.css`).
8. **`build/smoke-templates.js` готовит контекст задач** (`tasks`, `stats`, `filters`, `sorts`), хотя соответствующих шаблонов (`partials/stats.html`, `partials/task_list.html`) в проекте уже нет — тест не проверяет их, но данные вводят в заблуждение.
9. **Безопасность Electron**: `webSecurity: false` (раздел 9) допустим для LAN-шаблона, но не для production.
10. **Нет unit-тестов** web-части — есть только smoke-тест шаблонов.

---

## 14. Полезные команды

| Задача | Команда |
|---|---|
| Установить зависимости | `npm install` |
| Разработка (web, без Electron) | `npm run dev` |
| Сгенерировать шаблоны | `npm run precompile` |
| Собрать production web assets | `npm run build` |
| Собрать и запустить десктоп | `npm start` |
| Запустить Electron вручную | `electron .` (Wayland: `electron --ozone-platform=x11 .`) |
| Smoke-тест шаблонов | `npm test` |
| Синхронизировать Android | `npx cap sync android` |
| Собрать Android debug APK | `cd android && ./gradlew assembleDebug` |
| Установить APK на телефон | `adb install -r android/app/build/outputs/apk/debug/app-debug.apk` |
| Открыть Android Studio | `npx cap open android` |

Отладка из DevTools (Console):

```js
window.__debug.getData()          // текущий объект data
window.__debug.getApiBase()       // адрес API
window.__debug.getStartupError()  // текст ошибки старта
window.__debug.isReady()          // завершилась ли инициализация
```
