# 🚀 Деплой на GitHub Pages

## Шаг 1: Создайте репозиторий на GitHub

1. Зайдите на https://github.com/new
2. Введите название репозитория: `max-messenger`
3. Сделайте репозиторий **Public** (для бесплатного GitHub Pages)
4. **НЕ** добавляйте README, .gitignore или лицензию (у нас уже есть)
5. Нажмите **Create repository**

## Шаг 2: Подключите локальный репозиторий

Скопируйте команды с GitHub и выполните в терминале:

```bash
# Замените YOUR_USERNAME на ваш GitHub username
git remote add origin https://github.com/YOUR_USERNAME/max-messenger.git
git branch -M main
git push -u origin main
```

**Пример:**
```bash
git remote add origin https://github.com/johndoe/max-messenger.git
git branch -M main
git push -u origin main
```

## Шаг 3: Включите GitHub Pages

1. Зайдите в Settings вашего репозитория
2. Слева выберите **Pages**
3. В разделе **Build and deployment**:
   - Source: выберите **GitHub Actions**
4. Сохраните

## Шаг 4: Дождитесь деплоя

1. Перейдите на вкладку **Actions** в репозитории
2. Дождитесь завершения workflow (зелёная галочка ✓)
3. Вернитесь в **Settings → Pages**
4. Скопируйте URL вашего сайта

Ваше приложение будет доступно по адресу:
```
https://YOUR_USERNAME.github.io/max-messenger/
```

## ⚡ Автоматический деплой

Теперь при каждом push в ветку `main` приложение будет автоматически обновляться!

```bash
# Внесите изменения
git add .
git commit -m "Update app"
git push
```

## 🔧 Если нужно обновить base URL

Если приложение не работает, обновите `vite.config.js`:

```js
export default defineConfig({
  plugins: [react()],
  base: '/max-messenger/', // Замените на название вашего репозитория
})
```

Затем:
```bash
npm run build
git add .
git commit -m "Fix base URL"
git push
```

## ✅ Готово!

Ваш MAX Messenger теперь доступен в интернете! 🎉
