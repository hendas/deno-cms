import { Application } from './deps.ts';
import config from './config.ts';

const app = new Application();

app.use((ctx) => {
  ctx.response.body = 'Hello World!';
});

console.log(`Server listening on port ${config.PORT}`);
await app.listen({
  port: config.PORT,
  // secure: true,
  // certFile: './server.cert',
  // keyFile: './server.key',
});
