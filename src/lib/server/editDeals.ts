import { Deal as InputDeal } from "@dealbase/core";
import * as prismaClient from "@dealbase/db";
import { Deal, Logo, Prisma } from "@dealbase/db";
import { logger } from "src/lib/logger";

export async function editDeals(
  deals: (Omit<InputDeal, "investors"> & { investors: string })[],
  loggerMetadata: Record<string, unknown>,
): Promise<Deal[]> {
  const databaseLogos = await prismaClient.prisma.logo.findMany();

  const logosMap = databaseLogos?.reduce<Record<string, Logo>>((acc, logo) => {
    acc[logo.originalFilename] = logo;
    return acc;
  }, {});

  const dealsPromises = [];

  for await (const deal of deals) {
    const {
      id,
      investors,
      pressRelease,
      createdAt,
      company: {
        id: _,
        sectors: __,
        createdAt: cca,
        logo,
        ...remainingCompany
      },
      ...remainingDeal
    } = deal;

    const existingLogo = logosMap[logo?.originalFilename ?? ""];

    let savedLogo;
    if (!remainingCompany.logoId) {
      if (existingLogo) {
        logger.info("Logo Already exists", {
          ...loggerMetadata,
          logo: existingLogo,
        });

        savedLogo = await prismaClient.prisma.logo.update({
          where: { id: existingLogo.id },
          data: { ...existingLogo, ...logo },
        });
      } else {
        if (logo) {
          logger.info("Saving New Logo", {
            ...loggerMetadata,
            logo: logo,
          });

          savedLogo = await prismaClient.prisma.logo.create({
            data: logo as unknown as Logo,
          });
        }
      }
    }

    logger.info("Checking if Company Already exists", {
      ...loggerMetadata,
      company: remainingCompany,
    });

    const existingCompany = await prismaClient.prisma.company.findFirst({
      where: {
        name: remainingCompany.name?.trim() ?? "",
      },
    });

    let savedCompany;
    if (existingCompany) {
      logger.info("Company Already exists", {
        ...loggerMetadata,
        company: existingCompany,
      });

      savedCompany = await prismaClient.prisma.company.update({
        where: { id: existingCompany.id },
        data: {
          ...existingCompany,
          ...remainingCompany,
        } as unknown as Prisma.CompanyUpdateInput,
      });
    } else {
      const newCompany = {
        ...remainingCompany,
      };

      if (savedLogo) {
        newCompany.logoId = savedLogo.id;
      }

      logger.info("Saving New Company", {
        ...loggerMetadata,
        company: newCompany,
      });

      savedCompany = await prismaClient.prisma.company.create({
        data: newCompany as unknown as Prisma.CompanyCreateInput,
      });
    }

    let savedPressRelease;
    if (pressRelease?.link || pressRelease?.date !== "Invalid Date") {
      logger.info("Checking if Press Release Already exists", {
        ...loggerMetadata,
        pressRelease: pressRelease,
      });

      const existingPressRelease =
        await prismaClient.prisma.pressRelease.findFirst({
          where: {
            link: pressRelease.link ?? "",
          },
        });

      if (existingPressRelease) {
        logger.info("Press Release Already exists", {
          ...loggerMetadata,
          press_release: existingPressRelease,
        });

        savedPressRelease = await prismaClient.prisma.pressRelease.update({
          where: { id: existingPressRelease.id },
          data: {
            ...existingPressRelease,
            ...pressRelease,
          } as unknown as Prisma.PressReleaseUpdateInput,
        });
      } else {
        const newPressRelease = {
          ...pressRelease,
          companyId: savedCompany?.id,
        };

        logger.info("Saving New Press Release", {
          ...loggerMetadata,
          pressRelease: newPressRelease,
        });
        savedPressRelease = await prismaClient.prisma.pressRelease.create({
          data: {
            ...pressRelease,
            title: "",
            company: {
              connect: { id: savedCompany?.id },
            },
          } as unknown as Prisma.PressReleaseCreateInput,
        });
      }
    }

    const investorsArray = Array.isArray(investors)
      ? investors
      : JSON.parse(investors) || [];

    let savedInvestors: string[] = [];
    const investorPromises = [];
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
          savedInvestors = [...savedInvestors, existingInvestor.name];
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
    savedInvestors = [
      ...savedInvestors,
      ...newSavedInvestors.map((i) => i.name),
    ];

    const dealToSave: Omit<
      Deal,
      | "id"
      | "company"
      | "investors"
      | "createdAt"
      | "isCrowdSourced"
      | "isAIGenerated"
    > & {
      id?: number;
    } = {
      ...remainingDeal,
      companyId: savedCompany?.id,
      pressReleaseId: 0,
    };

    if (savedPressRelease) {
      dealToSave.pressReleaseId = savedPressRelease?.id;
    }

    if (id) {
      logger.info("Updating Deal", {
        ...loggerMetadata,
        updatedDeal: { ...dealToSave, id },
      });
      dealsPromises.push(
        prismaClient.prisma.deal.update({
          where: { id },
          data: dealToSave as unknown as Prisma.DealUpdateInput,
        }),
      );
    } else {
      logger.info("Saving New Deal", { ...loggerMetadata, dealToSave });
      dealsPromises.push(
        prismaClient.prisma.deal.create({
          data: dealToSave as unknown as Prisma.DealCreateInput,
        }),
      );
    }

    logger.info("Finished Saving Deal", loggerMetadata);
  }

  const savedDeals = await Promise.all(dealsPromises);

  return savedDeals;
}
