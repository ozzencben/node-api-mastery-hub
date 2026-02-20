import cron from "node-cron";
import prisma from "../lib/prisma";

export const startCronJobs = () => {
  cron.schedule("1 0 * * *", async () => {
    try {
      const today = new Date();
      const currentDayOfMonth = today.getDate();
      const currentDayOfWeek = today.getDay();

      const pendingTemplates = await prisma.recurringTransaction.findMany({
        where: {
          AND: [
            { isActive: true },
            {
              isActive: true,
              OR: [
                { frequency: "MONTHLY", dayOfMonth: currentDayOfMonth },
                { frequency: "WEEKLY", dayOfWeek: currentDayOfWeek },
              ],
            },
            {
              OR: [
                { lastRunDate: null },
                {
                  lastRunDate: {
                    lt: new Date(new Date().setHours(0, 0, 0, 0)),
                  },
                },
              ],
            },
          ],
        },
      });

      if (pendingTemplates.length > 0) {
        for (const template of pendingTemplates) {
          await prisma.transaction.create({
            data: {
              amount: template.amount,
              type: template.type,
              category: template.category,
              description: `[AUTOMATIC] ${template.description || ""}`,
              userId: template.userId,
            },
          });

          await prisma.recurringTransaction.update({
            where: { id: template.id },
            data: { lastRunDate: new Date() },
          });
        }
        console.log(
          `[CRON] Processed ${pendingTemplates.length} recurring transactions.`,
        );
      }
    } catch (error) {
      console.error("Error in cron job:", error);
    }
  });
};
