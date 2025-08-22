import { z } from "zod";

export const useAnalysis = z.object({
    jdId: z.uuid({
        message: "jdId must be a valid UUID",
    }),
    resumeId: z.uuid({
        message: "resumeId must be a valid UUID",
    }),
});
