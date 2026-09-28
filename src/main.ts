import { InstanceBase, InstanceStatus, type SomeCompanionConfigField } from '@companion-module/base'

import { GetConfigFields, type ModuleConfig } from './config.js'
import { UpdateVariableDefinitions, type VariablesSchema } from './variables.js'
import { UpgradeScripts } from './upgrades.js'
import { UpdateActions, type ActionsSchema } from './actions.js'
import { UpdateFeedbacks, type FeedbacksSchema } from './feedbacks.js'
import { UpdatePresets } from './presets.js'
import { UMCPlayerClient, type UMCPlayerState } from './client.js'

export type ModuleSchema = {
	config: ModuleConfig
	secrets: undefined
	actions: ActionsSchema
	feedbacks: FeedbacksSchema
	variables: VariablesSchema
}

export { UpgradeScripts }

export default class ModuleInstance extends InstanceBase<ModuleSchema> {
	config!: ModuleConfig

	private client: UMCPlayerClient | undefined
	public state: UMCPlayerState | undefined

	constructor(internal: unknown) {
		super(internal)
	}

	async init(config: ModuleConfig): Promise<void> {
		this.config = config

		this.updateStatus(InstanceStatus.Connecting)

		this.updateActions()
		this.updateFeedbacks()
		this.updatePresets()
		this.updateVariableDefinitions()

		this.client = new UMCPlayerClient(this)
		this.client.connect()
	}

	async destroy(): Promise<void> {
		this.log('debug', 'destroy')

		this.client?.destroy()
		this.client = undefined
	}

	async configUpdated(config: ModuleConfig): Promise<void> {
		this.config = config

		this.client?.destroy()

		this.client = new UMCPlayerClient(this)
		this.client.connect()
	}

	getConfigFields(): SomeCompanionConfigField[] {
		return GetConfigFields()
	}

	updateActions(): void {
		UpdateActions(this)
	}

	updateFeedbacks(): void {
		UpdateFeedbacks(this)
	}

	updatePresets(): void {
		UpdatePresets(this)
	}

	updateVariableDefinitions(): void {
		UpdateVariableDefinitions(this)
	}

	handleStateUpdate(state: UMCPlayerState): void {
		this.state = state

		this.log(
			'debug',
			`State update: A=${state.playlistA.state}, track=${state.playlistA.trackId ?? 'none'}; B=${state.playlistB.state}, track=${state.playlistB.trackId ?? 'none'}`,
		)

		this.updateVariables()
		this.checkFeedbacks('track_playing', 'crossfade_enabled', 'finish_behavior')
	}

	updateVariables(): void {
		const state = this.state

		this.setVariableValues({
			playlistAState: state?.playlistA.state ?? 'unknown',
			playlistATrack: state?.playlistA.trackId?.toString() ?? '',
			playlistATrackName: state?.playlistA.trackName ?? '',
			playlistACrossfadeEnabled: state?.playlistA.crossfade.enabled ? 'On' : 'Off',
			playlistACrossfadeDuration: state?.playlistA.crossfade.duration?.toString() ?? '',

			playlistBState: state?.playlistB.state ?? 'unknown',
			playlistBTrack: state?.playlistB.trackId?.toString() ?? '',
			playlistBTrackName: state?.playlistB.trackName ?? '',
			playlistBCrossfadeEnabled: state?.playlistB.crossfade.enabled ? 'On' : 'Off',
			playlistBCrossfadeDuration: state?.playlistB.crossfade.duration?.toString() ?? '',
		})
	}
	async sendCommand(path: string): Promise<void> {
		const url = `http://${this.config.host}:${this.config.httpPort}${path}`

		this.log('debug', `Sending command: POST ${url}`)

		const response = await fetch(url, {
			method: 'POST',
		})

		if (!response.ok) {
			const body = await response.text()
			throw new Error(`UMCPlayer returned HTTP ${response.status}: ${body}`)
		}
	}
}
