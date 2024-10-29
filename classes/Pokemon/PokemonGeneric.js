let pokemonProperties = {};

class Pokemon {
    constructor(pokemon){
        // super();
        return this.initializePokemon(pokemon);  
    }

    async initializePokemon(pokemon) {
        try {
            const pokemon_data = await Pokemon.fetchPokemon(pokemon.id);
            pokemonProperties = await this.returnPokemonProperties(pokemon_data);    

            Object.assign(this, pokemonProperties);
            this.defineLevelGeneric(pokemon.level);
            this.defineShinyGeneric(pokemon.shiny); 

            this.defineMovesGeneric(pokemon.moves); 
            this.defineGenderGeneric(getRandomInt(0, 1));
            this.returnIVs();
            this.returnEVs();
            this.returnStats(this.baseStatus);
            this.returnBattleStats(this.stats);
            
            return this;
        }
        catch (error){
            console.error("Error ao capturar os dados:", error);
        }        
    }

    static async fetchPokemon(pokemon) {
        try {
            const APIResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`);
    
            if (APIResponse.status === 200) {
                const data = await APIResponse.json();
                return data;
            }   
        }
        catch (error) {
            console.error("Error ao capturar os dados", error);
        }               
    }    

    async returnPokemonProperties(pokemonData){
        if (pokemonData){
            const PokemonProps = {};            

            PokemonProps.id = pokemonData.id;
            PokemonProps.name = pokemonData.name;
            PokemonProps.type1 = pokemonData.types[0].type.name,
            PokemonProps.type2 = (pokemonData.types.length > 1) ? 
                                  pokemonData.types[1].type.name :
                                  null;
            PokemonProps.height = pokemonData.height;
            PokemonProps.weight = pokemonData.weight; 
            PokemonProps.baseStatus = pokemonData.stats;
            PokemonProps.stats = [];
            PokemonProps.battleStats = [];
            PokemonProps.front_sprite = pokemonData['sprites']['versions']['generation-iii']['firered-leafgreen']['front_default'];
            PokemonProps.back_sprite = pokemonData['sprites']['versions']['generation-iii']['firered-leafgreen']['back_default'];
            PokemonProps.front_shiny = pokemonData['sprites']['versions']['generation-iii']['firered-leafgreen']['front_shiny']; 
            PokemonProps.back_shiny = pokemonData['sprites']['versions']['generation-iii']['firered-leafgreen']['back_shiny'];
            PokemonProps.moveLearnings = await this.returnMoveLearningsGenericAPI(pokemonData, "level-up", "firered-leafgreen", false);
            PokemonProps.moveLearningsatZero = await this.returnMoveLearningsGenericAPI(pokemonData, "level-up", "firered-leafgreen", true);           

            return PokemonProps;
        }
    }

    async returnMoveLearningsGenericAPI(pokemonData, method, versionGroupName, considerOnlyMovesatZero){
        if (pokemonData) {
            const moveLearnings = [];
            const Attacks = await initializeAttacks();

            for (const moveGroup of pokemonData.moves) {
                const filteredMoves = moveGroup.version_group_details.filter((move) => {
                    if (considerOnlyMovesatZero){
                        return move.move_learn_method.name === method && 
                               move.version_group.name === versionGroupName &&
                               move.level_learned_at === 1;
                    }
                    else {
                        return move.move_learn_method.name === method && 
                               move.version_group.name === versionGroupName &&
                               move.level_learned_at !== 1;
                    }                    
                });
               
                moveLearnings.push(...filteredMoves.map((move) => ({
                    level: move.level_learned_at,
                    moves: Attacks[moveGroup.move.name],
                })));
            } 

            moveLearnings.sort((a, b) => a.level - b.level);    
            
            return moveLearnings;
        }
    }

    returnMovesByLevel(moveLearnings, moveLearningsatZero, currentlevel) {
        let startIndex = 0;
        for (const learning of moveLearnings) {
            if (currentlevel >= learning.level) {
                startIndex++;
            }
        }

        let lastFourMoves = (startIndex >= 4) ?
            moveLearnings.slice(startIndex - 4, startIndex).map(learning => learning.moves) :
            moveLearnings.slice(0, startIndex).map(learning => learning.moves);          

        let lastFourMovesIni = lastFourMoves.length;

        if (lastFourMovesIni + moveLearningsatZero.length <= 4){
            while (lastFourMoves.length < (lastFourMovesIni + moveLearningsatZero.length)){            
                let randomMove = getRandomInt(0, moveLearningsatZero.length - 1);            
                let selectedMove = moveLearningsatZero[randomMove];            
    
                if (!lastFourMoves.some(move => move === selectedMove.moves)) {
                    lastFourMoves.push(selectedMove.moves);
                }              
            }
        }
        else {
            while (lastFourMoves.length < 4){            
                let randomMove = getRandomInt(0, moveLearningsatZero.length - 1);            
                let selectedMove = moveLearningsatZero[randomMove];            
    
                if (!lastFourMoves.some(move => moves === selectedMove.moves)) {
                    lastFourMoves.push(selectedMove.moves);
                }              
            }
        } 
        
        this.moves = new Moves(lastFourMoves);
    }
    
    defineMovesGeneric(moves){
        if (moves !== undefined){
            this.moves = new Moves(moves);           
        }
        else {            
            this.returnMovesByLevel(this.moveLearnings, this.moveLearningsatZero, this.level); 
        }           
    }

    defineGenderGeneric(gender){        
        if(gender === 0){
            this.gender = "Male";
        }
        else if (gender === 1){
            this.gender = "Female";
        }
        else {
            this.gender = "Unknown";
        }  

        // if(gender === "Male"){
        //     this.gender = "Male";
        // }
        // else if (gender === "Female"){
        //     this.gender = "Female";
        // }
        // else {
        //     this.gender = "Unknown";
        // }   
    }

    defineShinyGeneric(shiny){
        if (shiny || shiny !== undefined){
            this.shiny = true;
        }
        else {
            let random = getRandomInt(0, 4095);
            this.shiny = (random === 0) ? true : false;            
        }
    }

    defineLevelGeneric(level){         
        if (level.number !== undefined) {
            this.level = level.number;
        } 
        else {
            // Use the provided range or default to 1-50
            const minRange = level.range && level.range[0] !== undefined ? level.range[0] : 1;
            const maxRange = level.range && level.range[1] !== undefined ? level.range[1] : 100;

            // Generate a random level within the specified range
            this.level = getRandomInt(minRange, maxRange);
        }
    }

    returnIVs(IVs){
        if (IVs !== undefined){
            this.IVs = IVs;
        } 
        else {
            this.IVs = [getRandomInt(0, 31), 
                        getRandomInt(0, 31), 
                        getRandomInt(0, 31), 
                        getRandomInt(0, 31), 
                        getRandomInt(0, 31), 
                        getRandomInt(0, 31)];
        }        
    }

    returnEVs(EVs){
        if (EVs !== undefined){
            this.EVs = IVs;
        }  
        else {
            this.EVs = [0, 
                        0, 
                        0, 
                        0, 
                        0, 
                        0];
        }          
    }
    
    returnStats(baseStatus){  
        baseStatus.forEach((stat) => {
            let i = 0;

            if (stat.stat.name === 'hp') {
                this.stats.push(Math.floor(0.01 * (2 * stat.base_stat + this.IVs[i] + Math.floor(0.25 * this.EVs[i])) * this.level) + this.level + 10);
            } 
            else{
                this.stats.push(Math.floor(0.01 * (2 * stat.base_stat + this.IVs[i] + Math.floor(0.25 * this.EVs[i])) * this.level) + 5);
            }

            i++;
        })                
    }

    returnBattleStats(stats){
        this.battleStats = [...stats];
    }
}