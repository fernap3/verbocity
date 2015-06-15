interface PuzzleChooserOptions
{
	Container: HTMLElement;
	OnCloseCallback: () => void;
}

class PuzzleChooser
{
	private options: PuzzleChooserOptions;
	private textInput: HTMLInputElement;
	private overlay: HTMLElement;
	private onOverlayClick: (MouseEvent) => void;
	
	constructor (options: PuzzleChooserOptions)
	{
		this.options = options;
		
		this.overlay = document.createElement("div");
		this.overlay.className = "clearOverlay";
		
		this.onOverlayClick = (MouseEvent) => {
			this.Close();
		}
		
		var builtinTabButton = <HTMLElement>this.options.Container.querySelector("button[data-tab='builtin']");
		var customTabButton = <HTMLElement>this.options.Container.querySelector("button[data-tab='custom']");
		var builtinTab = <HTMLElement>this.options.Container.querySelector("div[data-tab='builtin']");
		var customTab = <HTMLElement>this.options.Container.querySelector("div[data-tab='custom']");
		
		builtinTabButton.onclick = (evt) => {
			customTab.style.display = "none";
			builtinTab.style.display = "block";
		};
		
		customTabButton.onclick = (evt) => {
			customTab.style.display = "block";
			builtinTab.style.display = "none";
		};
	}
	
	Show ()
	{
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
}