/** Provides a backing store for save data */
class SaveDataProvider
{
	private static solvedPuzzleIdsStorageKey = "solvedpuzzleids"; 
	
	private static GetItem (key: string)
	{
		return JSON.parse(localStorage.getItem(key));
	}
	
	private static SetItem (key: string, value: any)
	{
		return localStorage.setItem(key, JSON.stringify(value));
	} 
	
	static get SolvedPuzzleIds (): string[]
	{
		return SaveDataProvider.GetItem(SaveDataProvider.solvedPuzzleIdsStorageKey) || [];
	}
	
	static AddSolvedPuzzleId (id: string)
	{
		var solvedPuzzleIds = SaveDataProvider.SolvedPuzzleIds;
		
		if (solvedPuzzleIds.indexOf(id) !== -1)
			return;
			
		solvedPuzzleIds.push(id);
		SaveDataProvider.SetItem(SaveDataProvider.solvedPuzzleIdsStorageKey, solvedPuzzleIds);
	}
}