interface WinScreenOptions
{
	WinScreen: HTMLElement;
	Puzzle: Puzzle;
	OnCloseCallback: () => void;
}

class WinScreen
{
	private options: WinScreenOptions;
	private onDocumentClick: (evt: MouseEvent) => void;
	
	constructor (options: WinScreenOptions)
	{
		this.options = options;
		(<HTMLElement>this.options.WinScreen.querySelector(".puzzleTitle")).innerHTML = this.options.Puzzle.Name;
		new PreviewRenderer(<HTMLCanvasElement>this.options.WinScreen.querySelector("canvas")).UpdatePreview(this.options.Puzzle.Definition);
		
		this.onDocumentClick = (evt: MouseEvent) => {
			this.Close();
		}
		
		setTimeout(() => {
			document.body.addEventListener("click", this.onDocumentClick);
		}, 0);		
	}
	
	Show ()
	{
		this.FadeToWhite(this.ShowCompleteMessage);
	}
	
	private FadeToWhite (callback: () => void)
	{
		var winScreen = this.options.WinScreen;
		winScreen.style.opacity = "0";
		winScreen.style.display = "block";
		Centerer.CenterContainers();
		
		winScreen.addEventListener("transitionend", (evt) => {
			callback();
		});
		
		// For some reason, if the opacity change happens in this "thread,"
		// the animation doesn't work.  I'd like to know why??
		setTimeout(() => { winScreen.style.opacity = "1"; }, 0);
	}
	
	private ShowCompleteMessage ()
	{
	}
	
	private Close ()
	{
		document.body.removeEventListener("click", this.onDocumentClick);
		this.options.WinScreen.style.display = "none";
		this.options.OnCloseCallback();
	}
}