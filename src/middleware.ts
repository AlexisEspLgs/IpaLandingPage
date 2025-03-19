import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Proteger todas las rutas bajo /admin (excepto /admin que es la página de login)
  if (pathname.startsWith("/admin") && pathname !== "/admin") {
    // Verificar la presencia de un token de sesión
    const token = request.cookies.get("session")?.value

    if (!token) {
      return NextResponse.redirect(new URL("/admin", request.url)) // Redirigir al login si no hay token
    }
  }

  return NextResponse.next() // Continuar con la respuesta normal
}

export const config = {
  matcher: ["/admin/:path*"], // Aplicar a todas las rutas bajo /admin
}

