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
		Id: "dd56e5ef-69e3-44de-80f3-b6750feb6000",
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
		Id: "2a8a8545-dc16-4de2-a640-e6a2b79c8325",
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
