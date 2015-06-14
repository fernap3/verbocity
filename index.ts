//@import "MainMenu.ts"

class Game
{
	private page: HTMLElement;
	private mainMenu: MainMenu;
	private engine: Engine;
	private playArea: HTMLElement;
	
	constructor (page: HTMLElement)
	{
		this.page = page;
		
		this.engine = new Engine({
			Page: document.getElementById("PlayArea"),
			OnWinCallback: () => { console.log("WIN"); },
			OnLoseCallback: () => { console.log("LOSE"); }
		});
		
		this.playArea = document.getElementById("PlayArea");
		
		Centerer.SetupResizeHandler();
	}
	
	Begin ()
	{
		this.mainMenu = new MainMenu({
			MenuContainer: document.getElementById("MainMenu"),
			OnJustPlayCallback: () => { this.StartJustPlay(); }
		});
		
		this.mainMenu.Show();
	}
	
	// Choose a random puzzle from the list to play
	StartJustPlay ()
	{
		this.mainMenu.Hide();
		this.playArea.style.display = "block";
		
		this.engine.SetPuzzle(Puzzles["Game Boy"]);
		this.engine.StartGame();
	}
}

new Game(document.body).Begin();

