const { connectRabbitMQ } = require('../config/rabbitmq');

const sendToQueue = async (queueName, message) => {
    const connection = await connectRabbitMQ();
    if (!connection) return;

    const channel = await connection.createChannel();
    await channel.assertQueue(queueName, { durable: true });

    channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)), {
        persistent: true
    });

    console.log(`📨 Sent message to ${queueName}:`, message);
};

module.exports = { sendToQueue };
