export interface CreateTaskResponse {
  status: string;
  data: UserTaskData;
}

export interface UserTaskData {
  id: number;
  title: string;
  description: string;
  start_date: string | null;
  end_date: string | null;
  is_done: boolean;
  label_color: string;
  created_at: string | null;
  updated_at: string | null; 
}

export interface GetTaskListResponse {
  status: string;
  data: UserTaskData[];
}