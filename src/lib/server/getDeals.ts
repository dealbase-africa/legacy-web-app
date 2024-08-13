import { prisma } from "@dealbase/db";
import * as prismaClient from "@prisma/client";

import { getDealsWithInclude } from "./getDealsWithInclude";

const dealWithRelations =
  prismaClient.Prisma.validator<prismaClient.Prisma.DealArgs>()({
    include: {
      investors: {
        select: {
          investor: { include: { logo: true } },
        },
      },
      company: {
        include: { logo: true, sectors: { select: { sector: true } } },
      },
      pressRelease: true,
    },
  });

type Deal = prismaClient.Prisma.DealGetPayload<typeof dealWithRelations>;

type GetDealsWithIncludeReturn<T> = { deals: T; total: number; value: number };

export async function getDeals(options?: {
  filter: string;
  skip: number;
  take: number;
  orderBy: string;
  orderDirection: "asc" | "desc";
}): Promise<GetDealsWithIncludeReturn<Deal[]>> {
  return await getDealsWithInclude<Deal[]>(prisma, dealWithRelations, options);
}
