class PuzzleRenderer
{
	private puzzle: number[][];
	private table: HTMLElement;
	private static spaceMarkedClassName = "filled";
	private static spaceFlaggedClassName = "flagged";
	
	constructor (puzzle, container)
	{
		this.puzzle = puzzle;
		this.table = document.getElementById("Board");
	}
	
	MarkSpace (row: number, col: number)
	{
		var cell = this.GetCell(row, col);
		cell.classList.remove(PuzzleRenderer.spaceFlaggedClassName);
		cell.classList.add(PuzzleRenderer.spaceMarkedClassName);
	}
	
	FlagSpace (row: number, col: number)
	{
		var cell = this.GetCell(row, col);
		cell.classList.add(PuzzleRenderer.spaceFlaggedClassName);
	}
	
	ClearSpace (row: number, col: number)
	{
		var cell = this.GetCell(row, col);
		cell.classList.remove(PuzzleRenderer.spaceFlaggedClassName);
		cell.classList.remove(PuzzleRenderer.spaceMarkedClassName);
	}
	
	RenderInitialBoard ()
	{
		var columnNumbers: number[][] = PuzzleRenderer.GenerateColumnNumbers(this.puzzle);
		var rowNumbers: number[][] = PuzzleRenderer.GenerateRowNumbers(this.puzzle);
		
		this.table.innerHTML = "";
		this.RenderToContainer(rowNumbers, columnNumbers);
	}
	
	ShowPenalty (row: number, col: number, seconds: number)
	{
		// Shows a little animation over the cell to indicate the number
		// of penalty seconds subtracted from the time.
		// NOTE: Only works with whole-minute penalties for now
		
		var cell = this.GetCell(row, col);
		var cellBounds = cell.getBoundingClientRect();
		
		var textContainer = document.createElement("span");
		textContainer.classList.add("cellPenaltyAnimationText");
		textContainer.innerHTML = "-" + (seconds / 60) + ":00";
		
		// Render the container to get its width
		textContainer.style.visibility = "hidden";
		document.body.appendChild(textContainer);
		var textBounds = textContainer.getBoundingClientRect();
		
		textContainer.style.top = cellBounds.top - textBounds.height + "px";
		textContainer.style.left = cellBounds.left + (cellBounds.width / 2) - (textBounds.width / 2) + "px";
		textContainer.style.visibility = "";
		
		// Start the animation in a different "thread" so the browser has
		// free cycles to render the initial state.
		setTimeout(() => { this.AnimatePenalty(textContainer) }, 0);
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
	
	private GetCell (row: number, col: number): HTMLElement
	{
		return <HTMLElement>this.table.querySelector("[data-row='" + row + "'][data-col='" + col + "']");
	}
	
	private RenderToContainer(rowNumbers: number[][], columnNumbers: number[][])
	{
		var maxNumberOfRowGroups = PuzzleRenderer.LongestArrayLength(rowNumbers);
		this.RenderColumnHeaders(this.table, columnNumbers, maxNumberOfRowGroups);
		
		for (var row = 0; row < this.puzzle.length; row++)
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
			
			for (var col = 0; col < this.puzzle[0].length; col++)
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
	
	private static GenerateColumnNumbers (puzzle: number[][]) : number[][]
	{
		var numbers = [];
		
		for (var col = 0; col < puzzle[0].length; col++)
		{
			var currentColumnNumbers = [];
			var consecutiveSetCells = 0;
			
			for (var row = 0; row < puzzle.length; row++)
			{
				if (puzzle[row][col] === 1)
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
	
	private static GenerateRowNumbers (puzzle: number[][]) : number[][]
	{
		var numbers = [];
		
		for (var row = 0; row < puzzle[0].length; row++)
		{
			var currentRowNumbers = [];
			var consecutiveSetCells = 0;
			
			for (var col = 0; col < puzzle.length; col++)
			{
				if (puzzle[row][col] === 1)
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
