interface InputHandlerOptions
{
	Page: HTMLElement;
	OnCellClickCallback: (row:number, col:number) => void;
	OnCellRightClickCallback: (row:number, col:number) => void;
}

class InputHandler
{
	private options: InputHandlerOptions;
	private table: HTMLElement;
	
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