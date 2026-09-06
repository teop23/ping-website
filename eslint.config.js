import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    // Only `dist` was ignored, so every wrangler build artifact under
    // .wrangler was being linted as if it were source.
    ignores: ['dist', '.wrangler', 'node_modules', 'public', 'functions/types.d.ts'],
  },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'warn',
    },
  },
  {
    /**
     * fabric v5 ships incomplete types: lowerCanvasEl, parsePath and _setPath
     * all exist at runtime but are absent from @types/fabric, so these modules
     * cannot avoid `any` without asserting on every call. Relaxed here only,
     * so a stray `any` anywhere else still fails the build.
     */
    files: [
      'src/utils/drawingTools.ts',
      'src/utils/undoRedoManager.ts',
      'src/utils/canvasUtils.ts',
      'src/utils/traitManager.ts',
      'src/pages/CreateTraits.tsx',
      'src/pages/WatermarkTool.tsx',
      'src/components/traits_page/**/*.tsx',
    ],
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
  {
    // Build scripts and their tests run in Node, not the browser.
    files: ['scripts/**/*.mjs', '**/*.test.mjs'],
    extends: [js.configs.recommended],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: globals.node,
    },
  }
);
