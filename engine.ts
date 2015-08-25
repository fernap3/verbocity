//@import "inputHandler.ts"
//@import "previewRenderer.ts"
//@import "timerRenderer.ts"

enum CellStates { Clear, Marked, Flagged };
enum GameRules { Normal, Video };

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
	private static initialTimePenalty: number = 2 * 60;
	private static maxTimePenalty: number = 8 * 60;
	private static initialStock: number = 5;
	private options: EngineOptions
	private board: Array<Array<number>>
	private boardHeight: number
	private boardWidth: number
	private puzzleRenderer: PuzzleRenderer;
	private previewRenderer: PreviewRenderer;
	private inputHandler: InputHandler;
	private timerRenderer: TimerRenderer;
	private stockRenderer: StockRenderer;
	private timer: Timer;
	private nextTimePenalty: number;
	private currentStock: number;
	private puzzle: Puzzle;
	private sharePrompt: SharePrompt;
	private pausePrompt: PausePrompt;
	private visualization: Visualization;
	private gameMode: GameRules;
	
	constructor (options:EngineOptions)
	{
		this.options = options;
		
		this.sharePrompt = new SharePrompt({
			Container: document.getElementById("SharePrompt"),
			OnCloseCallback: () => { this.OnSharePromptClose(); }
		});
		
		this.pausePrompt = new PausePrompt({
			Container: document.getElementById("PausePrompt"),
			OnCloseCallback: () => { this.UnPause(); }
		});
	}
	
	StartGame ()
	{
		this.nextTimePenalty = Engine.initialTimePenalty;
		this.board = this.CreateBoardFromPuzzle(this.puzzle);
		this.boardHeight = this.puzzle.Definition.length;
		this.boardWidth = this.puzzle.Definition[0].length;	
		this.currentStock = Engine.initialStock;	
		
		this.timerRenderer = new TimerRenderer({
			TimerContainer: <HTMLElement>this.options.Page.querySelector("#Timer")
		});
		
		this.gameMode = "VideoUrl" in this.puzzle ? GameRules.Video : GameRules.Normal;
		this.visualization = VisualizationFactory.Create(
			{
				Puzzle: this.puzzle,
				OnReadyCallback: (vizInfo: any) => {
					// When in "Video" mode, the timer is set to the video duration, and the player
					// has a certain number of "strikes" before losing the game.  When in "Normal"
					// mode, the timer is set to some constant number of seconds (maybe 30), and
					// each mistake takes time off the timer.
					var startTime = this.gameMode === GameRules.Video ? vizInfo.Duration : Engine.startTime;
					
					this.InitializeAndStartTimer(startTime);
					this.visualization.Start();
				},
				OnPauseCallback: () => { this.Pause() },
				OnUnPauseCallback: () => { this.UnPause(); }
			}
		);
		
		if (this.gameMode === GameRules.Video)
		{
			this.stockRenderer = new StockRenderer({
				StockContainer: <HTMLElement>document.getElementById("Stock"),
				InitialStock: Engine.initialStock
			});
			
			(<HTMLElement>document.getElementById("Stock")).style.display = "block";
		}
		else
		{
			(<HTMLElement>document.getElementById("Stock")).style.display = "none";
		}
		
		this.puzzleRenderer = new PuzzleRenderer(this.puzzle, this.options.Page);
		this.puzzleRenderer.RenderInitialBoard();
		
		this.previewRenderer = new PreviewRenderer(<HTMLCanvasElement>this.options.Page.querySelector("#Preview"));
		
		this.inputHandler = new InputHandler({
			Page: this.options.Page,
			OnCellRangeSelectCallback: (cells: CellCoord[]) => { this.puzzleRenderer.SetCellSelection(cells); },
			OnCellRangeDeselectCallback: () => { this.puzzleRenderer.ClearCellSelection(); },
			OnCellsMarkCallback: (cells: CellCoord[]) => { this.TryMarkCells(cells); },
			OnCellsFlagCallback: (cells: CellCoord[]) => { this.ToggleSpaceFlags(cells); },
			OnShareClickCallback: () => {
				this.Share();
			},
			OnQuitClickCallback: () => {
				this.QuitGame();
			},
			OnPauseClickCallback: () => {
				this.Pause();
			}
		});
		
		Centerer.CenterContainers();
	}
	
	private InitializeAndStartTimer (startTime: number)
	{
		this.timer = new Timer({
			StartSeconds: startTime,
			UpdateCallback: (seconds: number) => { this.HandleTimerTick(seconds); }
		});
		
		this.timerRenderer.UpdateDisplay(startTime);
		this.timer.Start();
	}
	
	private OnGameWin ()
	{
		this.timer.Stop();
		this.visualization.Stop();
		this.inputHandler.Dispose();
		
		new WinScreen({
			WinScreen: document.getElementById("WinScreen"),
			Puzzle: this.puzzle,
			OnCloseCallback: () => {
				this.options.OnWinCallback();
			}
		}).Show();
	}
	
	private OnGameLose ()
	{
		this.timer.Stop();
		this.visualization.Stop();
		this.inputHandler.Dispose();
		
		new LoseScreen({
			LoseScreen: document.getElementById("LoseScreen"),
			OnCloseCallback: () => {
				this.options.OnLoseCallback();
			}
		}).Show();
	}
	
	private QuitGame ()
	{
		this.timer.Stop();
		this.visualization.Stop();
		this.inputHandler.Dispose();
		this.options.OnQuitCallback();
	}
	
	private OnSharePromptClose ()
	{
		this.UnPause();
	}
	
	SetPuzzle (puzzle: Puzzle)
	{
		this.puzzle = puzzle;
		this.sharePrompt.SetPuzzle(puzzle);
	}
	
	private HandleTimerTick (seconds: number)
	{
		this.timerRenderer.UpdateDisplay(seconds);
		
		if (seconds === 0)
		{
			this.timer.Stop();
			this.OnGameLose();
		}
	}
	
	private TryMarkCells (cells: CellCoord[])
	{
		for (var i = 0; i < cells.length; i++)
		{
			var cell = cells[i];
			
			if (this.IsCellInPicture(cell) === true)
			{
				// The user marked a space that exists in the picture, great!
				this.MarkCell(cell);
			}
			else
			{
				// The user tried to mark a space that is not in the picture; penalty!
				this.IncurPenaltyFromCell(cell);
			}
		}
	}
	
	private MarkCell (cell: CellCoord)
	{
		this.board[cell.Row][cell.Col] = CellStates.Marked;
		this.puzzleRenderer.MarkCell(cell);
		this.previewRenderer.UpdatePreview(this.board, 60, 60);
		
		if (this.IsWinState(this.puzzle, this.board))
		{
			this.OnGameWin();
			return;
		}
	}
	
	private IncurPenaltyFromCell (cell: CellCoord)
	{
		if (this.gameMode === GameRules.Normal)
		{
			this.IncurTimerPenaltyFromCell(cell);
		}
		else
		{
			this.IncurStockPenaltyFromCell(cell);
		}
	}
	
	private IncurTimerPenaltyFromCell (cell: CellCoord)
	{
		var currentTime = this.timer.GetTime();
		currentTime -= this.nextTimePenalty;
		
		this.puzzleRenderer.ShowTimePenalty(cell, this.nextTimePenalty);
		this.IncrementTimerPenalty();
		
		if (currentTime <= 0)
		{
			this.timer.Stop();
			this.timerRenderer.UpdateDisplay(0);
			this.timerRenderer.IndicatePenalty();
			this.OnGameLose();
			return;
		}
		
		this.timer.SetTime(currentTime);
		this.timerRenderer.UpdateDisplay(currentTime);
		this.timerRenderer.IndicatePenalty();
	}
	
	private IncurStockPenaltyFromCell (cell: CellCoord)
	{
		this.puzzleRenderer.ShowStockPenalty(cell);
		this.currentStock -= 1;
		
		if (this.currentStock === 0)
		{
			this.timer.Stop();
			this.OnGameLose();
			this.stockRenderer.IndicatePenalty();
			return;
		}
		
		this.stockRenderer.IndicatePenalty();
	}
	
	private IncrementTimerPenalty ()
	{
		if (this.nextTimePenalty * 2 > Engine.maxTimePenalty)
			return;
			
		this.nextTimePenalty *= 2;
	}
	
	private ToggleSpaceFlags (cells: CellCoord[])
	{
		for (var i = 0; i < cells.length; i++)
		{
			var cell = cells[i];
			
			// If the space is already marked, don't allow the user to turn it into a flag
			if (this.board[cell.Row][cell.Col] === CellStates.Marked)
				continue;
			
			if (this.board[cell.Row][cell.Col] === CellStates.Clear)
			{
				this.board[cell.Row][cell.Col] = CellStates.Flagged;
				this.puzzleRenderer.FlagSpace(cell);
			}
			else
			{
				this.board[cell.Row][cell.Col] = CellStates.Clear;
				this.puzzleRenderer.ClearSpace(cell);	
			}
		}
	}
	
	private IsCellInPicture (cell: CellCoord): boolean
	{
		return this.puzzle.Definition[cell.Row][cell.Col] === 1;
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
	
	private Share ()
	{
		this.timer.Stop();
		this.visualization.Pause();
		document.getElementById("PlayArea").style.display = "none";
		this.sharePrompt.Show();
	}
	
	private Pause ()
	{
		this.timer.Stop();
		this.visualization.Pause();
		document.getElementById("PlayArea").style.display = "none";
		this.pausePrompt.Show();
	}
	
	private UnPause ()
	{
		this.visualization.Start();
		document.getElementById("PlayArea").style.display = "";
		this.timer.Start();
	}
}

interface CellCoord {
	Row: number;
	Col: number;
}