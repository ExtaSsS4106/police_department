# Сборка Android APK (Capacitor)

Инструкция по упаковке веб-части проекта (папка `www/`) в Android-приложение.
Electron сам APK собирать не умеет: он нужен для десктопной версии (exe, dmg, AppImage). Для Android используется Capacitor.

## Требования

- Node.js и npm
- JDK 17
- Android Studio (вместе с Android SDK)

## 1. Установка Capacitor

Выполняется один раз, если Capacitor ещё не установлен:

```bash
npm install @capacitor/core @capacitor/android
npm install -D @capacitor/cli
npx cap init
```

В `capacitor.config.json` укажите папку с веб-кодом:

```json
{
  "appId": "com.example.app",
  "appName": "MyApp",
  "webDir": "www"
}
```

## 2. Добавление Android-проекта

Выполняется один раз:

```bash
npx cap add android
```

Появится папка `android/`.

## 3. Синхронизация веб-кода

Выполняйте после каждого изменения в `www/`:

```bash
npx cap sync android
```

## 4. Сборка debug-APK

Для тестирования на телефоне.

**Вариант A: через Android Studio**

```bash
npx cap open android
```

Затем в меню: **Build → Build Bundle(s) / APK(s) → Build APK(s)**.

**Вариант B: через терминал**

```bash
cd android
./gradlew assembleDebug        # Windows: gradlew.bat assembleDebug
```

Готовый файл:

```
android/app/build/outputs/apk/debug/app-debug.apk
```

Установить на подключённый телефон (включена отладка по USB):

```bash
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

## 5. Release-сборка

Для публикации нужна подписанная сборка.

1. Создайте keystore:

   ```bash
   keytool -genkey -v -keystore my.keystore -alias myapp -keyalg RSA -keysize 2048 -validity 10000
   ```

   Храните файл и пароли в надёжном месте. Если keystore потерян, обновлять приложение будет невозможно. В репозиторий его не добавляйте.

2. Соберите подписанный APK: в Android Studio **Build → Generate Signed Bundle / APK**.

3. Для Google Play нужен AAB, а не APK:

   ```bash
   cd android
   ./gradlew bundleRelease
   ```

   Результат: `android/app/build/outputs/bundle/release/app-release.aab`.

## Важно: хранилище токенов

`window.authStorage` из `preload.js` существует только в Electron. На Android preload не запускается, и `window.authStorage` будет `undefined`, поэтому вызов `load()` сломает страницу.

Для Android нужна отдельная реализация на безопасном хранилище, например плагин `@aparajita/capacitor-secure-storage` или `capacitor-secure-storage-plugin`. Типичный приём, чтобы страница работала везде:

```js
const storage = window.authStorage ?? capacitorAuthStorage; // Electron или Android
```

где `capacitorAuthStorage` это обёртка с теми же методами `load`, `save`, `clear`.

## Шпаргалка команд

| Действие | Команда |
|---|---|
| Добавить Android (один раз) | `npx cap add android` |
| Обновить код после правок | `npx cap sync android` |
| Открыть в Android Studio | `npx cap open android` |
| Debug-APK | `cd android && ./gradlew assembleDebug` |
| Release-AAB | `cd android && ./gradlew bundleRelease` |

## Если проект на Cordova

Команды другие:

```bash
cordova platform add android
cordova build android
```


## Дополнительно

Перед каждым запускрм нужно вводить:

```bash
npm run build
```