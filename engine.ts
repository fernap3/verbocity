//@import "inputHandler.ts"
//@import "previewRenderer.ts"
//@import "timerRenderer.ts"

enum CellStates { Clear, Marked, Flagged }

interface EngineOptions
{
	Page: HTMLElement;
	OnWinCallback: () => void;
	OnLoseCallback: () => void;
	OnQuitCallback: () => void;
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
	private puzzle: Puzzle;
	private sharePrompt: SharePrompt;
	
	constructor (options:EngineOptions)
	{
		this.options = options;
		
		this.sharePrompt = new SharePrompt({
			Container: document.getElementById("SharePrompt"),
			OnCloseCallback: () => { this.OnSharePromptClose(); }
		});
	}
	
	StartGame ()
	{
		this.nextPenalty = Engine.initialPenalty;
		this.board = this.CreateBoardFromPuzzle(this.puzzle);
		this.boardHeight = this.puzzle.Definition.length;
		this.boardWidth = this.puzzle.Definition[0].length;		
		
		this.timerRenderer = new TimerRenderer({
			TimerContainer: <HTMLElement>this.options.Page.querySelector("#Timer")
		});
		
		this.timer = new Timer({
			StartSeconds: Engine.startTime,
			UpdateCallback: (seconds: number) => { this.HandleTimerTick(seconds); }
		});
		
		this.timerRenderer.UpdateDisplay(Engine.startTime);
		this.timer.Start();
		
		this.puzzleRenderer = new PuzzleRenderer(this.puzzle, this.options.Page);
		this.puzzleRenderer.RenderInitialBoard();
		
		this.previewRenderer = new PreviewRenderer(<HTMLCanvasElement>this.options.Page.querySelector("#Preview"));
		
		new InputHandler({
			Page: this.options.Page,
			OnCellClickCallback: (row: number, col: number) => { this.TryFillSpace(row, col); },
			OnCellRightClickCallback: (row: number, col: number) => { this.ToggleSpaceFlag(row, col); },
			OnShareClickCallback: () => {
				this.timer.Stop();
				document.getElementById("PlayArea").classList.add("blurred");
				this.sharePrompt.Show();
			},
			OnQuitClickCallback: () => {
				this.timer.Stop();
				this.options.OnQuitCallback();
			}
		});
		
		Centerer.CenterContainers();
	}
	
	private OnSharePromptClose ()
	{
		this.timer.Start();
		document.getElementById("PlayArea").classList.remove("blurred");
	}
	
	SetPuzzle (puzzle: Puzzle)
	{
		this.puzzle = puzzle;
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
			
			if (this.IsWinState(this.puzzle, this.board))
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
		return this.puzzle.Definition[row][col] === 1;
	}
	
	private CreateBoardFromPuzzle (puzzle: Puzzle)
	{
		var board = [];
		
		for (var i = 0; i < puzzle.Definition.length; i++)
		{
			var row = [];
			
			for (var j = 0; j < puzzle.Definition[i].length; j++)
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
				if (puzzle.Definition[i][j] === 1 && board[i][j] !== CellStates.Marked)
					return false;
			}
		}
		
		return true;
	}
}
