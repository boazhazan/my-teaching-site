# Memory: my-teaching-site

תיעוד של עבודה על האתר של בועז (boazhazan/my-teaching-site).

## מה זה הפרויקט
האתר השיווקי + פלטפורמת תוכן של בועז חזן - מורה פרטי למתמטיקה ומדמ"ח.
- HTML פשוט (RTL עברית)
- CSS משלו (style.css), פונט Heebo, צבעים #2563eb (כחול primary), #f59e0b (כתום accent)
- מבנה: index.html, about.html, services.html, materials.html (קטלוג), duckme.html, contact.html, ask-teacher.html

## אינטגרציה עם DuckMe app
האתר וה-DuckMe app הם 2 פרויקטים נפרדים:
- **כאן** (my-teaching-site): השיווק והתוכן
- **שם** (amazing-duck-server-v3): האפליקציה עצמה (Flutter + FastAPI backend)

הזרימה:
1. מבקר חדש מגיע לאתר
2. רואה הסבר על DuckMe ב-duckme.html
3. לוחץ "🦆 התחל עכשיו - Web App" → נפתח tab חדש לאפליקציה
4. (תהליך WhatsApp) בועז שולח classroom_code
5. המבקר מצטרף לכיתה הספציפית

---

## 📝 סיכום סשן 2026-04-26

### מה נעשה
- ✅ נוצר branch feat/duckme-integration
- ✅ נוסף כפתור "🦆 התחל עכשיו - Web App" ב-Hero של duckme.html (שורה 49)
- ✅ ל-CTA: http://develop.duckme.app (HTTP זמני - אין SSL בשרת)
- ✅ הוסף *.bak ל-.gitignore
- ✅ Push ל-origin/feat/duckme-integration

### Commits בbranch
- `1e139cd`: feat: add 'Try Web App' CTA button to DuckMe page hero
- `dc96857`: fix: change DuckMe Web app link from HTTPS to HTTP (temporary)

### חוב טכני ידוע
1. **HTTP במקום HTTPS** - הכפתור מוביל ל-HTTP. Browsers מציגים "Not secure".
   - לתקן: שלב 5 (בפרויקט amazing-duck-server-v3) - הגדרת SSL ב-develop server

### לסשן הבא
- **לא היום:** מיזוג של feat/duckme-integration ל-main של האתר
  - חכה עד ש-develop.duckme.app יקבל SSL ונוכל להחזיר את הכפתור ל-HTTPS
  - אז: PR + merge

### איך להתחיל את הסשן הבא
"קרא MEMORY.md ב-my-teaching-site, אני רוצה X"
