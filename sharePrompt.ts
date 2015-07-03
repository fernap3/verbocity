interface SharePromptOptions
{
	Container: HTMLElement;
	OnCloseCallback: () => void;
}

class SharePrompt
{
	private options: SharePromptOptions;
	private textInput: HTMLInputElement;
	private overlay: HTMLElement;
	private onOverlayClick: (MouseEvent) => void;
	private puzzle: Puzzle;
	
	constructor (options: SharePromptOptions)
	{
		this.options = options;
		this.textInput = <HTMLInputElement>this.options.Container.querySelector("input[type='text']");
		
		this.overlay = document.createElement("div");
		this.overlay.className = "clearOverlay";
		
		this.onOverlayClick = (MouseEvent) => {
			this.Close();
		}
		
		(<HTMLElement>this.options.Container.querySelector("input[type='checkbox'] + label")).onclick = (evt: MouseEvent) =>
		{
			// Wrapped in setTimeout so the checkbox value will reflect the new state
			setTimeout(() => { this.textInput.value = this.GetShareLink(); }, 0);			
		};
	}
	
	Show ()
	{
		this.textInput.value = this.GetShareLink();
		document.body.appendChild(this.overlay);
		this.options.Container.style.display = "block";
		Centerer.CenterContainers();
		
		// Add the click listener in a different "thread" so the click to open
		// the share prompt doesn't also trigger this.
		setTimeout(() => {
			this.overlay.addEventListener("click", this.onOverlayClick );
		}, 0);
	}
	
	Close ()
	{
		this.overlay.removeEventListener("click", this.onOverlayClick );
		this.options.Container.style.display = "none";
		document.body.removeChild(this.overlay);
		this.options.OnCloseCallback();
	}
	
	GetShareLink (): string
	{
		if (this.IsShareThisPuzzle() === false)
		{
			return "http://verbo.city";			
		}
		
		return "http://verbo.city#puzzle=" + this.puzzle.Id;	
	}
	
	SetPuzzle (puzzle: Puzzle)
	{
		this.puzzle = puzzle;
	}
	
	private IsShareThisPuzzle ()
	{
		return (<HTMLInputElement>this.options.Container.querySelector("input[type='checkbox']")).checked;
	}
}