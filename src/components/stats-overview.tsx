'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Clock, Hourglass, Circle, RefreshCw, AlertTriangle } from "lucide-react"
import { motion } from "framer-motion"
import { Task } from "@/types"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface StatsOverviewProps {
  tasks?: Task[]
}

interface Stat {
  title: string
  value: number | string
  description: string
  icon: React.ReactNode
  color: string
}

export default function StatsOverview({ tasks = [] }: StatsOverviewProps) {
  const [stats, setStats] = useState<Stat[]>([])

  useEffect(() => {
    // Calculate stats based on tasks
    const totalTasks = tasks.length
    const completedTasks = tasks.filter(task => task.status === 'done').length
    const inProgressTasks = tasks.filter(task => task.status === 'in-progress').length
    const todoTasks = tasks.filter(task => task.status === 'todo').length
    const reviewTasks = tasks.filter(task => task.status === 'review').length
    const backlogTasks = tasks.filter(task => task.status === 'backlog').length
    const highPriorityTasks = tasks.filter(task => task.priority === 'high').length
    
    // Calculate completion rate
    const completionRate = totalTasks > 0 
      ? Math.round((completedTasks / totalTasks) * 100)
      : 0
      
    // Calculate overdue tasks (assuming createdAt + 7 days is due date if not completed)
    const now = new Date()
    const overdueTasks = tasks.filter(task => {
      if (task.status === 'done') return false
      const dueDate = new Date(task.createdAt)
      dueDate.setDate(dueDate.getDate() + 7)
      return dueDate < now
    }).length
    
    const newStats: Stat[] = [
      {
        title: "Total Tasks",
        value: totalTasks,
        description: "All tasks in the system",
        icon: <Circle className="h-6 w-6" />,
        color: "bg-blue-500/20 text-blue-500"
      },
      {
        title: "Completed",
        value: completedTasks,
        description: `${completionRate}% completion rate`,
        icon: <CheckCircle className="h-6 w-6" />,
        color: "bg-green-500/20 text-green-500"
      },
      {
        title: "In Progress",
        value: inProgressTasks,
        description: `${Math.round((inProgressTasks / Math.max(totalTasks, 1)) * 100)}% of total tasks`,
        icon: <Hourglass className="h-6 w-6" />,
        color: "bg-amber-500/20 text-amber-500"
      },
      {
        title: "Waiting Review",
        value: reviewTasks,
        description: `${Math.round((reviewTasks / Math.max(totalTasks, 1)) * 100)}% of total tasks`,
        icon: <RefreshCw className="h-6 w-6" />,
        color: "bg-violet-500/20 text-violet-500"
      },
      {
        title: "Upcoming",
        value: todoTasks + backlogTasks,
        description: `${todoTasks} to do, ${backlogTasks} backlog`,
        icon: <Clock className="h-6 w-6" />,
        color: "bg-indigo-500/20 text-indigo-500"
      },
      {
        title: "High Priority",
        value: highPriorityTasks,
        description: `${Math.round((highPriorityTasks / Math.max(totalTasks, 1)) * 100)}% of total tasks`,
        icon: <AlertTriangle className="h-6 w-6" />,
        color: "bg-rose-500/20 text-rose-500"
      }
    ]
    
    setStats(newStats)
  }, [tasks])

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {stats.map((stat, index) => (
        <motion.div 
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <Card className="border border-border/50 bg-card/50 backdrop-blur-sm hover:border-border hover:bg-card/70 transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <div className={cn("rounded-full p-2", stat.color)}>
                {stat.icon}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
} 