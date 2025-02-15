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
        "add:companies",
      ]);
      await runMiddleware(req, res, checkPermissions);

      const {
        body: { logo, ...remainingBody },
      } = req;

      let savedLogo;
      if (logo?.url || logo?.cloudinary_public_id) {
        logger.info("Saving Logo", loggerMetadata);
        // savedLogo = await db.create(DatabaseTables.Logos, logo);

        logger.info("Finished Saving Logo", {
          ...loggerMetadata,
        });
      }

      const companyToSave = {
        ...remainingBody,
      };

      if (savedLogo) {
        // companyToSave.logo_id = savedLogo.id;
      }

      logger.info("Saving Company", loggerMetadata);
      // const data = await db.create(DatabaseTables.Companies, companyToSave);

      logger.info("Finished Saving Company", loggerMetadata);

      res.status(200).json({ success: true, company: {} });
    }

    if (req.method === "PATCH") {
      await runMiddleware(
        req,
        res,
        authorizeAccessToken as unknown as MiddlewareFunction,
      );
      const checkPermissions = createCheckPermissionsMiddleware([
        "edit:companies",
      ]);
      await runMiddleware(req, res, checkPermissions);

      const {
        body: { logo, ...updateData },
      } = req;

      let savedLogo;
      if (logo?.url || logo?.cloudinary_public_id) {
        logger.info("Saving Logo", loggerMetadata);
        // savedLogo = await db.update(DatabaseTables.Logos, logo);

        logger.info("Finished Saving Logo", {
          ...loggerMetadata,
        });
      }

      const companyToUpdate = {
        ...updateData,
      };

      if (savedLogo) {
        // companyToUpdate.logo_id = savedLogo.id;
      }

      logger.info("Updating Company", loggerMetadata);
      // const data = await db.update(DatabaseTables.Companies, companyToUpdate);

      logger.info("Finished Updating Company", loggerMetadata);

      res.status(200).json({ data: {} });
    }

    if (req.method === "DELETE") {
      await runMiddleware(
        req,
        res,
        authorizeAccessToken as unknown as MiddlewareFunction,
      );
      const checkPermissions = createCheckPermissionsMiddleware([
        "read:companies",
      ]);
      await runMiddleware(req, res, checkPermissions);

      const {
        body: { id },
      } = req;

      logger.info("Deleting Company", loggerMetadata);

      // const data = await db.delete(DatabaseTables.Companies, id);

      logger.info("Finished Deleting Company", loggerMetadata);

      res.status(200).json({ data: {} });
    }

    if (req.method === "GET") {
      logger.info("Getting Companies", loggerMetadata);
      // const { data, error } = await supabase
      //   .from(DatabaseTables.Companies)
      //   .select("*, logo(*)");

      const data = await prisma.company.findMany({});

      // if (error) throw error;

      logger.info("Finished Getting Companies", loggerMetadata);

      res.status(200).json({ success: true, data, total: data?.length });
    }
  } catch (e) {
    handleApiError(e as ErrorCommon, res, req);
  }
}

export default withSentry(handler);
