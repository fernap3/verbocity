//@import "engine.ts"

class PreviewRenderer
{
	private canvas: HTMLCanvasElement;
	
	constructor (canvas: HTMLCanvasElement)
	{
		this.canvas = canvas;
	}
	
	public UpdatePreview (board: number[][])
	{
		var boardHeight = board.length;
		var boardWidth = board[0].length;
		
		this.canvas.height = boardHeight * Engine.canvasScale * window.devicePixelRatio;
		this.canvas.width = boardWidth * Engine.canvasScale * window.devicePixelRatio;
		
		var context = this.canvas.getContext("2d");
		context.scale(Engine.canvasScale * window.devicePixelRatio, Engine.canvasScale * window.devicePixelRatio);
		
		for (var row = 0; row < boardHeight; row++)
		{
			for(var col = 0; col < boardWidth; col++)
			{
				if (board[row][col] === 1)
				{
					context.fillRect(col, row, 1, 1);
				}
			}
		}
	}
}