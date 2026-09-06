import { GAME_CONFIG } from "./config.js";
import { getRandomByWeight, isCollision } from "./utils.js";
import { updateTerrain, setTerrainByIndex } from "./scene.js";

//全局游戏状态
export const gameState = {
    x: 80,
    y: 0,
    speedX: 0,
    speedY: 0,
    score: 0,
    isOnGround: true,
    spaceHeld: false,
    downHeld: false,
    isSliding: false,
    fallingIntoPit: false,
    waitingRestart: false,
    gameOver: false,
    gameRunning: false,
    obstacleList: [],
    currentTerrain: null,
    spawnTimer: null
};

/** 更新恐龙位置DOM */
export function updatePos(gameState, dom) {
    const curH = gameState.isSliding ? GAME_CONFIG.dinoHSlide : GAME_CONFIG.dinoHStand;
    const groundLine = window.innerHeight / 2;
    if (gameState.isOnGround && !gameState.fallingIntoPit) {
        gameState.y = groundLine - curH;
    }
    dom.dino.style.left = gameState.x + 'px';
    dom.dino.style.top = gameState.y + 'px';
    dom.dino.style.height = curH + "px";
}

export function spawnObstacle(gameState) {
    if (gameState.gameOver || !gameState.gameRunning) return;
    const groundLine = window.innerHeight / 2;
    if (gameState.score >= GAME_CONFIG.MODE_SCORE_THRESHOLD) {
        const idx = getRandomByWeight(GAME_CONFIG.meteorWeightTable);
        const t = GAME_CONFIG.obstacleTypes[idx];
        const obs = document.createElement('div');
        obs.className = t.className;
        if (t.image) obs.style.backgroundImage = `url(${t.image})`;
        const rx = Math.random() * (window.innerWidth + 120) - 60;
        obs.style.left = rx + 'px';
        obs.style.top = (-t.h) + 'px';
        document.body.appendChild(obs);
        gameState.obstacleList.push({
            dom: obs, x: rx, y: -t.h, w: t.w, h: t.h,
            type: t.type, meteor: true, pit: false,
            vy: t.type === 'meteor-large' ? 6 + Math.random() * 2 : 4 + Math.random() * 2
        });
    } else {
        const idx = getRandomByWeight(GAME_CONFIG.obstacleWeightTable);
        const t = GAME_CONFIG.obstacleTypes[idx];
        const obs = document.createElement('div');
        obs.className = t.className;
        if (t.image) obs.style.backgroundImage = `url(${t.image})`;
        if (t.pit && gameState.currentTerrain) {
            obs.style.backgroundColor = gameState.currentTerrain.pitBg;
        }
        let cy;
        if (t.pit) cy = groundLine;
        else if (t.ground) cy = groundLine - t.h;
        else {
            const r = Math.random();
            cy = r < 0.33 ? groundLine - 64 : r < 0.66 ? groundLine - 94 : groundLine - 134;
        }
        obs.style.top = cy + 'px';
        obs.style.left = window.innerWidth + 'px';
        document.body.appendChild(obs);
        gameState.obstacleList.push({
            dom: obs, x: window.innerWidth, y: cy, w: t.w, h: t.h,
            type: t.type, pit: t.pit || false, meteor: false
        });
    }
}

export function updateScoreUI(gameState, dom) {
    const hs = Number(localStorage.getItem("dinoHighScore") || 0);
    dom.scoreDom.innerText = `分数：${gameState.score}  最高分：${hs}`;
    dom.modeHintDom.innerText = gameState.score >= GAME_CONFIG.MODE_SCORE_THRESHOLD
        ? "⚠️陨石模式！躲避从天而降的陨石" : "";
}

export function gameEnd(reasonText, gameState, dom) {
    gameState.gameOver = true;
    gameState.gameRunning = false;
    gameState.waitingRestart = true;
    if (gameState.spawnTimer) clearInterval(gameState.spawnTimer);

    const hs = Number(localStorage.getItem("dinoHighScore") || 0);
    if (gameState.score > hs) {
        localStorage.setItem("dinoHighScore", gameState.score);
    }
    dom.tipDom.innerText = `${reasonText}｜分数：${gameState.score}，最高分：${hs}\n点击屏幕重新开始`;
    dom.tipDom.style.display = 'block';
}

