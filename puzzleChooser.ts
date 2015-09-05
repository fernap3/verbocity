interface PuzzleChooserOptions
{
	Container: HTMLElement;
	Puzzles: Puzzle[];
	OnCloseCallback: () => void;
	OnPuzzleSelectCallback: (puzzle: Puzzle) => void;
}

class PuzzleChooser
{
	private options: PuzzleChooserOptions;
	private textInput: HTMLInputElement;
	private overlay: HTMLElement;
	private onOverlayClick: (MouseEvent) => void;
	
	constructor (options: PuzzleChooserOptions)
	{
		this.options = options;
		
		this.overlay = document.createElement("div");
		this.overlay.className = "clearOverlay";
		
		this.onOverlayClick = (MouseEvent) => {
			this.Hide();
		}
		
		var builtinTabButton = <HTMLElement>this.options.Container.querySelector("button[data-tab='builtin']");
		var customTabButton = <HTMLElement>this.options.Container.querySelector("button[data-tab='custom']");
		var builtinTab = <HTMLElement>this.options.Container.querySelector("div[data-tab='builtin']");
		var customTab = <HTMLElement>this.options.Container.querySelector("div[data-tab='custom']");
		
		customTabButton.classList.add("inactive");
		
		builtinTabButton.onclick = (evt) => {
			customTab.style.display = "none";
			builtinTab.style.display = "block";
			builtinTabButton.classList.remove("inactive");
			customTabButton.classList.add("inactive");
		};
		
		customTabButton.onclick = (evt) => {
			customTab.style.display = "block";
			builtinTab.style.display = "none";
			builtinTabButton.classList.add("inactive");
			customTabButton.classList.remove("inactive");
		};
	}
	
	Show ()
	{
		document.body.appendChild(this.overlay);
		this.options.Container.style.display = "block";
		Centerer.CenterContainers();
		
		// Add the click listener in a different "thread" so the click to open
		// the share prompt doesn't also trigger this.
		setTimeout(() => {
			this.overlay.addEventListener("click", this.onOverlayClick );
		}, 0);
		
		this.RenderBuiltinPreviews();
	}
	
	Hide ()
	{
		this.overlay.removeEventListener("click", this.onOverlayClick );
		this.options.Container.style.display = "none";
		document.body.removeChild(this.overlay);
		this.options.OnCloseCallback();
	}
	
	private RenderBuiltinPreviews ()
	{
		var list = <HTMLUListElement>this.options.Container.querySelector("ul#BuiltinPreviewList");
		list.innerHTML = "";
		
		for (var i = 0; i < this.options.Puzzles.length; i++)
		{
			var puzzle = this.options.Puzzles[i];
			var li = document.createElement("li");
			
			if (SaveDataProvider.SolvedPuzzleIds.indexOf(puzzle.Id) !== -1)
			{
				// The puzzle has been solved; show the solved image instead of the default
				// mysteriousi question mark
				li.classList.add("solved");
				li.appendChild(this.GetPreviewCanvas(puzzle));
				li.title = puzzle.Name;
				PuzzleChooser.AddSolvedIcon(li);
			}
			
			if ((<VideoPuzzle>puzzle).VideoUrl != null)
			{
				PuzzleChooser.AddVideoIcon(li);
			}

			li.onclick = this.CreatePuzzleClickHandler(puzzle);
			
			list.appendChild(li);
		}
		
		var puzzlesAdded = this.options.Puzzles.length;
		
		// Add blank puzzle icons so the bottom-most row of icons will
		// be left aligned
		while (puzzlesAdded % 10 !== 0)
		{
			var li = document.createElement("li");
			li.className = "placeHolder";
			list.appendChild(li);
			puzzlesAdded += 1;
		}
	}
	
	private static AddVideoIcon (element: HTMLElement)
	{
		var iconContainer = document.createElement("div");
		iconContainer.className = "videoIcon";
		
		element.appendChild(iconContainer);
	}
	
	private static AddSolvedIcon (element: HTMLElement)
	{
		var iconContainer = document.createElement("div");
		iconContainer.className = "solvedIcon";
		
		element.appendChild(iconContainer);
	}
	
	private CreatePuzzleClickHandler  (puzzle: Puzzle): (evt) => void
	{
		return (evt) =>
		{
			this.options.OnPuzzleSelectCallback(puzzle);
		};
	}
	
	private GetPreviewCanvas (puzzle: Puzzle): HTMLCanvasElement
	{
		var canvas = document.createElement("canvas");
		var renderer = new PreviewRenderer(canvas);
		renderer.UpdatePreview(puzzle.Definition, 30, 30);
		return canvas;
	}
}