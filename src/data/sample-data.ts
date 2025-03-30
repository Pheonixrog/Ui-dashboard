import { Activity, ChartData, Project, Stats, Task, User } from "@/types";

export const users: User[] = [
  {
    id: "user1",
    name: "Alex Johnson",
    avatar: "https://i.pravatar.cc/150?img=1",
    email: "alex@example.com",
  },
  {
    id: "user2",
    name: "Samantha Lee",
    avatar: "https://i.pravatar.cc/150?img=5",
    email: "sam@example.com",
  },
  {
    id: "user3",
    name: "David Chen",
    avatar: "https://i.pravatar.cc/150?img=3",
    email: "david@example.com",
  },
  {
    id: "user4",
    name: "Maria Rodriguez",
    avatar: "https://i.pravatar.cc/150?img=9",
    email: "maria@example.com",
  },
];

export const tasks: Task[] = [
  {
    id: "task1",
    title: "Design system update",
    description: "Update the design system with new components",
    status: "in-progress",
    priority: "high",
    createdAt: "2023-03-01T10:00:00Z",
    dueDate: "2023-04-10T23:59:59Z",
    assignee: users[0],
    tags: ["design", "ui"],
  },
  {
    id: "task2",
    title: "API integration",
    description: "Integrate with payment gateway API",
    status: "todo",
    priority: "medium",
    createdAt: "2023-03-05T14:30:00Z",
    dueDate: "2023-04-15T23:59:59Z",
    assignee: users[1],
    tags: ["backend", "api"],
  },
  {
    id: "task3",
    title: "User testing",
    description: "Conduct user testing sessions",
    status: "backlog",
    priority: "low",
    createdAt: "2023-03-10T09:15:00Z",
    dueDate: "2023-04-20T23:59:59Z",
    assignee: users[2],
    tags: ["research", "ux"],
  },
  {
    id: "task4",
    title: "Documentation",
    description: "Update developer documentation",
    status: "review",
    priority: "medium",
    createdAt: "2023-03-07T16:45:00Z",
    dueDate: "2023-04-12T23:59:59Z",
    assignee: users[3],
    tags: ["docs", "dev"],
  },
  {
    id: "task5",
    title: "Bug fixes",
    description: "Fix critical bugs in production",
    status: "in-progress",
    priority: "urgent",
    createdAt: "2023-03-08T11:20:00Z",
    dueDate: "2023-04-09T23:59:59Z",
    assignee: users[0],
    tags: ["bugs", "frontend"],
  },
  {
    id: "task6",
    title: "Performance optimization",
    description: "Optimize database queries",
    status: "todo",
    priority: "high",
    createdAt: "2023-03-11T13:10:00Z",
    dueDate: "2023-04-18T23:59:59Z",
    assignee: users[1],
    tags: ["performance", "database"],
  },
  {
    id: "task7",
    title: "Feature implementation",
    description: "Implement new analytics dashboard",
    status: "in-progress",
    priority: "high",
    createdAt: "2023-03-09T10:30:00Z",
    dueDate: "2023-04-14T23:59:59Z",
    assignee: users[2],
    tags: ["feature", "analytics"],
  },
  {
    id: "task8",
    title: "Code review",
    description: "Review pull requests",
    status: "done",
    priority: "medium",
    createdAt: "2023-03-06T15:00:00Z",
    dueDate: "2023-04-08T23:59:59Z",
    assignee: users[3],
    tags: ["code", "review"],
  },
];

export const project: Project = {
  id: "project1",
  name: "Dashboard Redesign",
  description: "Redesign and implement the new admin dashboard",
  tasks: tasks,
  members: users,
  createdAt: "2023-02-15T08:00:00Z",
  progress: 35,
};

export const activities: Activity[] = [
  {
    id: "activity1",
    user: users[0],
    action: "created task",
    target: "Design system update",
    timestamp: "2023-03-29T09:15:00Z",
  },
  {
    id: "activity2",
    user: users[1],
    action: "completed task",
    target: "Code review",
    timestamp: "2023-03-29T10:30:00Z",
  },
  {
    id: "activity3",
    user: users[2],
    action: "updated task",
    target: "API integration",
    timestamp: "2023-03-29T11:45:00Z",
  },
  {
    id: "activity4",
    user: users[3],
    action: "commented on",
    target: "Bug fixes",
    timestamp: "2023-03-29T13:00:00Z",
  },
  {
    id: "activity5",
    user: users[0],
    action: "assigned task",
    target: "User testing",
    timestamp: "2023-03-29T14:15:00Z",
  },
];

export const stats: Stats = {
  totalTasks: tasks.length,
  completedTasks: tasks.filter((task) => task.status === "done").length,
  overdueTasks: 2,
  upcomingDeadlines: 3,
};

export const statusDistribution: ChartData[] = [
  { name: "Backlog", value: tasks.filter((t) => t.status === "backlog").length, color: "#488df4" },
  { name: "To Do", value: tasks.filter((t) => t.status === "todo").length, color: "#b24fff" },
  { name: "In Progress", value: tasks.filter((t) => t.status === "in-progress").length, color: "#ff9f45" },
  { name: "Review", value: tasks.filter((t) => t.status === "review").length, color: "#a04fff" },
  { name: "Done", value: tasks.filter((t) => t.status === "done").length, color: "#3ecf8e" },
];

export const priorityDistribution: ChartData[] = [
  { name: "Low", value: tasks.filter((t) => t.priority === "low").length, color: "#3ecf8e" },
  { name: "Medium", value: tasks.filter((t) => t.priority === "medium").length, color: "#ffce45" },
  { name: "High", value: tasks.filter((t) => t.priority === "high").length, color: "#ff9f45" },
  { name: "Urgent", value: tasks.filter((t) => t.priority === "urgent").length, color: "#ff5c5c" },
]; 