import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import prisma from "@/lib/prisma";
import { NewServiceForm } from "./components/new-service-form";

export default async function ServicesPage() {
  const services = await prisma.service.findMany({
    orderBy: {
      name: 'asc'
    }
  });

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Register New Service</CardTitle>
            <CardDescription>
              Add a new therapy or service to the registry.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <NewServiceForm />
          </CardContent>
        </Card>
      </div>
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Available Services</CardTitle>
            <CardDescription>
              List of all registered services.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            {services.map((service) => (
              <div
                key={service.id}
                className="rounded-lg border bg-card text-card-foreground p-4"
              >
                <h3 className="font-semibold">{service.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {service.description}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
