# הנחיות פרויקט — אתר בועז חזן

## סקירה כללית
אתר GitHub Pages של בועז חזן — מורה פרטי ורכז למתמטיקה ומדעי המחשב.
שתי מטרות: כרטיס ביקור מקצועי + פלטפורמת למידה עצמית עם תרגילים אינטראקטיביים בעברית.

- **כתובת חיה:** https://boazhazan.github.io/my-teaching-site/
- **ריפו:** github.com/boazhazan/my-teaching-site
- **ענף ראשי:** `main` — push ישיר, אין PRs (אלא אם המשתמש מבקש במפורש)
- **פריסה:** GitHub Actions אוטומטי על כל push ל-main (`.github/workflows/deploy.yml`) — האתר סטטי, אין שרת backend מלבד Apps Script כ-API.

---

## עץ הקבצים האמיתי (חשוב — לא להמציא נתיבים)

```
my-teaching-site/
├── index.html              דף הבית
├── about.html              אודות
├── services.html           שיעורים ומחירון
├── materials.html          קטלוג חומרי לימוד (טאבים לפי שלב/מקצוע/כיתה)
├── duckme.html             עמוד DuckMe
├── contact.html            טופס יצירת קשר
├── README.md
├── CLAUDE.md               (הקובץ הזה)
├── favicon.ico
├── css/
│   └── style.css           CSS ראשי לאתר הראשי בלבד (תרגילים הם self-contained)
├── js/
│   ├── main.js             ניווט, טאבים, פילטרים, badge "חדש!"
│   └── auth-gate.js        מערכת רישום/תשלום/נעילה — נטען בכל 6 דפי השורש
├── assets/
│   ├── images/
│   └── images_DuckMe/
├── materials/              כל קבצי השיעורים (single-file HTML)
│   ├── preschool/
│   │   ├── age-3-4/{basic-concepts, belonging-matching, detail-recognition, expression, eye-hand-coordination, fine-motor, quantitative-comparison, quantity, shape-thinking}/
│   │   ├── age-4-5/{...אותם תת-נושאים}/
│   │   ├── age-5-6/{...}/
│   │   └── prep/           הכנה לכיתה א'
│   ├── elementary/
│   │   ├── math/grade-1..6/
│   │   ├── cs/grade-1..6/
│   │   ├── hebrew/grade-1..6/
│   │   └── holidays/
│   ├── middle/
│   │   ├── math/grade-7..9/
│   │   └── cs/grade-7..9/
│   ├── high/
│   │   ├── math/grade-10..12/
│   │   └── cs/grade-10..12/{course-name}/   ← קורסים: כל קורס בתיקייה משלו
│   └── bagrut/{math, cs}/
└── .github/workflows/deploy.yml
```

### חוקי נתיבים
- **שיעור preschool/elementary/middle/high/bagrut**: `materials/{stage}/{subject}/{grade}/{lesson}.html`
  דוגמה: `materials/middle/math/grade-7/variables-and-expressions.html`
- **preschool מחולק אחרת**: `materials/preschool/{age-3-4|age-4-5|age-5-6|prep}/{topic}/{lesson}.html`
- **back link מתוך שיעור**: `../../../../materials.html` (4 רמות מעלה ברוב המקרים)
- **קורס תיכון**: `materials/high/{subject}/grade-{N}/{course-name}/course.html` (דף ראשי) + `lesson-X-Y.html` (שיעורים)
  דוגמה: `materials/high/cs/grade-10/fullstack/course.html`, `materials/high/cs/grade-10/fullstack/lesson-1-1.html`
  עומק 5 — סקריפטים: `../../../../../js/auth-gate.js`
- **שמות קבצים**: אנגלית kebab-case בלבד. `find-differences.html`, `compare-numbers.html`. **לא** עברית בשמות קבצים.
- **flat structure בתוך תיקיית כיתה** — אין תת-תיקיות לפי נושא בתוך grade-N.

---

## כללים טכניים כלליים

### עיצוב ופונטים
- **כיוון:** RTL (`<html dir="rtl" lang="he">`)
- **פונטים:** Google Fonts — **Heebo** (ראשי לאתר ולתרגילים), **Rubik** (משמש בתרגילי מתמטיקה לביטויים LTR)
- **משתני CSS עיקריים** (מ-`css/style.css` — להשתמש בהם באתר הראשי):
  ```
  --primary: #2563eb       --primary-dark: #1d4ed8    --primary-light: #dbeafe
  --accent:  #f59e0b       --accent-dark:  #d97706
  --text:    #1e293b       --text-light:   #64748b
  --bg:      #ffffff       --bg-soft:      #f8fafc    --bg-muted: #f1f5f9
  --border:  #e2e8f0       --success:      #10b981
  --radius:  12px          --radius-sm:    8px
  ```
