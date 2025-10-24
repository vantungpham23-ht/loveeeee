import { createServerClient } from "@supabase/ssr";
import { P as PUBLIC_SUPABASE_URL } from "./public.js";
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBoYWVkd3N2Z3FyYm11ZHh4aGplIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTI4ODExOCwiZXhwIjoyMDc2ODY0MTE4fQ.qMQxVSWUHGY7AhfiMIT6cZ0EE07oU3P0kkrK9gjfwHE"';
const supabaseAdmin = createServerClient(
  PUBLIC_SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY,
  {
    cookies: {
      getAll() {
        return [];
      },
      setAll() {
      }
    }
  }
);
export {
  supabaseAdmin as s
};
