interface StockRendererOptions
{
	StockContainer: HTMLElement;
	InitialStock: number;
}

class StockRenderer
{
	private options: StockRendererOptions;
	private currentStock: number;
	private iconsContainer: HTMLElement;
	
	constructor (options: StockRendererOptions)
	{
		this.options = options;
		this.currentStock = this.options.InitialStock;
		this.iconsContainer = <HTMLElement>this.options.StockContainer.querySelector("#StockIcons");
		this.UpdateStockCount(this.currentStock);
	}
	
	IndicatePenalty ()
	{
		this.currentStock -= 1;
		this.UpdateStockCount(this.currentStock);
	}
	
	private UpdateStockCount (count: number)
	{
		this.iconsContainer.innerHTML = "";
		
		for (var i = 0; i < count; i++)
		{
			this.iconsContainer.innerHTML += "0";			
		}
	}
}
