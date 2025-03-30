export type Status = 'backlog' | 'todo' | 'in-progress' | 'review' | 'done';

export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export type User = {
  id: string;
  name: string;
  avatar: string;
  email: string;
};

export type Task = {
  id: string;
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  createdAt: string;
  dueDate: string;
  assignee: User;
  tags: string[];
};

export type Project = {
  id: string;
  name: string;
  description: string;
  tasks: Task[];
  members: User[];
  createdAt: string;
  progress: number;
};

export type Activity = {
  id: string;
  user: User;
  action: string;
  target: string;
  timestamp: string;
};

export type Stats = {
  totalTasks: number;
  completedTasks: number;
  overdueTasks: number;
  upcomingDeadlines: number;
};

export type ChartData = {
  name: string;
  value: number;
  color: string;
}; 