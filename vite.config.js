import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

// Plugin for serving raw SCSS content
const serveRawScss = () => {
  return {
    name: 'vite-plugin-serve-raw-scss',
    configureServer(server) {
      // Add middleware to serve raw SCSS files
      server.middlewares.use((req, res, next) => {
        if (req.url && req.url.startsWith('/raw-scss/')) {
          const filePath = req.url.split('?')[0].replace('/raw-scss/', '');
          const fullPath = path.resolve(process.cwd(), filePath);
          
          // Security check
          if (!fullPath.startsWith(process.cwd())) {
            res.statusCode = 403;
            res.end('Forbidden');
            return;
          }
          
          try {
            if (fs.existsSync(fullPath)) {
              const content = fs.readFileSync(fullPath, 'utf-8');
              res.setHeader('Content-Type', 'text/plain');
              res.setHeader('Cache-Control', 'no-cache');
              res.end(content);
            } else {
              res.statusCode = 404;
              res.end(`File not found: ${filePath}`);
            }
          } catch (error) {
            console.error(`Error serving ${filePath}:`, error);
            res.statusCode = 500;
            res.end('Internal Server Error');
          }
          return;
        }
        next();
      });
    }
  };
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    serveRawScss()
  ],
  // Basic settings for SCSS
  css: {
    preprocessorOptions: {
      scss: {
        // No additionalData
      }
    }
  }
})
