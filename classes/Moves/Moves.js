class Moves {
    constructor(moves = []) {
        this.moves = moves;
    }

    addMove(move) {
        if (this.moves.length < 4) {
            this.moves.push(move);
        }
    }

    getCount() {
        return this.moves.length;
    }

    getAllMoves() {
        return [...this.moves];
    }
}