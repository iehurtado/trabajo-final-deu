const url = process.env.BACKEND_URL ?? 'localhost:3000';

export default {
  "/api/**": {
    "target": `http://${url}`,
    "secure": false
  }
}
