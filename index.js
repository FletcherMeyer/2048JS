import G2048 from "./game.js";

const game = new G2048(
    // [
    //     [0, 0, 0, 0, 0, 0],
    //     [0, 0, 0, 0, 0, 0],
    //     [0, 0, 0, 0, 0, 0],
    //     [0, 0, 0, 0, 0, 0],
    //     [0, 0, 0, 0, 0, 0],
    //     [0, 0, 0, 0, 0, 0]
    // ],
    // 3
);
game.displayGrid();

import readline from "node:readline";
function question() {

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    rl.question(`Direction : \n`, dir => {
        if (dir == 'w') game.moveUp();
        if (dir == 's') game.moveDown();
        if (dir == 'a') game.moveLeft();
        if (dir == 'd') game.moveRight();
        rl.close();
        game.displayGrid();
        question();
    });

}
question();