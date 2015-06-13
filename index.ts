var engine = new Engine({
	Page: document.body,
	Puzzle: Puzzles["Test"],
	OnWinCallback: () => { console.log("WIN"); },
	OnLoseCallback: () => { console.log("LOSE"); }
});

engine.StartGame();


