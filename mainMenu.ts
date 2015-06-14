interface MainMenuOptions
{
	MenuContainer: HTMLElement;
	OnJustPlayCallback: () => void;
}

class MainMenu
{
	private options: MainMenuOptions;
	private justPlayItem: HTMLUListElement;
	
	constructor (options: MainMenuOptions)
	{
		this.options = options;
		this.justPlayItem = <HTMLUListElement>this.options.MenuContainer.querySelector("li[data-action='justplay']");
		
		this.justPlayItem.onclick = (evt) => {
			this.options.OnJustPlayCallback();
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