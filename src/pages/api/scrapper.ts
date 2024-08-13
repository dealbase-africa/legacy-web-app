import { withSentry } from "@sentry/nextjs";
import { Duration } from "date-fns";
import { NextApiRequest, NextApiResponse } from "next";
import { ErrorCommon, handleApiError } from "src/lib/handleApiError";
import { applyCommonMiddlewares } from "src/lib/middlewares/applyCommonMIddlewares";
import { getDisruptAfrica } from "src/lib/server/scrapper/disrupt-africa";
import { getTechCabal } from "src/lib/server/scrapper/tech-cabal";
import { getTechCrunch } from "src/lib/server/scrapper/techcrunch";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await applyCommonMiddlewares(req, res);
    const loggerMetadata = {
      traceId: req.headers["x-trace-id"],
      url: req.url,
      method: req.method,
    };

    if (req.method === "GET") {
      const {
        query: { number, unit },
      } = req;

      const num = number ? +number : 7;

      const duration: Duration = {
        [unit as string]: num,
      };

      const disruptAfrica = await getDisruptAfrica(duration);
      const techCabal = await getTechCabal(duration);
      const techCrunch = await getTechCrunch(duration);

      res.status(200).json({ data: [disruptAfrica, techCabal, techCrunch] });
    }
  } catch (e) {
    handleApiError(e as ErrorCommon, res, req);
  }
}

export default withSentry(handler);
