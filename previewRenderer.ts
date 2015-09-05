/** Draws the small live puzzle preview during gameplay */
class PreviewRenderer
{
	private static canvasScale = 2;
	private canvas: HTMLCanvasElement;
	
	constructor (canvas: HTMLCanvasElement)
	{
		this.canvas = canvas;
		
		var context = this.canvas.getContext("2d");
		context.clearRect(0, 0, canvas.width, canvas.height);
	}
	
	public UpdatePreview (board: number[][], canvasHeight: number, canvasWidth: number)
	{
		var boardHeight = board.length;
		var boardWidth = board[0].length;
		
		this.canvas.height = canvasHeight * window.devicePixelRatio;
		this.canvas.width = canvasWidth * window.devicePixelRatio;
		
		var context = this.canvas.getContext("2d");
		var scale = (canvasHeight * window.devicePixelRatio) / boardHeight;
		
		for (var row = 0; row < boardHeight; row++)
		{
			for(var col = 0; col < boardWidth; col++)
			{
				if (board[row][col] === 1)
				{
					context.fillRect(col * scale, row * scale, scale, scale);
				}
			}
		}
	}
}