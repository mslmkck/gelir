import { z } from "zod";

import { prisma } from "@/lib/prisma";
import {
  createCrudService,
  createPrismaCrudRepository,
} from "@/lib/services/crud-factory";

const createExpenseSchema = z.object({
  amount: z.coerce.number().positive(),
  category: z.string().trim().min(1),
  vendor: z.string().trim().min(1),
  incurredAt: z.coerce.date(),
  notes: z.string().trim().max(500).optional(),
});

const updateExpenseSchema = z
  .object({
    amount: z.coerce.number().positive().optional(),
    category: z.string().trim().min(1).optional(),
    vendor: z.string().trim().min(1).optional(),
    incurredAt: z.coerce.date().optional(),
    notes: z.string().trim().max(500).nullable().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "No fields provided for update",
  });

const expensesRepository = createPrismaCrudRepository(prisma.expense, {
  orderBy: { incurredAt: "desc" },
});

export const expensesService = createCrudService(expensesRepository, {
  create: createExpenseSchema,
  update: updateExpenseSchema,
});
