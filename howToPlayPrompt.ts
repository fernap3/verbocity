interface HowToPlayPromptOptions
{
	Container: HTMLElement;
	OnCloseCallback: () => void;
}

/** Controls the "How to Play" dialog */
class HowToPlayPrompt
{
	private options: HowToPlayPromptOptions;
	private overlay: HTMLElement;
	private onOverlayClick: (MouseEvent) => void;
	
	constructor (options: HowToPlayPromptOptions)
	{
		this.options = options;
		
		this.overlay = document.createElement("div");
		this.overlay.className = "clearOverlay";
		
		this.onOverlayClick = (MouseEvent) => {
			this.Hide();
		}
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
	
	Hide ()
	{
		this.overlay.removeEventListener("click", this.onOverlayClick );
		this.options.Container.style.display = "none";
		document.body.removeChild(this.overlay);
		this.options.OnCloseCallback();
	}
}