-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Orden" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "pais" TEXT NOT NULL DEFAULT 'AR',
    "juegoId" TEXT NOT NULL,
    "denominacionId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "whatsapp" TEXT NOT NULL,
    "camposPrePago" JSONB,
    "camposPostPago" JSONB,
    "estado" TEXT NOT NULL DEFAULT 'CREADA',
    "mpPreferenceId" TEXT,
    "mpPaymentId" TEXT,
    "ip" TEXT,
    "userAgent" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Orden" ("camposPostPago", "camposPrePago", "createdAt", "denominacionId", "email", "estado", "id", "ip", "juegoId", "mpPaymentId", "mpPreferenceId", "pais", "updatedAt", "userAgent", "whatsapp") SELECT "camposPostPago", "camposPrePago", "createdAt", "denominacionId", "email", "estado", "id", "ip", "juegoId", "mpPaymentId", "mpPreferenceId", "pais", "updatedAt", "userAgent", "whatsapp" FROM "Orden";
DROP TABLE "Orden";
ALTER TABLE "new_Orden" RENAME TO "Orden";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
