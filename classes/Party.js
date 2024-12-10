class PokemonTime {
    constructor(){
        this.time = [];
        this.tamanhoMaximo = 6;
    }

    addPokemon(pokemon){             
        if (this.time.length < this.tamanhoMaximo) {
            this.time.push(pokemon);
            return true;
        }  
        else {
            return false;
        }             
    }

    async addPokemonAsync(pokemonData){
        let pokemon = await new Pokemon(pokemonData);
        this.addPokemon(pokemon);
    }

    removerPokemon(index) {
        if (index >= 0 && index < this.time.length) {
          this.time.splice(index, 1)[0];          
          return true;
        } 
        else {
          return false;
        }
    }

    substituirPokemon(index, newPokemon) {
        if (index >= 0 && index < this.time.length) {
          this.time[index];
          this.time[index] = newPokemon;
          return true;
        }
        else {
          return false;
        }
    }
}    