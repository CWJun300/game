// 素材统一用相对路径（不要带前导 /），dev、dist、子目录部署都能正确解析
export const IMG = {
    cactus: 'assets/cactus.jpg',
    bird: 'assets/bird.webp'
};

export const GAME_CONFIG = {
    dinoW: 56,
    dinoHStand: 56,
    dinoHSlide: 28,
    moveSpeed: 5,
    gravity: 0.6,
    jumpPower: -15,
    cactusSpeed: 6,
    MODE_SCORE_THRESHOLD: 5000,
    spawnInterval: 800,

    terrainTypes: [
        { name: "草原", minScore: 0, maxScore: 2000, bodyBg: "#87CEEB", groundBg: "#654321", pitBg: "#000000" },
        { name: "荒漠", minScore: 2000, maxScore: 4000, bodyBg: "#b99b78", groundBg: "#d8b18a", pitBg: "#1a0f0a" },
        { name: "暗夜荒野", minScore: 4000, maxScore: 5000, bodyBg: "#242b42", groundBg: "#383842", pitBg: "#050510" },
        { name: "灾变焦土", minScore: 5000, maxScore: 999999, bodyBg: "#4b2222", groundBg: "#2b2020", pitBg: "#100505" }
    ],

    obstacleTypes: [
        { type: 'cactus', className: 'obstacle cactus-img', w: 24, h: 48, ground: true, image: IMG.cactus },
        { type: 'cactus-tall', className: 'obstacle cactus-tall-img', w: 28, h: 64, ground: true, image: IMG.cactus },
        { type: 'cactus-wide', className: 'obstacle cactus-wide-img', w: 40, h: 48, ground: true, image: IMG.cactus },
        { type: 'bird', className: 'obstacle bird-img', w: 32, h: 32, ground: false, image: IMG.bird },
        { type: 'pit', className: 'obstacle pit', w: 80, h: 48, ground: true, pit: true, depth: 1 },
        { type: 'pit-deep', className: 'obstacle pit pit-deep', w: 80, h: 144, ground: true, pit: true, depth: 3 },
        { type: 'meteor', className: 'obstacle meteor-img', w: 36, h: 36, ground: false, meteor: true, image: '' },
        { type: 'meteor-large', className: 'obstacle meteor-large-img', w: 52, h: 52, ground: false, meteor: true, image: '' }
    ],

    obstacleWeightTable: [
        { index: 0, weight: 35 }, { index: 1, weight: 20 }, { index: 2, weight: 20 },
        { index: 3, weight: 12 }, { index: 4, weight: 8 }, { index: 5, weight: 5 }
    ],
    meteorWeightTable: [{ index: 6, weight: 70 }, { index: 7, weight: 30 }]
};