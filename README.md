# comboDatabase
A better looking database of combos than a wiki.

Combo List
	Features
		<Display game>
			<Display game systems>
			<Display characters>
				Display combos for character
					toggle move notation for combos
					show videos of combos
					show notes/damage/meter gain/position of combos
					reorder combos depending on damage / meter gain
					<show different routes for the same combo>
					<show move list of each character>
						<scrape data from wikis?>
		sign up
		login
			authorize actions for creating, edit, and remove own combos
			send request for editing other's combos
			<Create game>
				<Create characters>
					Create combos
						write move notation
						designate notation, damage, meter gain, additional notes
					edit combos of your own and others
					add videos of combos (youtube/nico embed link)
					remove combos
		logout


User Stories
A user should be able to
	signup
	login
	logout
	when logged in
		<create a game>
			<create a character>
				create a combo
				edit their own combo
				remove their own combo
				send optimization requests of combos
	<reorder combos depending on certain factors>
	<switch move notation>
	<see an image of each move when moused over or highlighted>
	<see a full movelist of a character>

Modeling			   
	<Game>
		<Character>
			Combos
				moves: string
				damage: string || number for comparisons?
				meter gain: string || number for comparisons?
				position: string
				notes: string
				youtube links: string
				optimization requests
					[reference to request in user] // when you log in display  // can replace the original move
	Users
		name: string
		passwordDigest: string
		Combos
			embed combos rather than references
		optimization requests: string

accordion to move things down and focus