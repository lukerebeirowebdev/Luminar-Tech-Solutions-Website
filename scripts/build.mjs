import { cp, mkdir, rm } from 'node:fs/promises';

const projectRoot = new URL('../', import.meta.url);
const outputDirectory = new URL('dist/', projectRoot);

await rm(outputDirectory, { recursive: true, force: true });
await mkdir(outputDirectory, { recursive: true });

for (const asset of ['index.html', 'style.css', 'script.js', 'img']) {
  await cp(new URL(asset, projectRoot), new URL(asset, outputDirectory), {
    recursive: true,
  });
}
