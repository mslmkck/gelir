import { afterAll, beforeEach, describe, expect, it } from "vitest";

import {
  DELETE as deleteCreditHandler,
  GET as getCreditHandler,
  PUT as updateCreditHandler,
} from "@/app/api/credits/[id]/route";
import {
  GET as listCreditsHandler,
  POST as createCreditHandler,
} from "@/app/api/credits/route";
import {
  DELETE as deleteExpenseHandler,
  GET as getExpenseHandler,
  PUT as updateExpenseHandler,
} from "@/app/api/expenses/[id]/route";
import {
  GET as listExpensesHandler,
  POST as createExpenseHandler,
} from "@/app/api/expenses/route";
import {
  DELETE as deleteIncomeHandler,
  GET as getIncomeHandler,
  PUT as updateIncomeHandler,
} from "@/app/api/incomes/[id]/route";
import {
  GET as listIncomesHandler,
  POST as createIncomeHandler,
} from "@/app/api/incomes/route";
import {
  DELETE as deleteInvoiceHandler,
  GET as getInvoiceHandler,
  PUT as updateInvoiceHandler,
} from "@/app/api/invoices/[id]/route";
import {
  GET as listInvoicesHandler,
  POST as createInvoiceHandler,
} from "@/app/api/invoices/route";
import {
  DELETE as deletePaymentHandler,
  GET as getPaymentHandler,
  PUT as updatePaymentHandler,
} from "@/app/api/payments/[id]/route";
import {
  GET as listPaymentsHandler,
  POST as createPaymentHandler,
} from "@/app/api/payments/route";
import { prisma } from "@/lib/prisma";

const BASE_URL = "http://localhost";

