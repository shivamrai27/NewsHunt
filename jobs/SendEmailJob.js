import { Queue, Worker } from "bullq";
import { defaultQueueConfig, redisConnection } from "../config/queue.js";

export const emailQueueName = "email-queue";

export const emailQueue = new Queue(emailQueueName, {
    connection: redisConnection,
    defaultJobOptions: defaultQueueConfig,
});

//* Workers
export const handler = new Worker(emailQueueName, async (job) => {
    console.log("The email worker datais ", job.data);
}, { connection: redisConnection });
