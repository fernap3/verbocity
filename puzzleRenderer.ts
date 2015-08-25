class PuzzleRenderer
{
	private puzzle: Puzzle;
	private table: HTMLElement;
	private static spaceMarkedClassName = "marked";
	private static spaceFlaggedClassName = "flagged";
	
	constructor (puzzle, container)
	{
		this.puzzle = puzzle;
		this.table = document.getElementById("Board");
	}
	
	MarkCell (cellCoord: CellCoord)
	{
		var cell = this.GetCell(cellCoord);
		cell.classList.remove(PuzzleRenderer.spaceFlaggedClassName);
		cell.classList.add(PuzzleRenderer.spaceMarkedClassName);
	}
	
	FlagSpace (cellCoord: CellCoord)
	{
		var cell = this.GetCell(cellCoord);
		cell.classList.add(PuzzleRenderer.spaceFlaggedClassName);
	}
	
	ClearSpace (cellCoord: CellCoord)
	{
		var cell = this.GetCell(cellCoord);
		cell.classList.remove(PuzzleRenderer.spaceFlaggedClassName);
		cell.classList.remove(PuzzleRenderer.spaceMarkedClassName);
	}
	
	SetCellSelection (cells: CellCoord[])
	{
		if (cells.length === 0)
			return;
			
		this.ClearCellSelection();
		
		var beginCell = this.GetCell(cells[0]);
		var endCell = this.GetCell(cells[cells.length - 1]);
		var betweenCells = cells.slice(1, cells.length - 1).map((cellCoord: CellCoord) => {
			return this.GetCell(cellCoord);
		});
		
		beginCell.classList.add("beginSelect");
		endCell.classList.add("endSelect");
		
		for (var i = 0; i < betweenCells.length; i++)
		{
			betweenCells[i].classList.add("betweenSelect");
		}
	}
	
	ClearCellSelection ()
	{
		var beginCell = <HTMLElement>(this.table.querySelector(".beginSelect"));
		
		// If there is no beginCell, there is no selection, so do nothing
		if (beginCell === null)
			return;
			
		beginCell.classList.remove("beginSelect");
		
		(<HTMLElement>(this.table.querySelector(".endSelect"))).classList.remove("endSelect");
		var betweenCells = this.table.querySelectorAll(".betweenSelect");
		
		for (var i = 0; i < betweenCells.length; i++)
		{
			(<HTMLElement>betweenCells[i]).classList.remove("betweenSelect");
		}
	}
	
	RenderInitialBoard ()
	{
		var columnNumbers: number[][] = PuzzleRenderer.GenerateColumnNumbers(this.puzzle);
		var rowNumbers: number[][] = PuzzleRenderer.GenerateRowNumbers(this.puzzle);
		
		this.table.innerHTML = "";
		this.RenderToContainer(rowNumbers, columnNumbers);
	}
	
	ShowTimePenalty (cellCoord: CellCoord, seconds: number)
	{
		// Shows a little animation over the cell to indicate the number
		// of penalty seconds subtracted from the time.
		// NOTE: Only works with whole-minute penalties for now
		
		var cell = this.GetCell(cellCoord);
		var cellBounds = cell.getBoundingClientRect();
		
		var textContainer = document.createElement("span");
		textContainer.classList.add("cellPenaltyAnimationText");
		textContainer.innerHTML = "-" + (seconds / 60) + ":00";
		
		this.ShowPenalty(textContainer, cellBounds);
	}
	
	ShowStockPenalty (cellCoord: CellCoord)
	{
		var cell = this.GetCell(cellCoord);
		var cellBounds = cell.getBoundingClientRect();
		
		var img = document.createElement("img");
		img.src = "stockPenalty.svg";
		img.className = "cellPenaltyAnimationImage";
		
		this.ShowPenalty(img, cellBounds);
	}
	
	private ShowPenalty (element: HTMLElement, cellBounds: ClientRect)
	{
		// Render the container to get its width
		element.style.visibility = "hidden";
		document.body.appendChild(element);
		var textBounds = element.getBoundingClientRect();
		
		element.style.top = cellBounds.top - textBounds.height + "px";
		element.style.left = cellBounds.left + (cellBounds.width / 2) - (textBounds.width / 2) + "px";
		element.style.visibility = "";
		
		// Make sure the element's initial state is rendered before we
		// animate it
		PuzzleRenderer.ForceElementRedraw(element);
		this.AnimatePenalty(element);
	}
	
	private AnimatePenalty (textContainer: HTMLElement)
	{
		textContainer.addEventListener("transitionend", (evt) => {
			// If the text container has already been removed, do nothing
			if (textContainer.parentNode === null)
				return;
				
			textContainer.parentNode.removeChild(textContainer);
		});

		var textBounds = textContainer.getBoundingClientRect();
		textContainer.style.opacity = "0";
		textContainer.style.top = textBounds.top - 20 + "px";
	}
	
	private GetCell (cellCoord: CellCoord): HTMLElement
	{
		return <HTMLElement>this.table.querySelector("[data-row='" + cellCoord.Row + "'][data-col='" + cellCoord.Col + "']");
	}
	
	private RenderToContainer(rowNumbers: number[][], columnNumbers: number[][])
	{
		var maxNumberOfRowGroups = PuzzleRenderer.LongestArrayLength(rowNumbers);
		this.RenderColumnHeaders(this.table, columnNumbers, maxNumberOfRowGroups);
		
		for (var row = 0; row < this.puzzle.Definition.length; row++)
		{
			var rowElem = document.createElement("tr");
			
			for (var col = 0; col < maxNumberOfRowGroups; col++)
			{
				var tdElem = document.createElement("td");
				
				if (rowNumbers[row].length - maxNumberOfRowGroups + col >= 0)
				{
					tdElem.innerHTML = rowNumbers[row][rowNumbers[row].length - maxNumberOfRowGroups + col].toString();
				}
				
				rowElem.appendChild(tdElem);
			}
			
			for (var col = 0; col < this.puzzle.Definition[0].length; col++)
			{
				var tdElem = document.createElement("td");
				tdElem.className = "pictureCell";
				tdElem.setAttribute("data-row", row.toString());
				tdElem.setAttribute("data-col", col.toString());
				rowElem.appendChild(tdElem);
			}
			
			this.table.appendChild(rowElem);
		}
	}
	
	private static LongestArrayLength (a: any[][])
	{
		var maxNumber = 0;
		
		for (var i = 0; i < a.length; i++)
		{
			if (a[i].length > maxNumber)
			{
				maxNumber = a[i].length;
			}
		}
		
		return maxNumber;
	}
	
	private RenderColumnHeaders (table: HTMLElement, columnNumbers: number[][], rowHeaderCount: number)
	{
		var maxNumberOfColumnGroups = PuzzleRenderer.LongestArrayLength(columnNumbers);

		for (var row = 0; row < maxNumberOfColumnGroups; row++)
		{
			var rowElement = document.createElement("tr");
			
			for (var i = 0; i < rowHeaderCount; i++)
			{
				rowElement.appendChild(document.createElement("td"));
			}
			
			for (var col = 0; col < columnNumbers.length; col++)
			{
				var cellElement = document.createElement("td");
				
				if (columnNumbers[col].length - maxNumberOfColumnGroups + row >= 0)
				{
					cellElement.innerHTML = 
						columnNumbers[col][columnNumbers[col].length - maxNumberOfColumnGroups + row].toString();
				}
				
				rowElement.appendChild(cellElement);
			}
			
			table.appendChild(rowElement);
		}
	}
	
	private static GenerateColumnNumbers (puzzle: Puzzle) : number[][]
	{
		var numbers = [];
		
		for (var col = 0; col < puzzle.Definition[0].length; col++)
		{
			var currentColumnNumbers = [];
			var consecutiveSetCells = 0;
			
			for (var row = 0; row < puzzle.Definition.length; row++)
			{
				if (puzzle.Definition[row][col] === 1)
				{
					consecutiveSetCells += 1;
				}
				else if (consecutiveSetCells !== 0)
				{
					currentColumnNumbers.push(consecutiveSetCells);
					consecutiveSetCells = 0;
				}
			}
			
			if (consecutiveSetCells !== 0)
			{
				currentColumnNumbers.push(consecutiveSetCells);
			}
			
			if (currentColumnNumbers.length > 0)
			{
				numbers.push(currentColumnNumbers);			
			}
			else
			{
				numbers.push([0]);
			}
		}
		
		return numbers;
	}
	
	private static GenerateRowNumbers (puzzle: Puzzle) : number[][]
	{
		var numbers = [];
		
		for (var row = 0; row < puzzle.Definition[0].length; row++)
		{
			var currentRowNumbers = [];
			var consecutiveSetCells = 0;
			
			for (var col = 0; col < puzzle.Definition.length; col++)
			{
				if (puzzle.Definition[row][col] === 1)
				{
					consecutiveSetCells += 1;
				}
				else if (consecutiveSetCells !== 0)
				{
					currentRowNumbers.push(consecutiveSetCells);
					consecutiveSetCells = 0;
				}
			}
			
			if (consecutiveSetCells !== 0)
			{
				currentRowNumbers.push(consecutiveSetCells);
			}
			
			if (currentRowNumbers.length > 0)
			{
				numbers.push(currentRowNumbers);			
			}
			else
			{
				numbers.push([0]);
			}
		}
		
		return numbers;
	}
}
