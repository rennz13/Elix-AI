/**
 * Elix AI - Gemini API Client (Frontend)
 *
 * This file handles communication with our secure Node.js backend.
 * All Gemini AI logic and API keys are stored safely on the server.
 */

const BACKEND_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3001') + '/api/chat';
const FALLBACK_REPLY = "⚠️ AI is currently unavailable. Please try again.";

export async function chat(prompt) {
  try {
    const response = await fetch(BACKEND_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });

    let data = {};
    try {
      data = await response.json();
    } catch {
      data = {};
    }

    if (!response.ok) {
      const backendMessage =
        typeof data?.error === 'string' && data.error.trim()
          ? data.error
          : 'Failed to connect to the AI server.';
      if (
        backendMessage.toLowerCase().includes('max_tokens') ||
        backendMessage.toLowerCase().includes('credits')
      ) {
        throw new Error('Response too long. Please try a shorter message.');
      }
      throw new Error(backendMessage);
    }

    return data.reply;
  } catch (error) {
    const message =
      typeof error?.message === 'string' && error.message.trim()
        ? error.message
        : FALLBACK_REPLY;
    console.error('Chat API error:', message);
    return message;
  }
}
