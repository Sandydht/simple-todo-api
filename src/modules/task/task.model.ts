export interface CreateTaskResponse {
  status: string;
  data: TaskData;
}

export interface TaskData {
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
  data: TaskData[];
}

export interface UserTaskData {
  id: number;
  user_id: number;
  task_id: number;
}
