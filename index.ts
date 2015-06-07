/* global Puzzles */

var engine = new Engine({
	Page: document,
	Puzzle: window.Puzzles["Game Boy"],
	OnTimerUpdateCallback: UpdateTimerDisplay
});

engine.StartGame();

function UpdateTimerDisplay(seconds)
{
	var timeString = "";
	
	if (seconds < 60 * 10)
	{
		timeString += "0";
	}
	
	timeString += Math.floor(seconds / 60);
	
	timeString += ":";
	
	if (seconds % 60 < 10)
	{
		timeString += "0";
	}
	
	timeString += Math.floor(seconds % 60);
	
	var timerDiv = document.querySelector("#Timer");
	timerDiv.innerHTML = timeString;
}