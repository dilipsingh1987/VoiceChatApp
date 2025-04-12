// services/openai.ts
// import axios from 'axios';

// const OPENAI_API_KEY = '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';

// export async function sendMessageToOpenAI(message: string): Promise<string> {
//   try {
//     const res = await axios.post(
//       'https://api.openai.com/v1/chat/completions',
//       {
//         model: 'gpt-3.5-turbo',
//         messages: [{ role: 'user', content: message }],
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${OPENAI_API_KEY}`,
//           'Content-Type': 'application/json',
//         },
//       }
//     );

//     return res.data.choices[0].message.content.trim();
//   } catch (error) {
//     console.error('OpenAI API Error:', error);
//     throw new Error('OpenAI API Error');
//   }
// }

// services/openai.ts
import axios from 'axios';

const GROQ_API_KEY = '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'; // 👈 Replace this with your Groq key
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

export async function sendMessageToOpenAI(message: string): Promise<string> {
  try {
    const response = await axios.post(
      GROQ_API_URL,
      {
        model: 'llama3-70b-8192', // You can also try 'llama2-70b-chat' or 'gemma-7b-it'
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', content: message },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data.choices[0].message.content.trim();
  } catch (error: any) {
    console.error('Groq API Error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    return '⚠️ Error contacting AI';
  }
}
