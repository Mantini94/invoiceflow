import { supabase } from "../lib/supabase";

export async function getInvoices() {
  return supabase
    .from("invoices")
    .select("*")
    .order("created_at", { ascending: false });
}

export async function updateInvoiceStatus(id, status) {
  return supabase.from("invoices").update({ status }).eq("id", id);
}