const jsonRequest = (method: string, path: string, body?: unknown) =>
  new Request(`${BASE_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });

const request = (method: string, path: string) =>
  new Request(`${BASE_URL}${path}`, {
    method,
  });

async function resetDatabase() {
  await prisma.$transaction([
    prisma.payment.deleteMany(),
    prisma.credit.deleteMany(),
    prisma.invoice.deleteMany(),
    prisma.expense.deleteMany(),
    prisma.income.deleteMany(),
  ]);
}

beforeEach(async () => {
  await resetDatabase();
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe("Incomes API", () => {
  it("performs full CRUD flow", async () => {
    const createResponse = await createIncomeHandler(
      jsonRequest("POST", "/api/incomes", {
        amount: 5500,
        source: "Consulting",
        receivedAt: "2024-01-10",
        notes: "Initial invoice",
      })
    );

    expect(createResponse.status).toBe(201);
    const created = await createResponse.json();
    expect(created.data.source).toBe("Consulting");
    expect(created.data.amount).toBe(5500);

    const listResponse = await listIncomesHandler(request("GET", "/api/incomes"));
    expect(listResponse.status).toBe(200);
    const list = await listResponse.json();
    expect(list.data).toHaveLength(1);

    const id = String(created.data.id);

    const getResponse = await getIncomeHandler(
      request("GET", `/api/incomes/${id}`),
      { params: { id } }
    );
    expect(getResponse.status).toBe(200);
    const fetched = await getResponse.json();
    expect(fetched.data.id).toBe(created.data.id);

    const updateResponse = await updateIncomeHandler(
      jsonRequest("PUT", `/api/incomes/${id}`, {
        notes: "Updated notes",
      }),
      { params: { id } }
    );
    expect(updateResponse.status).toBe(200);
    const updated = await updateResponse.json();
    expect(updated.data.notes).toBe("Updated notes");

    const deleteResponse = await deleteIncomeHandler(
      request("DELETE", `/api/incomes/${id}`),
      { params: { id } }
    );
    expect(deleteResponse.status).toBe(204);

    const notFoundResponse = await getIncomeHandler(
      request("GET", `/api/incomes/${id}`),
      { params: { id } }
    );
    expect(notFoundResponse.status).toBe(404);
    const notFoundBody = await notFoundResponse.json();
    expect(notFoundBody.error).toBe("Resource not found");
  });

  it("rejects invalid payloads", async () => {
    const response = await createIncomeHandler(
      jsonRequest("POST", "/api/incomes", {
        amount: -10,
        source: "",
        receivedAt: "2024-01-01",
      })
    );

    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.error).toBe("Validation failed");
  });

  it("rejects invalid identifiers", async () => {
    const response = await getIncomeHandler(
      request("GET", "/api/incomes/abc"),
      { params: { id: "abc" } }
    );

    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.error).toBe("Invalid identifier provided");
  });
});

describe("Expenses API", () => {
  it("performs full CRUD flow", async () => {
    const createResponse = await createExpenseHandler(
      jsonRequest("POST", "/api/expenses", {
        amount: 250,
        category: "Software",
        vendor: "Figma",
        incurredAt: "2024-02-02",
        notes: "Monthly subscription",
      })
    );
    expect(createResponse.status).toBe(201);
    const created = await createResponse.json();

    const id = String(created.data.id);

    const listResponse = await listExpensesHandler(request("GET", "/api/expenses"));
    expect(listResponse.status).toBe(200);
    const list = await listResponse.json();
    expect(list.data).toHaveLength(1);

    const getResponse = await getExpenseHandler(
      request("GET", `/api/expenses/${id}`),
      { params: { id } }
    );
    expect(getResponse.status).toBe(200);

    const updateResponse = await updateExpenseHandler(
      jsonRequest("PUT", `/api/expenses/${id}`, {
        vendor: "Figma Inc.",
      }),
      { params: { id } }
    );
    expect(updateResponse.status).toBe(200);
    const updated = await updateResponse.json();
    expect(updated.data.vendor).toBe("Figma Inc.");

    const deleteResponse = await deleteExpenseHandler(
      request("DELETE", `/api/expenses/${id}`),
      { params: { id } }
    );
    expect(deleteResponse.status).toBe(204);
  });

  it("validates payloads", async () => {
    const response = await createExpenseHandler(
      jsonRequest("POST", "/api/expenses", {
        amount: 0,
        category: "",
        vendor: "Vendor",
        incurredAt: "2024-02-01",
      })
    );

    expect(response.status).toBe(400);
  });

  it("rejects invalid identifiers", async () => {
    const response = await getExpenseHandler(
      request("GET", "/api/expenses/-1"),
      { params: { id: "-1" } }
    );

    expect(response.status).toBe(400);
  });
});

describe("Invoices API", () => {
  it("performs full CRUD flow", async () => {
    const createResponse = await createInvoiceHandler(
      jsonRequest("POST", "/api/invoices", {
        number: "INV-1001",
        client: "Acme Corp",
        amount: 12000,
        issuedAt: "2024-03-01",
        dueAt: "2024-03-15",
        description: "Website redesign",
      })
    );
    expect(createResponse.status).toBe(201);
    const created = await createResponse.json();

    const id = String(created.data.id);

    const listResponse = await listInvoicesHandler(request("GET", "/api/invoices"));
    expect(listResponse.status).toBe(200);
    const list = await listResponse.json();
    expect(list.data).toHaveLength(1);

    const getResponse = await getInvoiceHandler(
      request("GET", `/api/invoices/${id}`),
      { params: { id } }
    );
    expect(getResponse.status).toBe(200);

    const updateResponse = await updateInvoiceHandler(
      jsonRequest("PUT", `/api/invoices/${id}`, {
        status: "PAID",
      }),
      { params: { id } }
    );
    expect(updateResponse.status).toBe(200);
    const updated = await updateResponse.json();
    expect(updated.data.status).toBe("PAID");

    const deleteResponse = await deleteInvoiceHandler(
      request("DELETE", `/api/invoices/${id}`),
      { params: { id } }
    );
    expect(deleteResponse.status).toBe(204);
  });

  it("enforces unique invoice numbers", async () => {
    const payload = {
      number: "INV-2001",
      client: "Acme",
      amount: 5000,
      issuedAt: "2024-04-01",
      dueAt: "2024-04-15",
    };

    const first = await createInvoiceHandler(jsonRequest("POST", "/api/invoices", payload));
    expect(first.status).toBe(201);

    const second = await createInvoiceHandler(jsonRequest("POST", "/api/invoices", payload));
    expect(second.status).toBe(409);
  });

  it("validates temporal consistency", async () => {
    const response = await createInvoiceHandler(
      jsonRequest("POST", "/api/invoices", {
        number: "INV-3001",
        client: "Acme",
        amount: 5000,
        issuedAt: "2024-04-20",
        dueAt: "2024-04-10",
      })
    );

    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.error).toBe("Validation failed");
  });
});

describe("Credits API", () => {
  it("performs full CRUD flow", async () => {
    const invoiceResponse = await createInvoiceHandler(
      jsonRequest("POST", "/api/invoices", {
        number: "INV-4001",
        client: "Globex",
        amount: 8000,
        issuedAt: "2024-05-01",
        dueAt: "2024-05-20",
      })
    );
    const invoice = await invoiceResponse.json();

    const createResponse = await createCreditHandler(
      jsonRequest("POST", "/api/credits", {
        amount: 500,
        reason: "Loyalty discount",
        issuedAt: "2024-05-05",
        invoiceId: invoice.data.id,
      })
    );
    expect(createResponse.status).toBe(201);
    const created = await createResponse.json();

    const id = String(created.data.id);

    const listResponse = await listCreditsHandler(request("GET", "/api/credits"));
    expect(listResponse.status).toBe(200);

    const getResponse = await getCreditHandler(
      request("GET", `/api/credits/${id}`),
      { params: { id } }
    );
    expect(getResponse.status).toBe(200);

    const updateResponse = await updateCreditHandler(
      jsonRequest("PUT", `/api/credits/${id}`, {
        amount: 650,
      }),
      { params: { id } }
    );
    expect(updateResponse.status).toBe(200);
    const updated = await updateResponse.json();
    expect(updated.data.amount).toBe(650);

    const deleteResponse = await deleteCreditHandler(
      request("DELETE", `/api/credits/${id}`),
      { params: { id } }
    );
    expect(deleteResponse.status).toBe(204);
  });

  it("validates foreign key references", async () => {
    const response = await createCreditHandler(
      jsonRequest("POST", "/api/credits", {
        amount: 100,
        reason: "Adjustment",
        issuedAt: "2024-06-01",
        invoiceId: 9999,
      })
    );

    expect(response.status).toBe(400);
  });
});

describe("Payments API", () => {
  it("performs full CRUD flow", async () => {
    const invoiceResponse = await createInvoiceHandler(
      jsonRequest("POST", "/api/invoices", {
        number: "INV-5001",
        client: "Soylent",
        amount: 4000,
        issuedAt: "2024-06-01",
        dueAt: "2024-06-20",
      })
    );
    const invoice = await invoiceResponse.json();

    const createResponse = await createPaymentHandler(
      jsonRequest("POST", "/api/payments", {
        amount: 2000,
        method: "BANK_TRANSFER",
        receivedAt: "2024-06-05",
        reference: "TRX-1234",
        invoiceId: invoice.data.id,
      })
    );
    expect(createResponse.status).toBe(201);
    const created = await createResponse.json();

    const id = String(created.data.id);

    const listResponse = await listPaymentsHandler(request("GET", "/api/payments"));
    expect(listResponse.status).toBe(200);

    const getResponse = await getPaymentHandler(
      request("GET", `/api/payments/${id}`),
      { params: { id } }
    );
    expect(getResponse.status).toBe(200);

    const updateResponse = await updatePaymentHandler(
      jsonRequest("PUT", `/api/payments/${id}`, {
        reference: null,
      }),
      { params: { id } }
    );
    expect(updateResponse.status).toBe(200);
    const updated = await updateResponse.json();
    expect(updated.data.reference).toBeNull();

    const deleteResponse = await deletePaymentHandler(
      request("DELETE", `/api/payments/${id}`),
      { params: { id } }
    );
    expect(deleteResponse.status).toBe(204);
  });

  it("validates payment methods", async () => {
    const response = await createPaymentHandler(
      jsonRequest("POST", "/api/payments", {
        amount: 200,
        method: "CRYPTO",
        receivedAt: "2024-07-01",
      })
    );

    expect(response.status).toBe(400);
  });
});
