// backend/babel-loader.js
import { transform } from '@babel/core';
import presetEnv from '@babel/preset-env';
import presetReact from '@babel/preset-react';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';

export async function load(url, context, next) {
  // ✅ Correct: Ensures only file system URLs are processed by fileURLToPath.
  // This prevents 'ERR_INVALID_URL_SCHEME' for internal Node.js modules or data URIs.
  if (!url.startsWith('file://')) {
    return next(url, context);
  }

  const filePath = fileURLToPath(url);

  // ✅ Correct: Dynamically determines the project root, making it more portable.
  const backendRootPath = process.cwd();

  // ✅ Correct: Checks if the file is within your project directory.
  const isProjectFile = filePath.startsWith(backendRootPath);
  // ✅ Correct: Catches .jsx files explicitly.
  const isJsxFile = url.endsWith('.jsx');
  // ✅ Correct: Catches .js files within the /routes/ directory.
  const isJsRouteFile = url.endsWith('.js') && filePath.includes('/routes/');
  // ✅ Correct: Catches .js files within the /templates/jsx/ directory.
  const isJsTemplateFile = url.endsWith('.js') && filePath.includes('/templates/jsx/');

  // ✅ Correct: The condition ensures that only relevant project files containing JSX
  // (either .jsx or .js in specified directories) are sent to Babel.
  if (isProjectFile && (isJsxFile || isJsRouteFile || isJsTemplateFile)) {
    try {
      const fileContent = await fs.readFile(filePath, 'utf8');
      const { code } = await transform(fileContent, {
        filename: filePath, // Good for source maps and error reporting
        presets: [
          presetReact, // Essential for transforming JSX
          [presetEnv, { targets: { node: 'current' } }] // Essential for modern JS features in Node.js
        ],
        sourceMaps: true, // Useful for debugging
      });

      return {
        format: 'module',
        source: code,
        shortCircuit: true, // Tells Node.js that this loader has handled the module
      };
    } catch (babelError) {
      // ✅ Good error handling for Babel-specific issues.
      console.error(`Babel transformation error for ${filePath}:`, babelError);
      throw babelError;
    }
  }

  // ✅ Correct: Passes control to the next loader or Node.js's default loader
  // for any files not matching the transpilation criteria.
  return next(url, context);
}