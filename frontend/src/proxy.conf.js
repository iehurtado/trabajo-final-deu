const host = process.env.BACKEND_HOST ?? 'localhost';
const port = parseInt(process.env.BACKEND_PORT ?? '3000');

export default {
  "/api/**": {
    "target": `http://${host}:${port}`,
    "secure": false
  }
}
