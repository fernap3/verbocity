interface Puzzle
{
	Id: string;
	Name: string;
	Definition: number[][];
}

class PuzzleProvider
{
	static BuiltinPuzzles: Puzzle[];
	
	static GetBuiltinPuzzle (name: string)
	{
		for (var i = 0; i < PuzzleProvider.BuiltinPuzzles.length; i++)
		{
			if (PuzzleProvider.BuiltinPuzzles[i].Name === name)
				return PuzzleProvider.BuiltinPuzzles[i]; 
		}
		
		throw "Built-in puzzle not found";
	}
	
	static GetRandomBuiltinPuzzle ()
	{
		return PuzzleProvider.BuiltinPuzzles[Math.floor(Math.random() * PuzzleProvider.BuiltinPuzzles.length)];
	}
}

PuzzleProvider.BuiltinPuzzles = [
	{
		Id: "MOCKID",
		Name: "Game Boy",
		Definition: [
			[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
			[1,1,0,0,0,0,0,0,0,0,0,0,0,1,1],
			[1,1,0,1,1,1,1,1,1,1,1,1,0,1,1],
			[1,1,0,1,0,0,0,0,0,0,0,1,0,1,1],
			[1,1,0,1,0,0,0,0,0,0,0,1,0,1,1],
			[1,1,0,1,0,0,0,0,0,0,0,1,0,1,1],
			[1,1,0,1,0,0,0,0,0,0,0,1,0,1,1],
			[1,1,0,1,1,1,1,1,1,1,1,1,0,1,1],
			[1,1,0,0,0,0,0,0,0,0,0,0,0,1,1],
			[1,1,0,0,1,0,0,0,0,0,0,0,0,1,1],
			[1,1,0,1,1,1,0,0,0,0,0,0,0,1,1],
			[1,1,0,0,1,0,0,0,0,1,1,1,0,1,1],
			[1,1,0,0,0,0,0,0,0,0,0,0,0,1,1],
			[1,1,0,0,0,0,0,0,0,0,0,0,1,1,1],
			[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
		]
	},
	{
		Id: "MOCKID2",
		Name: "Test",
		Definition: [
			[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
		]
	}
];
