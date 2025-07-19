
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import type { Patient, User } from "@prisma/client"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

type Nameable = 
    Pick<Patient, 'name' | 'secondname' | 'lastname' | 'secondlastname'> | 
    Pick<User, 'name' | 'lastname'>;


export function getFullName(person: Nameable): string {
    const parts = [person.name];
    if ('secondname' in person) {
        parts.push(person.secondname);
    }
    parts.push(person.lastname);
    if ('secondlastname' in person) {
        parts.push(person.secondlastname);
    }
    return parts.filter(Boolean).join(' ');
}
