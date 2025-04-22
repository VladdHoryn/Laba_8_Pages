let state = {
    players: 1,
    names: ["Гравець 1", "Гравець 2"],
    rows: 4,
    cols: 4,
    difficulty: "easy",
    time: 180,
    moves: [0, 0],
    pairs: [0, 0],
    currentPlayer: 0,
    flipped: [],
    cards: [],
    timer: null
};

document.getElementById('playersSelect').addEventListener('change', e => {
    state.players = parseInt(e.target.value);
    document.getElementById('namesBlock').style.display = state.players === 2 ? 'block' : 'none';
});

function resetSettings() {
    document.getElementById('playersSelect').value = "1";
    document.getElementById('player1Name').value = "";
    document.getElementById('player2Name').value = "";
    document.getElementById('rows').value = 4;
    document.getElementById('cols').value = 4;
    document.getElementById('difficulty').value = "easy";
    document.querySelector('.board').innerHTML = "";
    document.querySelector('.stats').innerHTML = "";
}

function startGame() {
    state.players = parseInt(document.getElementById('playersSelect').value);
    state.names[0] = document.getElementById('player1Name').value || 'Гравець 1';
    state.names[1] = document.getElementById('player2Name').value || 'Гравець 2';
    state.rows = Math.max(4, parseInt(document.getElementById('rows').value));
    state.cols = Math.max(4, parseInt(document.getElementById('cols').value));
    state.difficulty = document.getElementById('difficulty').value;
    state.moves = [0, 0];
    state.pairs = [0, 0];
    state.currentPlayer = 0;
    state.flipped = [];

    let totalCards = state.rows * state.cols;
    let images = Array.from({length: totalCards / 2}, (_, i) => i+1).flatMap(i => [i, i]);
    state.cards = shuffle(images);

    document.querySelector('.board').style.gridTemplateColumns = `repeat(${state.cols}, 60px)`;
    document.querySelector('.board').innerHTML = state.cards.map((_, i) => `<div class="card" data-idx="${i}" onclick="flipCard(${i})">?</div>`).join('');
    updateStats();
    startTimer();
}

function shuffle(arr) {
    return arr.sort(() => Math.random() - 0.5);
}

function flipCard(index) {
    let cardEl = document.querySelectorAll('.card')[index];
    if (state.flipped.includes(index) || state.flipped.length === 2) return;

    cardEl.classList.add('flipped');
    cardEl.innerText = state.cards[index];
    state.flipped.push(index);

    if (state.flipped.length === 2) {
        setTimeout(checkPair, 600);
    }
}

function checkPair() {
    const [a, b] = state.flipped;
    const cards = document.querySelectorAll('.card');

    if (state.cards[a] === state.cards[b]) {
        cards[a].classList.add(`player${state.currentPlayer + 1}`);
        cards[b].classList.add(`player${state.currentPlayer + 1}`);
        state.pairs[state.currentPlayer]++;
    } else {
        cards[a].innerText = '?';
        cards[b].innerText = '?';
        cards[a].classList.remove('flipped');
        cards[b].classList.remove('flipped');
        if (state.players === 2) {
            state.currentPlayer = 1 - state.currentPlayer;
        }
    }
    state.moves[state.currentPlayer]++;
    state.flipped = [];
    updateStats();

    if (state.pairs.reduce((a,b)=>a+b) === state.cards.length/2) {
        clearInterval(state.timer);
        let winner = state.players === 2
            ? (state.pairs[0] > state.pairs[1] ? state.names[0] : state.names[1])
            : `${state.names[0]} завершив гру!`;
        alert(`Гру завершено! Переможець: ${winner}`);
    }
}

function updateStats() {
    const playerInfo = state.players === 2 ? `Хід: ${state.names[state.currentPlayer]}` : '';
    const scores = state.players === 2
        ? `<p>${state.names[0]}: Ходи ${state.moves[0]}, Пари ${state.pairs[0]}</p><p>${state.names[1]}: Ходи ${state.moves[1]}, Пари ${state.pairs[1]}</p>`
        : `<p>Ходи: ${state.moves[0]}</p>`;
    document.querySelector('.stats').innerHTML = `${playerInfo}${scores}`;
}

function startTimer() {
    const timeMap = { easy: 180, normal: 120, hard: 60 };
    state.time = timeMap[state.difficulty];
    clearInterval(state.timer);
    state.timer = setInterval(() => {
        state.time--;
        const playerInfo = state.players === 2 ? `Хід: ${state.names[state.currentPlayer]}` : '';
        const scores = state.players === 2
            ? `<p>${state.names[0]}: Ходи ${state.moves[0]}, Пари ${state.pairs[0]}</p><p>${state.names[1]}: Ходи ${state.moves[1]}, Пари ${state.pairs[1]}</p>`
            : `<p>Ходи: ${state.moves[0]}</p>`;
        document.querySelector('.stats').innerHTML = `${playerInfo}${scores}`;
        document.querySelector('.stats').innerHTML += `<p>Залишилось: ${state.time}s</p>`;
        if (state.time <= 0) {
            clearInterval(state.timer);
            alert('Час вийшов!');
        }
    }, 1000);
}