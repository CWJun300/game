import { defineConfig } from 'vite';

export default defineConfig({
    // 打包产物用相对路径：部署到子目录（如 GitHub Pages 的 /game/）也能正确加载
    base: './'
});
