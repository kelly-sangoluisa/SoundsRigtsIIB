import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Rutas que requieren autenticación
  const protectedPaths = ['/dashboard'];
  const loginPath = '/login';
  const { pathname } = request.nextUrl;

  // Verificar si la ruta actual está protegida
  const isProtectedPath = protectedPaths.some(path => 
    pathname.startsWith(path)
  );

  if (isProtectedPath) {
    // Buscar el token en las cookies
    const token = request.cookies.get('auth_token')?.value;

    if (!token) {
      // Si no hay token, redirigir al login
      const loginUrl = new URL(loginPath, request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // TODO: Aquí se podría validar el token con el backend
    // Por ahora, solo verificamos que exista
  }

  // Si la ruta no está protegida o el usuario tiene token, continuar
  return NextResponse.next();
}

// Configurar las rutas donde se ejecuta el middleware
export const config = {
  matcher: [
    /*
     * Coincidir con todas las rutas excepto:
     * - api (API routes)
     * - _next/static (archivos estáticos)
     * - _next/image (optimización de imágenes)
     * - favicon.ico (favicon file)
     * - Archivos públicos (imágenes, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
