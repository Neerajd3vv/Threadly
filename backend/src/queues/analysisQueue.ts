import { Queue } from "bullmq";

const queue = new Queue("resume-analysis")

export async function analysisQueue(id: string) {
    queue.add("run-analysis", { id })

}
