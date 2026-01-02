import {useState, useEffect} from 'react';
import {v4 as uuid4} from 'uuid';
import {Message} from './types/message.js';
import dotenv from 'dotenv';

dotenv.config({path: '.env.local', quiet: true});
//
// export default function useMessageService(session_id: string | null) {
// 	const [messages, setMessages] = useState<Message[]>([]);
// 	const [currentMessage, setCurrentMessage] = useState<Message | null>(null);
// 	const [sessionId, setSessionId] = useState<string | null>(session_id);
// 	const [status, setStatus] = useState('waiting');
//
// 	const sendAndRecieveMessage = async (message: string) => {
// 		const newMessageId = uuid4();
// 		setStatus('loading');
//
// 		let localMessage: Message = {
// 			id: newMessageId,
// 			user: message,
// 			model: 'Loading response...',
// 		};
//
// 		setCurrentMessage(localMessage);
//
// 		const response = await fetch(`${/process.env['MAIN_ENDPOINT']}api/chat`, {
// 			method: 'POST',
// 			body: JSON.stringify({
// 				message,
// 				session_id: sessionId,
// 				stream: true,
// 			}),
// 			headers: {'Content-Type': 'application/json'},
// 		});
//
// 		if (!response.body) throw new Error('No response body');
//
// 		if (!response.ok) {
// 			setCurrentMessage({...localMessage, model: `[SERVER RETURENED ${response.status}] ${response.statusText}`});
// 		}
//
// 		const reader = response.body.getReader();
// 		const decoder = new TextDecoder();
// 		let buffer = '';
//
// 		localMessage.model = '';
//
// 		while (true) {
// 			const {value, done} = await reader.read();
// 			if (done) break;
// 			buffer += decoder.decode(value, {stream: true});
//
// 			const parts = buffer.split('\n\n');
// 			for (let i = 0; i < parts.length - 1; i++) {
// 				const line = parts[i]?.trim();
// 				if (!line?.startsWith('data: ')) continue;
//
// 				const data = line.replace('data: ', '');
// 				if (data === '[DONE]') {
// 					setStatus('waiting');
// 					setMessages(prev => [...prev, localMessage]);
// 					setCurrentMessage(null);
// 					return;
// 				}
//
// 				try {
// 					const parsed = JSON.parse(data);
// 					if (!sessionId && parsed.session_id) setSessionId(parsed.session_id);
// 					localMessage = parsed
// 					setCurrentMessage(localMessage)
// 					// if (parsed.tool_calls.length != 0) {
// 					// 	for (let tool in parsed.tools_calls) {
// 					// 		console.log(tool);
// 					// 	}
// 					// 		console.log(parsed.tool_calls);
//
// 					// }
//
// 					// if (parsed.content) {
// 					// 	localMessage.model += parsed.content;
// 					// 	setCurrentMessage({...localMessage}); // just for live UI updates
// 					// }
// 				} catch (e) {
// 					console.error('Failed to parse chunk', e, data);
// 				}
// 			}
//
// 			buffer = parts[parts.length - 1] ?? '';
// 		}
// 	};
//
// 	return {
// 		sendAndRecieveMessage,
// 		sessionId,
// 		messages,
// 		status,
// 		setStatus,
// 		currentMessage,
// 	};
// }



export default function useQueService(session_id: string | null) {
	const [currentMessage, setCurrentMessage] = useState<string>(null);
	const [sessionId, setSessionId] = useState<string | null>(session_id);
	const [status, setStatus] = useState('waiting');
	const [socket, setSocket] = useState<WebSocket | null>(null);
	const messages = new Map();


	useEffect(() => {
		const chatSocket = new WebSocket(`{process.env['WEBSOCKET_ENDPOINT']}/api/chat/ws`);
		chatSocket.addEventListener('open', () => {
			setSocket(chatSocket);
		});

		chatSocket.addEventListener('message', (e) => {
			console.log('Message from server', e.data)
			if (data["type"] == 'chat_response') {
				setCurrentMessage(data['content']['id'])
				if (messages.has(data['content']['id'])) {
					const prevMessageObject = messages.get(data['content']['id'])))
					const newMessageObject = {
						id: prevMessageObject.id,
						user: prevMessageObject.user,
						model: (prevMessageObject.model || '') += data['content']['content']
					}
					messages.set(newMessageObject);
				} else {
					messages.set({
						id: data['content']['id'],
						user: data['content']['user_query'],
						model: data['content']['content']
					});
				}
			}
		});
		setStatus('waiting');
		setMessages(prev => [...prev, localMessage]);
	}, []);

	const sendMessage = async (message: string) => {
		if (!socket || socket.readyState !== WebSocket.OPEN) {
			console.log('WebSocket not open.');
			return;
		}
		const newMessageId = uuid4();
		setStatus('loading');

		let localMessage: Message = {
			id: newMessageId,
			user: message,
			model: 'Loading response...',
		};

		setCurrentMessage(localMessage);

		socket.send({
				message,
				session_id: sessionId,
		});

	};

	return {
		sendMessage,
		sessionId,
		messages,
		status,
		setStatus,
		currentMessage,
	};
}
