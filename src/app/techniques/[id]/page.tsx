
import * as React from "react";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import type { Technique, Service, User, UserTechniqueStatus } from "@prisma/client";
import { TechniqueDetailClient } from "./components/technique-detail-client";

export type TechniqueWithDetails = Technique & {
  services: Service[];
  userStatuses: (UserTechniqueStatus & {
    user: User;
  })[];
};

export default async function TechniqueDetailPage({ params }: { params: { id:string } }) {
  const technique = await prisma.technique.findUnique({
    where: { id: params.id },
    include: {
      services: true,
      userStatuses: {
        include: {
          user: true
        }
      }
    },
  });

  if (!technique) {
    notFound();
  }

  return <TechniqueDetailClient technique={technique} />;
}
