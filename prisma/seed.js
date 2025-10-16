import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.income.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.credit.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.expense.deleteMany();

  const [consultingInvoice, subscriptionInvoice] = await Promise.all([
    prisma.invoice.create({
      data: {
        number: "INV-2024-0001",
        customerName: "Acme Industries",
        currency: "USD",
        status: "SENT",
        issuedAt: new Date("2024-07-01"),
        dueAt: new Date("2024-07-31"),
        subtotal: "15000.00",
        taxRate: "8.5",
        notes: "Quarterly consulting retainer.",
      },
    }),
    prisma.invoice.create({
      data: {
        number: "INV-2024-0002",
        customerName: "Globex Corporation",
        currency: "USD",
        status: "PARTIALLY_PAID",
        issuedAt: new Date("2024-07-15"),
        dueAt: new Date("2024-08-14"),
        subtotal: "6000.00",
        taxRate: "5.0",
        notes: "Annual SaaS subscription renewal.",
      },
    }),
  ]);

  const [firstCredit, secondCredit] = await Promise.all([
    prisma.credit.create({
      data: {
        invoiceId: consultingInvoice.id,
        amount: "500.00",
        currency: "USD",
        reason: "Early payment incentive",
        expiresAt: new Date("2024-12-31"),
      },
    }),
    prisma.credit.create({
      data: {
        invoiceId: subscriptionInvoice.id,
        amount: "250.00",
        currency: "USD",
        reason: "Support downtime credit",
        expiresAt: new Date("2024-10-01"),
      },
    }),
  ]);

  const paymentForConsulting = await prisma.payment.create({
    data: {
      invoiceId: consultingInvoice.id,
      amount: "12000.00",
      currency: "USD",
      method: "BANK_TRANSFER",
      reference: "WT-829173",
      receivedAt: new Date("2024-07-05T10:30:00Z"),
      notes: "Paid via ACH wire.",
    },
  });

  const partialPaymentForSubscription = await prisma.payment.create({
    data: {
      invoiceId: subscriptionInvoice.id,
      amount: "3000.00",
      currency: "USD",
      method: "CARD",
      reference: "CC-554430",
      receivedAt: new Date("2024-07-20T15:45:00Z"),
      notes: "Paid via company card.",
    },
  });

  await prisma.income.createMany({
    data: [
      {
        description: "Consulting retainer payment",
        type: "CONSULTING",
        source: "Acme Industries",
        currency: "USD",
        grossAmount: "12000.00",
        fee: "45.00",
        receivedAt: new Date("2024-07-05T10:30:00Z"),
        invoiceId: consultingInvoice.id,
        paymentId: paymentForConsulting.id,
      },
      {
        description: "Subscription renewal partial payment",
        type: "SUBSCRIPTION",
        source: "Globex Corporation",
        currency: "USD",
        grossAmount: "3000.00",
        fee: "90.00",
        receivedAt: new Date("2024-07-20T15:45:00Z"),
        invoiceId: subscriptionInvoice.id,
        paymentId: partialPaymentForSubscription.id,
      },
      {
        description: "Ad-hoc implementation work",
        type: "SERVICE",
        source: "Initech",
        currency: "USD",
        grossAmount: "4500.00",
        fee: "0",
        receivedAt: new Date("2024-06-18T12:15:00Z"),
      },
    ],
  });

  await prisma.expense.createMany({
    data: [
      {
        vendor: "Figma",
        description: "Design tooling subscription",
        category: "SOFTWARE",
        currency: "USD",
        amount: "75.00",
        taxAmount: "0",
        incurredAt: new Date("2024-07-01"),
        paidAt: new Date("2024-07-01"),
        paymentMethod: "CARD",
      },
      {
        vendor: "AWS",
        description: "June infrastructure usage",
        category: "OPERATIONS",
        currency: "USD",
        amount: "2150.00",
        taxAmount: "0",
        incurredAt: new Date("2024-06-30"),
        paidAt: new Date("2024-07-03"),
        paymentMethod: "ACH",
      },
      {
        vendor: "Tech Recruiters LLC",
        description: "Technical recruiting retainer",
        category: "PAYROLL",
        currency: "USD",
        amount: "3200.00",
        taxAmount: "256.00",
        incurredAt: new Date("2024-07-10"),
        paymentMethod: "BANK_TRANSFER",
      },
    ],
  });

  console.log("Seed data inserted successfully.");
}

main()
  .catch((error) => {
    console.error("Error seeding database:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
