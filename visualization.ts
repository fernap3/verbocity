declare var YT: any;

class VisualizationFactory
{
	static Create (puzzle: Puzzle, onReadyCallback: (vizInfo: any) => void): Visualization
	{
		if ("VideoUrl" in puzzle)
		{
			return new VideoVisualization(<VideoPuzzle>puzzle, onReadyCallback);
		}
		
		return new PartyModeVisualization(puzzle, onReadyCallback);
	}
}

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
	private player;
	
	constructor (puzzle: VideoPuzzle, onReadyCallback: (vizInfo: any) => void)
	{
		this.videoUrl = puzzle.VideoUrl;
		this.onReadyCallback = onReadyCallback;
		
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
				//'onStateChange': onPlayerStateChange
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
	
	constructor (puzzle: Puzzle, onReadyCallback: (vizInfo: any) => void)
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
