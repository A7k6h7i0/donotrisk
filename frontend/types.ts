export type Category = {
  id: string;
  name: string;
  parent_id: string | null;
  parent_name?: string | null;
};

export type Product = {
  id: string;
  name: string;
  brand: string;
  model_number: string;
  description: string;
  release_date: string;
  risk_score: number;
  risk_band: "Low" | "Moderate" | "High" | string;
  category_name?: string;
};
