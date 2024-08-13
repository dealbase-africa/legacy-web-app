import * as prismaClient from "@dealbase/db";
import { generateWhereClause } from "./generateWhereClause";

const dealForSummaryWithRelations =
  prismaClient.Prisma.validator<prismaClient.Prisma.DealArgs>()({
    include: {
      investors: {
        select: {
          investor: true,
        },
      },
    },
  });

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

const stringToInt = (inputString?: string | number, fallback?: number) => {
  if (typeof inputString === "number") return inputString;
  const parsedString = parseInt(inputString ?? `${fallback}`);
  return Number.isNaN(parsedString) ? fallback : parsedString;
};

type GetDealsWithIncludeReturn<T> = { deals: T; total: number; value: number };

export async function getDealsWithInclude<T, K = unknown>(
  prisma: prismaClient.PrismaClient,
  include: T extends Deal[]
    ? typeof dealWithRelations
    : typeof dealForSummaryWithRelations,
  options?: {
    filter: string;
    skip: number;
    take: number;
    orderBy: string;
    orderDirection: "asc" | "desc";
  },
): Promise<GetDealsWithIncludeReturn<T>> {
  const { filter, skip, take, orderBy, orderDirection } = options ?? {};

  const orderByObject =
    orderBy && orderDirection
      ? orderBy.includes(".")
        ? {
            [orderBy.split(".")[0]]: {
              [orderBy.split(".")[1]]: orderDirection,
            },
          }
        : { [orderBy]: orderDirection }
      : {};

  const whereClause = generateWhereClause(filter);

  const total = await prisma.deal.aggregate({
    _count: true,
    _sum: {
      amount: true,
    },
    where: whereClause,
  });

  const deals = (await prisma.deal.findMany({
    ...(include as K),
    where: whereClause,
    orderBy: orderByObject,
    ...(take ? { take: stringToInt(take, 10) } : {}),
    ...(skip ? { skip: stringToInt(skip, 0) } : {}),
  })) as T;

  return { deals: deals, total: total._count, value: total._sum.amount ?? 0 };
}
