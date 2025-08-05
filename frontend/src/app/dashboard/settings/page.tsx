import { RouteGuard } from '@/shared/components/RouteGuard';

export default function DashboardSettingsPage() {
  return (
    <RouteGuard>
      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Configuración
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Otra página protegida dentro del dashboard que también usa el layout con useAuth().
          </p>
          
          <div className="space-y-4">
            <div className="border-l-4 border-blue-400 bg-blue-50 dark:bg-blue-900/20 p-4">
              <p className="text-blue-700 dark:text-blue-300 text-sm">
                <strong>Nota:</strong> Esta página también está protegida por el middleware y usa el mismo layout del dashboard.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                  Preferencias de Usuario
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Configura tus preferencias personales
                </p>
              </div>
              
              <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                  Seguridad
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Gestiona la seguridad de tu cuenta
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </RouteGuard>
  );
}
