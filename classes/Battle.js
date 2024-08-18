class Battle {
    constructor({image}){
        this.initiaded = false;
        this.image = image;
        this.animateBattle = this.animateBattle.bind(this);
        this.pokemon1 = undefined;
        this.pokemon2 = undefined;
    }

    animateBattle = () => {
        window.requestAnimationFrame(this.animateBattle);
        this.image.draw();
        // console.log("teste");
    }
}