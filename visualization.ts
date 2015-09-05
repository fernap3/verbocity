declare var YT: any;

interface VisualizationFactoryOptions
{
	Puzzle: Puzzle;
	OnReadyCallback: (vizInfo: any) => void;
	OnPauseCallback: () => void;
	OnUnPauseCallback: () => void;
}

class VisualizationFactory
{
	static Create (options): Visualization
	{
		if ("VideoUrl" in options.Puzzle)
		{
			return new VideoVisualization(<VideoPuzzle>options.Puzzle, options.OnReadyCallback, 
				options.OnPauseCallback, options.OnUnPauseCallback);
		}
		
		return new PartyModeVisualization(options.OnReadyCallback);
	}
}

/** Describes a visualization that appears behind gameplay */
interface Visualization
{
	Start: () => void;
	Pause: () => void;
	Stop: () => void;
}

class VideoVisualization implements Visualization
{
	private container: HTMLElement;
	private videoUrl: string;
	private onReadyCallback: (vizInfo: any) => void;
	private onPauseCallback: () => void;
	private onUnPauseCallback: () => void;
	private player;
	
	constructor (puzzle: VideoPuzzle, onReadyCallback: (vizInfo: any) => void, onPauseCallback: () => void,
		onUnPauseCallback: () => void)
	{
		this.videoUrl = puzzle.VideoUrl;
		this.onReadyCallback = onReadyCallback;
		this.onPauseCallback = onPauseCallback;
		this.onUnPauseCallback = onUnPauseCallback;
		
		this.player = new YT.Player("Video", {
			videoId: VideoVisualization.GetYouTubeVideoIdFromUrl(this.videoUrl),
			height: "100%",
			width: "100%",
			playerVars: {
				autoplay: '0',
				controls: '0',
				disablekb: '1',
				iv_load_policy: '3',
				modestbranding: '1',
				rel: '0',
				showinfo: '0'
			},
			events: {
				onReady: (evt) => { this.OnPlayerReady(); },
				onStateChange: (evt) => { this.OnPlayerStateChange(evt); }
			}
		});
	}
	
	Start ()
	{
		this.player.playVideo();		
	}
	
	Pause ()
	{
		this.player.pauseVideo();		
	}
	
	Stop ()
	{
		var video = document.getElementById("Video");
		this.player.destroy();
	}
	
	private OnPlayerReady ()
	{
		this.onReadyCallback({
			Duration: this.player.getDuration()
		});
	}
	
	private OnPlayerStateChange (evt)
	{
		switch (evt.data)
		{
			case YT.PlayerState.PAUSED:
				this.onPauseCallback();
				break;
			case YT.PlayerState.PLAYING:
				this.onUnPauseCallback();
				break;
		}
	}
	
	private static GetYouTubeVideoIdFromUrl (url: string)
	{
		var searchText = "/watch?v=";
		return url.substr(url.indexOf(searchText) + searchText.length);
	}
}

// https://github.com/preziotte/party-mode
class PartyModeVisualization implements Visualization
{
	private container: HTMLElement;
	
	constructor (onReadyCallback: (vizInfo: any) => void)
	{
		// Has to be in set timeout because the callback needs access
		// to this constructed visualization
		setTimeout(() => { onReadyCallback({}); });
	}
	
	Start ()
	{
		
	}
	
	Pause ()
	{
		
	}
	
	Stop ()
	{
		
	}
}
