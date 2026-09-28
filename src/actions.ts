import type ModuleInstance from './main.js'

export type ActionsSchema = {
	play_track: {
		options: {
			playlist: 'a' | 'b'
			track: number
		}
	}
	play_pause: {
		options: {
			playlist: 'a' | 'b'
		}
	}
	stop: {
		options: {
			playlist: 'a' | 'b'
		}
	}
	next: {
		options: {
			playlist: 'a' | 'b'
		}
	}
	previous: {
		options: {
			playlist: 'a' | 'b'
		}
	}
	finish_behavior: {
		options: {
			playlist: 'a' | 'b'
			mode: 'loop' | 'next' | 'stop'
		}
	}
	crossfade: {
		options: {
			playlist: 'a' | 'b'
			mode: 'on' | 'off' | 'toggle'
		}
	}
	crossfade_duration: {
		options: {
			playlist: 'a' | 'b'
			duration: number
		}
	}
	crossfade_duration_adjust: {
		options: {
			playlist: 'a' | 'b'
			amount: number
		}
	}
}

function playlistOption(): {
	id: 'playlist'
	type: 'dropdown'
	label: string
	default: 'a'
	choices: Array<{
		id: 'a' | 'b'
		label: string
	}>
} {
	return {
		id: 'playlist',
		type: 'dropdown',
		label: 'Playlist',
		default: 'a',
		choices: [
			{ id: 'a', label: 'Playlist A' },
			{ id: 'b', label: 'Playlist B' },
		],
	}
}

export function UpdateActions(self: ModuleInstance): void {
	self.setActionDefinitions({
		play_track: {
			name: 'Play Track',
			options: [
				playlistOption(),
				{
					id: 'track',
					type: 'number',
					label: 'Track',
					default: 1,
					min: 1,
					max: 999,
					clampValues: true,
				},
			],
			callback: async (event) => {
				const playlist = event.options.playlist
				const track = event.options.track

				await self.sendCommand(`/api/${playlist}/play/${track}`)
			},
		},

		play_pause: {
			name: 'Play / Pause',
			options: [playlistOption()],
			callback: async (event) => {
				await self.sendCommand(`/api/${event.options.playlist}/pause`)
			},
		},

		stop: {
			name: 'Stop',
			options: [playlistOption()],
			callback: async (event) => {
				await self.sendCommand(`/api/${event.options.playlist}/stop`)
			},
		},

		next: {
			name: 'Next Track',
			options: [playlistOption()],
			callback: async (event) => {
				await self.sendCommand(`/api/${event.options.playlist}/next`)
			},
		},

		previous: {
			name: 'Previous Track',
			options: [playlistOption()],
			callback: async (event) => {
				await self.sendCommand(`/api/${event.options.playlist}/previous`)
			},
		},

		finish_behavior: {
			name: 'Set Finish Behaviour',
			options: [
				playlistOption(),
				{
					id: 'mode',
					type: 'dropdown',
					label: 'When Track Finishes',
					default: 'loop',
					choices: [
						{ id: 'loop', label: 'Loop' },
						{ id: 'next', label: 'Play Next' },
						{ id: 'stop', label: 'Stop' },
					],
				},
			],
			callback: async (event) => {
				await self.sendCommand(`/api/${event.options.playlist}/finish-behavior/${event.options.mode}`)
			},
		},

		crossfade: {
			name: 'Crossfade',
			options: [
				playlistOption(),
				{
					id: 'mode',
					type: 'dropdown',
					label: 'Crossfade',
					default: 'toggle',
					choices: [
						{ id: 'on', label: 'On' },
						{ id: 'off', label: 'Off' },
						{ id: 'toggle', label: 'Toggle' },
					],
				},
			],
			callback: async (event) => {
				await self.sendCommand(`/api/${event.options.playlist}/crossfade/${event.options.mode}`)
			},
		},

		crossfade_duration: {
			name: 'Set Crossfade Duration',
			options: [
				playlistOption(),
				{
					id: 'duration',
					type: 'number',
					label: 'Duration (seconds)',
					default: 2,
					min: 0,
					max: 60,
					step: 0.1,
				},
			],
			callback: async (event) => {
				await self.sendCommand(`/api/${event.options.playlist}/crossfade-duration/${event.options.duration}`)
			},
		},

		crossfade_duration_adjust: {
			name: 'Adjust Crossfade Duration',
			options: [
				playlistOption(),
				{
					id: 'amount',
					type: 'number',
					label: 'Adjustment (seconds)',
					default: 0.5,
					min: -10,
					max: 10,
					step: 0.5,
				},
			],
			callback: async (event) => {
				const state = self.state

				if (!state) {
					self.log('warn', 'Cannot adjust crossfade duration: no state available')
					return
				}

				const playlist = event.options.playlist === 'a' ? state.playlistA : state.playlistB

				const current = playlist.crossfade.duration
				const amount = event.options.amount

				const duration = Math.min(10, Math.max(0, current + amount))

				await self.sendCommand(`/api/${event.options.playlist}/crossfade-duration/${duration}`)
			},
		},
	})
}
