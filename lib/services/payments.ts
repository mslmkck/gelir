import { z } from "zod";

import { prisma } from "@/lib/prisma";
import {
  createCrudService,
  createPrismaCrudRepository,
} from "@/lib/services/crud-factory";

const paymentMethodSchema = z.enum(["CASH", "CARD", "BANK_TRANSFER", "OTHER"]);

const createPaymentSchema = z.object({
  amount: z.coerce.number().positive(),
  method: paymentMethodSchema,
  receivedAt: z.coerce.date(),
  reference: z.string().trim().max(100).optional(),
  invoiceId: z.coerce.number().int().positive().optional(),
});

const updatePaymentSchema = z
  .object({
    amount: z.coerce.number().positive().optional(),
    method: paymentMethodSchema.optional(),
    receivedAt: z.coerce.date().optional(),
    reference: z.string().trim().max(100).nullable().optional(),
    invoiceId: z.union([z.coerce.number().int().positive(), z.literal(null)]).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "No fields provided for update",
  });

const paymentsRepository = createPrismaCrudRepository(prisma.payment, {
  orderBy: { receivedAt: "desc" },
});

export const paymentsService = createCrudService(paymentsRepository, {
  create: createPaymentSchema,
  update: updatePaymentSchema,
});
