interface PausePromptOptions
{
	Container: HTMLElement;
	OnCloseCallback: () => void;
}

/** Controls the pause screen */
class PausePrompt
{
	private options: PausePromptOptions;
	private overlay: HTMLElement;
	private onDocumentClick: (evt: MouseEvent) => void;
	
	constructor (options: PausePromptOptions)
	{
		this.options = options;
		
		this.overlay = document.createElement("div");
		this.overlay.className = "clearOverlay";
		
		this.onDocumentClick = (MouseEvent) => {
			this.Hide();
		}
	}
	
	Show ()
	{
		document.body.appendChild(this.overlay);
		this.options.Container.style.display = "block";
		Centerer.CenterContainers();
		
		setTimeout(() =>{
			document.addEventListener("click", this.onDocumentClick);
		}, 0);
	}
	
	Hide ()
	{
		document.removeEventListener("click", this.onDocumentClick);
		document.body.removeChild(this.overlay);
		this.options.Container.style.display = "none";
		this.options.OnCloseCallback();
	}
	
	OnDocumentClick (evt: MouseEvent)
	{
		this.Hide();
	}
}