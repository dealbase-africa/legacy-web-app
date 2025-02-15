import { prisma } from "@dealbase/db";
import { withSentry } from "@sentry/nextjs";
import { NextApiRequest, NextApiResponse } from "next";
// import { db } from "src/lib/db/supabase";
import { ErrorCommon, handleApiError } from "src/lib/handleApiError";
import { logger } from "src/lib/logger";
import { applyCommonMiddlewares } from "src/lib/middlewares/applyCommonMIddlewares";
import { authorizeAccessToken } from "src/lib/middlewares/authorizeAccessToken";
import { createCheckPermissionsMiddleware } from "src/lib/middlewares/checkPermissions";
import {
  MiddlewareFunction,
  runMiddleware,
} from "src/lib/middlewares/runMiddleware";

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
      const checkPermissions = createCheckPermissionsMiddleware([
        "add:investors",
      ]);
      await runMiddleware(req, res, checkPermissions);

      const {
        body: { logo, ...remainingBody },
      } = req;

      let savedLogo;
      if (logo?.url || logo?.cloudinary_public_id) {
        logger.info("Saving Logo", loggerMetadata);
        // savedLogo = await db.create(DatabaseTables.Logos, logo);
      }

      const investorToSave = {
        ...remainingBody,
      };

      if (savedLogo) {
        // investorToSave.logo_id = savedLogo.id;
        investorToSave.logo_id = 1;
      }

      logger.info("Saving Investor", loggerMetadata);
      // const data = await db.create(DatabaseTables.Investors, investorToSave);

      logger.info("Finished Saving Investor", loggerMetadata);

      res.status(200).json({ success: true, investor: {} });
    }

    if (req.method === "PATCH") {
      await runMiddleware(
        req,
        res,
        authorizeAccessToken as unknown as MiddlewareFunction,
      );
      const checkPermissions = createCheckPermissionsMiddleware([
        "edit:investors",
      ]);
      await runMiddleware(req, res, checkPermissions);

      const {
        body: { logo, ...updateData },
      } = req;

      let savedLogo;
      if (logo?.url || logo?.cloudinary_public_id) {
        logger.info("Saving Logo", loggerMetadata);
        // savedLogo = await db.create(DatabaseTables.Logos, logo);
      }

      const investorToSave = {
        ...updateData,
      };

      if (savedLogo) {
        // investorToSave.logo_id = savedLogo.id;
        investorToSave.logo_id = 1;
      }

      logger.info("Updating Investor", loggerMetadata);
      // const data = await db.update(DatabaseTables.Investors, investorToSave);

      logger.info("Finished Updating Investor", loggerMetadata);

      res.status(200).json({ investor: {} });
    }

    if (req.method === "DELETE") {
      await runMiddleware(
        req,
        res,
        authorizeAccessToken as unknown as MiddlewareFunction,
      );
      const checkPermissions = createCheckPermissionsMiddleware([
        "delete:investors",
      ]);
      await runMiddleware(req, res, checkPermissions);

      const {
        body: { id },
      } = req;

      logger.info("Deleting Investor", loggerMetadata);
      // const data = await db.delete(DatabaseTables.Investors, id);

      logger.info("Finished Deleting Investor", loggerMetadata);

      res.status(200).json({ data: id });
    }

    if (req.method === "GET") {
      if (
        req.headers["x-auth-token"] !== process.env.NEXT_PUBLIC_X_AUTH_TOKEN
      ) {
        return res.status(403).json({
          success: false,
          message: "You are not authorized to access this resource",
        });
      }

      logger.info("Getting Investors", loggerMetadata);
      const investors = await prisma.investor.findMany();
      // const { data: investors, error } = await supabase
      //   .from(DatabaseTables.Investors)
      //   .select("*, logo(*)");

      // if (error) throw error;

      logger.info("Finished Getting Investors", loggerMetadata);

      res.status(200).json({
        success: true,
        data: investors,
      });
    }
  } catch (e) {
    handleApiError(e as ErrorCommon, res, req);
  }
}

export default withSentry(handler);
