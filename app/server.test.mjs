import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createServer } from './server.mjs';

test('HTTP local : fixtures originales, ressources limitées et lecture seule', async () => {
  const server = createServer();
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  try {
    for (const scenario of ['program_only', 'act_on_data']) {
      const path = new URL(`../examples/IA017/${scenario}/formation.json`, import.meta.url);
      const before = await readFile(path, 'utf8');
      const response = await fetch(`${base}/api/formations/${scenario}`);
      assert.equal(response.status, 200);
      assert.equal(await response.text(), before);
      for (const method of ['POST', 'PUT', 'PATCH', 'DELETE']) {
        assert.equal((await fetch(`${base}/api/formations/${scenario}`, {method, body:'{}'})).status, 405);
      }
      assert.equal(await readFile(path, 'utf8'), before);
    }
    for (const path of ['/', '/app.js', '/styles.css']) assert.equal((await fetch(base+path)).status, 200);
    for (const path of ['/README.md', '/api/formations/unknown', '/examples/IA017/sources/']) assert.equal((await fetch(base+path)).status, 404);
  } finally {
    await new Promise(resolve => server.close(resolve));
  }
});
