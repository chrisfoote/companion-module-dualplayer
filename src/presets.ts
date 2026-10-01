import type ModuleInstance from './main.js'

export function UpdatePresets(self: ModuleInstance): void {
	const presets: Record<string, any> = {}

	const playlistStructure = [
		{
			id: 'playlist-a',
			name: 'Playlist A',
			definitions: [] as string[],
		},
		{
			id: 'playlist-b',
			name: 'Playlist B',
			definitions: [] as string[],
		},
		{
			id: 'transport',
			name: 'Transport',
			definitions: [] as string[],
		},
	]

	for (const playlist of ['a', 'b'] as const) {
		const structure = playlistStructure.find((item) => item.id === `playlist-${playlist}`)!

		for (let track = 1; track <= 10; track++) {
			const id = `${playlist}-track-${track}`

			structure.definitions.push(id)

			presets[id] = {
				name: `Playlist ${playlist.toUpperCase()} Track ${track}`,
				type: 'simple',
				style: {
					text: `${playlist.toUpperCase()}${track}`,
					size: '18',
					color: 0xffffff,
					bgcolor: 0x000000,
				},
				steps: [
					{
						down: [
							{
								actionId: 'play_track',
								options: {
									playlist,
									track,
								},
							},
						],
						up: [],
					},
				],
				feedbacks: [
					{
						feedbackId: 'track_playing',
						options: {
							playlist,
							track,
						},
						style: {
							bgcolor: 0x009600,
							color: 0xffffff,
						},
					},
				],
			}
		}
	}

	const transportButtons = [
		{
			id: 'a-play-pause',
			name: 'Playlist A Play / Pause',
			text: 'A ▶/Ⅱ',
			actionId: 'play_pause',
			playlist: 'a',
			mode: undefined,
			amount: undefined,
		},
		{
			id: 'a-stop',
			name: 'Playlist A Stop',
			text: 'A ■',
			actionId: 'stop',
			playlist: 'a',
			mode: undefined,
			amount: undefined,
		},
		{
			id: 'a-previous',
			name: 'Playlist A Previous',
			text: 'A ◀',
			actionId: 'previous',
			playlist: 'a',
			mode: undefined,
			amount: undefined,
		},
		{
			id: 'a-next',
			name: 'Playlist A Next',
			text: 'A ▶',
			actionId: 'next',
			playlist: 'a',
			mode: undefined,
			amount: undefined,
		},
		{
			id: 'b-play-pause',
			name: 'Playlist B Play / Pause',
			text: 'B ▶/Ⅱ',
			actionId: 'play_pause',
			playlist: 'b',
			mode: undefined,
			amount: undefined,
		},
		{
			id: 'b-stop',
			name: 'Playlist B Stop',
			text: 'B ■',
			actionId: 'stop',
			playlist: 'b',
			mode: undefined,
			amount: undefined,
		},
		{
			id: 'b-previous',
			name: 'Playlist B Previous',
			text: 'B ◀',
			actionId: 'previous',
			playlist: 'b',
			mode: undefined,
			amount: undefined,
		},
		{
			id: 'b-next',
			name: 'Playlist B Next',
			text: 'B ▶',
			actionId: 'next',
			playlist: 'b',
			mode: undefined,
			amount: undefined,
		},
		{
			id: 'a-crossfade',
			name: 'Playlist A Crossfade',
			text: 'A X-Fade',
			actionId: 'crossfade',
			playlist: 'a',
			mode: 'toggle',
			amount: undefined,
		},
		{
			id: 'b-crossfade',
			name: 'Playlist B Crossfade',
			text: 'B X-Fade',
			actionId: 'crossfade',
			playlist: 'b',
			mode: 'toggle',
			amount: undefined,
		},
		{
			id: 'a-fade-up',
			name: 'Playlist A Crossfade +0.5s',
			text: 'A Fade +',
			actionId: 'crossfade_duration_adjust',
			playlist: 'a',
			amount: 0.5,
			mode: undefined,
		},
		{
			id: 'a-fade-down',
			name: 'Playlist A Crossfade -0.5s',
			text: 'A Fade -',
			actionId: 'crossfade_duration_adjust',
			playlist: 'a',
			amount: -0.5,
			mode: undefined,
		},
		{
			id: 'b-fade-up',
			name: 'Playlist B Crossfade +0.5s',
			text: 'B Fade +',
			actionId: 'crossfade_duration_adjust',
			playlist: 'b',
			amount: 0.5,
			mode: undefined,
		},
		{
			id: 'b-fade-down',
			name: 'Playlist B Crossfade -0.5s',
			text: 'B Fade -',
			actionId: 'crossfade_duration_adjust',
			playlist: 'b',
			amount: -0.5,
			mode: undefined,
		},
	] as const

	for (const button of transportButtons) {
		playlistStructure[2].definitions.push(button.id)

		presets[button.id] = {
			name: button.name,
			type: 'simple',
			style: {
				text: button.text,
				size: '18',
				color: 0xffffff,
				bgcolor: 0x000000,
			},
			steps: [
				{
					down: [
						{
							actionId: button.actionId,
							options: {
								playlist: button.playlist,
								...(button.mode ? { mode: button.mode } : {}),
								...(button.amount !== undefined ? { amount: button.amount } : {}),
							},
						},
					],
					up: [],
				},
			],
			feedbacks:
				button.actionId === 'crossfade'
					? [
							{
								feedbackId: 'crossfade_enabled',
								options: {
									playlist: button.playlist,
								},
								style: {
									bgcolor: 0x009600,
									color: 0xffffff,
								},
							},
						]
					: [],
		}
	}

	presets['a-fade-time'] = {
		name: 'Playlist A Crossfade Duration',
		type: 'simple',
		style: {
			text: 'A Fade\n$(umcplayer:playlistACrossfadeDuration)s',
			size: '18',
			color: 0xffffff,
			bgcolor: 0x000000,
		},
		steps: [],
		feedbacks: [],
	}

	presets['b-fade-time'] = {
		name: 'Playlist B Crossfade Duration',
		type: 'simple',
		style: {
			text: 'B Fade\n$(umcplayer:playlistBCrossfadeDuration)s',
			size: '18',
			color: 0xffffff,
			bgcolor: 0x000000,
		},
		steps: [],
		feedbacks: [],
	}

	playlistStructure[2].definitions.push('a-fade-time', 'b-fade-time')

	const finishBehaviourPresets = [
		{
			id: 'a-finish-loop',
			name: 'Playlist A Loop',
			text: 'A Loop',
			playlist: 'a' as const,
			mode: 'loop' as const,
		},
		{
			id: 'a-finish-next',
			name: 'Playlist A Next',
			text: 'A Next',
			playlist: 'a' as const,
			mode: 'next' as const,
		},
		{
			id: 'a-finish-shuffle',
			name: 'Playlist A Shuffle',
			text: 'A Shuffle',
			playlist: 'a' as const,
			mode: 'shuffle' as const,
		},
		{
			id: 'a-finish-stop',
			name: 'Playlist A Stop',
			text: 'A Stop',
			playlist: 'a' as const,
			mode: 'stop' as const,
		},
		{
			id: 'b-finish-loop',
			name: 'Playlist B Loop',
			text: 'B Loop',
			playlist: 'b' as const,
			mode: 'loop' as const,
		},
		{
			id: 'b-finish-next',
			name: 'Playlist B Next',
			text: 'B Next',
			playlist: 'b' as const,
			mode: 'next' as const,
		},
		{
			id: 'b-finish-shuffle',
			name: 'Playlist B Shuffle',
			text: 'B Shuffle',
			playlist: 'b' as const,
			mode: 'shuffle' as const,
		},
		{
			id: 'b-finish-stop',
			name: 'Playlist B Stop',
			text: 'B Stop',
			playlist: 'b' as const,
			mode: 'stop' as const,
		},
	] as const

	for (const preset of finishBehaviourPresets) {
		presets[preset.id] = {
			name: preset.name,
			type: 'simple',
			style: {
				text: preset.text,
				size: '18',
				color: 0xffffff,
				bgcolor: 0x000000,
			},
			steps: [
				{
					down: [
						{
							actionId: 'finish_behavior',
							options: {
								playlist: preset.playlist,
								mode: preset.mode,
							},
						},
					],
					up: [],
				},
			],
			feedbacks: [
				{
					feedbackId: 'finish_behavior',
					options: {
						playlist: preset.playlist,
						mode: preset.mode,
					},
					style: {
						bgcolor: 0x009600,
						color: 0xffffff,
					},
				},
			],
		}
	}

	for (const preset of finishBehaviourPresets) {
		playlistStructure[2].definitions.push(preset.id)
	}

	self.setPresetDefinitions(playlistStructure, presets)
}
