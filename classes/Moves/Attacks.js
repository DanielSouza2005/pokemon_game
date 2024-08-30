const AttackList = [
    "thunder-shock", "growl", "tail-whip", "thunder-wave", "quick-attack", 
    "double-team", "slam", "thunderbolt", "agility", "thunder", 
    "light-screen", "tackle", "helping-hand", "sand-attack", "growl", 
    "bite", "baton-pass", "take-down"
];

let allAttacks = [];

async function initializeAllAttacks() {
    const attacks = {};

    for (const attackName of AttackList) {
        const attackInstance = await new Attack({ name: attackName });
        attacks[attackName] = attackInstance;
    }

    return attacks;
}

async function initializeAttacks() {
    allAttacks = await initializeAllAttacks();
    return allAttacks;
}
