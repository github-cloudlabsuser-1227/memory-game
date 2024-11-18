window.onload = function () {
    const gameBoard = document.getElementById('game-board');
    const winMessage = document.createElement('div');
    winMessage.id = 'win-message';
    winMessage.innerText = 'You Win!';
    document.body.appendChild(winMessage);
    let cards = [];

    function initializeGame() {
        fetch('/get-symbols')
            .then(response => response.json())
            .then(symbols => {
                cards = [];
                gameBoard.innerHTML = ''; // Clear the game board

                // Create two cards for each symbol
                symbols.forEach(symbol => {
                    for (let i = 0; i < 2; i++) {
                        const card = document.createElement('div');
                        card.className = 'card';
                        card.dataset.symbol = symbol.name;
                        card.style.backgroundImage = `url(${symbol.image})`;
                        card.style.backgroundSize = 'cover';
                        card.addEventListener('click', flipCard);
                        cards.push(card);
                    }
                });

                shuffle(cards);
                cards.forEach(card => {
                    gameBoard.appendChild(card);
                });
            });
    }

    function shuffle(array) {
        // Shuffle the array using the Fisher-Yates algorithm
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    let flippedCards = [];
    function flipCard() {
        if (flippedCards.length < 2 && !this.classList.contains('flipped') && !this.classList.contains('matched')) {
            this.classList.add('flipped');
            flippedCards.push(this);

            if (flippedCards.length === 2) {
                setTimeout(checkMatch, 1000);
            }
        }
    }

    function checkMatch() {
        const [card1, card2] = flippedCards;

        // Check if the two flipped cards have the same symbol (Objective 3)
        if (card1.dataset.symbol === card2.dataset.symbol) {
            card1.classList.add('matched');
            card2.classList.add('matched');
        } else {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
        }

        flippedCards = [];
        checkWin();
    }

    function checkWin() {
        // Check if all cards are matched (Objective 4)
        if (cards.every(card => card.classList.contains('matched'))) {
            winMessage.style.display = 'block';
            setTimeout(() => {
                winMessage.style.display = 'none';
                initializeGame(); // Restart the game
            }, 2000);
        }
    }

    initializeGame();
};