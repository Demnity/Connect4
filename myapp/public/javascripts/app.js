var main = function() {
	const board = new Board('#board');
	const playerB = new Player("rgb(48, 207, 160)", "Player 2");
	const playerA = new Player("rgb(218, 187, 53)", "Player 1");
	const game = new Game(0, board, playerA, playerB, '#timer');
}

$(document).ready(main)

