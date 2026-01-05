# Public Assets

## PWA Icons

✅ **Іконки вже згенеровані автоматично!**

Цей проект включає автоматичний скрипт для генерації PWA іконок з `app/icon.svg`.

### Автоматична генерація (рекомендовано):

```bash
npm run generate:icons
```

Ця команда створить:
- `icon-192.png` (192x192) - Android Chrome icon
- `icon-512.png` (512x512) - Android Chrome splash icon

### Редагування іконки:

Щоб змінити дизайн іконки:
1. Відредагуйте `app/icon.svg`
2. Запустіть `npm run generate:icons`
3. Іконки автоматично оновляться

### Альтернативні методи:

#### Онлайн генератор:
- https://realfavicongenerator.net/
- https://icon.kitchen/ (app icons)
- https://www.pwabuilder.com/ (PWA assets)

#### Вручну через ImageMagick:
```bash
magick convert -background none -resize 192x192 ../app/icon.svg icon-192.png
magick convert -background none -resize 512x512 ../app/icon.svg icon-512.png
```

## Готовність до PWA

З цими іконками ваш додаток повністю готовий до інсталяції як Progressive Web App! 🎉
