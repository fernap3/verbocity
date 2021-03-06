declare var Origami:any;
declare var Switchery: any;

/**
 * The main entry point for the game.  Connects the main menu to other
 * places in the game.
 */
class Game
{
	static isTouchDevice: boolean;
	private page: HTMLElement;
	private mainMenu: MainMenu;
	private engine: Engine;
	private playArea: HTMLElement;
	private puzzleChooser: PuzzleChooser;
	private howToPlayPrompt: HowToPlayPrompt;
	private currentPuzzle: Puzzle;
	private mainMenuSoundHandle: string;
	
	/** Images that we need to appear responsively on user input are preloaded
	 * in anticipation of them actually being needed. */
	private static imagesToPreload = ["images/flag.svg", "images/unsolvedpuzzlepreview.svg", "images/stockPenalty.svg",
		"images/checked.svg", "images/unchecked.svg"];
	private static soundsToPreload = [ Sounds.MainMenu ];
	
	constructor (page: HTMLElement)
	{
		this.page = page;
		
		this.engine = new Engine({
			Page: document.getElementById("PlayArea"),
			OnWinCallback: () => {
				location.hash = "";
				SaveDataProvider.AddSolvedPuzzleId(this.currentPuzzle.Id);
				this.HidePlayArea();
				this.mainMenu.Show();
			},
			OnLoseCallback: () => {
				location.hash = "";
				this.HidePlayArea();
				this.mainMenu.Show();
			},
			OnQuitCallback: () => {
				location.hash = "";
				this.HidePlayArea();
				this.mainMenu.Show();
			}
		});
		
		this.mainMenu = new MainMenu({
			MenuContainer: document.getElementById("MainMenu"),
			OnJustPlayCallback: () => {
				this.mainMenu.Hide();
				this.StartJustPlay();
			},
			OnChoosePuzzleCallback: () => { this.ShowPuzzleChooser(); },
			OnHowToPlayCallback: () => { this.ShowHowToPlay(); }
		});
		
		this.puzzleChooser = new PuzzleChooser({
			Container: document.getElementById("PuzzleChooser"),
			Puzzles: PuzzleProvider.BuiltinPuzzles,
			OnCloseCallback: () => {},
			OnPuzzleSelectCallback: (puzzle) => {
				this.puzzleChooser.Hide();
				this.mainMenu.Hide();
				this.StartPuzzle(puzzle);
			}
		});
		
		this.howToPlayPrompt = new HowToPlayPrompt({
			Container: document.getElementById("HowToPlayPrompt"),
			OnCloseCallback: () => {}
		});
		
		this.playArea = document.getElementById("PlayArea");
		
		Game.isTouchDevice = "ontouchstart" in document.documentElement;
		
		if (Game.isTouchDevice === true)
		{
			document.body.classList.add("touch");
			
			// Show the "flag mode" switch, allowing the user to toggle
			// what happens when tapping on a cell
			var markModeSwitchContainer = <HTMLElement>document.querySelector("#MarkModeSwitchContainer");
			markModeSwitchContainer.style.display = "block";
			
			var markModeSwitch = document.querySelector("#MarkModeSwitch");
			var switchInstance = new Switchery(markModeSwitch);
			
			var markModeSwitchLabel = <HTMLElement>document.querySelector("#MarkModeSwitchContainer > label");			
			
			markModeSwitchLabel.addEventListener("touchstart", (evt: Event) => {
				switchInstance.setPosition(true);
			});
			
			Game.PreventBounceScroll();
			
			// When on a touch device, we want to instruct the user to "touch," not "click"
			Game.ReplaceClickText();
		}
		
		Centerer.SetupResizeHandler();
	}
	
	/**
	 * Replaces instances of the word "click" in the DOM with the word "touch"
	 */
	private static ReplaceClickText()
	{
		var clickTextElements = document.querySelectorAll("[data-clicktext]");
		
		for (var i = 0; i < clickTextElements.length; i++)
		{
			(<HTMLElement>clickTextElements[i]).innerHTML = "Touch";
		}
	}
	
	Begin ()
	{
		document.getElementById("AppPreloader").style.display = "block";
		
		Game.PreloadImages(Game.imagesToPreload);
		AudioManager.PreloadSounds(Game.soundsToPreload, () => {
			document.getElementById("AppPreloader").style.display = "none";
			
			// If the user has loaded the page with a shared puzzle in the URL,
			// jump right to the game without showing the main menu.
			var sharedPuzzle = this.GetPuzzleFromUrl();
			
			if (sharedPuzzle !== null)
			{
				this.StartPuzzle(sharedPuzzle);
				return;
			}
			
			this.mainMenuSoundHandle = AudioManager.Play(Sounds.MainMenu);
			
			this.mainMenu.Show();
		});
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
		AudioManager.Stop(this.mainMenuSoundHandle);
		this.ShowPlayArea();
		
		var puzzle = PuzzleProvider.GetRandomBuiltinPuzzle();
		this.currentPuzzle = puzzle;
		this.engine.SetPuzzle(puzzle);
		this.engine.StartGame();
	}
	
	private StartPuzzle (puzzle: Puzzle)
	{
		AudioManager.Stop(this.mainMenuSoundHandle);
		this.ShowPlayArea();
		
		this.currentPuzzle = puzzle;
		this.engine.SetPuzzle(puzzle);
		this.engine.StartGame();
	}
	
	private ShowPuzzleChooser ()
	{
		this.puzzleChooser.Show();
	}
	
	private ShowHowToPlay ()
	{
		this.howToPlayPrompt.Show();
	}
	
	private ShowPlayArea ()
	{
		this.playArea.style.display = "block";		
	}
	
	private HidePlayArea ()
	{
		this.playArea.style.display = "none";		
	}
	
	private GetPuzzleFromUrl (): Puzzle
	{
		var builtInPuzzleId = Game.GetUrlParameter("puzzle");
		
		if (builtInPuzzleId !== null)
		{
			return PuzzleProvider.GetBuiltinPuzzle(builtInPuzzleId);
		}
			
		return null;
	}
	
	private static GetUrlParameter (name: String)
	{
		name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
		var regex = new RegExp("[\\#&]" + name + "=([^&#]*)"), results = regex.exec(location.hash);
		return results === null ? null : decodeURIComponent(results[1].replace(/\+/g, " "));
	}
	
	private static PreventBounceScroll ()
	{
		document.addEventListener("touchmove", (evt: TouchEvent) =>
		{
			var element = <HTMLElement>evt.target;
			
			while (element !== null && element.classList.contains("scrollable") === false)
			{
				element = element.parentElement;
			}
			
			if (element === null)
			{
				evt.preventDefault();
			}
		});	
	}
}

new Game(document.body).Begin();
Origami.fastclick(document.body);
