import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Client per usar nomes des de codi de servidor (Route Handlers). A diferencia
// de createSupabaseClient() (app/lib/supabaseClient.js, pensat pel navegador),
// aquest no intenta persistir la sessio enlloc — cada peticio valida el seu
// propi token, no hi ha "sessio" al servidor.
export function createSupabaseServerClient() {
  if (!supabaseUrl || !supabaseAnonKey) return null;
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

// Verifica el JWT del header "Authorization: Bearer <token>" contra Supabase
// Auth i retorna l'usuari autenticat, o null si no n'hi ha cap de valid.
//
// Si Supabase no esta configurat al servidor (mode local/demo sense backend
// real — el mateix mode que ja fa servir seedDemo() a public/quadern.js),
// retorna `undefined` en lloc de null perque l'endpoint que ho crida pugui
// distingir "no hi ha sistema d'auth" de "hi ha auth pero la peticio no
// l'ha superat".
export async function getAuthedUser(req) {
  const supabase = createSupabaseServerClient();
  if (!supabase) return undefined;

  const authHeader = req.headers.get("authorization") || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7).trim() : "";
  if (!token) return null;

  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data?.user) return null;
  return data.user;
}
