
import prisma from "@/lib/prisma";
import type { Patient } from "@prisma/client";
import { PatientsList } from "./components/patients-list";

export default async function PatientsPage({
  searchParams,
}: {
  searchParams: {
    query?: string;
  };
}) {
  const { query = "" } = searchParams;
  const patients: Patient[] = await prisma.patient.findMany({
    where: {
      OR: [
        {
          name: {
            contains: query,
            mode: "insensitive",
          },
        },
        {
          lastname: {
            contains: query,
            mode: "insensitive",
          },
        },
        {
          email: {
            contains: query,
            mode: "insensitive",
          },
        },
      ],
    },
  });

  return (
    <PatientsList patients={patients} />
  );
}
