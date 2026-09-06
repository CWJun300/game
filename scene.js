import { GAME_CONFIG } from "./config.js";

let sceneLayer = null;
let sandParticles = [];
let sandRunning = false;

export function clearSceneLayer() {
    sandRunning = false;
    if (sceneLayer) {
        sceneLayer.remove();
        sceneLayer = null;
    }
    sandParticles = [];
}

export function createGrasslandBackground() {
    clearSceneLayer();
    sceneLayer = document.createElement('div');
    sceneLayer.className = 'scene-layer';
    for (let i = 0; i < 10; i++) {
        const cloud = document.createElement('div');
        cloud.className = 'cloud';
        const dur = 8 + Math.random() * 8;
        cloud.style.width = (70 + Math.random() * 80) + 'px';
        cloud.style.height = (35 + Math.random() * 40) + 'px';
        cloud.style.background = 'white';
        cloud.style.borderRadius = '40px';
        cloud.style.top = (3 + Math.random() * 40) + '%';
        cloud.style.left = (Math.random() * 100) + '%';
        cloud.style.opacity = '0.75';
        cloud.style.animation = `cloudDrift ${dur}s linear infinite`;
        sceneLayer.appendChild(cloud);
    }
    document.body.appendChild(sceneLayer);
}

export function createDesertBackground() {
    clearSceneLayer();
    sceneLayer = document.createElement('div');
    sceneLayer.className = 'scene-layer';
    const count = 400;
    sandParticles = [];
    sandRunning = true;
    for (let i = 0; i < count; i++) {
        const el = document.createElement('div');
        el.className = 'sand';
        const size = 0.6 + Math.random() * 1.8;
        el.style.width = size + 'px';
        el.style.height = size + 'px';
        el.style.background = `rgba(255,227,186,${0.45 + Math.random() * 0.4})`;
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * (window.innerHeight * 0.5);
        const speed = 1.2 + Math.random() * 3.2;
        el.style.left = x + 'px';
        el.style.top = y + 'px';
        sceneLayer.appendChild(el);
        sandParticles.push({ el, x, y, speed, size });
    }
    document.body.appendChild(sceneLayer);
    tickSand();
}

function tickSand() {
    if (!sandRunning || !sceneLayer || sandParticles.length === 0) return;
    const w = window.innerWidth;
    const h = window.innerHeight * 0.5;
    for (let p of sandParticles) {
        p.x -= p.speed;
        p.y += 0.12;
        if (p.x < -10) {
            p.x = w + 20;
            p.y = Math.random() * h;
        }
        if (p.y > h) {
            p.y = Math.random() * h * 0.3;
        }
        p.el.style.left = p.x + 'px';
        p.el.style.top = p.y + 'px';
    }
    requestAnimationFrame(tickSand);
}

export function createWildernessBackground() {
    clearSceneLayer();
    sceneLayer = document.createElement('div');
    sceneLayer.className = 'scene-layer';
    for (let i = 0; i < 80; i++) {
        const dot = document.createElement('div');
        dot.style.position = 'absolute';
        dot.style.width = '2px';
        dot.style.height = '2px';
        dot.style.background = '#ffffff';
        dot.style.borderRadius = '50%';
        dot.style.top = (Math.random() * 100) + '%';
        dot.style.left = (Math.random() * 100) + '%';
        dot.style.opacity = (0.25 + Math.random() * 0.75);
        sceneLayer.appendChild(dot);
    }
    for (let i = 0; i < 6; i++) {
        const star = document.createElement('div');
        star.className = 'shooting-star';
        star.style.width = '90px';
        star.style.height = '2px';
        star.style.background = 'linear-gradient(to right,#ffffff,transparent)';
        star.style.top = (Math.random() * 75) + '%';
        star.style.left = (Math.random() * 65) + '%';
        star.style.transformOrigin = 'left center';
        star.style.transform = 'rotate(-30deg)';
        star.style.animation = `shootingStar 2.8s ease-in infinite`;
        star.style.animationDelay = (i * 1.4) + 's';
        sceneLayer.appendChild(star);
    }
    document.body.appendChild(sceneLayer);
}

export function createScorchedBackground() {
    clearSceneLayer();
    sceneLayer = document.createElement('div');
    sceneLayer.className = 'scene-layer';
    for (let i = 0; i < 16; i++) {
        const bgMeteor = document.createElement('div');
        bgMeteor.className = 'bg-meteor';
        const size = 6 + Math.random() * 12;
        bgMeteor.style.width = size + 'px';
        bgMeteor.style.height = size + 'px';
        bgMeteor.style.background = '#553333';
        bgMeteor.style.borderRadius = '50%';
        bgMeteor.style.boxShadow = '0 0 8px #aa4422';
        bgMeteor.style.left = (Math.random() * 100) + '%';
        bgMeteor.style.animation = `bgMeteorFall ${3 + Math.random() * 4}s linear infinite`;
        bgMeteor.style.animationDelay = (Math.random() * 2.5) + 's';
        sceneLayer.appendChild(bgMeteor);
    }
    document.body.appendChild(sceneLayer);
}

export function setTerrainByIndex(idx, gameState, dom) {
    const target = GAME_CONFIG.terrainTypes[idx];
    if (!target) return;
    gameState.currentTerrain = target;
    document.body.style.backgroundColor = target.bodyBg;
    dom.groundDom.style.backgroundColor = target.groundBg;
    dom.terrainNameDom.innerText = "地形：" + target.name;

    gameState.obstacleList.forEach(obs => {
        if (obs.pit && obs.dom) obs.dom.style.backgroundColor = target.pitBg;
    });

    switch (idx) {
        case 0: createGrasslandBackground(); break;
        case 1: createDesertBackground(); break;
        case 2: createWildernessBackground(); break;
        case 3: createScorchedBackground(); break;
    }
}

export function updateTerrain(gameState, dom) {
    const score = gameState.score;
    const target = GAME_CONFIG.terrainTypes.find(t => score >= t.minScore && score < t.maxScore) || GAME_CONFIG.terrainTypes[0];
    if (gameState.currentTerrain === target) return;
    const idx = GAME_CONFIG.terrainTypes.indexOf(target);
    setTerrainByIndex(idx, gameState, dom);
}