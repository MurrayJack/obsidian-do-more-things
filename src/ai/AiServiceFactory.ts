import { Things3Data } from 'src/types';
import { OllamaAiService } from './OllamaAiService';

export interface AiServiceResponse {
	content: string;
}

export interface AiServiceTypes {
	serviceCall: (prompt: string) => Promise<AiServiceResponse>;
}

export async function buildPrompt(data: Things3Data) {
	const todo = [];

	for (const group of data.groups) {
		todo.push(...data[group]);
	}

	return `
** PERSONA **
You are a helpful assistant. You will be given a JSON string of todo data coming from Things3.
You task is to review this JSON text and return the most important item in the list.

** TASK **
1. Review the JSON text.
2. Identify the most important item in the list, look for the item that is most relevant to the user context,
3. Return the item in the JSON format show in output.

## USER RELEVANT CONTEXT ##
- Items mentioning must be completed.
- Items that are overdue.
- Items that are due today.
- Items that are due tomorrow.
- Items that are due this week.

** INPUT FORMAT **
The JSON text will be in the following format:
[
    {
        id: string;
	    status: 'open' | 'completed';
	    tags: string[];
	    name: string;
	    notes: string;
	    area: string;
	    project: string;
	    dueDate: string;
	    hasNotes: boolean;
    }
]

** OUTPUT **
Please respond **only** in the following JSON format. Do not include any explanation or additional text.
{
    id: string;
    status: 'open' | 'completed';
    tags: string[];
    name: string;
    notes: string;
    area: string;
    project: string;
    dueDate: string;
    hasNotes: boolean;
}

** JSON TEXT **:
${JSON.stringify(todo, null, 2)}`;
}

export function getAiService(
	model: string,
	temperature: number,
	maxTokens: number
): AiServiceTypes {
	return new OllamaAiService(model, temperature, maxTokens);
}
