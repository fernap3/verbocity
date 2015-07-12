/// <reference path='typings/tsd.d.ts' />

class AudioManager
{
	static context: AudioContext;
	
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
		var request = new XMLHttpRequest();
		request.open('GET', "sounds/" + fileName, true);
		request.responseType = 'arraybuffer';
		
		request.onload = () => {
			AudioManager.context.decodeAudioData(request.response, (buffer) => {
				
				
				onReadyCallback();
			},
			() => {
				throw "Error decoding audio";
			});
		}
		
		request.send();
	}
}

try {
	window.AudioContext = window.AudioContext || window.webkitAudioContext;
	AudioManager.context = new AudioContext();
}
catch(e) {
	console.log('Web Audio API is not supported in this browser');
}