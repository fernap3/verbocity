interface InputHandlerOptions
{
	Page: HTMLElement;
	OnCellRangeSelectCallback: (beginCell: CellCoord, endCell: CellCoord, betweenCells: CellCoord[]) => void;
	OnCellRangeDeselectCallback: () => void;
	OnCellsMarkCallback: (cells: CellCoord[]) => void;
	OnCellsFlagCallback: (cells: CellCoord[]) => void;
	OnShareClickCallback: () => void;
	OnQuitClickCallback: () => void;
	OnPauseClickCallback: () => void;
}

enum CellSelectType { Mark, Flag };

class InputHandler
{
	private options: InputHandlerOptions;
	private table: HTMLElement;
	private shareButton: HTMLElement;
	private quitButton: HTMLElement;
	private pauseButton: HTMLElement;
	private beginSelectCell: CellCoord;
	private endSelectCell: CellCoord;
	private cellSelectType: CellSelectType;
	
	constructor (options: InputHandlerOptions)
	{
		this.options = options;
		
		this.table = <HTMLElement>this.options.Page.querySelector("#Board");
		//this.table.onclick = (evt) => {  this.HandleTableClick(evt); };
		this.table.onmousedown = (evt) => {  this.HandleTableMousedown(evt); };
		this.table.onmouseup = (evt) => {  this.HandleTableMouseup(evt); };
		
		// Prevent context menu from showing up on right-click
		this.table.oncontextmenu = (evt) => {
			evt.stopPropagation();
			evt.preventDefault();
			return false;
		};
		
		this.beginSelectCell = null;
		this.cellSelectType = null;
		
		document.addEventListener("mousemove", (evt: PointerEvent) => { this.HandleMouseMoveWhileSelecting(evt); });		
		
		this.quitButton = <HTMLElement>document.querySelector("[data-action='quit']");
		this.quitButton.onclick = (evt) => { this.options.OnQuitClickCallback(); };
		
		this.shareButton = <HTMLElement>document.querySelector("[data-action='share']");
		this.shareButton.onclick = (evt) => { this.options.OnShareClickCallback(); };
		
		this.pauseButton = <HTMLElement>document.querySelector("[data-action='pause']");
		this.pauseButton.onclick = (evt) => { this.options.OnPauseClickCallback(); };
	}
	
	private IsEventTargetPictureCell (evt: Event): boolean
	{
		var target = <HTMLElement>evt.target;
		
		if (target.tagName !== "TD")
			return false;
		
		var row = parseInt(target.getAttribute("data-row"));
		var col = parseInt(target.getAttribute("data-col"));
		
		if (isNaN(row) || isNaN(col))
			return false;
			
		return true;
	}
	
	private IsCurrentlySelecting (): boolean
	{
		return this.beginSelectCell !== null;
	}
	
	private HandleTableMousedown (evt: MouseEvent)
	{
		if (this.IsEventTargetPictureCell(evt) === false)
			return;
		
		var target = <HTMLElement>evt.target;
		
		var isRightClick;

		if ("which" in evt)  // Gecko (Firefox), WebKit (Safari/Chrome) & Opera
			isRightClick = evt.which == 3;
		else if ("button" in evt)  // IE, Opera 
			isRightClick = evt.button == 2;
			
		if ((isRightClick === true && this.cellSelectType === CellSelectType.Mark) ||
			(isRightClick === false && this.cellSelectType === CellSelectType.Flag))
			{
				// Allow the user to cancel the current selection by depressing the opposite
				// mouse button
				this.beginSelectCell = null;
				this.cellSelectType = null;
				return;
			}
		
		var row = parseInt(target.getAttribute("data-row"));
		var col = parseInt(target.getAttribute("data-col"));
		
		this.beginSelectCell = { Row: row, Col: col };
		this.endSelectCell = { Row: row, Col: col };
		this.cellSelectType = isRightClick === true ? CellSelectType.Flag : CellSelectType.Mark;
	}
	
	private HandleTableMouseup (evt: MouseEvent)
	{
		if (this.IsEventTargetPictureCell(evt) === false)
			return;
			
		if (this.IsCurrentlySelecting() === false)
			return;
			
		var isRightClick;

		if ("which" in evt)  // Gecko (Firefox), WebKit (Safari/Chrome) & Opera
			isRightClick = evt.which == 3;
		else if ("button" in evt)  // IE, Opera 
			isRightClick = evt.button == 2; 
			
		if ((this.cellSelectType === CellSelectType.Mark && isRightClick === true) ||
		(this.cellSelectType === CellSelectType.Flag && isRightClick === false))
		{
			// The mouse button that was just lifted doesn't not correspond to the
			// button currently being held to select cells; do nothing.
			return;
		}
		
		// By this point, we know the event should trigger a cell range mark or flag event
		
		var target = <HTMLElement>evt.target;
		
		var row = parseInt(target.getAttribute("data-row"));
		var col = parseInt(target.getAttribute("data-col"));
		
		this.options.OnCellRangeDeselectCallback();
		
		if (isRightClick === true)
		{
			this.options.OnCellsFlagCallback([]);
		}
		else
		{
			this.options.OnCellsMarkCallback([]);			
		}
		
		this.beginSelectCell = null;
		this.endSelectCell = null;
		this.cellSelectType = null;
	}
	
	private HandleMouseMoveWhileSelecting (evt: PointerEvent)
	{
		if (this.IsCurrentlySelecting() === false)
			return;
		
		var target = <HTMLElement>evt.target;
		
		if (this.IsEventTargetPictureCell(evt) === false)
		{
			return;
		}
		
		var endCell = { Row: parseInt(target.getAttribute("data-row")), Col: parseInt(target.getAttribute("data-col")) };
		
		if ((this.beginSelectCell.Row !== endCell.Row && this.beginSelectCell.Col !== endCell.Col) ||
			((this.beginSelectCell.Row === endCell.Row && this.beginSelectCell.Col === endCell.Col)))
		{
			// The user is not selecting a straight row or column (or only selecting a single cell),
			// so select nothing
			
			this.options.OnCellRangeDeselectCallback();
			return;
		}
		
		// If the mouse has moved but not enough to cause a change in the selection,
		// do nothing
		if (endCell.Row === this.endSelectCell.Row && endCell.Col === this.endSelectCell.Col)
			return;
			
		this.endSelectCell = endCell;
		
		var betweenCells = [];		
		
		if (this.beginSelectCell.Row === endCell.Row)
		{
			// The user is selecting a row of cells
			for (var i = this.beginSelectCell.Col + 1; i < endCell.Col; i++)
			{
				betweenCells.push({Row: this.beginSelectCell.Row, Col: i });
			}
		}
		
		if (this.beginSelectCell.Col === endCell.Col)
		{
			// The user is selecting a column of cells
			for (var i = this.beginSelectCell.Row + 1; i < endCell.Row; i++)
			{
				betweenCells.push({Row: i, Col: this.beginSelectCell.Col });
			}
		}
		
		this.options.OnCellRangeSelectCallback(this.beginSelectCell, endCell, betweenCells);		
	}
}