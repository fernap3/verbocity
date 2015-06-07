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
	static DrawBoard (puzzle: number[][], container:HTMLElement)
	{
		var columnNumbers: number[][] = PuzzleRenderer.GenerateColumnNumbers(puzzle);
		var rowNumbers: number[][] = PuzzleRenderer.GenerateRowNumbers(puzzle);
		
		console.log(columnNumbers);
		console.log(rowNumbers);
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
}
