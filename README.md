# I DO · הכנות לחתונה בקלות

אפליקציית ווב לניהול חתונה מקצה לקצה, בעברית ומותאמת לישראל: מוזמנים, אישורי הגעה בוואטסאפ, סידור הושבה, מתנות, ספקים וחוזים עם לוח תשלומים, תקציב ו"מי שילם כמה" (הזוג, הורי הכלה, הורי החתן), צ'קליסט שמתוזמן לפי תאריך החתונה, ויום האירוע עם עמדת כניסה.

- **אתר:** קבצים סטטיים (`index.html`, `app.js`, `styles.css`, `config.js`) שמתארחים ב-GitHub Pages בחינם.
- **מסד נתונים:** [Supabase](https://supabase.com) (PostgreSQL) בחינם, עם הרשאות לפי אירוע וסנכרון בזמן אמת בין כל מי שמחובר.
- **בלי חיבור למסד** האתר עובד ב"מצב מקומי" ושומר רק בדפדפן, טוב לניסיון.

## כניסה עם שתי סיסמאות

| מי | משתמש ב-Supabase | הרשאה |
| --- | --- | --- |
| הזוג | `couple@example.com` | מנהלים: הוספה, עריכה ומחיקה |
| ההורים | `parents@example.com` | צפייה בלבד |

במסך הכניסה מקלידים רק סיסמה. האתר מזהה לפיה אם זה הזוג או ההורים. **הסיסמאות לא נשמרות בקוד**, רק ב-Supabase, וההרשאות נאכפות במסד עצמו (Row Level Security), כך שגם מי שקורא את הקוד לא יכול לערוך בלי הסיסמה של הזוג.

## הפעלה, צעד אחר צעד (כ-15 דקות)

### 1. יצירת מסד הנתונים
1. נכנסים ל-[supabase.com](https://supabase.com) ונרשמים (אפשר עם GitHub).
2. **New project**: שם `chuppah`, סיסמה למסד (שמרו אותה), אזור **Central EU (Frankfurt)** כי הוא הקרוב לישראל.
3. כשהפרויקט מוכן: **SQL Editor > New query**, מדביקים את כל התוכן של [`supabase/schema.sql`](supabase/schema.sql) ולוחצים **Run**. צריך לראות `Success`.

### 2. יצירת שני המשתמשים
1. **Authentication > Users > Add user > Create new user**
2. משתמש ראשון: מייל `couple@example.com`, סיסמה של הזוג, לסמן **Auto Confirm User**.
3. משתמש שני: מייל `parents@example.com`, סיסמה של ההורים, לסמן **Auto Confirm User**.
4. **Authentication > Sign In / Providers > Email**: לכבות את **Allow new users to sign up**, כדי שאף אחד אחר לא יוכל לפתוח חשבון.

### 3. חיבור האתר למסד
1. ב-Supabase: **Project Settings > API**. מעתיקים את **Project URL** ואת המפתח **anon public**.
2. ב-GitHub, בקובץ [`config.js`](config.js), לוחצים על העיפרון, מדביקים את שני הערכים ושומרים (**Commit changes**).

```js
window.CHUPPAH_CONFIG = {
  supabaseUrl: "https://xxxxxxxx.supabase.co",
  supabaseAnonKey: "eyJhbGciOi...",
  coupleEmail: "couple@example.com",
  parentsEmail: "parents@example.com"
};
```

המפתח anon נועד לדפדפן ומותר שיופיע בקוד פתוח. מפתח `service_role` אסור להכניס לכאן לעולם.

### 4. העלאה לאוויר
1. במאגר ב-GitHub: **Settings > Pages**.
2. **Source: Deploy from a branch**, ענף `main`, תיקייה `/ (root)`, **Save**.
3. אחרי דקה-שתיים האתר זמין בכתובת `https://<שם-המשתמש>.github.io/chuppah/`.

### 5. שימוש ראשון
1. הזוג נכנס עם הסיסמה שלו ויוצר את החתונה (או טוען נתוני דוגמה לניסיון).
2. ההורים מקבלים גישת צפייה אוטומטית לאירוע, ונכנסים עם הסיסמה שלהם.

## מבנה מסד הנתונים

| טבלה | מה יש בה |
| --- | --- |
| `events` | פרטי החתונה, תקציב, מחיר מנה, תכנון לפי קטגוריות, התחייבויות מימון |
| `event_members` | מי שייך לאירוע ובאיזו הרשאה (owner / editor / viewer) |
| `event_invites` | הזמנות לפי מייל שממתינות לכניסה ראשונה |
| `guests` | מוזמנים, סטטוס הגעה, מנה, שולחן, הגעה בפועל ומתנה |
| `seating_tables` | שולחנות ומספר מקומות |
| `vendors` | ספקים, מחיר, סטטוס, חוזה וסעיפים שנבדקו |
| `vendor_payments` | לוח תשלומים לכל ספק, כולל מי שילם |
| `expenses` | הוצאות שאינן ספק, כולל מי שילם |
| `tasks` | צ'קליסט לפי שלבים ותאריכי יעד |
| `schedule_items` | לו"ז יום האירוע |

## פיתוח מקומי

אין שלב בנייה. פותחים את `index.html` בדפדפן (או מריצים `npx serve .`). כשהשדות ב-`config.js` ריקים האתר עובד במצב מקומי.
