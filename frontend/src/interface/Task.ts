export interface Task {
  _id: string;
  title: string;
  description: string;
  priority: number;
  status: string;
  dueDate: Date;
  tags: string[];
}
export interface AddTaskModalProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  refetch: boolean;
  setRefetch: (value: boolean) => void;
  taskDataToEdit?: Task | null;
}
