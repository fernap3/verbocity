//@import "timer.ts"
//@import "puzzles.ts"

interface EngineOptions
{
	Page: Element;
	Puzzle: number[][];
	OnTimerUpdateCallback: Function;
}

enum CellStates { Clear, Marked, Question }

class Engine
{
	private options: EngineOptions
	private board: Array<Array<number>>
	private boardHeight: number
	private boardWidth: number
	
	constructor (options:EngineOptions)
	{
		this.options = options;
		//this._board = this._CreateBoardFromPuzzle(this._options.Puzzle);
		this.boardHeight = this.options.Puzzle.length;
		this.boardWidth = this.options.Puzzle[0].length;
	}
	
	StartGame ()
	{
		var timer = new Timer({
			StartSeconds: 64,
			UpdateCallback: this.options.OnTimerUpdateCallback
		});
		
		timer.Start();
	}
	
	_CreateBoardFromPuzzle (puzzle:Array<Array<number>>)
	{
		var board = [];
		
		for (var i = 0; i < puzzle.length; i++)
		{
			var row = [];
			
			for (var j = 0; j < puzzle[i].length; j++)
			{
				row.push(CellStates.Clear);
			}
			
			board.push(row);
		}
		
		return board;
	}
	
	_IsWinState (puzzle, board)
	{
		for (var i = 0; i < this.boardHeight; i++)
		{
			for (var j = 0; j < this.boardWidth; j++)
			{
				if (puzzle[i][j] === 1 && board[i][j] !== CellStates.Marked)
					return false;
			}
		}
		
		return true;
	}
}

class PuzzleRenderer
{
	private puzzle: number[][];
	private container: HTMLElement;
	
	constructor (puzzle, container)
	{
		this.puzzle = puzzle;
		this.container = container;
	}
	
	Render ()
	{
		var columnNumbers: number[][] = PuzzleRenderer.GenerateColumnNumbers(this.puzzle);
		var rowNumbers: number[][] = PuzzleRenderer.GenerateRowNumbers(this.puzzle);
		
		this.RenderToContainer(rowNumbers, columnNumbers);
	}
	
	private RenderToContainer(rowNumbers: number[][], columnNumbers: number[][])
	{
		var table = document.createElement("table");
		
		var maxNumberOfRowGroups = PuzzleRenderer.LongestArrayLength(rowNumbers);
		this.RenderColumnHeaders(table, columnNumbers, maxNumberOfRowGroups);
		
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
				rowElem.appendChild(tdElem);
			}
			
			table.appendChild(rowElem);
		}
		
		this.container.appendChild(table);
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
				numbers.push(0);
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
				numbers.push(0);
			}
		}
		
		return numbers;
	}
}
