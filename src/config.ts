import { Regex, type SomeCompanionConfigField } from '@companion-module/base'

export type ModuleConfig = {
	host: string
	httpPort: number
	webSocketPort: number
}

export function GetConfigFields(): SomeCompanionConfigField[] {
	return [
		{
			type: 'textinput',
			id: 'host',
			label: 'UMCPlayer IP Address',
			width: 8,
			regex: Regex.IP,
		},
		{
			type: 'number',
			id: 'httpPort',
			label: 'HTTP Port',
			width: 4,
			min: 1,
			max: 65535,
			default: 8766,
		},
		{
			type: 'number',
			id: 'webSocketPort',
			label: 'WebSocket Port',
			width: 4,
			min: 1,
			max: 65535,
			default: 8766,
		},
	]
}
