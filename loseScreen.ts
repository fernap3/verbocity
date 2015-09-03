interface LoseScreenOptions
{
	LoseScreen: HTMLElement;
	OnCloseCallback: () => void;
}

class LoseScreenElements
{
	ClickAnywhereMessage: HTMLDivElement;
	
	constructor (container: HTMLElement)
	{
		this.ClickAnywhereMessage = <HTMLDivElement>container.querySelector(".clickAnywhereMessage");
	}
}

class LoseScreen
{
	private options: LoseScreenOptions;
	private onDocumentClick: (evt: MouseEvent) => void;
	private afterFadeToWhite: () => void;
	private elements: LoseScreenElements;
	
	constructor (options: LoseScreenOptions)
	{
		this.options = options;
		this.elements = new LoseScreenElements(this.options.LoseScreen);
		
		this.onDocumentClick = (evt: MouseEvent) => {
			this.Close();
		};
		
		this.afterFadeToWhite = () => {
			this.BeginAnimations();
		};
		
		this.elements.ClickAnywhereMessage.style.display = "none";
	}
	
	Show ()
	{
		this.FadeToWhite(this.afterFadeToWhite);
	}
	
	private FadeToWhite (callback: () => void)
	{
		var loseScreen = this.options.LoseScreen;
		loseScreen.style.opacity = "0";
		loseScreen.style.display = "block";
		Centerer.CenterContainers();
		
		var transitionEndHandler = (evt: TransitionEvent) => {
			loseScreen.removeEventListener("transitionend", transitionEndHandler);
			callback();
		}
		
		loseScreen.addEventListener("transitionend", transitionEndHandler);
		
		// For some reason, if the opacity change happens in this "thread,"
		// the animation doesn't work.  I'd like to know why??
		setTimeout(() => { loseScreen.style.opacity = "1"; }, 0);
	}
	
	private BeginAnimations ()
	{
		setTimeout(() => {
			this.elements.ClickAnywhereMessage.style.display = "";			
			document.body.addEventListener("click", this.onDocumentClick);
		}, "3000");
	}
	
	private Close ()
	{
		document.body.removeEventListener("click", this.onDocumentClick);
		this.options.LoseScreen.style.display = "none";
		this.options.OnCloseCallback();
	}
}