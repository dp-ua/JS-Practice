class User {
    constructor() {
        this.rank = -8;
        this.progress = 0;
    }

    incProgress(rank) {
        console.log("My rank: " + this.rank + " task Rank: " + rank);
        let diffRank = this.rank - rank;
        this.progress +=
            diffRank === 1 ? 1 :
            diffRank === 0 ? 3 :
            diffRank <= -1 ? 10 * diffRank * diffRank :
            0;
        while (this.progress > 100 && this.rank != 8) this.incRank();
        console.log("My rank: " + this.rank + " progress: " + this.progress);
    }

    incRank() {
        if (this.rank !== 8 && this.progress > 100) {
            if (this.rank === -1) this.rank = 1;
            else this.rank++;
            this.progress -= 100;
        }
    }
}