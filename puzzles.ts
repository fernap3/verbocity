interface Puzzle
{
	Id: string;
	Name: string;
	Definition: number[][];
}

interface VideoPuzzle extends Puzzle
{
	VideoUrl: string;
}

class PuzzleProvider
{
	static BuiltinPuzzles: Puzzle[];
	
	static GetBuiltinPuzzle (id: string): Puzzle
	{
		for (var i = 0; i < PuzzleProvider.BuiltinPuzzles.length; i++)
		{
			if (PuzzleProvider.BuiltinPuzzles[i].Id === id)
				return PuzzleProvider.BuiltinPuzzles[i]; 
		}
		
		return null;
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
		VideoUrl: "https://www.youtube.com/watch?v=DMfxKYEN_KQ",
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
