import { RouteGuard } from '@/shared/components/RouteGuard';
import { UserInfo } from '@/features/auth/components/UserInfo';

export default function DashboardPage() {
  return (
    <RouteGuard>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <UserInfo />
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              ¡Bienvenido al dashboard! Esta es una ruta protegida que requiere autenticación.
            </p>
            
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-900 dark:text-blue-100">
                  📊 Analíticas
                </h3>
                <p className="text-blue-700 dark:text-blue-300 text-sm mt-1">
                  Visualiza métricas y estadísticas importantes
                </p>
              </div>
              
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <h3 className="font-semibold text-green-900 dark:text-green-100">
                  👥 Gestión de Usuarios
                </h3>
                <p className="text-green-700 dark:text-green-300 text-sm mt-1">
                  Administra usuarios y permisos del sistema
                </p>
              </div>
              
              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                <h3 className="font-semibold text-purple-900 dark:text-purple-100">
                  ⚙️ Configuración
                </h3>
                <p className="text-purple-700 dark:text-purple-300 text-sm mt-1">
                  Personaliza las opciones del sistema
                </p>
              </div>
            </div>

            <div className="mt-8 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <h4 className="font-medium text-yellow-900 dark:text-yellow-100 mb-2">
                🎯 Estado de Autenticación
              </h4>
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                Has accedido exitosamente al dashboard protegido. El middleware y el RouteGuard están funcionando correctamente.
              </p>
            </div>
          </div>
        </div>
      </div>
    </RouteGuard>
  );
}
