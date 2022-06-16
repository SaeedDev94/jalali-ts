import { execSync } from 'child_process';
import { build } from 'esbuild';

build({
  entryPoints: ['./src/index.ts'],
  outfile: 'dist/index.js',
  bundle: true,
  minify: true,
  sourcemap: false,
  platform: 'node',
  target: 'ES2020',
  plugins: [
    {
      name: 'TypeScriptDeclarationsPlugin',
      setup(build) {
        build.onStart(() => {
          execSync('rm -rf dist');
          execSync('tsc');
          execSync('find ./dist -type f -name "*.js" -delete');
        })
      }
    }
  ]
}).catch((error) => console.error(error));
