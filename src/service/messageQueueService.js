const amqp = require('amqplib');

const RABBITMQ_URL = 'amqp://guest:guest@localhost:5672';
const QUEUE_NAME = 'booking_queue';

let channel, connection;

const connectQueue = async () => {
    try {
        connection = await amqp.connect(RABBITMQ_URL);
        channel = await connection.createChannel();
        await channel.assertQueue(QUEUE_NAME, { durable: true });
        console.log("✅ Connected to RabbitMQ, Queue Created");
    } catch (error) {
        console.error("❌ Error connecting to RabbitMQ:", error);
    }
};

// Function to send message to queue
const sendToQueue = async (message) => {
    if (!channel) {
        console.error("Channel not initialized");
        return;
    }
    channel.sendToQueue(QUEUE_NAME, Buffer.from(JSON.stringify(message)), { persistent: true });
    console.log(`📩 Message sent to queue: ${JSON.stringify(message)}`);
};

// Function to consume messages
const consumeQueue = async () => {
    if (!channel) {
        console.error("Channel not initialized");
        return;
    }
    channel.consume(QUEUE_NAME, (msg) => {
        if (msg !== null) {
            console.log(`📥 Received message: ${msg.content.toString()}`);
            channel.ack(msg);
        }
    }, { noAck: false });
};

module.exports = { connectQueue, sendToQueue, consumeQueue };
