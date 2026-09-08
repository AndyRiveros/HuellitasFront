const hostname = window.location.hostname;

export const API_URL = hostname.endsWith('.devtunnels.ms')
  ? `https://${hostname.replace('-5173.', '-8080.')}`
  : 'http://localhost:8080';