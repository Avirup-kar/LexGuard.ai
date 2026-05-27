import { clerkClient, getAuth } from "@clerk/express";
import { type NextFunction, type Request, type Response } from "express"

export const auth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId } = getAuth(req);
        if(!userId) {
          return res.json({ success: false, message: "User unauthorised to access." });
        }

        next();
    } catch (error: any) {
        return res.status(500).json({
          success: false,
          message: error.message || "Unknown error",
        });
    }
}
