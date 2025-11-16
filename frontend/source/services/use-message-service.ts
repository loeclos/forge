import {useState} from 'react';
import {v4 as uuid4} from 'uuid';
import {Message} from './types/message.js';
import dotenv from 'dotenv';

dotenv.config({path: '.env.local', quiet: true});

export default function useMessageService(session_id: string | null) {
	const [messages, setMessages] = useState<Message[]>([]);
	const [currentMessage, setCurrentMessage] = useState<Message | null>(null);
	const [sessionId, setSessionId] = useState<string | null>(session_id);
	const [status, setStatus] = useState('waiting');

	const sendAndRecieveMessage = async (message: string) => {
	const newMessageId = uuid4();
	setStatus('loading');

	let localMessage: Message = {
		id: newMessageId,
		user: message,
		model: 'Loading response...',
	};

	setCurrentMessage(localMessage);

	const response = await fetch(`${process.env['MAIN_ENDPOINT']}/api/chat`, {
		method: 'POST',
		body: JSON.stringify({
			message,
			session_id: sessionId,
			stream: true,
		}),
		headers: {'Content-Type': 'application/json'},
	});

	if (!response.body) throw new Error('No response body');

	const reader = response.body.getReader();
	const decoder = new TextDecoder();
	let buffer = '';

	localMessage.model = '';

	while (true) {
		const {value, done} = await reader.read();
		if (done) break;
		buffer += decoder.decode(value, {stream: true});

		const parts = buffer.split('\n\n');
		for (let i = 0; i < parts.length - 1; i++) {
			const line = parts[i]?.trim();
			if (!line?.startsWith('data: ')) continue;

			const data = line.replace('data: ', '');
			if (data === '[DONE]') {
				setStatus('waiting');
				setMessages(prev => [...prev, localMessage]);
				setCurrentMessage(null);
				return;
			}

			try {
				const parsed = JSON.parse(data);
				if (!sessionId && parsed.session_id) setSessionId(parsed.session_id);

				if (parsed.content) {
					localMessage.model += parsed.content;
					setCurrentMessage({...localMessage}); // just for live UI updates
				}
			} catch (e) {
				console.error('Failed to parse chunk', e, data);
			}
		}

		buffer = parts[parts.length - 1] ?? '';
	}
};


	return {
		sendAndRecieveMessage,
		sessionId,
		messages,
		status,
		setStatus,
		currentMessage
	};
}
