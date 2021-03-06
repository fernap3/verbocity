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

/**
 * Handles player input of the puzzle board and gameplay menu, calling
 * the appropriate callbacks.
 */
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
	private isShiftHeld: boolean;
	private documentMouseMoveHandler = (evt: PointerEvent) => { this.HandleMouseMoveWhileSelecting(evt); };
	private documentTouchMoveHandler = (evt: TouchEvent) => { this.HandleTouchMoveWhileSelecting(evt); };
	private documentMouseUpHandler = (evt: PointerEvent) => { this.HandleDocumentMouseup(evt); };
	private documentTouchEndHandler = (evt: TouchEvent) => { this.HandleDocumentTouchEnd(evt); };
	private documentKeyDownHandler = (evt: KeyboardEvent) => { this.HandleDocumentKeydown(evt); };
	private documentKeyUpHandler = (evt: KeyboardEvent) => { this.HandleDocumentKeyup(evt); };
	
	private static KeyCodes = { Shift: 16, Escape: 27 };
	
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
		
		// Set event handlers in a new "thread" to avoid handling any initial non-related
		// events ie. The menu touch which begins the game.
		setTimeout(() => {
			document.addEventListener("mousemove", this.documentMouseMoveHandler);
			document.addEventListener("mouseup", this.documentMouseUpHandler);
			this.table.addEventListener("mousedown", (evt: MouseEvent) => { this.HandleTableMousedown(evt); });
			document.addEventListener("touchmove", this.documentTouchMoveHandler);
			document.addEventListener("touchend", this.documentTouchEndHandler);
			this.table.addEventListener("touchstart", (evt: TouchEvent) => { this.HandleTableTouchStart(evt); });
			document.addEventListener("keydown", this.documentKeyDownHandler);
			document.addEventListener("keyup", this.documentKeyUpHandler);
			
			
			this.quitButton = <HTMLElement>document.querySelector("[data-action='quit']");
			this.quitButton.onclick = (evt) => { this.options.OnQuitClickCallback(); };
			
			this.shareButton = <HTMLElement>document.querySelector("[data-action='share']");
			this.shareButton.onclick = (evt) => { this.options.OnShareClickCallback(); };
			
			this.pauseButton = <HTMLElement>document.querySelector("[data-action='pause']");
			this.pauseButton.onclick = (evt) => { this.options.OnPauseClickCallback(); };
		}, 0);
	}
	
	public Dispose ()
	{
		document.removeEventListener("mousemove", this.documentMouseMoveHandler);
		document.removeEventListener("mouseup", this.documentMouseUpHandler);
		document.removeEventListener("keydown", this.documentKeyDownHandler);
		document.removeEventListener("keyup", this.documentKeyUpHandler);
		document.removeEventListener("touchmove", this.documentTouchMoveHandler);
		document.removeEventListener("touchend", this.documentTouchEndHandler);
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
				this.CancelSelection();
				return;
			}
		
		var row = parseInt(target.getAttribute("data-row"));
		var col = parseInt(target.getAttribute("data-col"));
		
		this.beginSelectCell = { Row: row, Col: col };
		this.endSelectCell = { Row: row, Col: col };
		this.cellSelectType = isRightClick === true ? CellSelectType.Flag : CellSelectType.Mark;
	}
	
	HandleTableTouchStart (evt: TouchEvent)
	{
		if (this.IsEventTargetPictureCell(evt) === false)
			return;
			
		if (evt.touches.length > 1)
		{
			// Allow the user to cancel the current selection by touching with a second
			// digit
			this.CancelSelection();
			return;
		}
		
		var isFlag = (<HTMLInputElement>document.querySelector("#MarkModeSwitch")).checked;
		
		var target = <HTMLElement>evt.target;
		
		var row = parseInt(target.getAttribute("data-row"));
		var col = parseInt(target.getAttribute("data-col"));
		
		this.beginSelectCell = { Row: row, Col: col };
		this.endSelectCell = { Row: row, Col: col };
		this.cellSelectType = isFlag === true ? CellSelectType.Flag : CellSelectType.Mark;
	}
	
	private HandleDocumentKeydown (evt: KeyboardEvent)
	{
		switch (evt.keyCode)
		{
			case InputHandler.KeyCodes.Shift:
				this.isShiftHeld = true;
				break;
			case InputHandler.KeyCodes.Escape:
				this.CancelSelection();
				break;
		}
	}
	
	private CancelSelection ()
	{
		if (this.IsCurrentlySelecting() === false)
			return;
		
		this.beginSelectCell = null;
		this.endSelectCell = null;
		this.cellSelectType = null;
		this.options.OnCellRangeDeselectCallback();
	}
	
	private HandleDocumentKeyup (evt: KeyboardEvent)
	{
		switch (evt.keyCode)
		{
			case InputHandler.KeyCodes.Shift:
				this.isShiftHeld = false;
				break;
		}
	}
	
	private HandleDocumentMouseup (evt: MouseEvent)
	{
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
		
		var isFlag = isRightClick === true || this.isShiftHeld === true;
		
		this.HandleSelectFinish(isFlag);
	}
	
	private HandleDocumentTouchEnd (evt: TouchEvent)
	{
		if (this.IsCurrentlySelecting() === false)
			return;
		
		var isFlag = (<HTMLInputElement>document.querySelector("#MarkModeSwitch")).checked;
		this.HandleSelectFinish(isFlag);
	}
	
	private HandleSelectFinish (isFlag: boolean)
	{
		// If neither a straight row nor straight column is selected, do nothing
		if (InputHandler.AreCellsInSameRowOrColumn(this.beginSelectCell, this.endSelectCell) === false)
		{
			this.beginSelectCell = null;
			this.endSelectCell = null;
			this.cellSelectType = null;
			return;
		}
		
		this.options.OnCellRangeDeselectCallback();
		
		var betweenCells = InputHandler.GetCellsBetween(this.beginSelectCell, this.endSelectCell);
		var selectedCells = [this.beginSelectCell].concat(betweenCells).concat([this.endSelectCell]);
		
		// If beginCell and endCell are the same, the user has only selected one cell
		if (selectedCells.length === 2 && selectedCells[0].Row === selectedCells[1].Row &&
			selectedCells[0].Col === selectedCells[1].Col)
			{
				selectedCells = [selectedCells[0]];
			}
		
		if (isFlag === true)
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
		this.UpdateSelection(endCell);
	}
	
	private HandleTouchMoveWhileSelecting (evt: TouchEvent)
	{
		if (this.IsCurrentlySelecting() === false)
			return;
		
		var cell = document.elementFromPoint(evt.touches[0].pageX, evt.touches[0].pageY);
		
		for (; cell !== null && cell.tagName !== "TD"; cell = cell.parentElement);
		
		// We aren't touching a picture cell
		if (cell === null)
			return;
		
		var endCell = { Row: parseInt(cell.getAttribute("data-row")), Col: parseInt(cell.getAttribute("data-col")) };
		this.UpdateSelection(endCell);
	}
	
	private UpdateSelection (endCell: CellCoord)
	{
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