class VisualizationFactory
{
	static Create (puzzle: Puzzle): Visualization
	{
		if ("VideoUrl" in puzzle)
		{
			return new VideoVisualization(<VideoPuzzle>puzzle);
		}
		
		return new PartyModeVisualization();
	}
}

interface Visualization
{
	Start: (container: HTMLElement) => void;
	Stop: () => void;
}

class VideoVisualization implements Visualization
{
	private container: HTMLElement;
	private videoUrl: string;
	private player;
	
	constructor (puzzle: VideoPuzzle)
	{
		this.videoUrl = puzzle.VideoUrl;
	}
	
	Start (container: HTMLElement)
	{
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
	
	Stop  ()
	{
		this.player.pauseVideo();
	}
	
	private OnPlayerReady ()
	{
		var videoIframe = document.getElementById("Video");
		
		this.player.playVideo();
		//alert(this.player.getDuration());
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
	
	Start (container: HTMLElement)
	{
		
	}
	
	Stop  ()
	{
		
	}
}
