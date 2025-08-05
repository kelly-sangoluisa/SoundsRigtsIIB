export default () => ({
  circuitBreaker: {
    timeout: 3000,
    errorThresholdPercentage: 50,
    resetTimeout: 30000,
    rollingCountTimeout: 10000,
    rollingCountBuckets: 10,
    requestVolumeThreshold: 20,
    sleepWindow: 5000,
  },
});