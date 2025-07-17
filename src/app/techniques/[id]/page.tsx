
import * as React from "react";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import type { Technique, Service, User, UserTechniqueStatus } from "@prisma/client";
import { TechniqueDetailClient } from "./components/technique-detail-client";

export type UserTechniqueStatusWithUsage = UserTechniqueStatus & {
    user: User;
    _count: {
        userTechniqueUsageLogs: number;
    }
};

export type TechniqueWithDetails = Technique & {
  services: Service[];
  users: UserTechniqueStatusWithUsage[];
};

export default async function TechniqueDetailPage({ params }: { params: { id:string } }) {
  const technique = await prisma.technique.findUnique({
    where: { id: params.id },
    include: {
      services: true,
      users: {
        include: {
          user: true
        }
      }
    },
  });

  if (!technique) {
    notFound();
  }

  // Manually fetch usage counts for each user-technique pair
  const usersWithUsage = await Promise.all(technique.users.map(async (status) => {
    const usageCount = await prisma.userTechniqueUsageLog.count({
        where: {
            userId: status.userId,
            techniqueId: status.techniqueId,
        }
    });
    return {
        ...status,
        _count: {
            userTechniqueUsageLogs: usageCount,
        }
    };
  }));

  const techniqueWithDetails: TechniqueWithDetails = {
    ...technique,
    users: usersWithUsage,
  };


  return <TechniqueDetailClient technique={techniqueWithDetails} />;
}
