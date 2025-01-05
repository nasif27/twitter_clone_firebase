import { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";

export default function ChatbotModal({show, handleClose}) {
    const [message, setMessage] = useState('');
    const [allMessages, setAllMessages] = useState([]);

    const sendMessage = async (e) => {
        e.preventDefault();
        const API_URL = 'https://api.openai.com/v1/chat/completions';
        const apiKey = import.meta.env.VITE_OPENAI_API_KEY;     // 2nd option for security purpose. Related to .env in gitignore file & .env file

        const messagesToSend = [
            ...allMessages,
            {
                role: 'user',
                content: message
            }
        ];

        const response = await fetch(API_URL, {     // get response from OpenAI & store it in 'reponse' variable
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,    // need API key from OpenAI to be authorized by them
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({      // change non-string object key into string object key which is JSON format
                model: 'gpt-3.5-turbo',
                messages: messagesToSend    // contain messages from user
            })
        })

        const data = await response.json();     // change json format to normal object

        if (data) {
            let newAllMessages = [
                ...messagesToSend,      // [ { role: 'user', content: 'xyz' } ]
                data.choices[0].message     // choices & message are object key from API response that we get. This line will return {content: 'xyz', role: 'assistant'}
            ];
            setAllMessages(newAllMessages);
            setMessage('');
        }
    }

    return (
        <Modal show={show} onHide={handleClose} size="lg">
            <Modal.Header closeButton className="fs-4">
                AI Chatbot
            </Modal.Header>

            <Modal.Body>
                <div>
                    {allMessages.map((msg, index) => (
                        <p key={index}><strong>{msg.role}:</strong> {msg.content}</p>
                    ))}
                </div>

                <Form onSubmit={sendMessage}>
                    <Form.Control
                        type="text"
                        placeholder="Ask chatbot something..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />

                    <Button type="submit" className="mt-3">Send</Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
}