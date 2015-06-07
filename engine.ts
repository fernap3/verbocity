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
	_options: EngineOptions
	_board: Array<Array<number>>
	_boardHeight: number
	_boardWidth: number
	
	constructor (options:EngineOptions)
	{
		this._options = options;
		//this._board = this._CreateBoardFromPuzzle(this._options.Puzzle);
		this._boardHeight = this._options.Puzzle.length;
		this._boardWidth = this._options.Puzzle[0].length;
	}
	
	StartGame ()
	{
		var timer = new Timer({
			StartSeconds: 64,
			UpdateCallback: this._options.OnTimerUpdateCallback
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
		for (var i = 0; i < this._boardHeight; i++)
		{
			for (var j = 0; j < this._boardWidth; j++)
			{
				if (puzzle[i][j] === 1 && board[i][j] !== CellStates.Marked)
					return false;
			}
		}
		
		return true;
	}
}
