var engine = new Engine({
	Page: document.body,
	Puzzle: Puzzles["Test"],
	OnWinCallback: () => { console.log("WIN"); },
	OnLoseCallback: () => { console.log("LOSE"); }
});

engine.StartGame();

VerticallyCenterPlayArea();

window.onresize = (evt) => {
	VerticallyCenterPlayArea();
}

function VerticallyCenterPlayArea ()
{
	var playArea = document.getElementById("PlayArea");
	var playAreaHeight = playArea.offsetHeight;
	
	playArea.style.top = Math.max((window.innerHeight / 2) - (playAreaHeight / 2) , 0) + "px";
}