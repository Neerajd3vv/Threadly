import { userPayload } from "./general"

declare global {
    namespace Express {
        interface Request {
            user?: userPayload
        }
    }
}