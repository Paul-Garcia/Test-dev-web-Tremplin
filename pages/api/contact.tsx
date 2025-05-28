import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

const availabilitySchema = z.object({
  day: z.enum([
    "Lundi",
    "Mardi",
    "Mercredi",
    "Jeudi",
    "Vendredi",
    "Samedi",
    "Dimanche",
  ]),
  hour: z.number().int().min(0).max(23),
  minute: z.number().int().min(0).max(59),
});

const contactSchema = z.object({
  civilite: z.enum(["M", "Mme"]),
  lastName: z.string().min(1).max(100),
  firstName: z.string().min(1).max(100),
  email: z.string().email().max(150),
  phone: z.string().max(20).optional().or(z.literal("")),
  messageType: z.enum(["Demande", "Rappel", "Photos"]),
  message: z.string().min(1),
});

const schema = z.object({
  contact: contactSchema,
  availabilities: z.array(availabilitySchema).optional(),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.error("call vers contact");

  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  try {
    const data = schema.parse(req.body);

    const createdContact = await prisma.contact.create({
      data: {
        civilite: data.contact.civilite,
        lastName: data.contact.lastName,
        firstName: data.contact.firstName,
        email: data.contact.email,
        phone: data.contact.phone || null,
        messageType: data.contact.messageType,
        message: data.contact.message,
      },
    });

    if (data.availabilities && data.availabilities.length > 0) {
      await prisma.availability.createMany({
        data: data.availabilities.map(({ day, hour, minute }) => ({
          day,
          hour,
          minute,
          contactId: createdContact.id,
        })),
      });
    }

    return res.status(200).json({ message: 'Contact et disponibilités enregistrés' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    console.error(error);
    return res.status(500).json({ error: 'Erreur serveur' });
  } finally {
    await prisma.$disconnect();
  }
}
