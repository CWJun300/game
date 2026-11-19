import fs from 'node:fs';
import path from 'node:path';
import { defineConfig } from 'vite';

/**
 * 图片放在项目根目录 assets/ 里，而不是 public/。
 * 这样直接把源码目录挂到静态服务器（nginx / 宝塔 / GitHub Pages 等）时，
 * assets/cactus.jpg 这种相对路径天然就在同一目录下，不会 404。
 * dev 下 Vite 会直接提供根目录文件；build 时由下面的插件把 assets/ 原样拷进 dist/assets/。
 */
function copyRootAssets() {
    return {
        name: 'copy-root-assets',
        apply: 'build',
        closeBundle() {
            const from = path.resolve(process.cwd(), 'assets');
            const to = path.resolve(process.cwd(), 'dist', 'assets');
            if (fs.existsSync(from)) {
                fs.cpSync(from, to, { recursive: true });
            }
        }
    };
}

export default defineConfig({
    // 打包产物用相对路径：部署到子目录（如 GitHub Pages 的 /game/）也能正确加载
    base: './',
    plugins: [copyRootAssets()]
});
