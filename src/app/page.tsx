'use client'

import ThreeBackground from "@/components/three-background"
import Header from "@/components/header"
import StatsOverview from "@/components/stats-overview"
import TaskBoard from "@/components/task-board"
import Charts from "@/components/charts"
import ActivityFeed from "@/components/activity-feed"
import { tasks as initialTasks } from "@/data/sample-data"
import { useState } from "react"
import { Task } from "@/types"
import { Toaster } from "@/components/ui/toaster"
import { motion } from "framer-motion"

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)

  const handleTaskCreated = (task: Task) => {
    setTasks(prev => [task, ...prev])
  }

  const handleTasksUpdated = (updatedTasks: Task[]) => {
    setTasks(updatedTasks)
  }

  return (
    <main className="min-h-screen flex flex-col relative bg-gradient-to-br from-background via-background/95 to-background/90">
      <ThreeBackground />
      <Toaster />
      
      <div className="container mx-auto px-4 pt-4 pb-8 flex-1 z-10">
        <Header onTaskCreated={handleTaskCreated} />
        
        <div className="mt-8">
          <StatsOverview tasks={tasks} />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          <motion.div 
            className="lg:col-span-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <TaskBoard 
              tasks={tasks} 
              onTasksChange={handleTasksUpdated} 
            />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="space-y-8">
              <Charts tasks={tasks} />
              <ActivityFeed tasks={tasks} />
            </div>
          </motion.div>
        </div>
      </div>
      
      <footer className="mt-auto py-4 text-center text-xs text-muted-foreground z-10">
        © {new Date().getFullYear()} Project Dashboard. All rights reserved.
      </footer>
    </main>
  )
}