export function restartGame(gameState, dom) {
    gameState.gameOver = false;
    gameState.waitingRestart = false;
    gameState.gameRunning = true;
    gameState.fallingIntoPit = false;
    gameState.isOnGround = true;
    gameState.spaceHeld = false;
    gameState.downHeld = false;
    gameState.isSliding = false;
    gameState.x = 80;
    const groundLine = window.innerHeight / 2;
    gameState.y = groundLine - GAME_CONFIG.dinoHStand;
    gameState.speedX = 0;
    gameState.speedY = 0;
    gameState.score = 0;
    gameState.currentTerrain = null;

    gameState.obstacleList.forEach(o => o.dom && o.dom.remove());
    gameState.obstacleList = [];

    dom.tipDom.style.display = 'none';
    updateTerrain(gameState, dom);
    updatePos(gameState, dom);
    updateScoreUI(gameState, dom);

    if (gameState.spawnTimer) clearInterval(gameState.spawnTimer);
    gameState.spawnTimer = setInterval(() => spawnObstacle(gameState), GAME_CONFIG.spawnInterval);
    loop(gameState, dom);
}

export function loop(gameState, dom) {
    if (!gameState.gameRunning || gameState.gameOver) return;
    const keys = gameState.keyMap;
    gameState.speedX = 0;
    if (keys['ArrowLeft']) gameState.speedX = -GAME_CONFIG.moveSpeed;
    if (keys['ArrowRight']) gameState.speedX = GAME_CONFIG.moveSpeed;

    if (!gameState.fallingIntoPit) {
        if (keys['ArrowUp'] && gameState.isOnGround && !gameState.spaceHeld) {
            gameState.speedY = GAME_CONFIG.jumpPower;
            gameState.isOnGround = false;
            gameState.spaceHeld = true;
        }
        gameState.isSliding = !!gameState.downHeld && gameState.isOnGround;
    }
    gameState.speedY += GAME_CONFIG.gravity;
    gameState.x += gameState.speedX;
    gameState.x = Math.max(8, Math.min(window.innerWidth - GAME_CONFIG.dinoW - 8, gameState.x));

    gameState.y += gameState.speedY;
    const curH = gameState.isSliding ? GAME_CONFIG.dinoHSlide : GAME_CONFIG.dinoHStand;
    const groundLine = window.innerHeight / 2;

    if (!gameState.fallingIntoPit) {
        if (gameState.y + curH >= groundLine) {
            gameState.y = groundLine - curH;
            gameState.speedY = 0;
            gameState.isOnGround = true;
        }
    } else {
        gameState.speedY += 0.25;
    }
    updatePos(gameState, dom);
    gameState.score += 1;
    updateScoreUI(gameState, dom);
    updateTerrain(gameState, dom);

    for (let i = gameState.obstacleList.length - 1; i >= 0; i--) {
        const c = gameState.obstacleList[i];
        if (c.meteor) c.y += c.vy;
        else c.x -= GAME_CONFIG.cactusSpeed;

        c.dom.style.left = c.x + 'px';
        c.dom.style.top = c.y + 'px';

        if (isCollision({ x: gameState.x, y: gameState.y }, c, GAME_CONFIG.dinoW, curH)) {
            if (c.pit) {
                gameState.fallingIntoPit = true;
                gameState.isOnGround = false;
            } else if (c.meteor) {
                gameEnd("被陨石砸中！", gameState, dom);
                return;
            } else {
                let r = "撞到障碍物";
                if (c.type === 'bird') r = "被鸟撞到了";
                gameEnd(r, gameState, dom);
                return;
            }
        }
        let remove = false;
        if (c.meteor) {
            if (c.y > window.innerHeight) remove = true;
        } else {
            if (c.x + c.w < 0) remove = true;
        }
        if (remove) {
            c.dom.remove();
            gameState.obstacleList.splice(i, 1);
        }
    }
    if (gameState.fallingIntoPit && gameState.y > window.innerHeight) {
        gameEnd("掉进坑里了！", gameState, dom);
        return;
    }
    requestAnimationFrame(() => loop(gameState, dom));
}

export function initInput(gameState) {
    gameState.keyMap = {};
    window.addEventListener('keydown', e => {
        gameState.keyMap[e.code] = true;
        if (e.code === 'ArrowDown') gameState.downHeld = true;
    });
    window.addEventListener('keyup', e => {
        gameState.keyMap[e.code] = false;
        if (e.code === 'ArrowUp') gameState.spaceHeld = false;
        if (e.code === 'ArrowDown') gameState.downHeld = false;
    });
    window.addEventListener('blur', () => {
        gameState.downHeld = false;
        gameState.spaceHeld = false;
    });
}