-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "awb_number" TEXT,
ADD COLUMN     "estimated_delivery" TIMESTAMP(3),
ADD COLUMN     "shipment_id" TEXT,
ADD COLUMN     "shipping_status" TEXT DEFAULT 'NOT_SHIPPED',
ADD COLUMN     "tracking_url" TEXT;

-- CreateIndex
CREATE INDEX "orders_awb_number_idx" ON "orders"("awb_number");
