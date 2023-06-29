const { Client } = require('whatsapp-web.js');
const qrcode = require('qr-terminal');
const { OpenAI } = require('@openai/api');

// OpenAI API key
const openai = new OpenAI('YOUR_OPENAI_API_KEY');

// Initialize the WhatsApp client
const client = new Client();

// Event: Client is ready to send and receive messages
client.on('ready', () => {
  console.log('Client is ready!');

  // Generate QR code for WhatsApp Web
  qrcode.generate(client.getSession().WABrowserSession.wid._serialized, { small: true });

  // Listen for incoming messages
  client.on('message', async (message) => {
    if (message.body.startsWith('!gpt')) {
      try {
        // Extract the query from the message
        const query = message.body.substring(5).trim();

        // Call the OpenAI API to generate a response
        const response = await openai.complete({
          engine: 'text-davinci-003',
          prompt: query,
          maxTokens: 50,
          n: 1,
          stop: '\n',
        });

        // Get the generated reply from the API response
        const reply = response.data.choices[0].text.trim();

        // Send the reply
        client.sendMessage(message.from, reply);
      } catch (error) {
        console.error('Error generating reply:', error);
      }
    }
  });
});

// Start the client
client.initialize();
