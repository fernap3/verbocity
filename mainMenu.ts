interface MainMenuOptions
{
	MenuContainer: HTMLElement;
	OnJustPlayCallback: () => void;
	OnChoosePuzzleCallback: () => void;
}

class MainMenu
{
	private options: MainMenuOptions;
	private justPlayItem: HTMLUListElement;
	private choosePuzzleItem: HTMLUListElement;
	
	constructor (options: MainMenuOptions)
	{
		this.options = options;
		this.justPlayItem = <HTMLUListElement>this.options.MenuContainer.querySelector("li[data-action='justplay']");
		this.choosePuzzleItem = <HTMLUListElement>this.options.MenuContainer.querySelector("li[data-action='choosepuzzle']");
		
		this.justPlayItem.onclick = (evt) => {
			this.options.OnJustPlayCallback();
		};
		
		this.choosePuzzleItem.onclick = (evt) => {
			this.options.OnChoosePuzzleCallback();
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