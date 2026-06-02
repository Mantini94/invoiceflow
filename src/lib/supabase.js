import { createClient } from "@supabase/supabase-js";

/*
|--------------------------------------------------------------------------
| SUPABASE CLIENT
|--------------------------------------------------------------------------
|
| Ten client będzie używany w całej aplikacji.
| Łączy React z bazą danych Supabase.
|
*/

const supabaseUrl =
  "https://kzzkdvipytdpbsepwrhc.supabase.co";

const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt6emtkdmlweXRkcGJzZXB3cmhjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk4OTU1MjMsImV4cCI6MjA5NTQ3MTUyM30.VZmDmalkHDzd23rGQTcgw_MJ4kez-vsxIkBBQmvtb9E";

export const supabase =
  createClient(
    supabaseUrl,
    supabaseAnonKey
  );