- **קבצי שיעור הם self-contained**: inline CSS + inline JS, אפס תלויות חיצוניות (חוץ מ-Google Fonts ואופציונלית auth-gate.js — ראו למטה).

### בכל דף HTML של האתר הראשי (6 קבצי השורש)
חובה לכלול לפני `</body>`:
```html
<script src="js/auth-gate.js"></script>
<script src="js/main.js"></script>
```
**הסדר חשוב** — auth-gate.js לפני main.js. כל 6 הדפים (`index, about, services, materials, duckme, contact`) כבר מוגדרים נכון.

### בקבצי שיעור (materials/...)
**חובה** לטעון את `auth-gate.js` בכל קובץ שיעור, לפני `</body>`. הסיבה: לסגור את הפרצה של גישה ישירה ל-URL של שיעור (עוקפת את הנעילה של הקטלוג).

**הנתיב משתנה לפי עומק הקובץ:**
- שיעור בעומק 4 (רוב המקרים — `materials/{stage}/{subject}/grade-N/file.html`):
  ```html
  <script src="../../../../js/auth-gate.js"></script>
  ```
- שיעור בעומק 3 (`materials/preschool/prep/file.html`, `materials/elementary/holidays/file.html`, `materials/elementary/math/file.html` ללא grade):
  ```html
  <script src="../../../js/auth-gate.js"></script>
  ```

**להוסיף גם `data-premium`** לחלקי התוכן שיש לנעול לפי הכללים בסעיף "מערכת נעילת תכנים" למטה. טעינת הסקריפט לבדה לא נועלת כלום — היא רק מאפשרת את הלוגיקה. הנעילה האמיתית באה ממאפייני HTML או מתנאים ב-JS של הקובץ.

### חובה: כפתור "שאל את המורה" בכל קובץ שיעור
בכל קובץ שיעור (בכל שלב — preschool, elementary, middle, high, bagrut) **חובה** לטעון את `js/ask-teacher-btn.js` בנוסף ל-`auth-gate.js`. הסקריפט מוסיף כפתור צף 🦆 בפינה השמאלית-תחתונה שמעביר ל-`ask-teacher.html` עם הקשר (נושא/רמה/שאלה) מה-URL.

**הנתיב משתנה לפי עומק הקובץ — זהה ל-auth-gate.js:**
- עומק 4 (`materials/{stage}/{subject}/grade-N/file.html`):
  ```html
  <script src="../../../../js/auth-gate.js"></script>
  <script src="../../../../js/ask-teacher-btn.js"></script>
  ```
