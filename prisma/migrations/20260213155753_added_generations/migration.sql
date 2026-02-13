/*
  Warnings:

  - Added the required column `userId` to the `Generations` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Generations" ADD COLUMN     "userId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Generations" ADD CONSTRAINT "Generations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
