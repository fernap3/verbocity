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
	static canvasScale: number = 2;
	
	constructor (options:EngineOptions)
	{
		this.options = options;
		this.board = this.CreateBoardFromPuzzle(this.options.Puzzle);
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
		
		new PuzzleRenderer(this.options.Puzzle, this.options.Page).Render();
		
		
	}
	
	private RenderPreview ()
	{
		var canvas = <HTMLCanvasElement>document.getElementById("Preview");
		
		canvas.height = this.boardHeight * Engine.canvasScale * window.devicePixelRatio;
		canvas.width = this.boardWidth * Engine.canvasScale * window.devicePixelRatio;
		
		var context = canvas.getContext("2d");
		context.scale(Engine.canvasScale * window.devicePixelRatio, Engine.canvasScale * window.devicePixelRatio);
		
		for (var row = 0; row < this.boardHeight; row++)
		{
			for(var col = 0; col < this.boardWidth; col++)
			{
				if (this.board[col][row] === 1)
				{
					context.fillRect(col, row, 1, 1);
				}
			}
		}
	}
	
	private CreateBoardFromPuzzle (puzzle:Array<Array<number>>)
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
	
	private IsWinState (puzzle, board)
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
