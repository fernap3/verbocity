//@import "MainMenu.ts"

class Game
{
	private page: HTMLElement;
	private mainMenu: MainMenu;
	private engine: Engine;
	private playArea: HTMLElement;
	private puzzleChooser: PuzzleChooser;
	private currentPuzzle: Puzzle;
	
	// Images that we need to appear responsively on user input are preloaded
	// in anticipation of them actually being needed.
	private static imagesToPreload = ["flag.svg", "unsolvedpuzzlepreview.svg"];
	
	constructor (page: HTMLElement)
	{
		this.page = page;
		
		this.engine = new Engine({
			Page: document.getElementById("PlayArea"),
			OnWinCallback: () => { SaveDataProvider.AddSolvedPuzzleId(this.currentPuzzle.Id); },
			OnLoseCallback: () => { this.HidePlayArea(); this.mainMenu.Show(); },
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
		Game.PreloadImages(Game.imagesToPreload);
	}
	
	private static PreloadImages (urls: string[])
	{
		for (var i = 0; i < urls.length; i++)
		{
			var image = new Image();
			image.src = urls[i];
		}
	}
	
	// Choose a random puzzle from the list to play
	private StartJustPlay ()
	{
		this.mainMenu.Hide();
		this.ShowPlayArea();
		
		var puzzle = PuzzleProvider.GetRandomBuiltinPuzzle();
		this.currentPuzzle = puzzle;
		this.engine.SetPuzzle(puzzle);
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

