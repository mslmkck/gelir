import { z } from "zod";

import { prisma } from "@/lib/prisma";
import {
  createCrudService,
  createPrismaCrudRepository,
} from "@/lib/services/crud-factory";

const createCreditSchema = z.object({
  amount: z.coerce.number().positive(),
  reason: z.string().trim().min(1),
  issuedAt: z.coerce.date(),
  invoiceId: z.coerce.number().int().positive().optional(),
});

const updateCreditSchema = z
  .object({
    amount: z.coerce.number().positive().optional(),
    reason: z.string().trim().min(1).optional(),
    issuedAt: z.coerce.date().optional(),
    invoiceId: z.union([z.coerce.number().int().positive(), z.literal(null)]).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "No fields provided for update",
  });

const creditsRepository = createPrismaCrudRepository(prisma.credit, {
  orderBy: { issuedAt: "desc" },
});

export const creditsService = createCrudService(creditsRepository, {
  create: createCreditSchema,
  update: updateCreditSchema,
});
