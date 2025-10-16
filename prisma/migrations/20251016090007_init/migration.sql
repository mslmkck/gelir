-- CreateTable
CREATE TABLE "Invoice" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "number" TEXT NOT NULL,
    "customerName" TEXT NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "issuedAt" DATETIME NOT NULL,
    "dueAt" DATETIME,
    "subtotal" NUMERIC NOT NULL,
    "taxRate" NUMERIC NOT NULL DEFAULT 0,
    "taxAmount" NUMERIC GENERATED ALWAYS AS (("subtotal" * "taxRate" / 100.0)) STORED,
    "totalAmount" NUMERIC GENERATED ALWAYS AS (("subtotal" + ("subtotal" * "taxRate" / 100.0))) STORED,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Invoice_currency_check" CHECK ("currency" IN ('USD','EUR','GBP','CAD','AUD')),
    CONSTRAINT "Invoice_status_check" CHECK ("status" IN ('DRAFT','SENT','PARTIALLY_PAID','PAID','OVERDUE','CANCELED'))
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "invoiceId" INTEGER NOT NULL,
    "amount" NUMERIC NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "method" TEXT NOT NULL,
    "reference" TEXT,
    "receivedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Payment_currency_check" CHECK ("currency" IN ('USD','EUR','GBP','CAD','AUD')),
    CONSTRAINT "Payment_method_check" CHECK ("method" IN ('BANK_TRANSFER','CARD','CASH','CHECK','ACH','OTHER')),
    CONSTRAINT "Payment_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Income" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "description" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'OTHER',
    "source" TEXT,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "grossAmount" NUMERIC NOT NULL,
    "fee" NUMERIC DEFAULT 0,
    "netAmount" NUMERIC GENERATED ALWAYS AS (("grossAmount" - IFNULL("fee", 0))) STORED,
    "receivedAt" DATETIME NOT NULL,
    "invoiceId" INTEGER,
    "paymentId" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Income_currency_check" CHECK ("currency" IN ('USD','EUR','GBP','CAD','AUD')),
    CONSTRAINT "Income_type_check" CHECK ("type" IN ('PRODUCT','SERVICE','SUBSCRIPTION','CONSULTING','OTHER')),
    CONSTRAINT "Income_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Income_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "Payment"("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Expense" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "vendor" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL DEFAULT 'OTHER',
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "amount" NUMERIC NOT NULL,
    "taxAmount" NUMERIC DEFAULT 0,
    "totalWithTax" NUMERIC GENERATED ALWAYS AS (("amount" + IFNULL("taxAmount", 0))) STORED,
    "incurredAt" DATETIME NOT NULL,
    "paidAt" DATETIME,
    "paymentMethod" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Expense_currency_check" CHECK ("currency" IN ('USD','EUR','GBP','CAD','AUD')),
    CONSTRAINT "Expense_category_check" CHECK ("category" IN ('OPERATIONS','MARKETING','PAYROLL','SOFTWARE','TRAVEL','OTHER')),
    CONSTRAINT "Expense_paymentMethod_check" CHECK (
        "paymentMethod" IS NULL OR
        "paymentMethod" IN ('BANK_TRANSFER','CARD','CASH','CHECK','ACH','OTHER')
    )
);

-- CreateTable
CREATE TABLE "Credit" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "invoiceId" INTEGER NOT NULL,
    "amount" NUMERIC NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "reason" TEXT,
    "issuedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Credit_currency_check" CHECK ("currency" IN ('USD','EUR','GBP','CAD','AUD')),
    CONSTRAINT "Credit_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_number_key" ON "Invoice"("number");

-- CreateIndex
CREATE INDEX "Invoice_status_dueAt_idx" ON "Invoice"("status", "dueAt");

-- CreateIndex
CREATE UNIQUE INDEX "Income_paymentId_key" ON "Income"("paymentId");

-- CreateIndex
CREATE INDEX "Income_type_receivedAt_idx" ON "Income"("type", "receivedAt");

-- CreateIndex
CREATE INDEX "Expense_category_incurredAt_idx" ON "Expense"("category", "incurredAt");

-- CreateIndex
CREATE INDEX "Credit_invoiceId_expiresAt_idx" ON "Credit"("invoiceId", "expiresAt");

-- CreateIndex
CREATE INDEX "Payment_invoiceId_receivedAt_idx" ON "Payment"("invoiceId", "receivedAt");
