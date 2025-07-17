
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import type { Patient } from "@prisma/client"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

export function getFullName(patient: Pick<Patient, 'name' | 'secondname' | 'lastname' | 'secondlastname'>): string {
    return [patient.name, patient.secondname, patient.lastname, patient.secondlastname]
        .filter(Boolean) // Remove null or empty strings
        .join(' ');
}
