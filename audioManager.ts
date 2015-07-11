class Sounds
{
	static MainMenu = "MainMenu.mp3";
}

class AudioManager
{
	static Play (fileName: string)
	{
		
	}
	
	static Stop (fileName: string)
	{
		
	}
	
	static PreloadSounds (fileNames: string[], onReadyCallback: () => void)
	{
		var numSounds = fileNames.length;
		var numSoundsLoaded = 0;
		
		for (var i = 0; i < fileNames.length; i++)
		{
			AudioManager.PreloadSound(fileNames[0], () => {
				numSoundsLoaded += 1;
				
				if (numSoundsLoaded === numSounds)
				{
					onReadyCallback();
				}
			});
		}
	}
	
	private static PreloadSound (fileName: string, onReadyCallback: () => void)
	{
		onReadyCallback();
	}
}