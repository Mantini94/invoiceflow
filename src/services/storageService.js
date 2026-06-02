import { supabase } from "../lib/supabase";

export async function createInvoicePdfSignedUrl(filePath) {
  return supabase.storage
    .from("invoice-files")
    .createSignedUrl(filePath, 60 * 10);
}
