import { Things3Data } from 'src/types';
import { AiServiceResponse, AiServiceTypes } from './AiServiceFactory';

export class OpenAIService implements AiServiceTypes {
	constructor(
		private readonly _apiKey: string,
		private readonly _model: string,
		private readonly _temperature: number,
		private readonly _maxTokens: number
	) {}

	async serviceCall(
		prompt: string,
		data: Things3Data
	): Promise<AiServiceResponse> {
		const response = await fetch(
			'https://api.openai.com/v1/chat/completions',
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${this._apiKey}`,
				},
				body: JSON.stringify({
					model: this._model,
					messages: [
						{ role: 'user', content: prompt },
						{ role: 'user', content: JSON.stringify(data) },
					],

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
			content: json.choices[0].message.content,
		};
	}
}
