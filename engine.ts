//@import "inputHandler.ts"
//@import "previewRenderer.ts"

enum CellStates { Clear, Marked, Flagged }

interface EngineOptions
{
	Page: HTMLElement;
	Puzzle: number[][];
	OnTimerUpdateCallback: Function;
}

class Engine
{
	private options: EngineOptions
	private board: Array<Array<number>>
	private boardHeight: number
	private boardWidth: number
	static canvasScale: number = 2;
	private puzzleRenderer: PuzzleRenderer;
	private previewRenderer: PreviewRenderer;
	
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
		
		this.puzzleRenderer = new PuzzleRenderer(this.options.Puzzle, this.options.Page);
		this.puzzleRenderer.RenderInitialBoard();
		
		this.previewRenderer = new PreviewRenderer(<HTMLCanvasElement>this.options.Page.querySelector("#Preview"));
		
		new InputHandler({
			Page: this.options.Page,
			OnCellClickCallback: (row: number, col: number) => { this.TryFillSpace(row, col); },
			OnCellRightClickCallback: (row: number, col: number) => { this.ToggleQuestionSpace(row, col); }
		});
	}
	
	private TryFillSpace (row: number, col: number)
	{
		if (this.IsSpaceInPicture(row, col) === true)
		{
			this.board[row][col] = CellStates.Marked;
			this.puzzleRenderer.FillSpace(row, col);
			this.previewRenderer.UpdatePreview(this.board);
		}
		else
		{
			// The user tried to mark a space that is not in the picture; penalty!
		}
	}
	
	private ToggleQuestionSpace (row: number, col: number)
	{
		// If the space is already marked, don't allow the user to turn it into a question
		if (this.board[row][col] === CellStates.Marked)
			return;
		
		this.puzzleRenderer.MarkSpaceAsQuestion(row, col);
	}
	
	private IsSpaceInPicture (row: number, col: number): boolean
	{
		return this.options.Puzzle[row][col] === 1;
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
