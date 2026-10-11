import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';

const routes = new Map([
  ['/', [new URL('./public/index.html', import.meta.url), 'text/html']],
  ['/styles.css', [new URL('./public/styles.css', import.meta.url), 'text/css']],
  ['/app.js', [new URL('./public/app.js', import.meta.url), 'text/javascript']],
  ...['program_only', 'act_on_data'].map(s => [`/api/formations/${s}`, [new URL(`../examples/IA017/${s}/formation.json`, import.meta.url), 'application/json']]),
]);

export function createServer() {
  return http.createServer(async (req, res) => {
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self'; style-src 'self'; connect-src 'self'; object-src 'none'; frame-ancestors 'none'");
    if (!['GET', 'HEAD'].includes(req.method)) {
      res.writeHead(405, { Allow: 'GET, HEAD' }).end('Lecture seule');
      return;
    }
    const route = routes.get(req.url?.split('?')[0]);
    if (!route) { res.writeHead(404).end('Ressource inconnue'); return; }
    try {
      const content = await readFile(route[0]);
      if (route[1] === 'application/json') JSON.parse(content.toString('utf8'));
      res.writeHead(200, { 'Content-Type': `${route[1]}; charset=utf-8` });
      res.end(req.method === 'HEAD' ? undefined : content);
    } catch {
      res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' }).end('Impossible de lire la source. Vérifiez le fichier de formation.');
    }
  });
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const server = createServer();
  const port = Number(process.env.PORT || 3000);
  server.on('error', error => { console.error(`Démarrage impossible : ${error.message}`); process.exitCode = 1; });
  server.listen(port, '127.0.0.1', () => console.log(`Hector Studio : http://127.0.0.1:${server.address().port}`));
}
