import type { createClient as createBrowser } from "@supabase/supabase-js";

// Minimal untyped helpers when Database generics resolve poorly
export type UntypedClient = ReturnType<typeof createBrowser>;
