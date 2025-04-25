import {  useEffect, useState } from 'react';
import { useAppContext } from './AppContext';
import { buildPrompt, getAiService } from "../ai/AiServiceFactory"
import { Row } from './Row';

export const AiSuggestion: React.FC = () => {
    const [nextSuggestion, setNextSuggestion] = useState(() => {
        const storedValue = localStorage.getItem('nextSuggestion');
        return storedValue ? JSON.parse(storedValue) : null;
    });
    const { data } = useAppContext();
   
    useEffect( () => {
        const service = getAiService('gemma:latest', 0.1, 10000);

        buildPrompt(data).then((prompt) => {
              service.serviceCall(prompt).then((response) => {
                console.log("AI Response: ", response);
                setNextSuggestion(response.content);
                localStorage.setItem('nextSuggestion', JSON.stringify(response.content));
            })
        })

    }, [data]);

    return (
        <div>
            <h4 className='do-more-things-ai-heading'>AI: Do this Next</h4>
            <ul className='do-more-things-list'>
                {nextSuggestion && <p><Row item={JSON.parse(nextSuggestion)} /></p>}
            </ul>
        </div>
    );
};