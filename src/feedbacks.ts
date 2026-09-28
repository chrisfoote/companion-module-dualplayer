import { combineRgb, type CompanionFeedbackDefinition } from '@companion-module/base'

import type ModuleInstance from './main.js'

export type FeedbacksSchema = {
	track_playing: {
		type: 'boolean'
		options: {
			playlist: 'a' | 'b'
			track: number
		}
	}
	crossfade_enabled: {
		type: 'boolean'
		options: {
			playlist: 'a' | 'b'
		}
	}
	finish_behavior: {
		type: 'boolean'
		options: {
			playlist: 'a' | 'b'
			mode: 'loop' | 'next' | 'stop'
		}
	}
}

export function UpdateFeedbacks(self: ModuleInstance): void {
	const feedback: CompanionFeedbackDefinition<FeedbacksSchema['track_playing']> = {
		name: 'Track Playing',
		type: 'boolean',
		defaultStyle: {
			bgcolor: combineRgb(0, 150, 0),
			color: combineRgb(255, 255, 255),
		},
		options: [
			{
				id: 'playlist',
				type: 'dropdown',
				label: 'Playlist',
				default: 'a',
				choices: [
					{ id: 'a', label: 'Playlist A' },
					{ id: 'b', label: 'Playlist B' },
				],
			},
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
		callback: (feedback) => {
			const state = self.state

			if (!state) {
				return false
			}

			const playlist = feedback.options.playlist === 'a' ? state.playlistA : state.playlistB

			return playlist.state === 'playing' && playlist.trackId === feedback.options.track
		},
	}

	const crossfadeEnabledFeedback: CompanionFeedbackDefinition<FeedbacksSchema['crossfade_enabled']> = {
		name: 'Crossfade Enabled',
		type: 'boolean',
		defaultStyle: {
			bgcolor: combineRgb(0, 150, 0),
			color: combineRgb(255, 255, 255),
		},
		options: [
			{
				id: 'playlist',
				type: 'dropdown',
				label: 'Playlist',
				default: 'a',
				choices: [
					{ id: 'a', label: 'Playlist A' },
					{ id: 'b', label: 'Playlist B' },
				],
			},
		],
		callback: (feedback) => {
			const state = self.state

			if (!state) {
				return false
			}

			const playlist = feedback.options.playlist === 'a' ? state.playlistA : state.playlistB

			return playlist.crossfade.enabled
		},
	}

	const finishBehaviorFeedback: CompanionFeedbackDefinition<FeedbacksSchema['finish_behavior']> = {
		name: 'Finish Behaviour',
		type: 'boolean',
		defaultStyle: {
			bgcolor: combineRgb(0, 150, 0),
			color: combineRgb(255, 255, 255),
		},
		options: [
			{
				id: 'playlist',
				type: 'dropdown',
				label: 'Playlist',
				default: 'a',
				choices: [
					{ id: 'a', label: 'Playlist A' },
					{ id: 'b', label: 'Playlist B' },
				],
			},
			{
				id: 'mode',
				type: 'dropdown',
				label: 'Finish Behaviour',
				default: 'loop',
				choices: [
					{ id: 'loop', label: 'Loop' },
					{ id: 'next', label: 'Play Next' },
					{ id: 'stop', label: 'Stop' },
				],
			},
		],
		callback: (feedback) => {
			const state = self.state

			if (!state) {
				return false
			}

			const playlist = feedback.options.playlist === 'a' ? state.playlistA : state.playlistB

			return playlist.finishBehavior === feedback.options.mode
		},
	}

	self.setFeedbackDefinitions({
		track_playing: feedback,
		crossfade_enabled: crossfadeEnabledFeedback,
		finish_behavior: finishBehaviorFeedback,
	})
}
