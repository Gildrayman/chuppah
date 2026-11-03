// הגדרות חיבור ל-Supabase.
// כל עוד השדות ריקים, האתר עובד ב"מצב מקומי" ושומר רק בדפדפן.
// ה-anon key מיועד לשימוש בדפדפן והוא בטוח לפרסום: ההגנה על הנתונים היא בהרשאות (RLS) שבמסד.
// הסיסמאות עצמן לא נשמרות כאן אלא רק ב-Supabase (Authentication > Users).
window.CHUPPAH_CONFIG = {
  supabaseUrl: "",                       // לדוגמה: "https://abcdefgh.supabase.co"
  supabaseAnonKey: "",                   // Project Settings > API > anon public
  coupleEmail: "couple@example.com",   // משתמש הזוג: עריכה מלאה
  parentsEmail: "parents@example.com"  // משתמש ההורים: צפייה בלבד
};