- עומק 3 (`materials/preschool/prep/file.html`, `materials/elementary/holidays/file.html` וכו'):
  ```html
  <script src="../../../js/auth-gate.js"></script>
  <script src="../../../js/ask-teacher-btn.js"></script>
  ```

**אל תוסיף** את `ask-teacher-btn.js` לדפי השורש של האתר (index, about, services, materials, duckme, contact). הכפתור שם מיותר — הוא רק לדפי תרגיל/הקניה.

**קבצי שיעור שמנהלים רמות דינמית ב-JS** (כמו `match-letters.html` שיש לו state פנימי של 15 רמות) — לא ניתן להוסיף להם `data-premium` סטטי. במקום, להוסיף בתחילת הפונקציה שמטעינה רמה:
```js
if (typeof AuthState !== 'undefined' && !AuthState.isLoggedIn() && level > 1) {
  if (typeof showAuthModal === 'function') showAuthModal();
  return;
}
```

---

## מערכת נעילת תכנים — חובה לעקוב!

`js/auth-gate.js` סורק את הדף ב-DOMContentLoaded ומציג שכבת blur+מנעול על כל אלמנט עם:
- `data-auth-locked="true"` (לקטלוג materials.html)
- `data-premium` (לתרגילים בודדים)
- כל אחד מ-`.level-tab, .tab-btn, [data-level]` חוץ מהראשון (אוטומטי)

**הגדרות מפתח:**
- API: `https://script.google.com/macros/s/AKfycbzGLYhz0ZuhY0caoaae88fVmY9LreZFC7CoE4hvJuGnuAoH-D_afZ593ff7us2puKvKUw/exec`
- מחיר: ₪20 חד-פעמי
- קוד בדיקות: `BOAZ2026` (עובד תמיד, גם אופליין)
- localStorage key: `bh_auth`
- טלפון תשלום (ביט/פייבוקס): 0523616310

### כללי נעילה לפי שלב לימודים

#### פריסקול + יסודי (גילאי 3-12)
כל קובץ שיעור מכיל מספר תרגילים (exercises/levels/tabs).
- **תרגיל 1** — פתוח, **בלי** `data-premium`
- **תרגיל 2 ואילך** — `data-premium`

```html
<div data-exercise="1">...תרגיל ראשון...</div>
<div data-exercise="2" data-premium>...נעול...</div>
<div data-exercise="3" data-premium>...נעול...</div>
```

אם יש טאבים (`.level-tab`, `.tab-btn`, `[data-level]`) — auth-gate.js ננעל אוטומטית על כולם חוץ מהראשון. אין צורך להוסיף ידנית `data-premium` לטאבים.

#### חטיבת ביניים (גילאי 12-15)
התבנית הקנונית: `materials/middle/math/grade-7/variables-and-expressions.html`. **תמיד להעתיק ממנה כשבונים שיעור חטיבה חדש.**

מבנה: 7 צעדי הקניה + 4 רמות תרגול (קל/בינוני/קשה/אתגר = 20/20/20/15 = 75 שאלות).

- **הקניה** — `<div data-section="teach">` — תמיד פתוחה, **בלי** `data-premium`
- **תרגול** — בכל אחת מ-4 רמות הקושי:
  - שאלה 1: `<div data-question="1">` — פתוחה
  - שאלה 2+: `<div data-question="N" data-premium>` — נעולה

```html
<div data-section="practice">
  <div data-difficulty="easy">
    <div data-question="1">...פתוחה...</div>
    <div data-question="2" data-premium>...נעולה...</div>
  </div>
  <div data-difficulty="medium">...אותו דפוס...</div>
  <div data-difficulty="hard">...</div>
  <div data-difficulty="challenge">...</div>
</div>
```

#### תיכון (קורסים)
מבנה: קורסים עם יחידות, כל יחידה מכילה מספר שיעורים.
- **שיעור ראשון בכל יחידה** — פתוח, **בלי** `data-premium`
- **שיעור 2+ בכל יחידה** — `data-premium`

דף קורס ראשי (`course.html`) — פתוח לכולם, מציג את עץ היחידות והשיעורים. הנעילה היא על קישורי השיעורים הנעולים בלבד.

#### בגרות
**אל תוסיף נעילה.** הספציפיקציה עוד לא נסגרה — להשאיר פתוח לחלוטין עד הוראה מפורשת.

#### דף materials.html
**אל תוסיף `data-auth-locked` לפריטי קטלוג — אף פעם.** כל השיעורים בקטלוג פתוחים לחיצה לכולם. הנעילה קורית **רק בתוך השיעור** (שאלה/תרגיל 1 פתוח, 2+ נעול). הקטלוג הוא רק רשימת כותרות — אסור לחסום כניסה לשיעור עצמו.

---

## materials.html — איך להוסיף שיעור חדש לקטלוג

### מבנה תאי קטלוג
המבנה הקבוע של פריט קטלוג:
```html
<a href="materials/{path}/{lesson}.html"
   class="material-item"
   data-created="YYYY-MM-DD"
   data-tags="תגית1,תגית2"
   style="text-decoration:none;color:inherit">
  <div class="material-icon">🔢</div>
  <div class="material-info">
    <h4>שם השיעור</h4>
    <p>תיאור קצר — איזה כיתה</p>
    <div class="material-tags">
      <span class="material-tag tag-תגית1">תגית1</span>
      <span class="material-tag tag-תגית2">תגית2</span>
    </div>
  </div>
</a>
```

### איזה טאב לעדכן
טאבים קיימים ב-materials.html (כל אחד `<div class="materials-content" id="tab-...">`):
- **preschool**: `tab-preschool-3-4`, `tab-preschool-4-5`, `tab-preschool-5-6`, `tab-preschool-prep`
- **elementary math**: `tab-elementary-math-1` עד `tab-elementary-math-6`
- **elementary cs**: `tab-elementary-cs-1` עד `tab-elementary-cs-6`
- **elementary hebrew**: `tab-elementary-hebrew-1` עד `tab-elementary-hebrew-6`
- **elementary holidays**: `tab-elementary-holidays-1` עד `tab-elementary-holidays-6`
- **middle**: `tab-middle-math-7..9`, `tab-middle-cs-7..9`
- **high**: `tab-high-math`, `tab-high-cs`
- **bagrut**: `tab-bagrut-math`, `tab-bagrut-cs`

### כללי הוספה
1. **אל תוסיף ידנית** את הבדג' `<span class="material-badge">חדש!</span>` — `js/main.js` מוסיף אותו אוטומטית לכל פריט עם `data-created` שתאריכו תוך 3 הימים האחרונים. הוספה ידנית = בדג' כפול.
2. **אין `data-auth-locked` בקטלוג.** כל קישור לשיעור בקטלוג פתוח לכולם. הנעילה היא רק בתוך השיעור עצמו (תרגיל/שאלה 1 פתוחים, 2+ נעול).
3. **תגיות (`data-tags`)** — preschool משתמש בתגיות עבריות מתוך הרשימה הסגורה למטה. שלבים אחרים יכולים להמציא תגיות חופשיות (אבל עקביות).

### תגיות preschool הסגורות (לפילטר)
`אבחנה`, `מוטוריקה`, `מושגי יסוד`, `צורות`, `עין-יד`, `כמות`, `שייכות`, `מרחבי`

קבוצות גיל preschool: `3-4`, `4-5`, `5-6`, `prep` (הכנה לכיתה א')

---

## תבנית קנונית לשיעור חטיבה (math grade 7+)

**להעתיק תמיד מ-** `materials/middle/math/grade-7/variables-and-expressions.html` כנקודת התחלה.

מאפיינים:
- **single-file HTML** — inline CSS + inline JS
- **7 צעדי הקניה** + **4 רמות תרגול** (easy/medium/hard/challenge)
- **75 שאלות סך הכל**: 20+20+20+15
- **PRNG דטרמיניסטי לפי תאריך** (`mulberry32`) — אותן שאלות למשך כל היום
- **localStorage progress** דרך `LS_KEY` ייחודי לכל שיעור (לדוגמה `bh_grade7_variables`)

### כללי זהב לבניית שיעור מתמטיקה (lessons learned the hard way)

#### 1. LTR math בתוך RTL — קריטי!
**CSS** קנוני לביטויי inline math:
```css
.math-expr{direction:ltr;unicode-bidi:embed;display:inline;
           font-family:'Rubik',sans-serif;font-weight:700;color:var(--primary)}
.big-expr{direction:ltr;unicode-bidi:embed;text-align:center;...}
.mid-expr{direction:ltr;unicode-bidi:embed;text-align:center;...}
```

- **חובה `unicode-bidi:embed` — לא `isolate`.** `isolate` שובר דפוסי dash-prefix כמו `מ-x` (המקף מופיע בצד הלא נכון). רק `embed` נותן את ה-rendering הנכון.
- **חובה `display:inline` — לא `inline-block`.** inline-block שובר את ה-bidi.
- **באפשרויות multiple-choice** — לעטוף את הביטוי ב-LTR span:
  ```js
  html += '...<span dir="ltr" style="unicode-bidi:embed">' + opt + '</span>...';
  ```
  קל לשכוח כשמעתיקים את התבנית. תמיד `grep dir="ltr"` אחרי שמעדכנים `renderQuestion`.

- **דפוסי משתנים בעברית** — לעטוף את המשתנה ב-`<span class="math-expr">x</span>`:
  - ✅ `הגדול מ-<span>x</span> ב-5`
  - ✅ `הקטן מ-<span>x</span> ב-3`, `פי 4 מ-<span>x</span>`, `חצי מ-<span>x</span>`
  - ✅ `תלויה ב-<span>x</span>`, `כש-<span>x=5</span>`, `ל-<span>x</span>`
  - ❌ להימנע ממשתנה בתחילה לוגית של ביטוי RTL (יוצא מוזר ויזואלית).

- **סימן `\u200E` (LEFT-TO-RIGHT MARK) — חובה למספרים שליליים ולנקודות (קואורדינטות)!**
  בהקשר RTL, מספרים שליליים כמו `-3` עלולים להציג את המינוס מימין (`3-`) ונקודות `(x, y)` עלולות להציג x מימין ו-y משמאל (הפוך). הפתרון: הוספת `\u200E` לפני כל מספר שיכול להיות שלילי וסביב רכיבי נקודה.

  **פונקציית עזר חובה בכל שיעור שמציג מספרים שליליים:**
  ```js
  function ltrN(v){return '\u200E'+v}
  ```

  **לנקודות (קואורדינטות):**
  ```js
  function ptStr(x,y){return '\u200E(\u200E'+x+', \u200E'+y+')'}
  ```

  **שימוש — בהסברים, ב-stem, ובכל טקסט שמוצג ב-RTL:**
  ```js
  // ✅ נכון:
  explanation:'x = '+ltrN(x)+' ו-y = '+ltrN(y)
  explanation:'המרחק = |'+ltrN(a)+' − '+ltrN(b)+'| = '+dist
  stem:'הנקודה '+ptStr(x,y)+' נמצאת ב...'

  // ❌ לא נכון (בלי ltrN — מינוס מוצג הפוך):
  explanation:'x = '+x+' ו-y = '+y
  ```

  **חשוב:** אל תוסיפו `ltrN()` למערכי אפשרויות (options) שמשמשים ב-`indexOf` — זה ישבור את מציאת התשובה הנכונה. האפשרויות כבר עטופות ב-`<span dir="ltr" style="unicode-bidi:embed">` ב-`renderQuestion`.

#### 2. הסימן `−` (U+2212) **לא חוקי ב-JS**
- מותר רק במחרוזות תצוגה (HTML/stem text)
- בקוד JS (מספרים, מערכי literal) — רק ASCII `-`
- `wrong:[5,−5,15]` → `SyntaxError`. חייב להיות `wrong:[5,-5,15]`

#### 3. באג `switchSection` בתבנית
ב-JS של התבנית: חייב להיות `style.display='block'` ולא `style.display=''`.
הסיבה: `#practiceSection{display:none}` ב-CSS — מחרוזת ריקה יורשת את `none` והסקציה נשארת מוסתרת.

#### 4. מגבלת tokens בקבצי שיעור גדולים
שיעור חטיבה ~700+ שורות. בעת יצירה דרך כלי Write, לפצל ל-4 שלבים:
1. Write: CSS + HTML + state/utilities + placeholder comment
2. Edit: הוספת צעדי הקניה
3. Edit: הוספת מחוללי שאלות (easy + medium)
4. Edit: הוספת מחוללי שאלות (hard + challenge) + rendering + init

#### 5. ולידציה לפני commit
לפני שדוחפים שיעור חדש, להריץ בדיקה ב-Node:
```js
// לחלץ את ה-<script>, להחליף DOM stub,
// להריץ genEasy/Medium/Hard/Challenge,
// לוודא counts = 20,20,20,15 ושכל q.answer index חוקי.
```

---

## API (Google Apps Script)
- **URL:** `https://script.google.com/macros/s/AKfycbzGLYhz0ZuhY0caoaae88fVmY9LreZFC7CoE4hvJuGnuAoH-D_afZ593ff7us2puKvKUw/exec`
- **Actions:** `register`, `verify`, `check`
- **Content-Type:** `text/plain` (דרישה של Apps Script — לא `application/json`!)
- **קוד בדיקות:** `BOAZ2026` (עובד תמיד, גם כשה-API לא זמין — fallback אופליין)

---

## Commit & Push
- **סגנון הודעות:** באנגלית עם נושא בעברית בסוגריים לבהירות
- **פורמט:** `feat: add grade N lesson M - topic (נושא בעברית)`
  דוגמאות:
  - `feat: add grade 7 lesson 3 - order of operations (סדר פעולות החשבון)`
  - `feat: add even-odd and area-perimeter exercises for grade 2`
- **אין co-author trailer** (המשתמש לא משתמש בזה)
- **Push מיד אחרי commit** אלא אם המשתמש אומר אחרת
- **Branch:** `main` — push ישיר, אין PRs

---

## סביבה ופלטפורמה
- **OS:** Windows 10
- **Shell:** Bash on Windows — להשתמש ב-syntax יוניקסי (`/dev/null`, forward slashes)
- **Path במחשב:** `C:/boaz-my-teaching-site/my-teaching-site` (עובד גם כ-`C:\boaz-my-teaching-site\my-teaching-site`)

---

## אל תעשה
- אל תיצור תיקיות `exercises/` — לא קיים, השתמש ב-`materials/`
- אל תכתוב שמות קבצים בעברית
- אל תוסיף badge `חדש!` ידנית (`js/main.js` עושה את זה)
- אל תשתמש ב-`unicode-bidi:isolate` בביטויי math — תמיד `embed`
- אל תשתמש ב-`−` (minus sign) בתוך JS literals
- אל תוסיף נעילה לתיכון/בגרות
- אל תוסיף `data-auth-locked` לפריטי קטלוג ב-materials.html — אף פעם, בשום שלב. כל קישור לשיעור בקטלוג פתוח לכולם; הנעילה היא רק בתוך השיעור.
- אל תשנה את `js/main.js` בלי סיבה — הוא יציב והפונקציונליות שלו (טאבים, פילטרים, badge חדש) משמשת את כל האתר
- אל תשכח להוסיף `<script src="{path}/js/ask-teacher-btn.js"></script>` לכל קובץ שיעור חדש (מיד אחרי `auth-gate.js`, באותו עומק נתיב). דף `ask-teacher.html` בשורש הוא יעד הניווט של הכפתור.
