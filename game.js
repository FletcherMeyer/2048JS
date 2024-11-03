export default class G2048 {
    constructor(grid, count = 1) {
        this.grid = [
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ]
        if (grid) {
            this.grid = grid;
        }
        this.numbersToAdd = count;

        this.refreshTaken();
        for (let i = 0; i < Math.floor(Math.random() * 2) + 2; ++i) {
            this.addNumber();
        }

    }

    /**
     * Adds a random value. Should be called during construction and after any movement in the game.
     */
    addNumber() {
        /* Repeat for count times. */
        for (let i = 0; i < this.numbersToAdd; ++i) {
            /* Looks at the values which are currently not in use. */
            const notTakenRandomElement = Math.floor(Math.random() * this.notTaken.length);
            const randomIndex = this.notTaken[notTakenRandomElement];
            /* Sets the value to 2 or 4. Removes it from the usable list, (No need to refresh).*/
            /* 20% chance of it being 4. 80% chance of it being 2. */

            if (1 > Math.floor(Math.random() * 10)) {
                this.grid[Math.floor(randomIndex / (this.grid[0].length))][randomIndex % (this.grid.length)] = 4;
            } else {
                this.grid[Math.floor(randomIndex / (this.grid[0].length))][randomIndex % (this.grid.length)] = 2;
            }
            /* Remove from list of possible spots in the future.*/
            this.notTaken.splice(notTakenRandomElement, 1);
        }

    }

    /**
     * Goes through each value in the grid to dictate if a value may be placed here.
     * This is used for `addNumber()`. Should be called when grid placement it changed.
     */
    refreshTaken() {
        this.notTaken = [];
        for (let i = 0; i < this.grid.length; ++i) {
            for (let n = 0; n < this.grid[i].length; ++n) {
                const num = (i * this.grid[i].length) + n;
                if (this.grid[i][n] == 0) this.notTaken.push(num);
            }
        }
    }

    /**
     * Displays the 2D array of values in the grid.
     */
    displayGrid() {
        console.table(this.grid);
    }

    /**
     * Take an array of integers and combine adjascent pairs together. 
     * @param {Array} NumberStack An array of integer values.
     * @returns {Array} A number array. Will contain no 0's, pairs of values which are equal will be added together.  
     */
    combineLikeNumbers(NumberStack) {
        /* Remove all 0's from the array as they are dead space. */
        let zeroSpaces = 0;
        while (NumberStack.indexOf(0) !== -1) {
            ++zeroSpaces;
            NumberStack.splice(NumberStack.indexOf(0), 1);
        }

        /* Iterate through each value in the array. */
        /* Check if any of the values match the previous element. */
        for (let i = NumberStack.length - 1; i > 0; --i) {

            if (NumberStack[i] == NumberStack[i - 1]) {
                /* 'Merge' the values together. */
                NumberStack[i] = NumberStack[i] * 2;
                NumberStack[i - 1] = 0;
            }
        }

        while (NumberStack.indexOf(0) !== -1) {
            ++zeroSpaces;
            NumberStack.splice(NumberStack.indexOf(0), 1);
        }
        for (let i = 0; i < zeroSpaces; ++i) {
            NumberStack.unshift(0);
        }
        return NumberStack;
    }

    /**
     * Move all grid values to the right.
     */
    moveRight() {
        const reference = JSON.stringify(this.grid);
        /* Iterate through each row and merge. */
        for (let i = 0; i < this.grid.length; ++i) {
            const mergedArray = this.combineLikeNumbers([...this.grid[i]]);
            this.grid[i] = mergedArray;
        }
        /* Check if any move was accomplished. Necessary for spawning tiles.*/
        if (reference !== JSON.stringify(this.grid)) this.finishTurn();
    }

    /**
     * Move all grid values to the left.
     */
    moveLeft() {
        const reference = JSON.stringify(this.grid);
        /* Iterate through each row and merge. */
        for (let i = 0; i < this.grid.length; ++i) {
            const mergedArray = this.combineLikeNumbers([...this.grid[i]].reverse());
            mergedArray.reverse();
            this.grid[i] = mergedArray;
        }
        /* Check if any move was accomplished. Necessary for spawning tiles.*/
        if (reference !== JSON.stringify(this.grid)) this.finishTurn();
    }

    /**
     * Move all grid values down.
     */
    moveDown() {
        const reference = JSON.stringify(this.grid);
        for (let i = 0; i < this.grid[0].length; ++i) {
            /* Wide */
            let horizontalValues = [];
            for (let n = 0; n < this.grid.length; ++n) {
                /* Tall */
                horizontalValues.push(this.grid[n][i]);
            }
            const mergedArray = this.combineLikeNumbers([...horizontalValues]);
            /* Check if any move was accomplished. Necessary for spawning tiles.*/
            if (JSON.stringify(horizontalValues) === JSON.stringify(mergedArray)) {
                continue;
            }
            for (let n = 0; n < this.grid.length; ++n) {
                /* Tall */
                this.grid[n][i] = mergedArray[n];
            }
        }
        if (reference !== JSON.stringify(this.grid)) this.finishTurn();
    }

    /**
     * Gee wilikers I wonder what this does.
     */
    moveUp() {
        for (let i = 0; i < this.grid[0].length; ++i) {
            /* Wide */
            let horizontalValues = [];
            for (let n = 0; n < this.grid.length; ++n) {
                /* Tall */
                horizontalValues.push(this.grid[n][i]);
            }
            horizontalValues.reverse();
            const mergedArray = this.combineLikeNumbers([...horizontalValues]);
            mergedArray.reverse();
            /* Check if any move was accomplished. Necessary for spawning tiles.*/
            if (horizontalValues == mergedArray) return;
            for (let n = 0; n < this.grid.length; ++n) {
                /* Tall */
                this.grid[n][i] = mergedArray[n];
            }
        }
        this.finishTurn();
    }

    /**
     * Go through the traditional events between turns.
     */
    finishTurn() {
        this.refreshTaken();
        this.addNumber();
        this.refreshTaken();
    }

    /**
     * Check if all tiles are filled.
     * @returns Boolean. Returns true if lost.
     */
    checkLoss() {
        if (this.notTaken.length == (this.grid[0].length * this.grid.length)) {
            return true;
        }
        return false;
    }
}