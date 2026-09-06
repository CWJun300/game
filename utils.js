export function getRandomByWeight(weightArr) {
    let total = 0;
    for (let i of weightArr) total += i.weight;
    const r = Math.random() * total;
    let acc = 0;
    for (let i of weightArr) {
        acc += i.weight;
        if (r <= acc) return i.index;
    }
    return weightArr[0].index;
}

/** AABB碰撞检测 */
export function isCollision(a, b, dinoW, dinoCurHeight) {
    if (b.pit) {
        const groundLine = window.innerHeight / 2;
        return a.x < b.x + b.w && a.x + dinoW > b.x && (a.y + dinoCurHeight) >= groundLine - 8;
    }
    return a.x < b.x + b.w && a.x + dinoW > b.x
        && a.y < b.y + b.h && a.y + dinoCurHeight > b.y;
}