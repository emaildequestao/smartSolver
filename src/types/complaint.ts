export interface Complaint {
  id: string;
  pk: string;
  complaint_title: string;
  complaint_description: string;
  complaint_creation_date: string;
  complaint_solution: string;
  complaint_category: string;
  complaint_importance: number;
  complaint_status: boolean;
  complaint_origin: string;
};
