-- CreateTable
CREATE TABLE "Juego" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "imagen" TEXT NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "instrucciones" TEXT,
    "camposPrePago" JSONB NOT NULL,
    "requierePostPago" BOOLEAN NOT NULL DEFAULT false,
    "camposPostPago" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Denominacion" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "juegoId" TEXT NOT NULL,
    "etiqueta" TEXT NOT NULL,
    "valor" INTEGER NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Denominacion_juegoId_fkey" FOREIGN KEY ("juegoId") REFERENCES "Juego" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Precio" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "denominacionId" TEXT NOT NULL,
    "pais" TEXT NOT NULL DEFAULT 'AR',
    "moneda" TEXT NOT NULL DEFAULT 'ARS',
    "precioFinalCents" INTEGER NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Precio_denominacionId_fkey" FOREIGN KEY ("denominacionId") REFERENCES "Denominacion" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Orden" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "pais" TEXT NOT NULL DEFAULT 'AR',
    "juegoId" TEXT NOT NULL,
    "denominacionId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "whatsapp" TEXT NOT NULL,
    "camposPrePago" JSONB NOT NULL,
    "camposPostPago" JSONB,
    "estado" TEXT NOT NULL DEFAULT 'CREADA',
    "mpPreferenceId" TEXT,
    "mpPaymentId" TEXT,
    "ip" TEXT,
    "userAgent" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Juego_slug_key" ON "Juego"("slug");

-- CreateIndex
CREATE INDEX "Precio_denominacionId_pais_idx" ON "Precio"("denominacionId", "pais");
