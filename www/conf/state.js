

import { auth } from "../auth-storage.js";


export const data = {
    appName: 'Police Department',
    title: 'Главная',
    path: '/',            

    authenticated: false,
    isAdmin: false,        
    user: {},              

    cars: [],
    allCars: [],
    carsQuery: '',
    carsLoading: false,
    carsLoaded: false,
    carsError: '',

    users: [],
    allUsers: [],
    usersQuery: '',
    usersLoading: false,
    usersLoaded: false,
    usersError: '',
};

export let authReady = false;

export let startupError = '';

export function markAuthReady() {
    authReady = true;
}

export function setStartupError(message) {
    startupError = message;
}

export let authenticated;
export function set_authenticated(value) {
    authenticated = value;
}

export let tokens = null;
export function setTokens(value) {
    tokens = value;
}


export function resetSessionData() {
    data.authenticated = false;
    data.isAdmin = false;
    data.user = {};

    data.cars = [];
    data.allCars = [];
    data.carsQuery = '';
    data.carsLoading = false;
    data.carsLoaded = false;
    data.carsError = '';

    data.users = [];
    data.allUsers = [];
    data.usersQuery = '';
    data.usersLoading = false;
    data.usersLoaded = false;
    data.usersError = '';
}

export async function readTokens() {
    return auth.load();
}

export async function saveTokens(value) {
    setTokens(value);
    await auth.save(value);
}

export async function clearTokens() {
    setTokens(null);
    await auth.clear();
}
