// Адрес Django API.
// Для телефона/WebView указывайте LAN-IP компьютера с backend,
// например http://192.168.1.192:8080/api — и пересобирайте клиент (npm run build).

export const API_BASE = ('http://192.168.1.182:8080/api').replace(/\/+$/, '');

export const REQUEST_TIMEOUT_MS = 10000;