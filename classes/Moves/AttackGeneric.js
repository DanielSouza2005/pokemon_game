class Attack {
    constructor(move){
        return this.initializeMove(move);
    }

    async initializeMove(move){
        const move_data = await this.fetchMove(move.name);
        const move_props = this.returnMoveProperties(move_data);
        Object.assign(this, move_props);

        return this;
    }

    async fetchMove(move) {
        try {
            const APIResponse = await fetch(`https://pokeapi.co/api/v2/move/${move}`);
    
            if (APIResponse.status === 200) {
                const data = await APIResponse.json();
                return data;
            }   
        }
        catch (error) {
            console.error("Error fetching move data:", error);
        }               
    }

    returnMoveProperties(move_data){
        if (move_data){
            let move_props = {};
    
            move_props.id = move_data.id;
            move_props.name = move_data.name;
            move_props.type = move_data.type.name;
            move_props.power = move_data.power;
            move_props.effect_chance = (move_data.effect_chance === null) ?
                                        100 : move_data.effect_chance ;
            move_props.effect_description = move_data.effect_entries[0].effect;
            move_props.accuracy = (move_data.accuracy === null) ?
                                   100 : move_data.accuracy;            
    
            return move_props;
        }
    }       
}