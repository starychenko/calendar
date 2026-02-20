# Git Workflow

## Commit Message Format
`<emoji> <Ukrainian description>`

### Emoji guide
- 🐛 — bug fix
- ✨ — new feature
- ♻️ — refactor
- 📝 — documentation
- 🎨 — UI/style changes
- ⚡ — performance improvement
- 🔒 — security fix
- 🧹 — cleanup / removing dead code
- 🚀 — deployment / production changes

### Examples
```
🐛 Виправлено timezone баг у розрахунку Великодня
✨ Додано підтримку нового типу свят
📝 Оновлено CLAUDE.md — нові guardrails
♻️ Рефакторинг FloatingHolidays компоненту
```

## Workflow
1. `git pull` перед початком роботи
2. Робимо зміни
3. `npm run lint && npm run build` — обидва мають пройти
4. `git add -A && git commit -m "emoji Ukrainian message"`
5. `git push`
6. `request_review()` через MCP

## Branch Policy
- Прямо в `main` для дрібних задач (поточний проект — solo)
- Feature branch для великих змін: `git checkout -b feature/name`
