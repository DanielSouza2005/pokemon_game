let animationBattleId;

class Battle {
    constructor({image}){
        this.pokemonOposing = null;
        this.pokemonOposingSprite = null;

        this.pokemonFriend = null;
        this.pokemonFriendSprite = null;

        this.image = image;           
        this.initiaded = false;
    }

    async startBattle() { 
        await this.initializePokemonOposing();
        await this.initializePokemonFriend();

        this.animateBattle();
        this.renderAttacks();
        this.renderHealthBar();

        document.querySelectorAll('button').forEach((button) => {
            button.addEventListener('click', () => {
                this.handleAttack(this.pokemonFriend, this.pokemonOposing, this.pokemonFriend.moves.moves[getNumbersFromString(button.id) - 1], false, false);
            })

            button.addEventListener('mouseover', () => {
                this.showMoveDescription(this.pokemonFriend.moves.moves[getNumbersFromString(button.id) - 1]);
            })
        })
    }

    animateBattle = () => {
        animationBattleId = window.requestAnimationFrame(this.animateBattle);
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
            document.getElementById("Attack" + (i + 1)).innerHTML = (move && move.name) ? move.name : "-";            
            i++;
        }      
    }

    renderHealthBar(){
        const genderIcons = {
            Male: "./images/icons/male.png",
            Female: "./images/icons/female.png",
        };           

        // Name
        document.getElementById("pokemonFriendName").innerHTML = capitalizeFirstLetter(this.pokemonFriend.name);
        document.getElementById("pokemonOposingName").innerHTML = capitalizeFirstLetter(this.pokemonOposing.name);
         
        // Gender         
        document.getElementById("pokemonFriendGender").src = genderIcons[this.pokemonFriend.gender] || "";
        document.getElementById("pokemonOposingGender").src = genderIcons[this.pokemonOposing.gender] || "";
       
        // Level
        document.getElementById("pokemonFriendLevel").innerHTML  = "Lv. " + this.pokemonFriend.level;
        document.getElementById("pokemonOposingLevel").innerHTML = "Lv. " +  this.pokemonOposing.level;
    }    

    handleAttack(pokemonFriend, pokemonOposing, move, isEnemy, secondTime){
        if (move === undefined) return;

        const healthBarId = isEnemy ? '#friendHealthBar' : '#enemyHealthBar';
        const remainingHPFriendId = document.getElementById("remainingHPFriend");
        const pokemon = isEnemy ? pokemonFriend : pokemonOposing;
        const pokemonDialog = pokemonOposing ? pokemonFriend :  pokemonOposing;
        const pokemonFainted = pokemonOposing ? pokemonOposing : pokemonFriend;
        const HPIndex = 0;   
        const pokemonHP = pokemon.battleStats[HPIndex];        

        let damage = 0;
        let percentage = 0;
        let attackdialog = pokemonDialog.name + " usou " + move.name + "!";
        let dialog = pokemonFainted.name + " desmaiou!";        

        document.querySelector("#dialogBox").style.display = 'block';
        document.querySelector("#dialogBox").innerHTML = attackdialog;        

        damage = this.calculateDamage(move, pokemonFriend, pokemonOposing);        
        pokemon.battleStats[HPIndex] -= damage; 

        //SE DESMAIOU
        if (pokemon.battleStats[HPIndex] < 0) {
            pokemon.battleStats[HPIndex] = 0;
            
            if (secondTime) {
                gsap.to({value: pokemonHP}, {
                    value: pokemon.battleStats[HPIndex],
                    duration: 1,
                    ease: "none",
                    onUpdate: function () {
                        remainingHPFriendId.innerHTML = Math.ceil(this.targets()[0].value);
                    }
                });
            }   

            gsap.to(healthBarId, {
                width: `${percentage}%`,
                duration: 1,
                onComplete: () => {
                    document.querySelector("#dialogBox").innerHTML = dialog;        
                    this.handleFaint(pokemonFriend, pokemonOposing, pokemonDialog);
                }
            }); 

            return;
        }   
        
        if (pokemon.battleStats[HPIndex] > 0 && damage > 0)  {
            percentage = calculatePercentageDamage(pokemon.battleStats[HPIndex], pokemon.stats[HPIndex]);

            gsap.to(healthBarId, {
                width: `${percentage}%`,
                duration: 1,
                onComplete: () => {
                    document.querySelector("#dialogBox").style.display = 'none';

                    if (!secondTime) {
                        const randomMove = Math.floor(Math.random() * pokemonOposing.moves.moves.length);
                        this.handleAttack(pokemonOposing, pokemonFriend, pokemonOposing.moves.moves[randomMove] , true, true);
                    }
                }
            });  

            if (secondTime) {
                gsap.to({value: pokemonHP}, {
                    value: pokemon.battleStats[HPIndex],
                    duration: 1,
                    ease: "none",
                    onUpdate: function () {
                        remainingHPFriendId.innerHTML = Math.ceil(this.targets()[0].value);
                    }
                });
            }            
        } 
        else {
            gsap.to(healthBarId, {
                width: healthBarId.width,
                duration: 1,
                onComplete: () => {
                    document.querySelector("#dialogBox").style.display = 'none';

                    if (!secondTime) {
                        const randomMove = Math.floor(Math.random() * pokemonOposing.moves.moves.length);
                        this.handleAttack(pokemonOposing, pokemonFriend, pokemonOposing.moves.moves[randomMove] , true, true);
                    }
                }
            }); 
        }      
    }

    handleFaint(pokemon){
        // const pokemonFainted = (pokemon === this.pokemonFriend) ? this.pokemonOposing :  this.pokemonFriend;
        const pokemonFaintedSprite = (pokemon === this.pokemonFriend) ? this.pokemonOposingSprite : this.pokemonFriendSprite;

        gsap.to(pokemonFaintedSprite.position, {
            y: pokemonFaintedSprite.position.y + 20,
            duration: 2
        })

        gsap.to(pokemonFaintedSprite, {
            opacity: 0,
            duration: 2
        })

        gsap.to('#overlappingDiv', {
            opacity: 1,
            duration: 1,
            onComplete: () => {
                cancelAnimationFrame(animationBattleId);
                document.querySelector('#battleInterface').style.display = "none";
                mapGeneral.animate(); 

                gsap.to('#overlappingDiv', {
                    opacity: 0
                });

                mapGeneral.battle.initiaded = false;
            }
        });  
    }

    calculateDamage(move, pokemonFriend, pokemonAffected){
        if (!move || typeof move.type !== "string" || typeof move.power !== "number") {
            return 0;
        }

        let damage = 0;
        let attack = 0;
        let defense = 0;
        let physicalSpecial = 0;
        let STAB = 1;
        let criticalDamage = 1;
        let random = 1;     
        let type1Effectiveness = 1;  
        let type2Effectiveness = 1;    
               
        physicalSpecial = this.returnPhysicalSpecialMove(move.type);
        ({ attack, defense } = this.returnAttackDefense(physicalSpecial, pokemonFriend, pokemonAffected));
        STAB = this.returnSTABMove(move, pokemonFriend);
        criticalDamage = this.returnCriticalHit();
        random = this.returnRowRatio();
        type1Effectiveness = this.returnTypeEffectiveness(move.type, pokemonAffected.type1);
        type2Effectiveness = this.returnTypeEffectiveness(move.type, pokemonAffected.type2);

        let baseDamage = ((2 * pokemonFriend.level) / 5) * move.power * (attack / defense);
        let modifiers = criticalDamage * STAB * random * type1Effectiveness * type2Effectiveness;

        damage = (move.power === null) ? 0 : Math.round((baseDamage / 50 + 2) * modifiers);             

        return damage;
    }

    showMoveDescription(move){
        document.getElementById("attackType").innerHTML = (move === undefined) ? "" : "Type/" + move.type;     
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

    returnAttackDefense(physicalSpecial, pokemonFriend, pokemonAffected){
        let _attack = 0;
        let _defense = 0;

        switch(physicalSpecial){
            case 0: {
                _attack = pokemonFriend.battleStats[3];
                _defense = pokemonAffected.battleStats[4];
                break;
            }

            case 1: {
                _attack = pokemonFriend.battleStats[1];
                _defense = pokemonAffected.battleStats[2];
                break;
            }

            case 2: {
                _attack = 0;
                _defense = 0;
                break; 
            }
        }

        return { attack: _attack, defense: _defense };
    }

    returnTypeEffectiveness(move, targetType){
        const typeChart = {
            normal: { rock: 0.5, ghost: 0, steel: 0.5 },
            fire: { fire: 0.5, water: 0.5, grass: 2, ice: 2, bug: 2, rock: 0.5, dragon: 0.5, steel: 2 },
            water: { fire: 2, water: 0.5, grass: 0.5, ground: 2, rock: 2, dragon: 0.5 },
            electric: { water: 2, electric: 0.5, grass: 0.5, ground: 0, flying: 2, dragon: 0.5 },
            grass: { fire: 0.5, water: 2, grass: 0.5, poison: 0.5, ground: 2, flying: 0.5, bug: 0.5, rock: 2, dragon: 0.5, steel: 0.5 },
            ice: { fire: 0.5, water: 0.5, grass: 2, ice: 0.5, ground: 2, flying: 2, dragon: 2, steel: 0.5 },
            fighting: { normal: 2, ice: 2, rock: 2, dark: 2, steel: 2, flying: 0.5, poison: 0.5, psychic: 0.5, bug: 0.5, ghost: 0, fairy: 0.5 },
            poison: { grass: 2, poison: 0.5, ground: 0.5, rock: 0.5, ghost: 0.5, steel: 0, fairy: 2 },
            ground: { fire: 2, electric: 2, grass: 0.5, poison: 2, flying: 0, bug: 0.5, rock: 2, steel: 2 },
            flying: { electric: 0.5, grass: 2, fighting: 2, bug: 2, rock: 0.5, steel: 0.5 },
            psychic: { fighting: 2, poison: 2, psychic: 0.5, dark: 0, steel: 0.5 },
            bug: { fire: 0.5, grass: 2, fighting: 0.5, poison: 0.5, flying: 0.5, psychic: 2, ghost: 0.5, dark: 2, steel: 0.5, fairy: 0.5 },
            rock: { fire: 2, ice: 2, fighting: 0.5, ground: 0.5, flying: 2, bug: 2, steel: 0.5 },
            ghost: { normal: 0, psychic: 2, ghost: 2, dark: 0.5 },
            dragon: { dragon: 2, steel: 0.5, fairy: 0 },
            dark: { fighting: 0.5, psychic: 2, ghost: 2, dark: 0.5, fairy: 0.5 },
            steel: { fire: 0.5, water: 0.5, electric: 0.5, ice: 2, rock: 2, fairy: 2 },
            fairy: { fighting: 2, dragon: 2, dark: 2, fire: 0.5, poison: 0.5, steel: 0.5 },
        };

        let effectiveness = 1;

        const typeEffectiveness = typeChart[move]?.[targetType] ?? 1; 
        effectiveness *= typeEffectiveness;
   
        return effectiveness;
    }

}