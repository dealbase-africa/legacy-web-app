import { Deal, filterDeals } from "@dealbase/core";
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
import { createDeals } from "src/lib/server/createDeals";
import { getDeals } from "src/lib/server/getDeals";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await applyCommonMiddlewares(req, res);
    const loggerMetadata = {
      traceId: req.headers["x-trace-id"],
      url: req.url,
      method: req.method,
    };

    if (req.method === "POST") {
      await runMiddleware(
        req,
        res,
        authorizeAccessToken as unknown as MiddlewareFunction,
      );
      const checkPermissions = createCheckPermissionsMiddleware(["add:deals"]);
      await runMiddleware(req, res, checkPermissions);
      const { body } = req;

      const savedDeals = await createDeals(body, loggerMetadata);

      res.status(200).json({ data: savedDeals });
    }

    if (req.method === "PATCH") {
      await runMiddleware(
        req,
        res,
        authorizeAccessToken as unknown as MiddlewareFunction,
      );
      const checkPermissions = createCheckPermissionsMiddleware(["edit:deals"]);
      await runMiddleware(req, res, checkPermissions);

      const { body } = req;

      const savedDeals = await createDeals([body], loggerMetadata);

      res.status(200).json({ data: savedDeals[0] });
    }

    if (req.method === "DELETE") {
      await runMiddleware(
        req,
        res,
        authorizeAccessToken as unknown as MiddlewareFunction,
      );
      const checkPermissions = createCheckPermissionsMiddleware([
        "delete:deals",
      ]);
      await runMiddleware(req, res, checkPermissions);

      logger.info("Deleting Deal", loggerMetadata);
      // const data = await db.delete(DatabaseTables.Deals, id);
      logger.info("Finished Deleting Deal", loggerMetadata);

      // res.status(200).json({ data });
    }

    if (req.method === "GET") {
      // if (
      //   req.headers["x-auth-token"] !== process.env.NEXT_PUBLIC_X_AUTH_TOKEN
      // ) {
      //   return res.status(403).json({
      //     success: false,
      //     message: "You are not authorized to access this resource",
      //   });
      // }

      const query = req.query as { filter: string };

      const filter = Boolean(query.filter) && JSON.parse(query.filter);

      const deals = await getDeals();

      const filteredDeals = filterDeals(
        deals.deals as unknown as Deal[],
        filter,
      );

      res.status(200).json({
        success: true,
        data: filteredDeals,
        total: deals.deals?.length,
      });
    }
  } catch (e) {
    handleApiError(e as ErrorCommon, res, req);
  }
}

export default withSentry(handler);
