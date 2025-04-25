import { AiServiceResponse, AiServiceTypes } from './AiServiceFactory';

export class OllamaAiService implements AiServiceTypes {
	constructor(
		private readonly _model: string,
		private readonly _temperature: number,
		private readonly _maxTokens: number
	) {}

	async serviceCall(prompt: string): Promise<AiServiceResponse> {
		const response = await fetch(
			'http://localhost:11434/v1/chat/completions',
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					model: this._model,
					messages: [{ role: 'user', content: prompt }],
					temperature: this._temperature,
					max_tokens: this._maxTokens,
				}),
			}
		);
		if (!response.ok) {
			throw new Error(`Error: ${response.statusText}`);
		}
		const json = await response.json();
		return {
			content: json.choices[0].message.content
				.replace('```json', '')
				.replace('```', ''),
		};
	}
}
