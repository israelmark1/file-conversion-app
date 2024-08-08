import { PubSub } from "@google-cloud/pubsub";

const pubsub = new PubSub();

export async function publishMessage(
  topic: string,
  message: any
): Promise<void> {
  const dataBuffer = Buffer.from(JSON.stringify(message));
  try {
    const messageId = await pubsub.topic(topic).publish(dataBuffer);
    console.log(`Message ${messageId} published.`);
  } catch (error) {
    console.error(`Error publishing message to topic ${topic}:`, error);
    throw error;
  }
}


