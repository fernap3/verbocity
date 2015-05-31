function Engine (options)
{
	this._options = options;
	this._board = this._CreateBoardFromPuzzle(this._options.Puzzle);
}

Engine.cellStates = { Clear: 0, Marked: 1, Question: 2 };

Engine.prototype = 
{
	StartGame: function (options)
	{
		var thisObj = this;
		
		var timer = new Timer({
			StartSeconds: 64,
			UpdateCallback: this._options.OnTimerUpdateCallback
		});
		
		timer.Start();
	},
	
	_CreateBoardFromPuzzle: function (puzzle)
	{
		var board = [];
		
		for (var i = 0; i < puzzle.length; i++)
		{
			var row = [];
			
			for (var j = 0; j < puzzle[i].length; j++)
			{
				row.push(Engine.cellStates.Clear);
			}
			
			board.push(row);
		}
		
		return board;
	}
};