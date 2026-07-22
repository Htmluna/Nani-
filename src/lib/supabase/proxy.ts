import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Atualiza a sessão do Supabase a cada request e protege rotas privadas.
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAuthPage = request.nextUrl.pathname.startsWith("/login");
  const isPublic =
    isAuthPage ||
    request.nextUrl.pathname === "/" ||
    request.nextUrl.pathname.startsWith("/auth");

  // Sem usuário e tentando acessar rota privada -> manda pro login
  if (!user && !isPublic) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Já logado e indo pro login -> manda pro painel
  if (user && isAuthPage) {
    const url = request.nextUrl.clone();
    url.pathname = "/painel";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
