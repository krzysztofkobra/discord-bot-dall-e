const { Client, GatewayIntentBits, ActivityType} = require('discord.js');
require('dotenv/config');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { OpenAI } = require('openai');
const axios = require('axios');

const CHANNELS = ['channels id bot interact with'];

const openai = new OpenAI({
    apiKey: process.env.OPENAI_KEY,
});

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
        client.user.setActivity({
            name: "anything u want",
            type: ActivityType.Listening,
            //url: '',
            });
});

client.on('messageCreate', async message => {
    if (message.author.bot || !message.content.startsWith('!generate')) return;

    const prompt = message.content.slice('!generate'.length).trim();
    if (!prompt) return message.channel.send("Please provide a prompt for image generation.");

    try {
        const response = await axios.post('https://api.openai.com/v1/images/generations', {
            prompt: prompt,
            n: 1,
            size: "1024x1024",
            model: "dall-e-3",  // Please adjust the model ID based on the OpenAI documentation or your plan access
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        // Assuming the response directly gives the URLs of the images
        const imageUrl = response.data.data[0].url;  // Adjust according to the actual response structure
        message.channel.send(imageUrl);
    
    } catch (error) {
        console.error('Error generating image with DALL·E:\n', error);
        message.channel.send('An error occurred while generating the image. Please try again later.');
    }
});

client.login(process.env.TOKEN);
