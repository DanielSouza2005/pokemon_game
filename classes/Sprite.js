class Sprite {
    constructor({ position, image, frames = {max: 1}, sprites}) {
        this.position = position;
        this.image = image;
        this.frames = {...frames, val: 0, elapsed: 0};

        this.image.onload = () => {
            this.width = this.image.width / this.frames.max
            this.height = this.image.height / this.frames.max
        }

        this.moving = false; 
        this.sprites = sprites;       
    }

    draw(){
        context.drawImage(
            this.image,  
            this.frames.val * this.width,                      //CROPING THE START X OF THE IMAGE
            0,                                                 //CROPING THE START Y OF THE IMAGE
            this.image.width / this.frames.max,                //CROPING ONLY THE FIRST PLAYER
            this.image.height,                                 //CROPING THE FULL HEIGHT OF THE PLAYER
            this.position.x,                                   //CENTER OF THE CANVAS
            this.position.y,                                   //CENTER OF THE CANVAS
            this.image.width / this.frames.max,
            this.image.height
        );
        
        if (!this.moving) return;

        if (this.frames.max > 1) 
            this.frames.elapsed++
        
        if (this.frames.elapsed % 10 === 0) {
            if (this.frames.val < this.frames.max - 1) 
                this.frames.val++
            else 
                this.frames.val = 0
        }                  
    }  
}