export type Job =
  | { name: 'send-notification'; payload: { userId: string; type: string; data: Record<string, unknown> } }
  | { name: 'recompute-trust-score'; payload: { founderId: string } }
  | { name: 'recompute-recommendations'; payload: { developerId: string } };

const queue: Job[] = [];

export const jobQueue = {
  push(job: Job) {
    queue.push(job);
  },
  drain(handler: (job: Job) => Promise<void>) {
    return Promise.all(queue.splice(0).map((job) => handler(job)));
  }
};
