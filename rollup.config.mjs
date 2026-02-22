import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import serve from 'rollup-plugin-serve';

const dev = process.env.ROLLUP_WATCH || process.env.SERVE;

const templateMinifier = () => {
  return {
    name: 'template-minifier',
    transform(code) {
      // Minify CSS template literals
      code = code.replace(/css\s*`([\s\S]*?)`/g, (match, content) => {
        const minified = content
          .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
          .replace(/\s+/g, ' ') // Collapse whitespace
          .replace(/\s*{\s*/g, '{')
          .replace(/\s*}\s*/g, '}')
          .replace(/\s*:\s*/g, ':')
          .replace(/\s*;\s*/g, ';');
        return `css\`${minified}\``;
      });

      // Minify HTML template literals
      code = code.replace(/html\s*`([\s\S]*?)`/g, (match, content) => {
        const minified = content
          .replace(/>\s+</g, '><') // Remove whitespace between tags
          .replace(/\s+/g, ' '); // Collapse whitespace
        return `html\`${minified}\``;
      });

      return { code, map: null };
    },
  };
};

export default {
  input: 'src/violet-pool-card.ts',
  output: {
    file: 'dist/violet-pool-card.js',
    format: 'es',
    sourcemap: dev ? true : false,
    inlineDynamicImports: true,
  },
  external: (id) => {
    return (
      id === 'lit' ||
      id.startsWith('lit/') ||
      id.startsWith('@lit/') ||
      id.startsWith('lit-') ||
      id.startsWith('home-assistant-') ||
      id === 'custom-card-helpers'
    );
  },
  plugins: [
    templateMinifier(),
    resolve(),
    typescript({
      declaration: false,
    }),
    !dev && terser({
      module: true,
      toplevel: true,
      ecma: 2020,
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.info', 'console.debug', 'console.log', 'console.warn', 'console.error'],
        passes: 3,
        unsafe: true,
        pure_getters: true,
      },
      mangle: {
        properties: false,
      },
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
