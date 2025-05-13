export interface CreateTaskResponse {
  id: number;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  is_done: boolean;
  label_color: string;
  created_at: string;
  updated_at: string;
}