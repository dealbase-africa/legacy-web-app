import { Deal as InputDeal } from "@dealbase/core";
import * as prismaClient from "@dealbase/db";
import { Deal } from "@dealbase/db";
import { logger } from "src/lib/logger";
import { processPromisesInChunks } from "./processPromisesInChunks";

export async function createDeals(
  deals: (Omit<InputDeal, "investors" | "id"> & { investors: string })[],
  loggerMetadata: Record<string, unknown>,
): Promise<Deal[]> {
  const savedDeals = [];
  const dealsInvestors: { dealId: number; investorId: number }[] = [];
  const companiesSectors: { companyId: number; sectorId: number }[] = [];

  for await (const deal of deals) {
    const {
      investors,
      pressRelease,
      company: { sectors, logo, ...remainingCompany },
      ...remainingDeal
    } = deal;

    const existingCompany = await prismaClient.prisma.company.findFirst({
      where: {
        name: remainingCompany.name?.trim(),
        country: {
          isoCode: remainingCompany.country?.isoCode?.trim(),
        },
      },
    });

    const existingLogo = await prismaClient.prisma.logo.findFirst({
      where: {
        originalFilename: logo?.originalFilename ?? "",
      },
    });

    const createdDeal = await prismaClient.prisma.deal.create({
      data: {
        amount: remainingDeal.amount ?? 0,
        stage: remainingDeal.stage ?? "",
        company: {
          connectOrCreate: {
            where: {
              id: existingCompany?.id ?? 0,
              name: remainingCompany.name?.trim(),
              country: {
                isoCode: remainingCompany.country?.isoCode.trim() ?? "",
              },
            },
            create: {
              name: remainingCompany.name?.trim() ?? "",
              country: {
                connect: {
                  isoCode: remainingCompany.country?.isoCode.trim() ?? "",
                },
              },
              launchYear: remainingCompany.launchYear ?? "",
              website: remainingCompany.website ?? "",
              about: remainingCompany.about ?? "",
              femaleFounder: remainingCompany.femaleFounder ?? false,
              diverseFounders: remainingCompany.diverseFounders ?? false,
              logo: {
                connectOrCreate: {
                  where: {
                    id: existingLogo?.id ?? 0,
                    originalFilename: logo?.originalFilename ?? "",
                  },
                  create: {
                    cloudinaryPublicId: logo?.cloudinaryPublicId ?? "",
                    url: logo?.url ?? "",
                    format: logo?.format ?? "",
                    originalFilename: logo?.originalFilename ?? "",
                    ...logo,
                  },
                },
              },
            },
          },
        },
        pressRelease: {
          create: {
            ...pressRelease,
            title: pressRelease.title ?? "",
            link: pressRelease.link ?? "",
          },
        },
      },
    });

    savedDeals.push(createdDeal);

    logger.info("Finished Saving Deal", loggerMetadata);

    logger.info("Creating Deal Investor Links", loggerMetadata);

    const investorPromises = [];

    const investorsArray = Array.isArray(investors)
      ? investors
      : JSON.parse(investors) || [];

    if (investorsArray) {
      for await (const investor of investorsArray) {
        const existingInvestor = await prismaClient.prisma.investor.findFirst({
          where: {
            name: investor.trim(),
          },
        });

        if (existingInvestor) {
          logger.info("Investor already exists", {
            ...loggerMetadata,
            investor,
            existingInvestor: existingInvestor.name,
            newInvestor: investor.trim().toLowerCase().replace(/\s/g, ""),
          });

          dealsInvestors.push({
            dealId: createdDeal.id,
            investorId: existingInvestor.id,
          });
        } else if (investor.trim() !== "") {
          logger.info("Saving New Investor", {
            ...loggerMetadata,
            investor: investor.trim(),
          });

          investorPromises.push(
            prismaClient.prisma.investor.create({
              data: {
                name: investor.trim(),
              },
            }),
          );
        }
      }
    }

    const newSavedInvestors = await Promise.all(investorPromises);
    newSavedInvestors.forEach((investor) => {
      dealsInvestors.push({
        dealId: createdDeal.id,
        investorId: investor.id,
      });
    });

    logger.info("Creating Company Sector Links", loggerMetadata);

    const sectorPromises = [];

    const sectorsArray = Array.isArray(sectors)
      ? sectors
      : JSON.parse(sectors) || [];

    if (sectorsArray) {
      for await (const sector of sectorsArray) {
        const existingSector = await prismaClient.prisma.sector.findFirst({
          where: {
            name: sector.trim(),
          },
        });

        if (existingSector) {
          logger.info("Sector already exists", {
            ...loggerMetadata,
            sector,
            existingSector: existingSector.name,
            newSector: sector.trim().toLowerCase().replace(/\s/g, ""),
          });

          companiesSectors.push({
            companyId: createdDeal.companyId,
            sectorId: existingSector.id,
          });
        } else if (sector.trim() !== "") {
          logger.info("Saving New Sector", {
            ...loggerMetadata,
            sector: sector.trim(),
          });

          sectorPromises.push(
            prismaClient.prisma.sector.create({
              data: {
                name: sector.trim(),
              },
            }),
          );
        }
      }
    }

    const newSavedSectors = await Promise.all(sectorPromises);
    newSavedSectors.forEach((sector) => {
      companiesSectors.push({
        companyId: createdDeal.companyId,
        sectorId: sector.id,
      });
    });
  }

  const sectorPromises: Promise<unknown>[] = [];
  companiesSectors.forEach(async (companySector) => {
    if (
      typeof companySector === "object" &&
      companySector &&
      "companyId" in companySector &&
      "sectorId" in companySector &&
      typeof companySector.companyId === "number" &&
      typeof companySector.sectorId === "number"
    ) {
      sectorPromises.push(
        prismaClient.prisma.company.update({
          where: { id: companySector.companyId },
          data: {
            sectors: {
              connectOrCreate: [
                {
                  where: {
                    companyId_sectorId: {
                      companyId: companySector.companyId,
                      sectorId: companySector.sectorId,
                    },
                  },
                  create: {
                    sector: {
                      connect: {
                        id: companySector.sectorId,
                      },
                    },
                  },
                },
              ],
            },
          },
        }),
      );
    }
  });

  const dealInvestorPromises: Promise<unknown>[] = [];
  dealsInvestors.forEach(async (dealInvestor) => {
    if (
      typeof dealInvestor === "object" &&
      dealInvestor &&
      "dealId" in dealInvestor &&
      "investorId" in dealInvestor &&
      typeof dealInvestor.dealId === "number" &&
      typeof dealInvestor.investorId === "number"
    ) {
      dealInvestorPromises.push(
        prismaClient.prisma.deal.update({
          where: { id: dealInvestor.dealId },
          data: {
            investors: {
              connectOrCreate: [
                {
                  where: {
                    dealId_investorId: {
                      dealId: dealInvestor.dealId,
                      investorId: dealInvestor.investorId,
                    },
                  },
                  create: {
                    investor: {
                      connect: {
                        id: dealInvestor.investorId,
                      },
                    },
                  },
                },
              ],
            },
          },
        }),
      );
    }
  });

  processPromisesInChunks(sectorPromises, 200)
    .then((results) => {
      console.log("All companySector promises have been processed:", results);
    })
    .catch((error) => {
      console.error(
        "An error occurred while processing companySectors:",
        error,
      );
    });

  processPromisesInChunks(dealInvestorPromises, 200)
    .then((results) => {
      console.log("All dealInvestor promises have been processed:", results);
    })
    .catch((error) => {
      console.error("An error occurred while processing dealInvestors:", error);
    });

  logger.info("Finished Creating Deal Investor Links", {
    ...loggerMetadata,
    linksMade: dealsInvestors.length,
  });

  return savedDeals;
}
