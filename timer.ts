class TimerOptions
{
	StartSeconds: number
	UpdateCallback: Function
}

class Timer
{
	private options: TimerOptions
	private lastSeconds: number
	private lastSecondsSinceEpoch: number;
	private currentCountdownSeconds: number;
	private isActive: boolean;
	
	constructor (options:TimerOptions)
	{
		this.options = options;
		this.lastSeconds = null;
		this.currentCountdownSeconds = this.options.StartSeconds;
	}
	
	Start ()
	{
		this.lastSecondsSinceEpoch = Math.floor(new Date().getTime() / 1000);
		this.isActive = true;
		this.CheckUpdate();
	}
	
	Stop ()
	{
		this.isActive = false;
	}
	
	SetTime (seconds: number)
	{
		this.currentCountdownSeconds = seconds;
		this.lastSecondsSinceEpoch = Math.floor(new Date().getTime() / 1000);
	}
	
	GetTime ()
	{
		return this.currentCountdownSeconds;
	}
	
	private CheckUpdate ()
	{
		if (this.isActive === false)
			return;
		
		var currentSecondsSinceEpoch = Math.floor(new Date().getTime() / 1000);
		
		if (currentSecondsSinceEpoch !== this.lastSecondsSinceEpoch)
		{
			this.currentCountdownSeconds -= 1;
			this.options.UpdateCallback(this.currentCountdownSeconds);
			this.lastSecondsSinceEpoch = currentSecondsSinceEpoch;
		}
		
		if (this.currentCountdownSeconds === 0)
			return;
		
		var thisObj = this;
		
		setTimeout(function() {
			thisObj.CheckUpdate();
		}, 100);
	}
}
