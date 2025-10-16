import { z } from "zod";

import { prisma } from "@/lib/prisma";
import {
  createCrudService,
  createPrismaCrudRepository,
} from "@/lib/services/crud-factory";

const createIncomeSchema = z.object({
  amount: z.coerce.number().positive(),
  source: z.string().trim().min(1),
  receivedAt: z.coerce.date(),
  notes: z.string().trim().max(500).optional(),
});

const updateIncomeSchema = z
  .object({
    amount: z.coerce.number().positive().optional(),
    source: z.string().trim().min(1).optional(),
    receivedAt: z.coerce.date().optional(),
    notes: z.string().trim().max(500).nullable().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "No fields provided for update",
  });

const incomesRepository = createPrismaCrudRepository(
  prisma.income,
  {
    orderBy: { receivedAt: "desc" },
  }
);

export const incomesService = createCrudService(
  incomesRepository,
  {
    create: createIncomeSchema,
    update: updateIncomeSchema,
  }
);
