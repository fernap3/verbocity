interface TimerRendererOptions
{
	TimerContainer: HTMLElement;
}

class TimerRenderer
{
	private options: TimerRendererOptions;
	
	constructor (options: TimerRendererOptions)
	{
		this.options = options;
	}
	
	UpdateDisplay (seconds: number)
	{
		var timeString = "";
		
		if (seconds < 60 * 10)
		{
			timeString += "0";
		}
		
		timeString += Math.floor(seconds / 60);
		
		timeString += ":";
		
		if (seconds % 60 < 10)
		{
			timeString += "0";
		}
		
		timeString += Math.floor(seconds % 60);
		
		this.options.TimerContainer.innerHTML = timeString;
	}
}
