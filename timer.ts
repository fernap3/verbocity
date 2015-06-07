class TimerOptions
{
	StartSeconds: number
	UpdateCallback: Function
}

class Timer
{
	_options: TimerOptions
	_lastSeconds: number
	_lastSecondsSinceEpoch: number;
	_currentCountdownSeconds: number;
	
	constructor (options:TimerOptions)
	{
		this._options = options;
		this._lastSeconds = null;
	}
	
	Start () {
		this._lastSecondsSinceEpoch = Math.floor(new Date().getTime() / 1000);
		this._currentCountdownSeconds = this._options.StartSeconds;
		this._CheckUpdate();
	}
	
	_CheckUpdate ()
	{
		var currentSecondsSinceEpoch = Math.floor(new Date().getTime() / 1000);
		
		if (currentSecondsSinceEpoch !== this._lastSecondsSinceEpoch)
		{
			this._currentCountdownSeconds--;
			this._options.UpdateCallback(this._currentCountdownSeconds);
			this._lastSecondsSinceEpoch = currentSecondsSinceEpoch;
		}
		
		if (this._currentCountdownSeconds === 0)
			return;
		
		var thisObj = this;
		
		setTimeout(function() {
			thisObj._CheckUpdate();
		}, 100);
	}
}
