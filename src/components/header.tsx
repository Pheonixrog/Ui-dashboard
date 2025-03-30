'use client'

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Bell, ChevronDown, LogOut, Plus, Search, Settings, User } from "lucide-react"
import { motion } from "framer-motion"
import { useState } from "react"
import TaskDialog from "./task-dialog"
import { users } from "@/data/sample-data"
import { useToast } from "@/hooks/use-toast"

interface HeaderProps {
  onTaskCreated: (task: any) => void
}

export default function Header({ onTaskCreated }: HeaderProps) {
  const { toast } = useToast()
  const [taskDialogOpen, setTaskDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [notifications, setNotifications] = useState(3)
  const [searchQuery, setSearchQuery] = useState("")

  const handleCreateTask = async (data: any) => {
    setIsSubmitting(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Create new task
      const newTask = {
        id: `task-${Date.now()}`,
        title: data.title,
        description: data.description,
        status: data.status,
        priority: data.priority,
        createdAt: new Date().toISOString(),
        dueDate: data.dueDate.toISOString(),
        assignee: users.find(user => user.id === data.assigneeId) || users[0],
        tags: data.tags,
      }
      
      onTaskCreated(newTask)
      
      toast({
        title: "Task created",
        description: "New task has been created successfully.",
        variant: "success",
      })
      
      setTaskDialogOpen(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleNotificationsClick = () => {
    toast({
      title: "Notifications",
      description: `You have ${notifications} unread notifications.`,
      variant: "info",
    })
    setNotifications(0)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      toast({
        title: "Search",
        description: `Searching for "${searchQuery}"...`,
        variant: "info",
      })
    }
  }

  const handleLogout = () => {
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
      variant: "info",
    })
  }

  const handleMenuItemClick = (item: string) => {
    toast({
      title: item,
      description: `${item} page would open here.`,
      variant: "info",
    })
  }

  return (
    <motion.header 
      className="flex items-center justify-between p-4 border-b"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center space-x-4">
        <motion.h1 
          className="text-2xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          TaskBoard
        </motion.h1>
        <Badge 
          className="ml-2 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 hover:from-indigo-500/30 hover:to-purple-500/30 text-primary border-indigo-500/20"
          variant="outline"
        >
          Dashboard
        </Badge>
      </div>
      
      <div className="flex items-center space-x-2">
        <form 
          className="relative w-64 hidden md:block"
          onSubmit={handleSearch}
        >
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search tasks..." 
            className="w-full rounded-md pl-8 py-2 bg-secondary/10 border-2 border-secondary/20 hover:border-secondary focus:border-primary focus:outline-none transition-colors"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>
        
        <Button 
          variant="outline" 
          size="icon" 
          className="rounded-full relative border-2 hover:border-primary hover:bg-secondary/20"
          onClick={handleNotificationsClick}
        >
          <Bell className="h-4 w-4" />
          {notifications > 0 && (
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center">
              {notifications}
            </span>
          )}
        </Button>
        
        <Button 
          className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-full shadow-md hover:shadow-lg transition-all duration-200"
          onClick={() => setTaskDialogOpen(true)}
        >
          <Plus className="h-4 w-4 mr-2" /> New Task
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center space-x-2">
              <Avatar className="h-8 w-8 border-2 border-indigo-500/20">
                <AvatarImage src="https://i.pravatar.cc/150?img=1" alt="Alex Johnson" />
                <AvatarFallback>AJ</AvatarFallback>
              </Avatar>
              <span className="hidden md:inline-block font-medium">Alex Johnson</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleMenuItemClick('Profile')}>
              <User className="h-4 w-4 mr-2" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleMenuItemClick('Settings')}>
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleMenuItemClick('Projects')}>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="h-4 w-4 mr-2"
              >
                <path d="M2 7a5 5 0 0 1 5-5h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5z"></path>
                <path d="M9 22v-6h6v6"></path>
                <path d="M9 10h.01"></path>
                <path d="M15 10h.01"></path>
                <path d="M9.5 14.5a.5.5 0 0 0 5 0"></path>
              </svg>
              Projects
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <TaskDialog
        open={taskDialogOpen}
        onOpenChange={setTaskDialogOpen}
        onSubmit={handleCreateTask}
        initialData={null}
        isSubmitting={isSubmitting}
      />
    </motion.header>
  )
} 