-- Google / phone-OTP sign-in via Firebase Auth.
-- Phone-only customers have no email and no password, so both become optional.
ALTER TABLE "users" ALTER COLUMN "email" DROP NOT NULL;
ALTER TABLE "users" ALTER COLUMN "password_hash" DROP NOT NULL;

ALTER TABLE "users" ADD COLUMN "firebase_uid" TEXT;
ALTER TABLE "users" ADD COLUMN "email_verified" BOOLEAN NOT NULL DEFAULT false;

CREATE UNIQUE INDEX "users_firebase_uid_key" ON "users"("firebase_uid");
CREATE INDEX "users_phone_idx" ON "users"("phone");
