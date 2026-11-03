// הגדרות חיבור ל-Supabase.
// כל עוד השדות ריקים, האתר עובד ב"מצב מקומי" ושומר רק בדפדפן.
// ה-anon key מיועד לשימוש בדפדפן והוא בטוח לפרסום: ההגנה על הנתונים היא בהרשאות (RLS) שבמסד.
// הסיסמאות עצמן לא נשמרות כאן אלא רק ב-Supabase (Authentication > Users).
window.CHUPPAH_CONFIG = {
  supabaseUrl: "https://icdcotebsyopythsscld.supabase.co",
  supabaseAnonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImljZGNvdGVic3lvcHl0aHNzY2xkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTM3MTM3NjMsImV4cCI6MjEwOTI4OTc2M30.1rgCK0KcaQApxNvQVq_6wTwMljP7BkjRfgQ5hZVfyjk",
  coupleEmail: "couple@example.com",   // משתמש הזוג: עריכה מלאה
  parentsEmail: "parents@example.com"  // משתמש ההורים: צפייה בלבד
};
