interface InputHandlerOptions
{
	Page: HTMLElement;
	OnCellClickCallback: (row:number, col:number) => void;
	OnCellRightClickCallback: (row:number, col:number) => void;
	OnShareClickCallback: () => void;
	OnQuitClickCallback: () => void;
	OnPauseClickCallback: () => void;
}

class InputHandler
{
	private options: InputHandlerOptions;
	private table: HTMLElement;
	private shareButton: HTMLElement;
	private quitButton: HTMLElement;
	private pauseButton: HTMLElement;
	
	constructor (options: InputHandlerOptions)
	{
		this.options = options;
		
		this.table = <HTMLElement>this.options.Page.querySelector("#Board");
		this.table.onclick = (evt) => {  this.HandleTableClick(evt); };
		
		// Prevent context menu from showing up on right-click
		this.table.oncontextmenu = (evt) => {
			this.HandleTableClick(evt);
			
			evt.stopPropagation();
			evt.preventDefault();
			return false;
		};
		
		this.quitButton = <HTMLElement>document.querySelector("[data-action='quit']");
		this.quitButton.onclick = (evt) => { this.options.OnQuitClickCallback(); };
		
		this.shareButton = <HTMLElement>document.querySelector("[data-action='share']");
		this.shareButton.onclick = (evt) => { this.options.OnShareClickCallback(); };
		
		this.pauseButton = <HTMLElement>document.querySelector("[data-action='pause']");
		this.pauseButton.onclick = (evt) => { this.options.OnPauseClickCallback(); };
	}
	
	HandleTableClick (evt: MouseEvent)
	{
		var target = <HTMLElement>evt.target;
		
		var isRightClick;

		if ("which" in evt)  // Gecko (Firefox), WebKit (Safari/Chrome) & Opera
			isRightClick = evt.which == 3;
		else if ("button" in evt)  // IE, Opera 
			isRightClick = evt.button == 2; 
		
		if (target.tagName === "TD")
		{
			var row = parseInt(target.getAttribute("data-row"));
			var col = parseInt(target.getAttribute("data-col"));
			
			if (isNaN(row) || isNaN(col))
				return;
							
			if (isRightClick)
			{
				this.options.OnCellRightClickCallback(row, col);
			}
			else
			{
				this.options.OnCellClickCallback(row, col);
			}
		}
	}
}