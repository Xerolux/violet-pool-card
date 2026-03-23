/**
 * Violet Pool Card – Custom Lovelace Card for Home Assistant
 * © 2026 Xerolux | https://github.com/Xerolux/violet-pool-card
 *
 * Build Config: Rollup – Bundling und Kompilierung des TypeScript-Projekts
 * Erstellt von Xerolux | MIT License
 */

import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import serve from 'rollup-plugin-serve';

const dev = process.env.ROLLUP_WATCH || process.env.SERVE;

export default {
  input: 'src/violet-pool-card.ts',
  output: {
    file: 'dist/violet-pool-card.js',
    format: 'es',
    sourcemap: dev ? true : false,
  },
  // Mark home-assistant-js-websocket as external - it's provided by Home Assistant
  external: ['home-assistant-js-websocket'],
  plugins: [
    resolve(),
    typescript({
      declaration: false,
    }),
    !dev && terser({
      format: {
        comments: false,
      },
    }),
    dev && serve({
      contentBase: ['./dist'],
      host: '0.0.0.0',
      port: 5000,
      allowCrossOrigin: true,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    }),
  ].filter(Boolean),
};
