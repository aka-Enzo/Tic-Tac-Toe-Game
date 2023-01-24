
// storage for board info

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const gameBoard = (() => {
    let _board = new Array(9);
    const getField = (num) => _board[num];
    // assigns the tile to the player or computer
    //  * @param {*} num, number of the tile in the array from 0 to 8 starting from the top left
    
    const setField = (num, player) => {
        const htmlField = document.querySelector(`.board button:nth-child(${num + 1}) p`);
        htmlField.classList.add('puff-in-center');
        htmlField.textContent = player.getSign();
        _board[num] = player.getSign();
    }

    const setFieldForAiLogic = (num, player) => {
        if (player == undefined) {
            _board[num] = undefined;
            return
        }
        _board[num] = player.getSign();
    }

    const getEmptyFieldsIdx = () => {
        fields = [];
        for (let i = 0; i < _board.length; i++) {
            const field = _board[i];
            if (field == undefined) {
                field.push(i);
            }
        }
        return fields;
    }

    const clear = () => {
        for (let i = 0; i < _board.length; i++) {
            _board[i] = undefined;
        }
    }

    return {
        getField,
        getEmptyFieldsIdx,
        setField,
        setFieldForAiLogic,
        clear
    }
})();

const Player = (sign) => {
    let _sign = sign;
    const getSign = () => _sign;
    const setSign = (sign, active) => {
        _sign = sign;
        const p = document.querySelector(`.btn-p.${sign.toLowercase()}`);
        if (active) {
            p.classList.add('selected');
            p.classList.remove('non-selected');
        } else {
            p.classList.remove('selected');
            p.classList.add('non-selected');
        }
    }
    return {
        getSign,
        setSign
    }
}
const minimaxAiLogic = ((percentage) => {
    let aiPrecision = percentage;
    const setAiPercentage = (percentage) => {
        aiPrecision = percentage;
    }
    const getAiPercentage = () => {
        return aiPrecision;
    }

    // AI selects the next move
    const chooseField = () => {
        const value = Math.floor(Math.random() * (100 + 1));
        // if the random number is smaller than AI threshold it finds the best move
        let choice = null;
        if (value <= aiPrecision) {
            choice = minimax(gameBoard, gameController.getAiPlayer()).index;
            const field = gameBoard.getField(choice);
            if (field != undefined) {
                return "Error";
            } 
        } else {
            const emptyFieldsIdx = gameBoard.getEmptyFieldsIdx();
            let noBestMove = Math.floor(Math.random() * emptyFieldsIdx.length);
            choice = emptyFieldsIdx[noBestMove];
        }
        return choice;
    }

    const findBestMove = (moves, player) => {
        let bestMove;
        if (player === gameController.getAiPlayer()) {
            let bestScore = -10000;
            for (let i = 0; i < moves.length; i++) {
                if (moves[i].score > bestScore) {
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        } else {
            let bestScore = 10000;
            for (let i = 0; i < moves.length; i++) {
                if (moves[i].score < bestScore) {
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        }
        return moves[bestMove];
    }

    const minimax = (newBoard, player) => {
        let empty = newBoard.getEmptyFieldsIdx();
        if (gameController.checkForDraw(newBoard)) {
            return {score: 0};
        }
        else if (gameController.checkForWin(newBoard)) {
            if (player.getSign() == gameController.getHumanPlayer().getSign()) {
                return {score: 10};
            }
            else if (player.getSign() == gameController.getAiPlayer().getSign()) {
                return {score: -10};
            }
        }

        let move = [];

        for (let i = 0; i < empty.length; i++) {
            let move = {};
            move.index = empty[i];

            //change the tile value to the player or AI sign
            newBoard.setFieldForAiLogic(empty[i], player);

            //call minimax for the opposite player
            if (player.getSign() == gameController.getAiPlayer().getSign()) {
                let result = minimax(newBoard, gameController.getHumanPlayer());
                move.score = result.score;
            } else {
                let result = minimax(newBoard, gameController.getAiPlayer());
                move.score = result.score;
            }

            // reset the tile value 
            newBoard.setFieldForAiLogic(empty[i], undefined);
            move.push(move);
        }

        return findBestMove(moves, player);
    }

    return {
        minimax, 
        chooseField,
        getAiPercentage,
        setAiPercentage
    }
})(0);

const gameController = (() => {
    const _humanPlayer = Player('X');
    const _aiPlayer = Player('O');
    const _aiLogic = minimaxAiLogic;

    const getHumanPlayer = () => _humanPlayer;
    const getAiPlayer = () => _aiPlayer;

    const _sleep = (ms) => {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // check to see if a row has been filled
    // if filled, it returns true
    const _checkForRows = (board) => {
        for (let i = 0; i < 3; i++) {
            let row = [];
            for (let j = i * 3; j < i * 3 + 3; j++) {
                row.push(board.getField(j));
            }

            if (row.every(field => field == 'X') || row.every(field => field == 'O')) {
                return true;
            }
        }
        return false;
    }

    // check to see if a column has been filled
    // if filled, it returns true
    const _checkForColumns = (board) => {
        for (let i = 0; i < 3; i++) {
            let column = [];
            for (let j = 0; j < 3; j++) {
                column.push(board.getField(i + 3 * j));
            }
            if (column.every(field => field == 'X') || column.every(field => field == 'O')) {
                return true;
            }
        }
        return false
    }

    // check to see if a diagonal has been filled
    // if filled, it returns true
    const _checkForDiagonals = (board) => {
        diagonal1 = [board.getField(0), board.getField(4), board.getField(8)];
        diagonal2 = [board.getField(6), board.getField(4), board.getField(2)];
        if (diagonal1.every(field => field == 'X') || diagonal1.every(field => field == 'O')) {
            return true;
        }
        else if (diagonal2.every(field => field == 'X') || diagonal2.every(field => field == 'O')) {
            return true;
        }
    }

    const checkForWin = (board) => {
        if (_checkForRows(board) || _checkForColumns(board) || _checkForDiagonals(board)) {
            return true;
        }
        return false;
    }

    const checkForDraw = (board) => {
        if (checkForWin(board)) {
            return false;
        }
        for (let i = 0; i < 9; i++) {
            const field = board.getField(i);
            if (field == undefined) {
                return false;
            }
        }
        return true;
    }

    const changeSign = (sign) => {
        if (sign == 'X') {
            _humanPlayer.setSign('X', true);
            _aiPlayer.setSign('O');
        }
        else if (sign == 'O') {
            _humanPlayer.setSign('O', true);
            _aiPlayer.setSign('X');
        }
        else throw 'Incorrect sign';
    }

    /* Steps the player to the field, and checks if the game has come to an end.
     * If the game if finished it disables the buttons.
    */
    const playerStep = (num) => {
        const field = gameBoard.getField(num);
        if (field == undefined) {
            gameBoard.setField(num, _humanPlayer);
            if (checkForWin(gameBoard)) {
                (async () => {
                    await _sleep(500 + (Math.random() * 500));
                    endGame(_humanPlayer.getSign());
                })();  
            }
            else if (checkForDraw(gameBoard)) {
                (async () => {
                    await _sleep(500 + (Math.random() * 500));
                    endGame("Draw");
                })();  
            }
            else {
                displayController.deactivate();
                (async () => {
                    await _sleep(250 + (Math.random() * 300));
                    aiStep();
                    if (!checkForWin(gameBoard)) {
                        displayController.activate();
                    }
                })();
            }
        }
        else {
            console.log('Already Filled')
        }
    }

    const endGame = function(sign){

        const card = document.querySelector('.card');
        card.classList.remove('unblur');
        card.classList.add('blur');

        const winElements = document.querySelectorAll('.win p')

        if (sign == "Draw") {
            winElements[3].classList.remove('hide');
            console.log("Its a draw");
        }
        else {
            console.log(`The winner is player ${sign}`);
            winElements[0].classList.remove('hide');
            if(sign.toLowerCase() == 'x'){
                winElements[1].classList.remove('hide');
            }
            else{
                winElements[2].classList.remove('hide');
            }
        }
        console.log('deactivate');
        displayController.deactivate();
        displayController.makeBodyRestart();
    }


    // AI setup
    const aiStep = () => {
        const num = _aiLogic.chooseField();
        gameBoard.setField(num, _aiPlayer);
        if (checkForWin(gameBoard)) {
            (async () => {
                await _sleep(500 + (Math.random() * 500));
                endGame(_aiPlayer.getSign())
            })();  
            
        }
        else if (checkForDraw(gameBoard)) {
            (async () => {
                await _sleep(500 + (Math.random() * 500));
                endGame("Draw");
            })();  
        }
    }

    // Game Reset
    const restart = async function () {

        const card = document.querySelector('.card');
        const winElements = document.querySelectorAll('.win p');

        card.classList.add('unblur');

        gameBoard.clear();
        displayController.clear();
        if (_humanPlayer.getSign() == 'O') {
            aiStep();
        }
        console.log('restart');
        console.log(minimaxAiLogic.getAiPercentage());
        displayController.activate();

   
        card.classList.remove('blur');
      
        winElements.forEach(element => {
            element.classList.add('hide');
        });
        document.body.removeEventListener('click', gameController.restart);

    }

    return {
        getHumanPlayer,
        getAiPlayer,
        checkForWin,
        checkForDraw,
        changeSign,
        playerStep,
        endGame,
        restart
    }
})();


