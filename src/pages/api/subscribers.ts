import { prisma } from "@dealbase/db";
import { withSentry } from "@sentry/nextjs";
import { NextApiRequest, NextApiResponse } from "next";
import { ErrorCommon, handleApiError } from "src/lib/handleApiError";
import { logger } from "src/lib/logger";
import { applyCommonMiddlewares } from "src/lib/middlewares/applyCommonMIddlewares";
import { authorizeAccessToken } from "src/lib/middlewares/authorizeAccessToken";
import { createCheckPermissionsMiddleware } from "src/lib/middlewares/checkPermissions";
import {
  MiddlewareFunction,
  runMiddleware,
} from "src/lib/middlewares/runMiddleware";

export interface Subscriber {
  id: number;
  email: string;
  firstname: string;
  lastname: string;
  company: string;
  type: "founder" | "investor";
  createdAt: string;
}

export interface ReturnType {
  success: boolean;
  subscribers?: Subscriber[];
  subscriber?: Subscriber;
  subscriberId?: string;
  error: unknown;
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await applyCommonMiddlewares(req, res);
    const loggerMetadata = {
      traceId: req.headers["x-trace-id"],
      url: req.url,
      method: req.method,
    };

    if (req.method === "POST") {
      const { body } = req;

      logger.info("Saving Subscriber", { ...loggerMetadata, body });
      const data = await prisma.subscriber.create({ data: body });

      logger.info("Finished Saving Subscriber", loggerMetadata);

      res.status(200).json({ success: true, subscriber: data });
    }

    if (req.method === "PATCH") {
      await runMiddleware(
        req,
        res,
        authorizeAccessToken as unknown as MiddlewareFunction,
      );
      const checkPermissions = createCheckPermissionsMiddleware([
        "edit:subscribers",
      ]);
      await runMiddleware(req, res, checkPermissions);

      // const {
      //   body: { ...updateData },
      // } = req;

      logger.info("Updating Subscriber", loggerMetadata);
      // const data = await db.update(DatabaseTables.Subscribers, updateData);

      logger.info("Finished Updating Subscriber", loggerMetadata);

      res.status(200).json({ subscriber: {} });
    }

    if (req.method === "DELETE") {
      await runMiddleware(
        req,
        res,
        authorizeAccessToken as unknown as MiddlewareFunction,
      );
      const checkPermissions = createCheckPermissionsMiddleware([
        "delete:subscribers",
      ]);
      await runMiddleware(req, res, checkPermissions);

      // const {
      //   body: { id },
      // } = req;

      logger.info("Deleting Subscriber", loggerMetadata);
      // const data = await db.delete(DatabaseTables.Subscribers, id);

      logger.info("Finished Deleting Subscriber", loggerMetadata);

      res.status(200).json({ data: {} });
    }

    if (req.method === "GET") {
      await runMiddleware(
        req,
        res,
        authorizeAccessToken as unknown as MiddlewareFunction,
      );
      const checkPermissions = createCheckPermissionsMiddleware([
        "read:subscribers",
      ]);
      await runMiddleware(req, res, checkPermissions);

      logger.info("Getting Subscribers", loggerMetadata);
      // const { data: subscribers, error } = await supabase
      //   .from(DatabaseTables.Subscribers)
      //   .select("*");

      const subscribers = await prisma.subscriber.findMany();

      // if (error) throw error;

      logger.info("Finished Getting Subscribers", loggerMetadata);

      res.status(200).json({
        success: true,
        subscribers,
        total: subscribers?.length,
      });
    }
  } catch (e) {
    handleApiError(e as ErrorCommon, res, req);
  }
}

export default withSentry(handler);
