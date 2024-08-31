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
        this.renderAttacks();
        this.renderHealthBar();
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
                x: 778,
                y: 85
            },
            image: pokemonOposingImage,
        });

        this.pokemonOposing = pokemonOposing; 
    }

    async initializePokemonFriend() {
        const pokemonFriend = await new Pokemon({
            level: { number: 5 },
            id: 25 //Pikachu
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

    renderAttacks(){
        let i = 0;
        while(i < 4){
            let move = this.pokemonFriend.moves.moves[i];

            if (move && move.name) {
                document.getElementById("Attack" + (i + 1)).innerHTML = move.name;
            }
            else {
                document.getElementById("Attack" + (i + 1)).innerHTML = "-";
            }

            i++;
        }      
    }

    renderHealthBar(){
        // Name
        document.getElementById("pokemonFriendName").innerHTML = capitalizeFirstLetter(this.pokemonFriend.name);
        document.getElementById("pokemonOposingName").innerHTML = capitalizeFirstLetter(this.pokemonOposing.name);

        console.log(this.pokemonFriend);
        console.log(document.getElementById("pokemonFriendGender"));
         
        // Gender          
        if (this.pokemonFriend.gender === "Male"){
            document.getElementById("pokemonFriendGender").src = "./images/icons/male.png";
        } 
        else if (this.pokemonFriend.gender === "Female"){
            document.getElementById("pokemonFriendGender").src = "./images/icons/female.png";
        }
        else {
            document.getElementById("pokemonFriendGender").src = "" ;
        }  

        if (this.pokemonOposing.gender === "Male"){
            document.getElementById("pokemonOposingGender").src = "./images/icons/male.png";
        } 
        else if (this.pokemonOposing.gender === "Female"){
            document.getElementById("pokemonOposingGender").src = "./images/icons/female.png";
        }
        else {
            document.getElementById("pokemonOposingGender").src = "" ;
        }  
       
        // Level
        document.getElementById("pokemonFriendLevel").innerHTML  = "Lv. " + this.pokemonFriend.level;
        document.getElementById("pokemonOposingLevel").innerHTML = "Lv. " +  this.pokemonOposing.level;
    }
}