import type ModuleInstance from './main.js'

export type VariablesSchema = {
	playlistAState: string
	playlistATrack: string
	playlistATrackName: string
	playlistACrossfadeEnabled: string
	playlistACrossfadeDuration: string
	playlistBState: string
	playlistBTrack: string
	playlistBTrackName: string
	playlistBCrossfadeEnabled: string
	playlistBCrossfadeDuration: string
}

export function UpdateVariableDefinitions(self: ModuleInstance): void {
	self.setVariableDefinitions({
		playlistAState: {
			name: 'Playlist A State',
		},
		playlistATrack: {
			name: 'Playlist A Track',
		},
		playlistATrackName: {
			name: 'Playlist A Track Name',
		},
		playlistACrossfadeEnabled: {
			name: 'Playlist A Crossfade Enabled',
		},
		playlistACrossfadeDuration: {
			name: 'Playlist A Crossfade Duration',
		},
		playlistBState: {
			name: 'Playlist B State',
		},
		playlistBTrack: {
			name: 'Playlist B Track',
		},
		playlistBTrackName: {
			name: 'Playlist B Track Name',
		},
		playlistBCrossfadeEnabled: {
			name: 'Playlist B Crossfade Enabled',
		},
		playlistBCrossfadeDuration: {
			name: 'Playlist B Crossfade Duration',
		},
	})
}
