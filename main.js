import { gameState, restartGame, updatePos, updateScoreUI, initInput } from "./gamecore.js";
import { updateTerrain } from "./scene.js";
import { GAME_CONFIG } from "./config.js";

document.addEventListener('DOMContentLoaded', () => {
    const dom = {
        dino: document.getElementById("dino"),
        groundDom: document.getElementById("groundDom"),
        terrainNameDom: document.getElementById("terrainName"),
        scoreDom: document.getElementById("score"),
        modeHintDom: document.getElementById("modeHint"),
        tipDom: document.getElementById("tip")
    };

    initInput(gameState);

    //点击屏幕开局/重启
    document.body.addEventListener('click', () => {
        if (!gameState.gameRunning || gameState.waitingRestart) {
            restartGame(gameState, dom);
        }
    });

    //调试地形快捷键：直接把分数拨到该地形区间，否则会被 updateTerrain 每帧按分数覆盖回去
    window.addEventListener('keydown', e => {
        const idx = ['1', '2', '3', '4'].indexOf(e.key);
        if (idx < 0) return;
        const target = GAME_CONFIG.terrainTypes[idx];
        if (!target) return;
        gameState.score = target.minScore;
        updateTerrain(gameState, dom);
        updateScoreUI(gameState, dom);
    });

    updateTerrain(gameState, dom);
    updateScoreUI(gameState, dom);
    updatePos(gameState, dom);
});