import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
    plugins: [
        dts({
            insertTypesEntry: true,
            rollupTypes: true,
            outDir: './dist',
        }),
    ],
    build: {
        lib: {
            entry: './src/main.ts',
            name: 'w3ValidationNpm',
            fileName: 'main',
            formats: ['es', 'cjs'],
        },
        rollupOptions: {
            external: [
                'jsdom',
                'fs',
                'fs/promises',
                'path',
                'url',
                'http',
                'https',
                'stream',
                'zlib',
                'buffer',
                'events',
                'util',
                'net',
                'tls',
                'crypto',
                'os',
                'child_process',
                'vm',
                'string_decoder',
                'assert',
            ],
            output: {
                banner: (chunk) => {
                    // ES Module için shebang ekle
                    if (chunk.fileName === 'main.js') {
                        return '#!/usr/bin/env node\n';
                    }
                    return '';
                },
                preserveModules: false,
            },
        },
    },
});

