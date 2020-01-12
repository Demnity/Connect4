var main = function() {
	const board = new Board('#board')
	console.log('hello')
}

var i = 0;


$(document).ready(function(){
    main();
    $("[col]").mouseenter(function(event) {
        let colValue = event.target.getAttribute("col");
        $("[row = 0][col="+colValue+"]").css("border-color", "turquoise");
    });
    $("[col]").mouseout(function(event) {
        let colValue = event.target.getAttribute("col");
        $("[row = 0][col="+colValue+"]").css("border-color", "transparent");
    });
});

