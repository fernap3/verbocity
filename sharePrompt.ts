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
	private onDocumentClick: (MouseEvent) => void;
	
	constructor (options: SharePromptOptions)
	{
		this.options = options;
		this.textInput = <HTMLInputElement>this.options.Container.querySelector("input");
		
		this.overlay = document.createElement("div");
		this.overlay.className = "clearOverlay";
		
		this.onDocumentClick = (MouseEvent) => {
			this.Close();
		}
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
			document.body.addEventListener("click", this.onDocumentClick );
		}, 0);
	}
	
	Close ()
	{
		document.body.removeEventListener("click", this.onDocumentClick );
		this.options.Container.style.display = "none";
		document.body.removeChild(this.overlay);
		this.options.OnCloseCallback();
	}
	
	GetShareLink (): string
	{
		return "http://verbo.city";
	}
}