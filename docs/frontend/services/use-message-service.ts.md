# use-message-service.ts Documentation

## File Overview

Custom React hook for managing chat messages. Handles sending messages to the backend, receiving streaming responses, and managing message state.

**Location:** `frontend/source/services/use-message-service.ts`

## Imports

```typescript
import {useState} from 'react';
import {v4 as uuid4} from 'uuid';
import {Message} from '../types/message.js';
import dotenv from 'dotenv';
```

## Hook: `useMessageService`

Custom hook for message management and API communication.

### Signature

```typescript
export default function useMessageService(session_id: string | null)
```

### Parameters

- `session_id` (string | null): Optional session ID for maintaining conversation context

### Returns

```typescript
{
    sendAndRecieveMessage: (message: string) => Promise<void>;
    sessionId: string | null;
    messages: Message[];
    status: string;
    setStatus: (status: string) => void;
    currentMessage: Message | null;
}
```

**Return Values:**
- `sendAndRecieveMessage`: Function to send message and receive response
- `sessionId`: Current session ID
- `messages`: Array of completed messages
- `status`: Current status ('waiting', 'loading', 'confirmed', 'error')
- `setStatus`: Function to update status
- `currentMessage`: Currently streaming message (if any)

### State

```typescript
const [messages, setMessages] = useState<Message[]>([]);
const [currentMessage, setCurrentMessage] = useState<Message | null>(null);
const [sessionId, setSessionId] = useState<string | null>(session_id);
const [status, setStatus] = useState('waiting');
```

**State Variables:**
- `messages`: Completed messages array
- `currentMessage`: Currently streaming message
- `sessionId`: Session identifier
- `status`: Current operation status

### Function: `sendAndRecieveMessage`

Sends a message to the backend and handles streaming response.

**Signature:**
```typescript
const sendAndRecieveMessage = async (message: string) => Promise<void>
```

**Parameters:**
- `message` (string): User's message to send

**Behavior:**

1. **Message Creation:**
   ```typescript
   const newMessageId = uuid4();
   setStatus('loading');
   
   let localMessage: Message = {
       id: newMessageId,
       user: message,
       model: '',
   };
   setCurrentMessage(localMessage);
   ```
   - Generates unique message ID
   - Sets status to 'loading'
   - Creates message object
   - Sets as current message

2. **API Request:**
   ```typescript
   const response = await fetch(`${process.env['MAIN_ENDPOINT']}/api/chat`, {
       method: 'POST',
       body: JSON.stringify({
           message,
           session_id: sessionId,
           stream: true,
       }),
       headers: {'Content-Type': 'application/json'},
   });
   ```
   - Sends POST request to `/api/chat`
   - Includes message and session_id
   - Requests streaming response

3. **Stream Processing:**
   ```typescript
   const reader = response.body.getReader();
   const decoder = new TextDecoder();
   let buffer = '';
   
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
                   setCurrentMessage({...localMessage});
               }
           } catch (e) {
               console.error('Failed to parse chunk', e, data);
           }
       }
       
       buffer = parts[parts.length - 1] ?? '';
   }
   ```
   - Reads stream chunks
   - Decodes text
   - Parses Server-Sent Events format
   - Accumulates content in `localMessage.model`
   - Updates current message for UI
   - Handles session ID from response
   - Completes when `[DONE]` received

**Stream Format:**
- Server-Sent Events (SSE)
- Format: `data: {json}\n\n`
- End marker: `data: [DONE]\n\n`

**Error Handling:**
- Logs parsing errors
- Continues processing on errors
- Completes stream on `[DONE]`

## Usage

```typescript
const {sendAndRecieveMessage, messages, currentMessage, sessionId} = useMessageService(null);

// Send a message
await sendAndRecieveMessage("Hello, how are you?");

// Access messages
messages.forEach(msg => {
    console.log(msg.user, msg.model);
});

// Check current streaming message
if (currentMessage) {
    console.log("Streaming:", currentMessage.model);
}
```

## Related Files

- `types/message.ts` - Message type definition
- `commands/chat.tsx` - Uses this hook
- `hooks/http.hook.ts` - Alternative HTTP hook (not used here)

## Notes

1. **Streaming:** Handles Server-Sent Events streaming for real-time responses.

2. **Session Management:** Automatically captures and uses session ID from responses.

3. **State Management:** Manages both completed messages and currently streaming message.

4. **Status Tracking:** Tracks operation status for UI state management.

5. **Error Handling:** Gracefully handles parsing errors and continues processing.

6. **Buffer Management:** Properly handles partial chunks in stream processing.

7. **Typo:** Function name `sendAndRecieveMessage` has a typo (should be "Receive"), but is consistent throughout codebase.

