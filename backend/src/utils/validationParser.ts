
import { ZodType, z } from "zod";

export function validationParser<T>(schema: ZodType<T>, body: unknown) {
    const result = schema.safeParse(body)
    if (!result.success) {
        return {
            success: false,
            errors: z.treeifyError(result.error)

        }
    }

    return {
        success: true,
        data: result.data
    }
}