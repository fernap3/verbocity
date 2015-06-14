//@import "inputHandler.ts"
//@import "previewRenderer.ts"
//@import "timerRenderer.ts"

enum CellStates { Clear, Marked, Flagged }

interface EngineOptions
{
	Page: HTMLElement;
	Puzzle: number[][];
	OnWinCallback: () => void;
	OnLoseCallback: () => void;
}

class Engine
{
	private static startTime: number = 30 * 60;
	private static initialPenalty: number = 2 * 60;
	private static maxPenalty: number = 8 * 60;
	private options: EngineOptions
	private board: Array<Array<number>>
	private boardHeight: number
	private boardWidth: number
	private puzzleRenderer: PuzzleRenderer;
	private previewRenderer: PreviewRenderer;
	private timerRenderer: TimerRenderer;
	private timer: Timer;
	private nextPenalty: number;
	
	constructor (options:EngineOptions)
	{
		this.options = options;
		this.board = this.CreateBoardFromPuzzle(this.options.Puzzle);
		this.boardHeight = this.options.Puzzle.length;
		this.boardWidth = this.options.Puzzle[0].length;
		this.nextPenalty = Engine.initialPenalty;
	}
	
	StartGame ()
	{
		this.timerRenderer = new TimerRenderer({
			TimerContainer: <HTMLElement>this.options.Page.querySelector("#Timer")
		});
		
		this.timer = new Timer({
			StartSeconds: Engine.startTime,
			UpdateCallback: (seconds: number) => { this.HandleTimerTick(seconds); }
		});
		
		this.timerRenderer.UpdateDisplay(Engine.startTime);
		this.timer.Start();
		
		this.puzzleRenderer = new PuzzleRenderer(this.options.Puzzle, this.options.Page);
		this.puzzleRenderer.RenderInitialBoard();
		
		this.previewRenderer = new PreviewRenderer(<HTMLCanvasElement>this.options.Page.querySelector("#Preview"));
		
		new InputHandler({
			Page: this.options.Page,
			OnCellClickCallback: (row: number, col: number) => { this.TryFillSpace(row, col); },
			OnCellRightClickCallback: (row: number, col: number) => { this.ToggleSpaceFlag(row, col); }
		});
	}
	
	private HandleTimerTick (seconds: number)
	{
		this.timerRenderer.UpdateDisplay(seconds);
		
		if (seconds === 0)
		{
			this.timer.Stop();
			this.options.OnLoseCallback();
		}
	}
	
	private TryFillSpace (row: number, col: number)
	{
		if (this.IsSpaceInPicture(row, col) === true)
		{
			// The user marked a space that exists in the picture, great!
			this.board[row][col] = CellStates.Marked;
			this.puzzleRenderer.MarkSpace(row, col);
			this.previewRenderer.UpdatePreview(this.board);
			
			if (this.IsWinState(this.options.Puzzle, this.board))
			{
				this.timer.Stop();
				this.options.OnWinCallback();
				return;
			}
		}
		else
		{
			// The user tried to mark a space that is not in the picture; penalty!
			var currentTime = this.timer.GetTime();
			currentTime -= this.nextPenalty;
			
			this.puzzleRenderer.ShowPenalty(row, col, this.nextPenalty);
			
			this.IncrementPenalty();
			
			if (currentTime <= 0)
			{
				this.timer.Stop();
				this.timerRenderer.UpdateDisplay(0);
				this.timerRenderer.IndicatePenalty();
				this.options.OnLoseCallback();
				return;
			}
			
			this.timer.SetTime(currentTime);
			this.timerRenderer.UpdateDisplay(currentTime);
			this.timerRenderer.IndicatePenalty();
		}
	}
	
	private IncrementPenalty ()
	{
		if (this.nextPenalty * 2 > Engine.maxPenalty)
			return;
			
		this.nextPenalty *= 2;
	}
	
	private ToggleSpaceFlag (row: number, col: number)
	{
		// If the space is already marked, don't allow the user to turn it into a question
		if (this.board[row][col] === CellStates.Marked)
			return;
		
		if (this.board[row][col] === CellStates.Clear)
		{
			this.board[row][col] = CellStates.Flagged;
			this.puzzleRenderer.FlagSpace(row, col);
		}
		else
		{
			this.board[row][col] = CellStates.Clear;
			this.puzzleRenderer.ClearSpace(row, col);	
		}
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
