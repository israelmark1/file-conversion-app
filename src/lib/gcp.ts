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

export async function subscribeToTopic(
  subscriptionName: string,
  callback: (message: any) => Promise<void>
): Promise<void> {
  try {
    const subscription = pubsub.subscription(subscriptionName);

    subscription.on("message", async (message) => {
      try {
        await callback(message.data.toString());
        message.ack();
      } catch (error) {
        console.error("Error handling message:", error);
        message.nack();
      }
    });

    console.log(`Listening for messages on subscription ${subscriptionName}`);
  } catch (error) {
    console.error(`Error subscribing to topic ${subscriptionName}:`, error);
    throw error;
  }
}
