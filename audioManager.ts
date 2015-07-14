/// <reference path='typings/tsd.d.ts' />

interface Sound
{
	// The basename (eg. "mainMenu.mp3") of the file to playFileName: string;	
	FileName: string;
	
	// Indicates whether or not the sound should loop
	Loop: boolean;
	
	// If the file should loop, indicates the start (in samples) of the loop.
	LoopStart: number;
}

interface PlayingSound
{
	Sources: AudioBufferSourceNode[];
}

interface AudioBufferCollection
{
	[filename: string]: AudioBuffer;
}

interface PlayingSoundCollection
{
	[handle: string]: PlayingSound;
}

class AudioManager
{
	static context: AudioContext;
	
	// The decoded audio data for each audio file loaded, indexed by filename 
	static buffers: AudioBufferCollection = {};
	
	// The currently playing sounds, indexed by handle returned by AudioManager.Play
	static playingSounds: PlayingSoundCollection = {};
	
	// Plays a sound, returning a unique handle which can be used to stop
	// the sound using AudioManager.Stop
	static Play (sound: Sound): string
	{
		if (sound.FileName in AudioManager.buffers === false)
		{
			AudioManager.PreloadSound(sound, () => {
				AudioManager.Play(sound);
			});
			return null;
		}
		
		if (sound.Loop === false)
		{
			return AudioManager.PlayOneShot(AudioManager.buffers[sound.FileName]);
		}
		
		return AudioManager.PlayWithLoop(AudioManager.buffers[sound.FileName], sound.LoopStart);
	}
	
	// Stops a currently-playing sound and takes as input the handle returned by
	// AudioManager.Play.  If the instance attached to the handle is no longer
	// playing, this function does nothing.
	static Stop (handle: string)
	{
		var playingSound = AudioManager.playingSounds[handle];
		
		if (typeof playingSound === "undefined")
			return;
		
		var sources = playingSound.Sources;
		
		for (var i = 0; i < sources.length; i++)
		{
			sources[i].stop();
		}
		
		delete AudioManager.playingSounds[handle];
	}
	
	private static PlayOneShot (buffer: AudioBuffer): string
	{
		var source = AudioManager.context.createBufferSource();
		source.connect(AudioManager.context.destination);
		source.buffer = buffer;
		source.start();
		
		var handle = Math.floor(Math.random() * Number.MIN_VALUE).toString();
		AudioManager.playingSounds[handle] = { Sources: [source] };
		return handle;
	}
	
	private static PlayWithLoop (buffer: AudioBuffer, loopStart: number): string
	{
		var middleArray = new Float32Array(buffer.length - loopStart);
		var loopBuffer = AudioManager.context.createBuffer(buffer.numberOfChannels, 
			buffer.length - loopStart, AudioManager.context.sampleRate);
		
		for (var i = 0; i < buffer.numberOfChannels; i++)
		{
			buffer.copyFromChannel(middleArray, i, loopStart);
			loopBuffer.copyToChannel(middleArray, i, 0);
		}
		
		var beginSource = AudioManager.context.createBufferSource();
		var loopSource = AudioManager.context.createBufferSource();
		
		
		beginSource.buffer = buffer;
		beginSource.connect(AudioManager.context.destination);
		
		loopSource.buffer = loopBuffer;
		loopSource.connect(AudioManager.context.destination);
		
		
		loopSource.loop = true;
		
		var beginOffsetSeconds = loopStart / AudioManager.context.sampleRate;
		
		beginSource.start(AudioManager.context.currentTime, 0, beginOffsetSeconds);
		loopSource.start(AudioManager.context.currentTime + beginOffsetSeconds);
		
		var handle = Math.floor(Math.random() * Number.MIN_VALUE).toString();
		AudioManager.playingSounds[handle] = { Sources: [beginSource, loopSource] };
		return handle;
	}
	
	static PreloadSounds (sounds: Sound[], onReadyCallback: () => void)
	{
		var numSounds = sounds.length;
		var numSoundsLoaded = 0;
		
		for (var i = 0; i < sounds.length; i++)
		{
			AudioManager.PreloadSound(sounds[0], () => {
				numSoundsLoaded += 1;
				
				if (numSoundsLoaded === numSounds)
				{
					onReadyCallback();
				}
			});
		}
	}
	
	private static PreloadSound (sound: Sound, onReadyCallback: () => void)
	{
		var request = new XMLHttpRequest();
		request.open('GET', "sounds/" + sound.FileName, true);
		request.responseType = 'arraybuffer';
		
		request.onload = () => {
			AudioManager.context.decodeAudioData(request.response, (buffer) => {
				AudioManager.buffers[sound.FileName] = buffer;
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
	throw "Web Audio API is not supported in this browser";
}