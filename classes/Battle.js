class Battle {
    constructor({image}){
        this.pokemonOposing = null;
        this.pokemonOposingSprite = null;

        this.pokemonFriend = null;
        this.pokemonFriendSprite = null;

        this.image = image;                    
    }

    async startBattle() {
        await this.initializePokemonOposing();
        await this.initializePokemonFriend();
        
        this.animateBattle();
    }

    animateBattle = () => {
        window.requestAnimationFrame(this.animateBattle);
        this.image.draw();     
        
        this.renderPokemonOposing();
        this.renderPokemonFriend();
    }

    async initializePokemonOposing() {
        const pokemonOposing = await new Pokemon({
            level: { number: 5 },
            id: 133 //Eevee
        });

        const front_spriteOposing = './images/front/' + pokemonOposing.id + '.png' //pokemonOposing.front_sprite;

        const pokemonOposingImage = new Image();
        pokemonOposingImage.src = front_spriteOposing;

        this.pokemonOposingSprite = new Sprite({
            position: {
                x: 800,
                y: 100
            },
            image: pokemonOposingImage,
        });

        this.pokemonOposing = pokemonOposing; 
    }

    async initializePokemonFriend() {
        const pokemonFriend = await new Pokemon({
            level: { number: 5 },
            id: 25
        });

        const front_spriteFriend = './images/back/' + pokemonFriend.id + '.png';//pokemonFriend.back_sprite;

        const pokemonFriendImage = new Image();
        pokemonFriendImage.src = front_spriteFriend;

        this.pokemonFriendSprite = new Sprite({
            position: {
                x: 280,
                y: 325
            },
            image: pokemonFriendImage
        });

        this.pokemonFriend = pokemonFriend; 
    }

    renderPokemonOposing() {
        if (this.pokemonOposingSprite) {         
            this.pokemonOposingSprite.draw();
        }
    }

    renderPokemonFriend() {
        if (this.pokemonFriendSprite) {
            this.pokemonFriendSprite.draw();
        }
    }
}