let board = [];
let letterCount = {};
let words = {}

function initializeBoard() {
    for (let i = 0; i < 6; i++) {
        board.push([])
        for (let j = 0; j < 6; j++) {
            board[i].push(' ');
        }
    }
}

function drawBoard() {
    let container = document.querySelector('.puzzle_container')

    for (let i = 0; i < board.length; i++) {
        let row = document.createElement("div");
        row.className = "puzzle_row";
        row.id = "puzzle_row_" + i;

        container.append(row);


        for (let j = 0; j < board[i].length; j++) {
            let box = document.createElement("div");
            box.className = "box";
            box.textContent = board[i][j];

            row.append(box);
        }

    }
}

function updateBoard() {
    let container = document.querySelector('.puzzle_container');

    for (let i = 0; i < board.length; i++) {
        let row = container.children[i];
        let boxes = row.children;

        for (let j = 0; j < boxes.length; j++) {
            boxes[j].textContent = board[i][j];

            if (isLetter(board[i][j])) {
                boxes[j].classList.add('selected')
            } else {
                boxes[j].classList.remove('selected')

            }
        }
    }
}

let currentRow = 0;
let currentBox = 0;
let won = false;
let wordList = ["ATTACK", "ABROAD", "JINXED", "QUENCH"];
let wordIndex = Math.floor(Math.random() * wordList.length)


function getLetterCount(word) {
    letterCount = {}

    word.forEach(letter => {
        if (letter in letterCount) letterCount[letter][1] += 1;
        else letterCount[letter] = [0, 1];
    });

    return letterCount;
}

function checkRow(rowPos) {
    word = wordList[wordIndex].split('');

    letterCount = getLetterCount(word);

    let container = document.querySelector('.puzzle_container');

    let row = container.children[rowPos];
    let boxes = row.children;

    let boardRow = board[rowPos];

    markWrong(boardRow, word, boxes);
    checkCorrect(boardRow, word, boxes);
    checkDiscovered(boardRow, word, boxes);

    if (boardRow.join('') == wordList[wordIndex]) won = true;
}

function markWrong(boardRow, word, boxes) {
    for (let i = 0; i < boardRow.length; i++) {
        let letter = boardRow[i];
        let counts = letterCount[letter]

        let selector = '[data-value="' + boardRow[i] + '"]';
        let key = document.querySelector(selector);

        boxes[i].classList.add('wrong');

        if (!key.classList.contains('correct') && !key.classList.contains('discovered')) {
            key.classList.add('wrong');
        }
    }
}

function checkDiscovered(boardRow, word, boxes) {
    for (let i = 0; i < boardRow.length; i++) {
        let letter = boardRow[i];
        let counts = letterCount[letter]

        let selector = '[data-value="' + boardRow[i] + '"]';
        let key = document.querySelector(selector);

        if (word.includes(letter) && counts[0] < counts[1] && !boxes[i].classList.contains('correct')) {
            boxes[i].classList.add('discovered');
            boxes[i].classList.remove('wrong');

            letterCount[letter][0] += 1;

            if (!key.classList.contains('correct')) {
                key.classList.remove('wrong');
                key.classList.add('discovered');
            }
        }
    }
}

function checkCorrect(boardRow, word, boxes) {
    for (let i = 0; i < boardRow.length; i++) {
        let letter = boardRow[i];
        let counts = letterCount[letter]

        let selector = '[data-value="' + boardRow[i] + '"]';
        let key = document.querySelector(selector);

        if (letter == word[i] && counts[0] < counts[1]) {
            boxes[i].classList.add('correct');
            key.classList.add('correct');
            key.classList.remove('discovered');

            key.classList.remove('wrong');
            boxes[i].classList.remove('wrong');

            letterCount[letter][0] += 1;
        }
    }
}

function readInput(key) {
    str = key.toUpperCase();

    if (won) return;

    if (isLetter(str) && currentBox < 6) {
        board[currentRow][currentBox] = str
        updateBoard();
        currentBox += 1;
    } else if (str == 'ENTER' && currentBox == 6 && board[currentRow].join('').toLowerCase() in words) {
        checkRow(currentRow);
        currentRow += 1;
        currentBox = 0;
    } else if (str == 'BACKSPACE' && currentBox > 0) {
        currentBox -= 1;
        board[currentRow][currentBox] = ' ';
        updateBoard();
    }
}

function isLetter(str) {
    return str.length === 1 && str.match(/[a-z]/i);
}

async function getDict() {
    let dictUrl = 'https://raw.githubusercontent.com/dwyl/english-words/master/words_alpha.txt'
    let response = await fetch(dictUrl);
    let text = await response.text();
    text.split('\n').map(word => word.trim())
        .forEach(word => words[word] = null);
}


let page = document.querySelector('body');

page.addEventListener('keydown', e => {
    readInput(e.key);
});

let keyboard = document.querySelector('.keyboard_container');

keyboard.addEventListener('click', e => {
    if (e.target.nodeName != "BUTTON" && e.target.nodeName != "SPAN") return;

    key = e.target.dataset.value;

    readInput(key);
});

initializeBoard();
getDict();
drawBoard();
