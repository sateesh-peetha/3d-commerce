import { useState, useEffect } from 'react';

/**
 * A simple dashboard widget that displays a greeting
 */
export default function HelloWidget({ context }) {
    const [greeting, setGreeting] = useState('Loading...');

    useEffect(() => {
        context.storage.get('greeting').then((value) => {
            setGreeting(value || 'Hello, World!');
        });
    }, []);

    return (
        <div className="hello-widget">
            <h3>Hello World Plugin</h3>
            <p>{greeting}</p>
            <button onClick={() => context.api.showToast('Hello!')}>
                Say Hello
            </button>
        </div>
    );
}
