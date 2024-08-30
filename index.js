//VARIABLES
const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

//LOADING THE CANVAS AND THE IMAGES
canvas.width = 1024;
canvas.height = 576;

context.fillStyle = 'white';
context.fillRect(0, 0, canvas.width, canvas.height);

const map = new Image();
map.src = './png/pokemon_map.png';

const foregroundImage = new Image();
foregroundImage.src = './png/foreground.png';

const playerDownImage = new Image();
playerDownImage.src = './png/player/playerDown.png';

const playerUpImage = new Image();
playerUpImage.src = './png/player/playerUp.png';

const playerLeftImage = new Image();
playerLeftImage.src = './png/player/playerLeft.png';

const playerRightImage = new Image();
playerRightImage.src = './png/player/playerRight.png';

const battleBackgroundImage = new Image();
battleBackgroundImage.src = './png/battleBackground.png';

//KEY EVENTS
const keys = {
    w: {
        pressed: false
    },
    a: {
        pressed: false
    },
    s: {
        pressed: false
    },
    d: {
        pressed: false
    }
}

const keyEvents = new KeyEvents({keys});
keyEvents.addEventListenerKeyDown();
keyEvents.addEventListenerKeyUp();
//KEY EVENTS

const boundaries = [];
const battleZones = [];

const offset = {
    x: -450,
    y: -260
    // x: 0,
    // y: 0
}

const player = new Sprite({
    position: {  
        x: canvas.width / 2 - 192 / 4 / 2,
        y: canvas.height / 2 - 68 / 2
    },
    image: playerDownImage,
    frames: {
        max: 4
    }, 
    sprites: {
        up: playerUpImage,
        down: playerDownImage,
        left: playerLeftImage,
        right: playerRightImage
    }
})

const background = new Sprite({
    position: {
        x: offset.x, 
        y: offset.y
    },
    image: map
});

const foreground = new Sprite({
    position: {
        x: offset.x, 
        y: offset.y
    },
    image: foregroundImage
});

const battleBackground = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    image : battleBackgroundImage
});

const battle = new Battle({image: battleBackground});

const collisionsMap = [];
for (let i = 0; i < collisions.length; i += 70){
    collisionsMap.push(collisions.slice(i, 70 + i));
}

const battleZonesMap = [];
for (let i = 0; i < battleZonesData.length; i += 70){
    battleZonesMap.push(battleZonesData.slice(i, 70 + i));
}

collisionsMap.forEach((row, i) => {
    row.forEach((symbol, j) => {
        if (symbol === 1025){
            boundaries.push(
                new Boundary({
                    position: {
                        x: j * Boundary.width + offset.x,
                        y: i * Boundary.height + offset.y
                    }
                })
            )
        }        
    });
});

battleZonesMap.forEach((row, i) => {
    row.forEach((symbol, j) => {
        if (symbol === 1025){
            battleZones.push(
                new Boundary({
                    position: {
                        x: j * Boundary.width + offset.x,
                        y: i * Boundary.height + offset.y
                    }
                })
            )
        }        
    });
});

const movables = [background, ...boundaries, foreground, ...battleZones];

const mapGeneral = new Map({
    background: background,
    boundaries: boundaries,
    player: player,
    foreground: foreground,
    battleZones: battleZones,
    battle: battle
});

function rectangularCollision({ rectangle1, rectangle2 }){
    return (
       (rectangle1.position.x + rectangle1.width >= rectangle2.position.x) && 
       (rectangle1.position.x <= rectangle2.position.x + rectangle2.width) &&
       (rectangle1.position.y <= rectangle2.position.y + rectangle2.height) &&    
       (rectangle1.position.y + rectangle1.height >= rectangle2.position.y) 
    )
}

function returnOverlappingArea(player, battleZone){
    return (Math.min(
                player.position.x + player.width, 
                battleZone.position.x + battleZone.width
            ) -
            Math.max(
                player.position.x, 
                battleZone.position.x
            )) *
            (Math.min(
                player.position.y + player.height, 
                battleZone.position.y + battleZone.height
            ) -
            Math.max(
                player.position.y, 
                battleZone.position.y  
            ));
}

mapGeneral.animate();
// mapGeneral.battle.startBattle();