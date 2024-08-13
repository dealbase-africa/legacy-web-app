import bunyan from "bunyan";

export const bunyanLogger = bunyan.createLogger({
  name: "dealbase-africa",
  src: process.env.NODE_ENV === "production" ? false : true,
  serializers: {
    req: bunyan.stdSerializers.req,
    res: bunyan.stdSerializers.res,
  },
});

import { log as axiomLogger } from "next-axiom";

export const logger =
  process.env.NODE_ENV === "production" ? axiomLogger : bunyanLogger;
