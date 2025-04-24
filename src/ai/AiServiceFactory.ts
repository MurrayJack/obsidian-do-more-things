import { Things3Data } from 'src/types';
import { OpenAIService } from './OpenAIService';

export interface AiServiceResponse {
	content: string;
}

export interface AiServiceTypes {
	serviceCall: (
		prompt: string,
		data: Things3Data
	) => Promise<AiServiceResponse>;
}

export function AiServiceFactory(
	service: string,
	apiKey: string,
	model: string,
	temperature: number,
	maxTokens: number
): AiServiceTypes {
	return new OpenAIService(apiKey, model, temperature, maxTokens);
}
