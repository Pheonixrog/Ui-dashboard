import { Task, Priority, Status } from "@/types"

export const tasks: Task[] = [
  {
    id: "TASK-8782",
    title: "Implement authentication flow",
    status: Status.IN_PROGRESS,
    priority: Priority.HIGH,
    dueDate: "2023-11-15",
    description:
      "Implement user authentication flow using OAuth2.0 and JWT tokens",
    assigneeId: "user-14",
    tags: ["Auth", "Security"],
    createdAt: "2023-10-26",
    updatedAt: "2023-11-02",
  },
  {
    id: "TASK-7878",
    title: "Design system implementation",
    status: Status.TODO,
    priority: Priority.MEDIUM,
    dueDate: "2023-11-20",
    description:
      "Create reusable UI components following our design system guidelines",
    assigneeId: "user-02",
    tags: ["UI", "Design"],
    createdAt: "2023-10-28",
    updatedAt: "2023-10-28",
  },
  {
    id: "TASK-5562",
    title: "API integration for user profiles",
    status: Status.COMPLETED,
    priority: Priority.LOW,
    dueDate: "2023-11-10",
    description: "Connect user profile section with backend API endpoints",
    assigneeId: "user-14",
    tags: ["API", "Backend"],
    createdAt: "2023-10-15",
    updatedAt: "2023-11-08",
  },
  {
    id: "TASK-9901",
    title: "Optimize database queries",
    status: Status.IN_REVIEW,
    priority: Priority.HIGH,
    dueDate: "2023-11-12",
    description:
      "Review and optimize slow database queries to improve application performance",
    assigneeId: "user-03",
    tags: ["Database", "Performance"],
    createdAt: "2023-10-20",
    updatedAt: "2023-11-05",
  },
  {
    id: "TASK-1121",
    title: "Implement error tracking",
    status: Status.TODO,
    priority: Priority.MEDIUM,
    dueDate: "2023-11-25",
    description:
      "Set up error tracking and monitoring using Sentry for frontend applications",
    assigneeId: "user-05",
    tags: ["DevOps", "Monitoring"],
    createdAt: "2023-10-30",
    updatedAt: "2023-10-30",
  },
  {
    id: "TASK-7654",
    title: "Update user documentation",
    status: Status.IN_PROGRESS,
    priority: Priority.LOW,
    dueDate: "2023-12-05",
    description:
      "Update the user guide to reflect recent changes in the application",
    assigneeId: "user-14",
    tags: ["Documentation"],
    createdAt: "2023-11-01",
    updatedAt: "2023-11-03",
  },
  {
    id: "TASK-2389",
    title: "Fix navigation responsive issues",
    status: Status.IN_REVIEW,
    priority: Priority.MEDIUM,
    dueDate: "2023-11-13",
    description:
      "Address the navigation menu breakpoints for mobile and tablet devices",
    assigneeId: "user-09",
    tags: ["UI", "Responsive"],
    createdAt: "2023-10-22",
    updatedAt: "2023-11-04",
  },
  {
    id: "TASK-5552",
    title: "Upgrade dependencies",
    status: Status.COMPLETED,
    priority: Priority.HIGH,
    dueDate: "2023-11-05",
    description:
      "Upgrade all npm packages to their latest versions and fix any compatibility issues",
    assigneeId: "user-07",
    tags: ["Maintenance", "Dependencies"],
    createdAt: "2023-10-10",
    updatedAt: "2023-11-01",
  },
  {
    id: "TASK-3421",
    title: "Implement dark mode toggle",
    status: Status.TODO,
    priority: Priority.LOW,
    dueDate: "2023-12-10",
    description:
      "Add dark mode support with a toggle in user settings and respect system preferences",
    assigneeId: "user-12",
    tags: ["UI", "Accessibility"],
    createdAt: "2023-11-02",
    updatedAt: "2023-11-02",
  },
  {
    id: "TASK-9987",
    title: "Setup CI/CD pipeline",
    status: Status.IN_PROGRESS,
    priority: Priority.HIGH,
    dueDate: "2023-11-18",
    description:
      "Configure GitHub Actions for continuous integration and deployment",
    assigneeId: "user-03",
    tags: ["DevOps", "CI/CD"],
    createdAt: "2023-10-25",
    updatedAt: "2023-11-02",
  },
]

export function generateTaskId(): string {
  const randomNum = Math.floor(Math.random() * 10000)
  return `TASK-${randomNum.toString().padStart(4, "0")}`
}

export const statusOptions = [
  {
    value: Status.TODO,
    label: "To Do",
  },
  {
    value: Status.IN_PROGRESS,
    label: "In Progress",
  },
  {
    value: Status.IN_REVIEW,
    label: "In Review",
  },
  {
    value: Status.COMPLETED,
    label: "Completed",
  },
]

export const priorityOptions = [
  {
    value: Priority.LOW,
    label: "Low",
  },
  {
    value: Priority.MEDIUM,
    label: "Medium",
  },
  {
    value: Priority.HIGH,
    label: "High",
  },
]

export const userOptions = [
  {
    value: "user-01",
    label: "Alex Johnson",
  },
  {
    value: "user-02",
    label: "Samantha Lee",
  },
  {
    value: "user-03",
    label: "David Chen",
  },
  {
    value: "user-04",
    label: "Maria Rodriguez",
  },
  {
    value: "user-05",
    label: "James Wilson",
  },
  {
    value: "user-06",
    label: "Emily Davis",
  },
  {
    value: "user-07",
    label: "Michael Brown",
  },
  {
    value: "user-08",
    label: "Michelle Kim",
  },
  {
    value: "user-09",
    label: "Robert Taylor",
  },
  {
    value: "user-10",
    label: "Jessica Martinez",
  },
  {
    value: "user-11",
    label: "Daniel Smith",
  },
  {
    value: "user-12",
    label: "Sarah Clark",
  },
  {
    value: "user-13",
    label: "Thomas Garcia",
  },
  {
    value: "user-14",
    label: "Rebecca Lewis",
  },
]

export const allTags = [
  "UI",
  "API",
  "Auth",
  "Backend",
  "Frontend",
  "Bug",
  "Feature",
  "Documentation",
  "DevOps",
  "Testing",
  "Design",
  "Security",
  "Performance",
  "Accessibility",
  "Maintenance",
  "Responsive",
  "Database",
  "Dependencies",
  "CI/CD",
  "Monitoring"
] 