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
				let color = $colNext.css('border-top-color')
				if(color == 'rgb(255, 255, 255)'){
					setTimeout(function(){
						$col.css('border-color', 'turquoise')
					}, i*100)
					setTimeout(function(){
						$col.css('border-color', 'white')
					}, i*100 + 100)
				}
				else {
					setTimeout(function(){
						$col.css('border-color', 'turquoise')
					}, i*100)
					return true;
				}
			}
			return false;
		}

		$("[col]").mouseenter(function(event) {
        	let colValue = event.target.getAttribute("col");
        	$("[row = 0][col="+colValue+"]").css("border-color", "turquoise");
   		});

   		$("[col]").mouseout(function(event) {
        	let colValue = event.target.getAttribute("col");
        	$("[row = 0][col="+colValue+"]").css("border-color", "transparent");
   		});

   		$("[col]").click(function(event){
   			let colValue = event.target.getAttribute("col");
   			let rowValue = event.target.getAttribute("row");
   			let emptyRing = dropAnimation(colValue);
   			console.log(emptyRing)
   		})
	}

	
} 