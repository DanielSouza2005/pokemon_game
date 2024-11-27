class Map{
    constructor({background, 
                 boundaries,
                 player, 
                 foreground,
                 battleZones,
                 battle}){
        this.background       = background;
        this.boundaries       = boundaries;
        this.player           = player;
        this.foreground       = foreground; 
        this.battleZones      = battleZones;
        this.battle           = battle;
        this.moving           = false;
        this.animate          = this.animate.bind(this);
    }

    animate = () => {
        document.querySelector('#battleInterface').style.display = "none";

        const animationId = window.requestAnimationFrame(this.animate); 

        this.background.draw(); 

        this.boundaries.forEach((boundary) => {
            boundary.draw();        
        });

        this.battleZones.forEach((battleZone) => {
            battleZone.draw(); 
        });

        this.player.draw();    
        this.foreground.draw(); 

        this.moving = true;
        this.player.moving = false;      

        if (this.battle.initiaded) return;

        if (keys.w.pressed || keys.a.pressed || keys.s.pressed || keys.d.pressed ) {
            for(let i = 0; i < this.battleZones.length; i++){
    
                const battleZone = this.battleZones[i];
                const overlappingArea = returnOverlappingArea(this.player, battleZone);
    
                if (
                    (rectangularCollision({
                        rectangle1: this.player,
                        rectangle2: battleZone
                    })) && 
                    (overlappingArea > (this.player.width * this.player.height / 2)) &&
                    (Math.random() < 0.01)
                ) {
                    window.cancelAnimationFrame(animationId);
                    this.battle.initiaded = true;
    
                    //transition
                    gsap.to('#overlappingDiv', {
                        opacity : 1,
                        repeat: 3,
                        yoyo: true,
                        duration: 0.5,
                        onComplete: () => {
                            gsap.to('#overlappingDiv', {
                                opacity: 1,
                                duration: 0.5,
                                onComplete: () => {
                                    document.querySelector('#battleInterface').style.display = "block";
                                    this.battle.startBattle();
    
                                    gsap.to('#overlappingDiv', {
                                        opacity: 0,
                                        duration: 0.5
                                    });
                                }
                            });                                             
                        } 
                    });
    
                    break;
                }
            }
        }

        if (keyEvents.keys.w.pressed && keyEvents.lastKey === 'w') {
            this.player.moving = true;
            this.player.image = this.player.sprites.up;
    
            for(let i = 0; i < this.boundaries.length; i++){
    
                const boundary = this.boundaries[i];
                if (
                    rectangularCollision({
                        rectangle1: this.player,
                        rectangle2: {
                            ...boundary, 
                            position: {
                                x: boundary.position.x,
                                y: boundary.position.y + 3
                        }}
                    })
                ) {                
                    this.moving = false;
                    break;
                }
            }
            
            if (this.moving){
                movables.forEach(movable => {
                    movable.position.y += 3
                })
            }        
        }  
        else if (keyEvents.keys.a.pressed && keyEvents.lastKey === 'a') {
            this.player.moving = true;
            this.player.image = this.player.sprites.left;
    
            for(let i = 0; i < this.boundaries.length; i++){
    
                const boundary = this.boundaries[i];
                if (
                    rectangularCollision({
                        rectangle1: this.player,
                        rectangle2: {
                            ...boundary, 
                            position: {
                                x: boundary.position.x + 3,
                                y: boundary.position.y
                        }}
                    })
                ) {
                    this.moving = false;
                    break;
                }
            }
    
            if (this.moving){
                movables.forEach(movable => {
                    movable.position.x += 3
                })
            }
        } 
        else if (keyEvents.keys.s.pressed && keyEvents.lastKey === 's') {
            this.player.moving = true;
            this.player.image = this.player.sprites.down;
    
            for(let i = 0; i < this.boundaries.length; i++){
    
                const boundary = this.boundaries[i];
                if (
                    rectangularCollision({
                        rectangle1: this.player,
                        rectangle2: {
                            ...boundary, 
                            position: {
                                x: boundary.position.x,
                                y: boundary.position.y - 3
                        }}
                    })
                ) {
                    this.moving = false;
                    break;
                }
            }
    
            if (this.moving){
                movables.forEach(movable => {
                    movable.position.y -= 3
                })
            }
            
        } 
        else if (keyEvents.keys.d.pressed && keyEvents.lastKey === 'd') {
            this.player.moving = true;
            this.player.image = player.sprites.right;
    
            for(let i = 0; i < this.boundaries.length; i++){
    
                const boundary = this.boundaries[i];
                if (
                    rectangularCollision({
                        rectangle1: this.player,
                        rectangle2: {
                            ...boundary, 
                            position: {
                                x: boundary.position.x - 3,
                                y: boundary.position.y
                        }}
                    })
                ) {
                    this.moving = false;
                    break;
                }
            }
    
            if (this.moving){
                movables.forEach(movable => {
                    movable.position.x -= 3
                })
            }        
        }
    };
}