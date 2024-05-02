import { Queue, Worker } from "bullmq";
import { defaultQueueConfig, redisConnection } from "../config/queue.js";
import logger from "../config/logger.js";

export const emailQueueName = "email-queue";

export const emailQueue = new Queue(emailQueueName, {
    connection: redisConnection,
    defaultJobOptions: defaultQueueConfig,
});

//* Workers
export const handler = new Worker(emailQueueName, async (job) => {
    console.log("The email worker data is ", job.data);
    data?.map(async (item) => {
        await sendEmail(item.toEmail, item.subject, item.body);
    })
},
    { connection: redisConnection });

// * Worker Listners

handler.on("completed", (job) => {
    logger.info({ job: job, msg: "Job completed" });
    console.log(`the job ${job.id} completed`);
});

handler.on("completed", (job) => {
    logger.info({ job: job.id, job });
    console.log(`the job ${job.id} failed`);
});