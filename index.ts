var engine = new Engine({
	Page: document.body,
	//Puzzle: Puzzles.Random(15),
	Puzzle: Puzzles["Game Boy"],
	OnWinCallback: () => { console.log("WIN"); },
	OnLoseCallback: () => { console.log("LOSE"); }
});

engine.StartGame();

CenterPlayArea();

window.onresize = (evt) => {
	CenterPlayArea();
}

function CenterPlayArea ()
{
	var playArea = document.getElementById("PlayArea");
	var playAreaHeight = playArea.offsetHeight;
	var playAreaWidth = playArea.offsetWidth;
	
	playArea.style.top = Math.max((window.innerHeight / 2) - (playAreaHeight / 2) , 0) + "px";
	playArea.style.left = Math.max((window.innerWidth / 2) - (playAreaWidth / 2) , 0) + "px";
}