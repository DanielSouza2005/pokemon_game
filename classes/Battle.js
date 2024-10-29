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

        document.querySelectorAll('button').forEach((button) => {
            button.addEventListener('click', () => {
                this.handleAttack(this.pokemonFriend, this.pokemonOposing, this.pokemonFriend.moves.moves[getNumbersFromString(button.id) - 1]);
            })

            button.addEventListener('mouseover', () => {
                this.showMoveDescription(this.pokemonFriend.moves.moves[getNumbersFromString(button.id) - 1]);
            })
        })
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

    handleAttack(pokemonFriend, pokemonOposing, move){
        let damage = 0;
        damage = this.calculateDamage(move, pokemonFriend, pokemonOposing);
        let percentage = 0;

        pokemonOposing.battleStats[0] -= damage; 
        if (pokemonOposing.battleStats[0] < 0)
            pokemonOposing.battleStats[0] = 0; 

        if (damage > 0) {
            percentage = calculatePercentageDamage(pokemonOposing.battleStats[0], pokemonOposing.stats[0]);

            gsap.to('#enemyHealthBar', {
                width: percentage + '%'
            });   
        }        
    }

    calculateDamage(move, pokemonFriend, pokemonAffected){
        // console.log(pokemonFriend)
        // console.log(pokemonAffected)
        // console.log(move) 

        //TODO - Type effectiveness

        let damage = 0;
        let attack = 0;
        let defense = 0;
        let physicalSpecial = 0;
        let STAB = 1;
        let criticalDamage = 1;
        let random = 1;                                                                      ;
        
        physicalSpecial = this.returnPhysicalSpecialMove(move.type);

        //turn into a function
        switch(physicalSpecial){
            case 0: {
                attack = pokemonFriend.battleStats[3];
                defense = pokemonAffected.battleStats[4];
                break;
            }

            case 1: {
                attack = pokemonFriend.battleStats[1];
                defense = pokemonAffected.battleStats[2];
                break;
            }
        }

        STAB = this.returnSTABMove(move, pokemonFriend);
        criticalDamage = this.returnCriticalHit();
        random = this.returnRowRatio();
        
        if (move.power === null){
            damage = 0;
        }
        else {
            damage = Math.round((((((2 * pokemonFriend.level) / 5) * move.power * (attack / defense)) / 50) + 2) * criticalDamage * STAB * random);
        }

        return damage;
    }

    showMoveDescription(move){
        if (move === undefined) {
            document.getElementById("attackType").innerHTML  = "";
        }            
        else {
            document.getElementById("attackType").innerHTML  = "Type/" + move.type;
        }       
    }

    returnPhysicalSpecialMove(type){
        type = type.toUpperCase();
    
        if ((type === 'NORMAL') || (type === 'FIGHTING') || (type === 'POISON') ||
            (type === 'GROUND') || (type === 'FLYING')   || (type === 'BUG')    ||
            (type === 'ROCK')   || (type === 'GHOST')    || (type === 'STEEL')) {
            return 0; //Pyshical
        }     
        else if ((type === 'FIRE')   || (type === 'WATER') || (type === 'ELECTRIC') ||
                 (type === 'GRASS')  || (type === 'ICE')   || (type === 'PSYCHIC')  ||
                 (type === 'DRAGON') || (type === 'DARK')) {
            return 1; //Special
        }
        else {
            return 2; //None
        }
    }  

    returnCriticalHit(){
        if (getRandomInt(0, 24) === 0) {
            return 2;  
        } 
        else {
            return 1;
        }
    }

    returnSTABMove(move, pokemonFriend){
        if ((move.type.toUpperCase() === (pokemonFriend.type1 ? pokemonFriend.type1.toUpperCase() : "") ) ||
            (move.type.toUpperCase() === (pokemonFriend.type2 ? pokemonFriend.type2.toUpperCase() : "") )) {
                return 1.5;
        }
    }

    returnRowRatio(){
        let randomInt = Math.floor(Math.random() * (100 - 85 + 1)) + 85;
        return randomInt / 100;
    }

}