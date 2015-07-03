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
		
		(<HTMLElement>this.options.Container.querySelector("#ShareThisPuzzle + label")).onclick = (evt: MouseEvent) =>
		{
			this.textInput.value = this.GetShareLink(true);		
		};
		
		(<HTMLElement>this.options.Container.querySelector("#ShareTheApp + label")).onclick = (evt: MouseEvent) =>
		{
			this.textInput.value = this.GetShareLink(false);		
		};
		
		(<HTMLElement>this.options.Container.querySelector("img[data-action='facebook']")).onclick = (evt: MouseEvent) =>
		{
			// Share to Faceboook
			
			//var facebookLink = "https://www.facebook.com/dialog/feed?";
			//facebookLink += "app_id=";
			//facebookLink += "display=popup";
			//facebookLink += "caption=" + encodeURIComponent("example caption");
			//facebookLink += "link=" + encodeURIComponent("http://verbo.city");
			//facebookLink += "redirect_uri=" + encodeURIComponent("");
			
			var facebookLink = "https://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent(this.textInput.value);
			window.open(facebookLink);
		};
		
		(<HTMLElement>this.options.Container.querySelector("img[data-action='twitter']")).onclick = (evt: MouseEvent) =>
		{
			// Share to Twitter
			var twitterLink = "https://twitter.com/intent/tweet?";
			twitterLink += "text=" + encodeURIComponent("Check out verbocity!");
			twitterLink += "&url=" + encodeURIComponent(this.textInput.value);
			twitterLink += "&hashtags=" + encodeURIComponent("verbocity");
			window.open(twitterLink);
		};
		
		(<HTMLElement>this.options.Container.querySelector("img[data-action='email']")).onclick = (evt: MouseEvent) =>
		{
			// Share via email
			var emailLink = "mailto:myfriend@example.com?subject=" + encodeURIComponent("Check out verbocity") +
				"&body=" + encodeURIComponent(this.textInput.value);
			window.location.assign(emailLink);
		};
	}
	
	Show ()
	{
		this.textInput.value = this.GetShareLink(true);
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
	
	GetShareLink (sharePuzzle: Boolean): string
	{
		if (sharePuzzle === false)
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
		return (<HTMLInputElement>this.options.Container.querySelector("input[type='radio']")).checked;
	}
}