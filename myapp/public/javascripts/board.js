class Board {
	constructor(board){
		this.row = 7
		this.col = 7
		this.board = board
		this.createBoard()
		this.listenMouseEvent()
	}

	createBoard() {
		var $board = $(this.board)
		for(let i = 0; i < this.row; i++){
			var $row = $('<div>').addClass('row');
			for(let j = 0; j < this.col; j++){
				var $col = $('<div>').addClass('ring').attr("row", "" + i).attr("col", "" + j);

				if(i == 0){
					$col.attr("class", "top-ring");
				}

				$row.append($col)
			}
			$board.append($row)
		}
	}


	listenMouseEvent() {
		function findEmptyRing(colValue) {
			let col = $('[col='+colValue+']')
			for(let i = col.length - 1; i > 0; i--){
				if($(col[i]).css('border-top-color') == 'rgb(255, 255, 255)')
					return col[i]
			}
			return null
		}

		function dropAnimation(colValue) {
			let col = $('[col='+colValue+']')
			for(let i = 1; i < col.length; i++){
				let $colNext = $(col[i + 1])
				let $col = $(col[i])
				if(($colNext.css('border-top-color') == 'rgb(255, 255, 255)')){
					$col.css("border-color", "turquoise")
					setTimeout(function(){
						if(i == 0) $col.css('border-color', 'transparent')
						else $col.css('border-color', 'white')
					}, 500)
				}
				else {
					return $col;
					
				}
			}
			return null;
		}

		$("[col]").mouseenter(function(event) {
        	let colValue = event.target.getAttribute("col");
        	$("[row = 0][col="+colValue+"]").css("border-color", "turquoise");
        	let emptyRing = findEmptyRing(colValue)
        	console.log(emptyRing)
   		});

   		$("[col]").mouseout(function(event) {
        	let colValue = event.target.getAttribute("col");
        	$("[row = 0][col="+colValue+"]").css("border-color", "transparent");
   		});

   		$("[col]").click(function(event){
   			let colValue = event.target.getAttribute("col");
   			let rowValue = event.target.getAttribute("row");
   			let emptyRing = dropAnimation(colValue);
   			emptyRing.css("border-color", "black");
   		})
	}

	
} 