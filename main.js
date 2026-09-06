import { gameState, restartGame, updatePos, updateScoreUI, initInput } from "./gamecore.js";
import { updateTerrain, setTerrainByIndex } from "./scene.js";

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

    //调试地形快捷键
    window.addEventListener('keydown', e => {
        if (e.key === '1') setTerrainByIndex(0, gameState, dom);
        if (e.key === '2') setTerrainByIndex(1, gameState, dom);
        if (e.key === '3') setTerrainByIndex(2, gameState, dom);
        if (e.key === '4') setTerrainByIndex(3, gameState, dom);
    });

    updateTerrain(gameState, dom);
    updateScoreUI(gameState, dom);
    updatePos(gameState, dom);
});