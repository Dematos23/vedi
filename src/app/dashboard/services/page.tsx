import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import prisma from "@/lib/prisma";

export default async function ServicesPage() {
  const services = await prisma.service.findMany();

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
            <form className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Service Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Individual Therapy"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the service..."
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Register Service
              </Button>
            </form>
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
