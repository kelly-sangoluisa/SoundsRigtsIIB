export default () => ({
  circuitBreaker: {
    timeout: 3000, // Timeout de 3 segundos
    errorThresholdPercentage: 50, // 50% de errores para abrir el circuito
    resetTimeout: 30000, // 30 segundos para intentar cerrar el circuito
    rollingCountTimeout: 10000, // Ventana de tiempo para contar errores
    rollingCountBuckets: 10, // Número de buckets para el rolling window
    requestVolumeThreshold: 20, // Mínimo de requests para activar el circuit breaker
    sleepWindow: 5000, // Tiempo de espera antes de intentar una request en estado half-open
    enabled: process.env.NODE_ENV !== 'development', // Deshabilitar en desarrollo
  },
  gateway: {
    retries: 3, // Número de reintentos
    retryDelay: 1000, // Delay entre reintentos (ms)
    services: {
      auth: {
        baseUrl: process.env.AUTH_SERVICE_URL || 'http://localhost:3000',
        timeout: 5000,
      },
      songs: {
        baseUrl: process.env.SONGS_SERVICE_URL || 'http://localhost:3000',
        timeout: 5000,
      },
      licenses: {
        baseUrl: process.env.LICENSES_SERVICE_URL || 'http://localhost:3000',
        timeout: 5000,
      },
      chat: {
        baseUrl: process.env.CHAT_SERVICE_URL || 'http://localhost:3000',
        timeout: 5000,
      },
    },
  },
});