class Centerer
{
	// Centers containers, both vertically and horizontally, on the page.
	// Containers to be centered should have the [data-center] attribute to take advantage.
	
	static SetupResizeHandler ()
	{
		window.onresize = (evt) => {
			Centerer.CenterContainers();
		}
	}
	
	static CenterContainers ()
	{
		var containers = document.querySelectorAll("[data-center]");
		
		for (var i = 0; i < containers.length; i++)
		{
			var container = <HTMLElement>containers[i];
			var height = container.offsetHeight;
			
			// Don't try to center the container if it is not displayed
			if (height === 0)
				continue;
				
			container.style.left = "0";
			container.style.top = "0";
			
			var width = container.offsetWidth;
			
			container.style.left = Math.max((window.innerWidth / 2) - (width / 2), 0) + "px";
			container.style.top = Math.max((window.innerHeight / 2) - (height / 2), 0) + "px";
		}
	}
}