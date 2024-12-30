import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://jylfrxwfbiikljjnxddy.supabase.co"; // Thay thế bằng URL Supabase của bạn
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp5bGZyeHdmYmlpa2xqam54ZGR5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUzNjI5NDksImV4cCI6MjA1MDkzODk0OX0.LQHdhTZ1okDfMhZI9jOWbSVmlwM_1EwQpeJ4XpQdXOQ"; // Thay thế bằng anon key của bạn

export const supabase = createClient(supabaseUrl, supabaseKey);
