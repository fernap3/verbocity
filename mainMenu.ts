interface MainMenuOptions
{
	MenuContainer: HTMLElement;
	OnJustPlayCallback: () => void;
	OnChoosePuzzleCallback: () => void;
	OnHowToPlayCallback: () => void;
}

/** Controls the main menu */
class MainMenu
{
	private options: MainMenuOptions;
	private justPlayItem: HTMLUListElement;
	private choosePuzzleItem: HTMLUListElement;
	private howToPlayItem: HTMLUListElement;
	
	constructor (options: MainMenuOptions)
	{
		this.options = options;
		this.justPlayItem = <HTMLUListElement>this.options.MenuContainer.querySelector("li[data-action='justplay']");
		this.choosePuzzleItem = <HTMLUListElement>this.options.MenuContainer.querySelector("li[data-action='choosepuzzle']");
		this.howToPlayItem = <HTMLUListElement>this.options.MenuContainer.querySelector("li[data-action='howtoplay']");
		
		this.justPlayItem.onclick = (evt) => {
			this.options.OnJustPlayCallback();
		};
		
		this.choosePuzzleItem.onclick = (evt) => {
			this.options.OnChoosePuzzleCallback();
		};
		
		this.howToPlayItem.onclick = (evt) => {
			this.options.OnHowToPlayCallback();
		};
	}
	
	Show ()
	{
		this.options.MenuContainer.style.display = "block";
		Centerer.CenterContainers();
	}
	
	Hide ()
	{
		this.options.MenuContainer.style.display = "none";
	}
}