import { defineConfig } from 'tsup';

export default defineConfig({
    name: "RELEASE_MATE",
    entry: ['./src/index.ts'],
    dts: true,
    clean: true,
    outDir: './dist',
    target: 'es2015',
    // minify: true,
    noExternal: ['volog'],
    // minifyIdentifiers: true,
    // minifySyntax: true,
    // minifyWhitespace: true,
    replaceNodeEnv: true
})