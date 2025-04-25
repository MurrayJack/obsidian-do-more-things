// // import fetch from 'node-fetch'; // or global fetch if you're using modern Node

// const runId = crypto.randomUUID(); // use crypto or uuid
// const now = new Date().toISOString();

// const baseUrl = 'https://api.smith.langchain.com';

// export class LangSmithAiService {}

// const headers = {
// 	'Content-Type': 'application/json',
// 	'x-api-key': process.env.LANGCHAIN_API_KEY,
// };

// const runData = {
// 	id: runId,
// 	name: 'ollama-run',
// 	run_type: 'llm',
// 	inputs: {
// 		prompt: 'Tell me a joke about databases',
// 	},
// 	start_time: now,
// };

// await fetch(`${baseUrl}/v1/runs`, {
// 	method: 'POST',
// 	headers,
// 	body: JSON.stringify(runData),
// });

// // ... do your LLM call here (e.g. to Ollama)

// const response =
// 	'Why did the database admin go broke? Because he lost his cache.';

// await fetch(`${baseUrl}/v1/runs/${runId}`, {
// 	method: 'PATCH',
// 	headers,
// 	body: JSON.stringify({
// 		outputs: { response },
// 		end_time: new Date().toISOString(),
// 	}),
// });
