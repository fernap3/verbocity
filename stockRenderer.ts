interface StockRendererOptions
{
	StockContainer: HTMLElement;
	InitialStock: number;
}

class StockRenderer
{
	private options: StockRendererOptions;
	private currentStock: number;
	
	constructor (options: StockRendererOptions)
	{
		this.options = options;
		this.currentStock = this.options.InitialStock;
		this.UpdateStockCount(this.currentStock);
	}
	
	IndicatePenalty ()
	{
		this.currentStock -= 1;
		this.UpdateStockCount(this.currentStock);
	}
	
	private UpdateStockCount (count: number)
	{
		this.options.StockContainer.innerHTML = "";
		
		for (var i = 0; i < count; i++)
		{
			this.options.StockContainer.innerHTML += "0";			
		}
	}
}
