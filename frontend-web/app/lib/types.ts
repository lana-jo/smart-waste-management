export interface ReportStats {
  total: number;
  by_status: {
    Pending: number;
    "In Progress": number;
    Completed: number;
    Rejected: number;
  };
  by_category: {
    "Organic Waste": number;
    "Plastic Waste": number;
    "Paper Waste": number;
  };
}
