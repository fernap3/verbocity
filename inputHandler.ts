interface InputHandlerOptions
{
	Page: HTMLElement;
	OnCellRangeSelectCallback: (cells: CellCoord[]) => void;
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
		
		// Prevent context menu from showing up on right-click
		this.table.oncontextmenu = (evt) => {
			evt.stopPropagation();
			evt.preventDefault();
			return false;
		};
		
		this.beginSelectCell = null;
		this.cellSelectType = null;
		
		document.addEventListener("mousemove", (evt: PointerEvent) => { this.HandleMouseMoveWhileSelecting(evt); });
		document.addEventListener("mouseup", (evt: MouseEvent) => { this.HandleTableMouseup(evt); });
		document.addEventListener("mousedown", (evt: MouseEvent) => { this.HandleTableMousedown(evt); });
		
		
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
		{
			this.beginSelectCell = null;
			this.endSelectCell = null;
			this.cellSelectType = null;
			this.options.OnCellRangeDeselectCallback();
			return;
		}
			
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
		
		// If neither a straight row or straight column is selected, do nothing
		if (InputHandler.AreCellsInSameRowOrColumn(this.beginSelectCell, this.endSelectCell) === false)
		{
			this.beginSelectCell = null;
			this.endSelectCell = null;
			this.cellSelectType = null;
			return;
		}
		
		// By this point, we know the event should trigger a cell range mark or flag event
		
		var target = <HTMLElement>evt.target;
		
		var row = parseInt(target.getAttribute("data-row"));
		var col = parseInt(target.getAttribute("data-col"));
		
		this.options.OnCellRangeDeselectCallback();
		
		var betweenCells = InputHandler.GetCellsBetween(this.beginSelectCell, this.endSelectCell);
		var selectedCells = [this.beginSelectCell].concat(betweenCells).concat([this.endSelectCell]);
		
		// If beginCell and endCell are the same, the user has only selected one cell
		if (selectedCells.length === 2 && selectedCells[0].Row === selectedCells[1].Row &&
			selectedCells[0].Col === selectedCells[1].Col)
			{
				selectedCells = [selectedCells[0]];
			}
		
		if (isRightClick === true)
		{
			this.options.OnCellsFlagCallback(selectedCells);
		}
		else
		{
			this.options.OnCellsMarkCallback(selectedCells);			
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
			
			this.endSelectCell = endCell;			
			this.options.OnCellRangeDeselectCallback();
			return;
		}
		
		// If the mouse has moved but not enough to cause a change in the selection,
		// do nothing
		if (endCell.Row === this.endSelectCell.Row && endCell.Col === this.endSelectCell.Col)
			return;
			
		this.endSelectCell = endCell;
		
		var betweenCells = InputHandler.GetCellsBetween(this.beginSelectCell, this.endSelectCell);
		this.options.OnCellRangeSelectCallback([this.beginSelectCell].concat(betweenCells).concat([endCell]));		
	}
	
	private static GetCellsBetween (beginCell: CellCoord, endCell: CellCoord) : CellCoord[]
	{
		var betweenCells = [];		
		
		if (beginCell.Row === endCell.Row)
		{
			// The user is selecting a row of cells
			// Make sure we iterate correctly in case beginCell comes before endCell
			if (beginCell.Col > endCell.Col)
			{
				var temp = beginCell;
				beginCell = endCell;
				endCell = temp;
			}
			
			for (var i = beginCell.Col + 1; i < endCell.Col; i++)
			{
				betweenCells.push({Row: beginCell.Row, Col: i });
			}
		}
		
		if (beginCell.Col === endCell.Col)
		{
			// The user is selecting a column of cells
			// Make sure we iterate correctly in case beginCell comes before endCell
			if (beginCell.Row > endCell.Row)
			{
				var temp = beginCell;
				beginCell = endCell;
				endCell = temp;
			}
			
			for (var i = beginCell.Row + 1; i < endCell.Row; i++)
			{
				betweenCells.push({Row: i, Col: beginCell.Col });
			}
		}
		
		return betweenCells;
	}
	
	private static AreCellsInSameRowOrColumn (cell1: CellCoord, cell2: CellCoord)
	{
		return cell1.Row === cell2.Row || cell1.Col === cell2.Col;
	}
}