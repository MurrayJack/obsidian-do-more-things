import { exec } from 'child_process';

export class Things3Manager {
	constructor() {}

	getTodayListByJXA(): Promise<string> {
		const getTodayListScript = `
                function buildJson() {
                    const json = {};
                    const todos = Application('Things').lists.byId('TMTodayListSource').toDos();
                    
                    json.groups = [];
                    json.tags = [];
    
                    todos.forEach(t => {
                        const area = t.area() ? t.area().name() : undefined;
                        let projectName = t.project() ? t.project().name() : undefined;
                        
                        if (!projectName) {
                            projectName = area ? area : 'No Project';
                        }
    
                        if (!json.groups.includes(projectName)) {
                            json.groups.push(projectName);
                        }
    
                        json[projectName] = json[projectName] || [];
    
                        if (t.tags().length > 0) {
                            t.tags().forEach(tag => {
                                if (!json.tags.includes(tag.name())) {
                                    json.tags.push(tag.name());
                                }
                            });
                        }
    
                        json[projectName].push({
                            id: t.id(),
                            name: t.name(),
                            group: projectName,
                            area: t.area() ? t.area().name() : undefined,
                            project: t.project() ? t.project().name() : undefined,
                            status: t.status(),
                            notes: t.notes(),
                            hasNotes: t.notes()?.length ? true : false,
                            tags: t.tags().map(tag => tag.name()),
                            dueDate: t.dueDate() ? t.dueDate().toString() : undefined,
                        });
                    });
    
                    return JSON.stringify(json, null, 2);
                }
                buildJson();
            `
			.replace(/"/g, '\\"')
			.replace(/\n/g, ' ');

		return this._executeScript(getTodayListScript);
	}

	completeTodoByJXA(todoId: string, value: boolean): Promise<string> {
		const completeSct =
			`Application('Things').toDos.byId('${todoId}').status = '${
				value ? 'completed' : 'open'
			}';`
				.replace(/"/g, '\\"')
				.replace(/\n/g, ' ');

		return this._executeScript(completeSct);
	}

	_executeScript(script: string): Promise<string> {
		return new Promise((resolve) => {
			exec(
				`osascript -l JavaScript -e  "${script}"`,
				(err, stdout, stderr) => {
					resolve(stdout);
				}
			);
		});
	}
}
