import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { Search } from "./components/search";

export default async function PatientsPage({
  searchParams,
}: {
  searchParams?: {
    query?: string;
  };
}) {
  const query = searchParams?.query || "";
  const patients = await prisma.patient.findMany({
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
    <Card>
      <CardHeader>
        <CardTitle>Patients</CardTitle>
        <CardDescription>A list of your current patients.</CardDescription>
        <div className="pt-4">
            <Search placeholder="Search by name or email..." />
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="hidden md:table-cell">Email</TableHead>
              <TableHead className="hidden md:table-cell">Phone</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {patients.map((patient) => (
              <TableRow key={patient.id}>
                <TableCell className="font-medium">{`${patient.name} ${patient.lastname}`}</TableCell>
                <TableCell className="hidden md:table-cell">
                  {patient.email}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {patient.phone && <Badge variant="outline">{patient.phone}</Badge>}
                </TableCell>
                <TableCell className="text-right">
                  <Button asChild variant="ghost" size="icon">
                    <Link href={`/dashboard/patients/${patient.id}`}>
                      <ArrowRight className="h-4 w-4" />
                      <span className="sr-only">View Patient</span>
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
             {patients.length === 0 && (
                <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                    No results found.
                    </TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}