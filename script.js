
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

const player = (sign) => {
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
