import cron from "node-cron";
import axios from "axios";

const SERVER_URL = process.env.SERVER_URL;

export const startKeepAliveCron = () => {
  if (!SERVER_URL) {
    console.log("⚠️ SERVER_URL not defined. Cron not started.");
    return;
  }

  cron.schedule("*/10 * * * *", async () => {
    try {
      const res = await axios.get(`${SERVER_URL}/api/v1/healthcheck`);
      console.log("✅ Keep-alive ping sent:", res.status);
    } catch (error) {
      console.error("❌ Keep-alive failed:", error.message);
    }
  });

  console.log("🚀 Keep-alive cron started (every 10 minutes)");
};
