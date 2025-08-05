import { License, LicensesResponse, LicenseFilters } from '../types';

// Datos simulados de licencias
let mockLicenses: License[] = [
  {
    id: 'lic_001',
    songId: '1',
    songName: 'Echoes of Tomorrow',
    songArtist: 'Administrador',
    songGenre: 'electronic',
    buyerId: '2',
    buyerName: 'Usuario Normal',
    buyerEmail: 'user@example.com',
    sellerId: '1',
    sellerName: 'Administrador',
    sellerEmail: 'admin@example.com',
    price: 2.99,
    purchaseDate: '2024-01-20T15:30:00Z',
    status: 'active',
    licenseType: 'commercial',
    transactionId: 'txn_001',
    downloadUrl: '/downloads/echoes-tomorrow-license.zip'
  },
  {
    id: 'lic_002',
    songId: '4',
    songName: 'Rock Anthem',
    songArtist: 'Usuario Normal',
    songGenre: 'rock',
    buyerId: '1',
    buyerName: 'Administrador',
    buyerEmail: 'admin@example.com',
    sellerId: '2',
    sellerName: 'Usuario Normal',
    sellerEmail: 'user@example.com',
    price: 3.49,
    purchaseDate: '2024-01-18T09:15:00Z',
    status: 'active',
    licenseType: 'commercial',
    transactionId: 'txn_002',
    downloadUrl: '/downloads/rock-anthem-license.zip'
  },
  {
    id: 'lic_003',
    songId: '5',
    songName: 'Jazz Nights',
    songArtist: 'Artista Demo',
    songGenre: 'jazz',
    buyerId: '1',
    buyerName: 'Administrador',
    buyerEmail: 'admin@example.com',
    sellerId: '3',
    sellerName: 'Artista Demo',
    sellerEmail: 'artist@example.com',
    price: 4.99,
    purchaseDate: '2024-01-15T11:45:00Z',
    status: 'pending',
    licenseType: 'commercial',
    transactionId: 'txn_003'
  }
];

// Función de delay para simular latencia de red
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const mockLicensesAPI = {
  // GET /licenses/mine - Licencias compradas por el usuario
  getPurchasedLicenses: async (buyerId: string, filters?: LicenseFilters): Promise<LicensesResponse> => {
    await delay(600);
    
    let userLicenses = mockLicenses.filter(license => license.buyerId === buyerId);
    
    // Aplicar filtros
    if (filters?.status) {
      userLicenses = userLicenses.filter(license => license.status === filters.status);
    }
    
    if (filters?.search) {
      const searchLower = filters.search.toLowerCase();
      userLicenses = userLicenses.filter(license => 
        license.songName.toLowerCase().includes(searchLower) ||
        license.songArtist.toLowerCase().includes(searchLower) ||
        license.transactionId.toLowerCase().includes(searchLower)
      );
    }
    
    if (filters?.dateFrom) {
      userLicenses = userLicenses.filter(license => 
        new Date(license.purchaseDate) >= new Date(filters.dateFrom!)
      );
    }
    
    if (filters?.dateTo) {
      userLicenses = userLicenses.filter(license => 
        new Date(license.purchaseDate) <= new Date(filters.dateTo!)
      );
    }
    
    // Ordenar por fecha de compra (más reciente primero)
    userLicenses.sort((a, b) => new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime());
    
    return {
      licenses: userLicenses,
      total: userLicenses.length,
      page: 1,
      limit: 50
    };
  },

  // GET /licenses/sold - Licencias vendidas por el usuario (como artista)
  getSoldLicenses: async (sellerId: string, filters?: LicenseFilters): Promise<LicensesResponse> => {
    await delay(600);
    
    let userLicenses = mockLicenses.filter(license => license.sellerId === sellerId);
    
    // Aplicar filtros (misma lógica que arriba)
    if (filters?.status) {
      userLicenses = userLicenses.filter(license => license.status === filters.status);
    }
    
    if (filters?.search) {
      const searchLower = filters.search.toLowerCase();
      userLicenses = userLicenses.filter(license => 
        license.songName.toLowerCase().includes(searchLower) ||
        license.buyerName.toLowerCase().includes(searchLower) ||
        license.transactionId.toLowerCase().includes(searchLower)
      );
    }
    
    if (filters?.dateFrom) {
      userLicenses = userLicenses.filter(license => 
        new Date(license.purchaseDate) >= new Date(filters.dateFrom!)
      );
    }
    
    if (filters?.dateTo) {
      userLicenses = userLicenses.filter(license => 
        new Date(license.purchaseDate) <= new Date(filters.dateTo!)
      );
    }
    
    // Ordenar por fecha de compra (más reciente primero)
    userLicenses.sort((a, b) => new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime());
    
    return {
      licenses: userLicenses,
      total: userLicenses.length,
      page: 1,
      limit: 50
    };
  },

  // GET /licenses/:id - Obtener detalles de una licencia específica
  getLicenseById: async (licenseId: string): Promise<License> => {
    await delay(300);
    
    const license = mockLicenses.find(l => l.id === licenseId);
    
    if (!license) {
      throw new Error('Licencia no encontrada');
    }
    
    return license;
  },

  // POST /licenses/:id/download - Simular descarga de licencia
  downloadLicense: async (licenseId: string, userId: string): Promise<{ downloadUrl: string; fileName: string }> => {
    await delay(1000);
    
    const license = mockLicenses.find(l => l.id === licenseId);
    
    if (!license) {
      throw new Error('Licencia no encontrada');
    }
    
    // Verificar que el usuario tenga permisos (es comprador o vendedor)
    if (license.buyerId !== userId && license.sellerId !== userId) {
      throw new Error('No tienes permisos para descargar esta licencia');
    }
    
    if (license.status !== 'active') {
      throw new Error('Esta licencia no está activa y no se puede descargar');
    }
    
    return {
      downloadUrl: license.downloadUrl || `/downloads/${license.songName.toLowerCase().replace(/\s+/g, '-')}-license.zip`,
      fileName: `${license.songName} - Licencia.zip`
    };
  }
};

// Utilidades para formatear datos de licencias
export const getLicenseStatusLabel = (status: License['status']): string => {
  const labels = {
    pending: 'Pendiente',
    active: 'Activa',
    expired: 'Expirada',
    cancelled: 'Cancelada',
    refunded: 'Reembolsada'
  };
  return labels[status];
};

export const getLicenseStatusColor = (status: License['status']): string => {
  const colors = {
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    expired: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
    cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    refunded: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300'
  };
  return colors[status];
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};
