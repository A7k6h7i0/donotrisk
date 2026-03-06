import { AgentReview } from "../models/AgentReview.js";
import { AgentProfile } from "../models/AgentProfile.js";
import { RegisteredProduct } from "../models/RegisteredProduct.js";

export async function recalculateAgentMetrics(agentProfileId) {
  const [reviews, registrations] = await Promise.all([
    AgentReview.find({ agent_id: agentProfileId }).select("rating").lean(),
    RegisteredProduct.find({ agent_id: agentProfileId, warranty_completed: true }).select("customer_email customer_phone").lean()
  ]);

  const averageRating = reviews.length
    ? Number((reviews.reduce((sum, item) => sum + item.rating, 0) / reviews.length).toFixed(2))
    : 0;

  const uniqueCustomers = new Set(
    registrations.map((item) => (item.customer_email || item.customer_phone || "").trim().toLowerCase()).filter(Boolean)
  );

  await AgentProfile.findByIdAndUpdate(agentProfileId, {
    average_rating: averageRating,
    total_registrations: registrations.length,
    total_customers: uniqueCustomers.size
  });

  return {
    averageRating,
    totalRegistrations: registrations.length,
    totalCustomers: uniqueCustomers.size
  };
}
