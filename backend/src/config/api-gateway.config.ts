export default () => ({
  gateway: {
    timeout: 5000,
    retries: 3,
    endpoints: {
      users: '/api/users',
      songs: '/api/songs',
      licenses: '/api/licenses',
      chat: '/api/chat',
      auth: '/api/auth',
    },
  },
});