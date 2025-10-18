
const cron = require("node-cron")
const Task = require("../models/Task.js")
const sendDueDateReminder = require("./emailService.js")

const startTaskReminderScheduler = () => {
  cron.schedule("0 8 * * *", async () => {
    // Runs every day at 8 AM
    console.log("⏳ Checking tasks due tomorrow...");

    try {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);

      const nextDay = new Date(tomorrow);
      nextDay.setHours(23, 59, 59, 999);

      // Find tasks due tomorrow
      const tasks = await Task.find({
        dueDate: { $gte: tomorrow, $lte: nextDay },
        status: { $ne: "completed" },
      }).populate("assignedTo", "email name");

      for (const task of tasks) {
        if (task.assignedTo?.email) {
          await sendDueDateReminder(task.assignedTo.email, task.title, task.dueDate);
        }
      }

      console.log(`✅ Processed ${tasks.length} tasks`);
    } catch (error) {
      console.error("❌ Error checking tasks:", error);
    }
  });
};

module.exports = startTaskReminderScheduler