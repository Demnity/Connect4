class Board {
	constructor(board){
		this.row = 6
		this.col = 7
		this.board = board
		this.createBoard()
	}

	createBoard() {
		var $board = $(this.board)
		for(let i = 0; i < this.row; i++){
			var $row = $('<div>').addClass('row')
			for(let j = 0; j < this.col; j++){
				var $col = $('<div>').addClass('col')
				$row.append($col)
			}
			$board.append($row)
		}
	}
} 