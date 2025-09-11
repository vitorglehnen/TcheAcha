import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://womjrydobmixlcmrgvgn.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndvbWpyeWRvYm1peGxjbXJndmduIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY0MjEwOTMsImV4cCI6MjA3MTk5NzA5M30.nxSZmOe-eCmYnxWNTsDpegN8mqxsY7n62ByN5wJ4mxo"; 

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
