/* Smoke-тест шаблонов: рендерим их серверным nunjucks с теми же данными,
   что отдаёт www/conf/state.js, и ловим ошибки фильтров/полей. */
const path = require('path');
const nunjucks = require('nunjucks');

const env = nunjucks.configure(path.join(__dirname, '..', 'templates'), {
    autoescape: true,
    throwOnUndefined: false,
});

const user = {
    id: 1,
    username: 'ivanov',
    first_name: 'Иван',
    last_name: 'Иванов',
    email: 'ivanov@example.com',
    role: 'admin',
    initial: 'И',
    initials: 'ИИ',
    date_joined_label: '03.10.2026',
};

const emptyUser = { initial: '?', initials: '?', date_joined_label: '', role: '' };

const base = {
    appName: 'Police Department',
    title: 'Автопарк',
    path: '/',
    authenticated: true,
    isAdmin: false,
    user,

    cars: [],
    allCars: [],
    carsQuery: '',
    carsLoading: false,
    carsLoaded: true,
    carsError: '',

    users: [],
    allUsers: [],
    usersQuery: '',
    usersLoading: false,
    usersLoaded: false,
    usersError: '',
};

const cars = [
    {
        car_id: 1, vin: 'JTDKB20U697777777', model: 'Toyota Camry', year: 2019,
        color: 'Белый', status: 'in_stock', img: '', created_at: '2026-10-01T10:00:00',
        title: 'Toyota Camry (JTDKB20U697777777)', sold: false,
    },
    {
        car_id: 2, vin: 'WAUZZZ8K0AA000001', model: 'Audi A6', year: 2020,
        color: 'Чёрный', status: 'sold', img: 'http://127.0.0.1:8080/media/images/a6.jpg',
        created_at: '2026-10-02T12:00:00',
        title: 'Audi A6 (WAUZZZ8K0AA000001)', sold: true,
    },
    {
        car_id: 3, vin: 'Z94C241AAB0000001', model: 'Very long police car model name that should not break the layout',
        year: null, color: '', status: 'in_stock', img: '', created_at: '',
        title: 'Very long police car model name (Z94C241AAB0000001)', sold: false,
    },
];

const users = [
    { profile_id: 3, username: 'petrov', user_id: 3 },
    { profile_id: 2, username: 'sidorov', user_id: 2 },
    { profile_id: 1, username: 'ivanov', user_id: 1 },
];

const cases = [
    ['home.html', { ...base, cars, allCars: cars }],
    ['home.html', { ...base, cars: [], allCars: [], carsQuery: 'camry' }],
    ['home.html', { ...base, cars: [], carsLoading: true }],
    ['home.html', { ...base, cars: [], carsError: 'Сервер не отвечает' }],
    ['home.html', { ...base, isAdmin: true }],
    ['users.html', { ...base, path: '/users', title: 'Пользователи', isAdmin: true, users, allUsers: users }],
    ['users.html', { ...base, path: '/users', title: 'Пользователи', isAdmin: true, usersQuery: 'petr' }],
    ['users.html', { ...base, path: '/users', title: 'Пользователи', isAdmin: true, usersLoading: true }],
    ['profile.html', { ...base, title: 'Профиль', path: '/profile' }],
    ['profile.html', { ...base, title: 'Профиль', path: '/profile', user: emptyUser }],
    ['auth/login.html', { ...base, title: 'Вход', authenticated: false, user: emptyUser }],
    ['auth/reg.html', { ...base, title: 'Регистрация', authenticated: false, user: emptyUser }],
];

let failed = 0;
for (const [name, ctx] of cases) {
    try {
        const html = env.render(name, ctx);
        if (html === null || html === undefined) throw new Error('undefined вместо строки');
        console.log(`ok   ${name}  (${html.length} симв.)`);
    } catch (err) {
        failed += 1;
        console.log(`FAIL ${name}: ${err.message}`);
    }
}

console.log(failed ? `\n${failed} ошибок` : '\nВсе шаблоны рендерятся');
process.exit(failed ? 1 : 0);
