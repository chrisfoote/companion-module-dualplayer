import WebSocket from 'ws'
import { InstanceStatus } from '@companion-module/base'
import type ModuleInstance from './main.js'

export type UMCPlayerState = {
	device: {
		status: string
		connected: boolean
	}
	playlistA: PlaylistState
	playlistB: PlaylistState
}

export type PlaylistState = {
	state: 'playing' | 'paused' | 'stopped'
	trackId: number | null
	trackName: string | null
	trackCount: number
	finishBehavior: 'loop' | 'next' | 'stop'
	crossfade: {
		enabled: boolean
		duration: number
	}
}

export class UMCPlayerClient {
	private socket: WebSocket | undefined
	private reconnectTimer: ReturnType<typeof setTimeout> | undefined
	private destroyed = false

	constructor(private readonly instance: ModuleInstance) {}

	connect(): void {
		this.destroyed = false
		this.connectWebSocket()
	}

	destroy(): void {
		this.destroyed = true

		if (this.reconnectTimer) {
			clearTimeout(this.reconnectTimer)
			this.reconnectTimer = undefined
		}

		this.socket?.close()
		this.socket = undefined
	}

	private connectWebSocket(): void {
		if (this.destroyed) return

		const { host, webSocketPort } = this.instance.config

		this.instance.log('info', `UMCPlayer config: host=${String(host)}, webSocketPort=${String(webSocketPort)}`)

		const url = `ws://${host}:${webSocketPort}/`

		this.instance.log('debug', `Connecting to UMCPlayer WebSocket: ${url}`)

		this.socket = new WebSocket(url)

		this.socket.on('open', () => {
			this.instance.log('info', 'Connected to UMCPlayer')
			this.instance.updateStatus(InstanceStatus.Ok)
		})

		this.socket.on('message', (data) => {
			try {
				let message: string

				if (typeof data === 'string') {
					message = data
				} else if (Buffer.isBuffer(data)) {
					message = data.toString('utf8')
				} else {
					message = Buffer.from(data as ArrayBuffer).toString('utf8')
				}

				const state = JSON.parse(message) as UMCPlayerState

				this.instance.handleStateUpdate(state)
			} catch (error) {
				this.instance.log('error', `Invalid UMCPlayer WebSocket message: ${String(error)}`)
			}
		})

		this.socket.on('error', (error) => {
			this.instance.log('error', `UMCPlayer WebSocket error: ${String(error)}`)
		})

		this.socket.on('close', () => {
			this.socket = undefined

			if (!this.destroyed) {
				this.instance.log('warn', 'UMCPlayer WebSocket disconnected')
				this.instance.updateStatus(InstanceStatus.ConnectionFailure, 'Disconnected')

				this.scheduleReconnect()
			}
		})
	}

	private scheduleReconnect(): void {
		if (this.reconnectTimer || this.destroyed) return

		this.reconnectTimer = setTimeout(() => {
			this.reconnectTimer = undefined
			this.connectWebSocket()
		}, 3000)
	}
}
