import { createServer } from "./server.js";

const app = createServer();
const PORT = 8080;

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
