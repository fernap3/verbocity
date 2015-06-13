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
	}
	
	HandleTableClick (evt: Event)
	{
		var target = <HTMLElement>evt.target;
		
		if (target.tagName === "TD")
		{
			var row = parseInt(target.getAttribute("data-row"));
			var col = parseInt(target.getAttribute("data-col"));
			this.options.OnCellClickCallback(row, col);
		}
	}
}