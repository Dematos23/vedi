
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
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { UserType } from "@prisma/client";

export default async function TherapistsPage() {
  const therapists = await prisma.user.findMany({
    where: {
      type: UserType.THERAPIST,
    },
    include: {
        _count: {
            select: { patients: true }
        }
    },
    orderBy: {
        name: 'asc'
    }
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
            <div>
                <CardTitle>Therapists</CardTitle>
                <CardDescription>A list of all therapists in your practice.</CardDescription>
            </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="hidden md:table-cell">Email</TableHead>
              <TableHead className="hidden md:table-cell">Phone</TableHead>
              <TableHead className="hidden sm:table-cell">Assigned Patients</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {therapists.map((therapist) => (
              <TableRow key={therapist.id}>
                <TableCell className="font-medium">{`${therapist.name} ${therapist.lastname}`}</TableCell>
                <TableCell className="hidden md:table-cell">
                  {therapist.email}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {therapist.phone || 'N/A'}
                </TableCell>
                 <TableCell className="hidden sm:table-cell text-center">
                  {therapist._count.patients}
                </TableCell>
                <TableCell className="text-right">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/therapists/${therapist.id}`}>
                      <Eye className="mr-2 h-4 w-4" />
                      View Performance
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
             {therapists.length === 0 && (
                <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                    No therapists found.
                    </TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
