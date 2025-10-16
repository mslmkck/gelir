import { z } from "zod";

import { prisma } from "@/lib/prisma";
import {
  createCrudService,
  createPrismaCrudRepository,
} from "@/lib/services/crud-factory";

const invoiceStatusSchema = z.enum(["PENDING", "PAID", "OVERDUE", "CANCELLED"]);

const createInvoiceSchema = z
  .object({
    number: z.string().trim().min(1),
    client: z.string().trim().min(1),
    amount: z.coerce.number().positive(),
    status: invoiceStatusSchema.default("PENDING"),
    issuedAt: z.coerce.date(),
    dueAt: z.coerce.date(),
    description: z.string().trim().max(1000).optional(),
  })
  .refine((data) => data.dueAt >= data.issuedAt, {
    message: "dueAt must be on or after issuedAt",
    path: ["dueAt"],
  });

const updateInvoiceSchema = z
  .object({
    number: z.string().trim().min(1).optional(),
    client: z.string().trim().min(1).optional(),
    amount: z.coerce.number().positive().optional(),
    status: invoiceStatusSchema.optional(),
    issuedAt: z.coerce.date().optional(),
    dueAt: z.coerce.date().optional(),
    description: z.string().trim().max(1000).nullable().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "No fields provided for update",
  })
  .superRefine((data, ctx) => {
    if (data.dueAt && data.issuedAt && data.dueAt < data.issuedAt) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "dueAt must be on or after issuedAt",
        path: ["dueAt"],
      });
    }
  });

const invoicesRepository = createPrismaCrudRepository(prisma.invoice, {
  orderBy: { dueAt: "asc" },
});

export const invoicesService = createCrudService(invoicesRepository, {
  create: createInvoiceSchema,
  update: updateInvoiceSchema,
});
