-- CreateTable
CREATE TABLE "ClickEvent" (
    "id" SERIAL NOT NULL,
    "event" TEXT NOT NULL,
    "source" TEXT,
    "userUuid" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "appVersion" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ClickEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ClickEvent_event_createdAt_idx" ON "ClickEvent"("event", "createdAt");
