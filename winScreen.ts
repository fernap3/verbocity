interface WinScreenOptions
{
	WinScreen: HTMLElement;
	Puzzle: Puzzle;
	OnCloseCallback: () => void;
}

class WinScreenElements
{
	PuzzleCanvas: HTMLCanvasElement;
	CompleteMessage: HTMLDivElement;
	ClickAnywhereMessage: HTMLDivElement;
	PuzzleTitle: HTMLDivElement;
	
	constructor (container: HTMLElement)
	{
		this.PuzzleCanvas = <HTMLCanvasElement>container.querySelector("canvas");
		this.CompleteMessage = <HTMLDivElement>container.querySelector(".completeMessage");
		this.ClickAnywhereMessage = <HTMLDivElement>container.querySelector(".clickAnywhereMessage");
		this.PuzzleTitle = <HTMLDivElement>container.querySelector(".puzzleTitle");
	}
}

class WinScreen
{
	private options: WinScreenOptions;
	private onDocumentClick: (evt: MouseEvent) => void;
	private afterFadeToWhite: () => void;
	private elements: WinScreenElements;
	
	constructor (options: WinScreenOptions)
	{
		this.options = options;
		this.elements = new WinScreenElements(this.options.WinScreen);
		
		(<HTMLElement>this.options.WinScreen.querySelector(".puzzleTitle")).innerHTML = this.options.Puzzle.Name;
		new PreviewRenderer(<HTMLCanvasElement>this.options.WinScreen.querySelector("canvas")).UpdatePreview(this.options.Puzzle.Definition);
		
		this.onDocumentClick = (evt: MouseEvent) => {
			this.Close();
		};
		
		this.afterFadeToWhite = () => {
			this.BeginAnimations();
		};
		
		setTimeout(() => {
			document.body.addEventListener("click", this.onDocumentClick);
		}, 0);
		
		// Position the canvas just off the right of the screen
		var puzzleCanvasBounds = this.elements.PuzzleCanvas.getBoundingClientRect();
		this.elements.PuzzleCanvas.style.left = window.innerWidth - puzzleCanvasBounds.left + "px";
		this.elements.PuzzleCanvas.classList.remove("animate");
		
		// Position the "Complete!" message div just off the bottom of the screen
		var completeMessageBounds = this.elements.CompleteMessage.getBoundingClientRect();
		this.elements.CompleteMessage.style.top = window.innerHeight - completeMessageBounds.top + "px";
		this.elements.CompleteMessage.classList.remove("animate");
		
		this.elements.ClickAnywhereMessage.style.display = "none";
		this.elements.PuzzleTitle.style.display = "none";
	}
	
	Show ()
	{
		this.FadeToWhite(this.afterFadeToWhite);
	}
	
	private FadeToWhite (callback: () => void)
	{
		var winScreen = this.options.WinScreen;
		winScreen.style.opacity = "0";
		winScreen.style.display = "block";
		Centerer.CenterContainers();
		
		var transitionEndHandler = (evt: TransitionEvent) => {
			winScreen.removeEventListener("transitionend", transitionEndHandler);
			callback();
		}
		
		winScreen.addEventListener("transitionend", transitionEndHandler);
		
		// For some reason, if the opacity change happens in this "thread,"
		// the animation doesn't work.  I'd like to know why??
		setTimeout(() => { winScreen.style.opacity = "1"; }, 0);
	}
	
	private BeginAnimations ()
	{
		this.elements.CompleteMessage.classList.add("animate");
		this.elements.PuzzleCanvas.classList.add("animate");
		
		setTimeout(() => {
			this.elements.ClickAnywhereMessage.style.display = "";
			this.elements.PuzzleTitle.style.display = "";
		}, "3000");
	}
	
	private Close ()
	{
		document.body.removeEventListener("click", this.onDocumentClick);
		this.options.WinScreen.style.display = "none";
		this.options.OnCloseCallback();
	}
}