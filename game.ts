//@import "MainMenu.ts"

class Game
{
	private page: HTMLElement;
	private mainMenu: MainMenu;
	private engine: Engine;
	private playArea: HTMLElement;
	private puzzleChooser: PuzzleChooser;
	private currentPuzzle: Puzzle;
	
	constructor (page: HTMLElement)
	{
		this.page = page;
		
		this.engine = new Engine({
			Page: document.getElementById("PlayArea"),
			OnWinCallback: () => { SaveDataProvider.AddSolvedPuzzleId(this.currentPuzzle.Id); },
			OnLoseCallback: () => { console.log("LOSE"); },
			OnQuitCallback: () => { this.HidePlayArea(); this.mainMenu.Show(); }
		});
		
		this.puzzleChooser = new PuzzleChooser({
			Container: document.getElementById("PuzzleChooser"),
			Puzzles: PuzzleProvider.BuiltinPuzzles,
			OnCloseCallback: () => {},
			OnPuzzleSelectCallback: (puzzle) => {
				this.puzzleChooser.Hide();
				this.StartPuzzle(puzzle);
			}
		});
		
		this.playArea = document.getElementById("PlayArea");
		
		Centerer.SetupResizeHandler();
	}
	
	Begin ()
	{
		this.mainMenu = new MainMenu({
			MenuContainer: document.getElementById("MainMenu"),
			OnJustPlayCallback: () => { this.StartJustPlay(); },
			OnChoosePuzzleCallback: () => { this.ShowPuzzleChooser(); }
		});
		
		this.mainMenu.Show();
	}
	
	// Choose a random puzzle from the list to play
	private StartJustPlay ()
	{
		this.mainMenu.Hide();
		this.ShowPlayArea();
		
		this.engine.SetPuzzle(PuzzleProvider.GetRandomBuiltinPuzzle());
		this.engine.StartGame();
	}
	
	private StartPuzzle (puzzle: Puzzle)
	{
		this.mainMenu.Hide();
		this.ShowPlayArea();
		
		this.currentPuzzle = puzzle;
		this.engine.SetPuzzle(puzzle);
		this.engine.StartGame();
	}
	
	private ShowPuzzleChooser ()
	{
		this.puzzleChooser.Show();
	}
	
	private ShowPlayArea ()
	{
		this.playArea.style.display = "block";		
	}
	
	private HidePlayArea ()
	{
		this.playArea.style.display = "none";		
	}
}

new Game(document.body).Begin();

