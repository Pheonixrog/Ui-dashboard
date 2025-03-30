'use client'

import { Button } from "@/components/ui/button"
import { Task, Priority, Status } from "@/types"
import { useToast } from "@/hooks/use-toast"
import {
  Bell,
  Menu,
  Plus,
  Settings,
  User,
  Search,
  Inbox,
  LogOut,
  LayoutGrid,
  Calendar,
} from "lucide-react"
import { TaskDialog } from "@/components/task-dialog"
import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { generateTaskId } from "@/app/(dashboard)/tasks/data"

interface HeaderProps {
  onTaskCreated?: (task: Task) => void
}

export default function Header({ onTaskCreated }: HeaderProps) {
  const [searchOpen, setSearchOpen] = useState(false)
  const [notifications, setNotifications] = useState<
    { id: string; title: string; time: string; read: boolean }[]
  >([
    {
      id: "n1",
      title: "New task assigned to you",
      time: "2 hours ago",
      read: false,
    },
    {
      id: "n2",
      title: "Your task status was updated",
      time: "5 hours ago",
      read: false,
    },
    {
      id: "n3",
      title: "New comment on your task",
      time: "1 day ago",
      read: true,
    },
  ])
  const [taskDialogOpen, setTaskDialogOpen] = useState(false)
  const { toast } = useToast()

  const unreadCount = notifications.filter((n) => !n.read).length

  const markAllAsRead = () => {
    setNotifications(
      notifications.map((n) => ({
        ...n,
        read: true,
      }))
    )
  }

  const handleCreateTask = (data: Partial<Task>) => {
    try {
      // Just a placeholder for demo - in a real app, this would call an API
      if (onTaskCreated) {
        const newTask: Task = {
          id: generateTaskId(),
          title: data.title || "Untitled Task",
          description: data.description || "",
          status: data.status || Status.TODO,
          priority: data.priority || Priority.MEDIUM,
          dueDate: data.dueDate || new Date().toISOString().split("T")[0],
          assigneeId: data.assigneeId || "",
          tags: data.tags || [],
          createdAt: new Date().toISOString().split("T")[0],
          updatedAt: new Date().toISOString().split("T")[0],
        }
        onTaskCreated(newTask)
        toast({
          title: "Task created",
          description: "Your new task has been created successfully",
        })
      }
    } catch {
      toast({
        title: "Error",
        description: "There was a problem creating your task",
        variant: "destructive",
      })
    }
  }

  return (
    <header className="flex items-center justify-between py-4">
      <div className="flex items-center">
        <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary/80 to-primary mr-8">
          Dashboard
        </div>

        <nav className="hidden md:flex items-center space-x-4">
          <Button variant="ghost" size="sm" className="text-muted-foreground">
            <LayoutGrid className="h-4 w-4 mr-2" />
            Dashboard
          </Button>
          <Button variant="ghost" size="sm" className="text-muted-foreground">
            <Calendar className="h-4 w-4 mr-2" />
            Calendar
          </Button>
        </nav>
      </div>

      <div className="flex items-center space-x-2">
        {!searchOpen ? (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSearchOpen(true)}
          >
            <Search className="h-5 w-5" />
          </Button>
        ) : (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "200px", opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Input
              placeholder="Search..."
              className="w-full"
              autoFocus
              onBlur={() => setSearchOpen(false)}
            />
          </motion.div>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px]"
                >
                  {unreadCount}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel className="flex items-center justify-between">
              Notifications
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                className="h-auto text-xs px-2"
              >
                Mark all as read
              </Button>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className="flex flex-col items-start p-4 cursor-pointer"
              >
                <div className="flex justify-between w-full">
                  <span
                    className={`text-sm ${
                      !notification.read ? "font-medium" : ""
                    }`}
                  >
                    {notification.title}
                  </span>
                  {!notification.read && (
                    <Badge className="ml-2 bg-primary/20 text-primary border-primary/10 h-auto text-[10px]">
                      New
                    </Badge>
                  )}
                </div>
                <span className="text-xs text-muted-foreground mt-1">
                  {notification.time}
                </span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <div className="flex items-center p-2">
              <Avatar className="h-8 w-8 mr-2">
                <AvatarImage src="/avatars/01.png" alt="Avatar" />
                <AvatarFallback>RD</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">Rebecca Lewis</p>
                <p className="text-xs text-muted-foreground">
                  rebecca@example.com
                </p>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Inbox className="mr-2 h-4 w-4" />
              <span>Inbox</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button size="sm" onClick={() => setTaskDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-1" />
          New Task
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          aria-label="Toggle Menu"
        >
          <Menu className="h-6 w-6" />
        </Button>
      </div>

      <TaskDialog
        open={taskDialogOpen}
        onOpenChange={setTaskDialogOpen}
        onSubmit={handleCreateTask}
      />
    </header>
  )
} 