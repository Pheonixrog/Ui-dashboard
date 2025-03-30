'use client'

import { CalendarDays, Clock, ExternalLink, User, CheckCircle2, BarChart3, CircleAlert } from "lucide-react"
import { format } from "date-fns"
import { Task } from "@/types"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { userOptions } from "@/app/(dashboard)/tasks/data"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface TaskDrawerProps {
  task: Task | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onStatusChange: (taskId: string, status: string) => void
  onComplete: (taskId: string) => void
}

export default function TaskDrawer({
  task,
  open,
  onOpenChange,
  onStatusChange,
  onComplete,
}: TaskDrawerProps) {
  if (!task) return null

  const handleComplete = () => {
    onComplete(task.id)
    onOpenChange(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "todo":
        return "bg-slate-500"
      case "in-progress":
        return "bg-amber-500"
      case "review":
        return "bg-purple-500"
      case "done":
        return "bg-emerald-500"
      default:
        return "bg-slate-500"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "low":
        return "bg-emerald-500"
      case "medium":
        return "bg-blue-500"
      case "high":
        return "bg-amber-500"
      default:
        return "bg-emerald-500"
    }
  }

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case "low":
        return "Low"
      case "medium":
        return "Medium"
      case "high":
        return "High"
      default:
        return "Unknown"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "todo":
        return "To Do"
      case "in-progress":
        return "In Progress"
      case "review":
        return "In Review"
      case "done":
        return "Completed"
      default:
        return "Unknown"
    }
  }

  const isOverdue = () => {
    const dueDate = new Date(task.dueDate)
    const today = new Date()
    return task.status !== "done" && dueDate < today
  }

  const getDaysRemaining = () => {
    const today = new Date()
    const dueDate = new Date(task.dueDate)
    const diffTime = dueDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return "Due today"
    if (diffDays < 0) return `Overdue by ${Math.abs(diffDays)} days`
    if (diffDays === 1) return "Due tomorrow"
    return `Due in ${diffDays} days`
  }

  const getAssigneeName = (assigneeId: string) => {
    const user = userOptions.find(user => user.value === assigneeId)
    return user ? user.label : "Unassigned"
  }

  const getAssigneeFallback = (assigneeId: string) => {
    const name = getAssigneeName(assigneeId)
    return name.split(' ').map(part => part[0]).join('')
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-2xl font-bold">{task.title}</SheetTitle>
          <div className="flex items-center mt-2 space-x-2">
            <div
              className={`h-3 w-3 rounded-full ${getStatusColor(task.status)}`}
            ></div>
            <span className="text-sm font-medium">
              {getStatusLabel(task.status)}
            </span>
            <Separator orientation="vertical" className="h-4" />
            <div
              className={`h-3 w-3 rounded-full ${getPriorityColor(
                task.priority
              )}`}
            ></div>
            <span className="text-sm font-medium">
              {getPriorityLabel(task.priority)}
            </span>
          </div>
        </SheetHeader>

        <div className="mt-6">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">
            Description
          </h3>
          <p className="text-sm">{task.description || "No description provided."}</p>
        </div>

        <div className="mt-6 space-y-4">
          <div className="flex items-center">
            <User className="h-5 w-5 mr-2 text-muted-foreground" />
            <div className="flex items-center gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-1 cursor-pointer">
                      <Badge className={cn(
                        "rounded-full h-2 w-2 p-0",
                        task.status === 'done' ? "bg-emerald-500" : "bg-slate-300"
                      )} />
                      <Avatar className="h-7 w-7 ring-2 ring-background">
                        <AvatarImage src="/avatars/01.png" alt={getAssigneeName(task.assigneeId)} />
                        <AvatarFallback>{getAssigneeFallback(task.assigneeId)}</AvatarFallback>
                      </Avatar>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Assigned to {getAssigneeName(task.assigneeId)}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          <div className="flex items-center">
            <CalendarDays className="h-5 w-5 mr-2 text-muted-foreground" />
            <div className="flex items-center">
              <span className="text-sm">
                {format(new Date(task.dueDate), "MMM d, yyyy")}
              </span>
              <Badge
                variant={isOverdue() ? "destructive" : "outline"}
                className="ml-2 text-xs"
              >
                {getDaysRemaining()}
              </Badge>
            </div>
          </div>

          <div className="flex items-center">
            <Clock className="h-5 w-5 mr-2 text-muted-foreground" />
            <div className="flex items-center">
              <span className="text-sm">
                Created {format(new Date(task.createdAt), "MMM d, yyyy")}
              </span>
              {task.updatedAt && (
                <span className="text-sm text-muted-foreground ml-2">
                  (Updated {format(new Date(task.updatedAt), "MMM d")})
                </span>
              )}
            </div>
          </div>
        </div>

        {task.tags && task.tags.length > 0 && (
          <div className="mt-6">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">
              Tags
            </h3>
            <div className="flex flex-wrap gap-2">
              {task.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">
            Actions
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {task.status !== "done" && (
              <Button onClick={handleComplete} className="w-full" size="sm">
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Mark Complete
              </Button>
            )}
            <Button
              variant="outline"
              className="w-full"
              size="sm"
              asChild
            >
              <a href="#" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" />
                Open Details
              </a>
            </Button>
          </div>
        </div>

        {task.status !== "done" && (
          <div className="mt-6">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">
              Change Status
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {task.status !== "todo" && (
                <Button
                  variant="outline"
                  size="sm"
                  className={cn(
                    "border-slate-500/30 hover:border-slate-500/70",
                    task.status === "todo" && "bg-slate-500/10"
                  )}
                  onClick={() => onStatusChange(task.id, "todo")}
                >
                  <div className="h-2 w-2 rounded-full bg-slate-500 mr-2"></div>
                  To Do
                </Button>
              )}
              {task.status !== "in-progress" && (
                <Button
                  variant="outline"
                  size="sm"
                  className={cn(
                    "border-amber-500/30 hover:border-amber-500/70",
                    task.status === "in-progress" && "bg-amber-500/10"
                  )}
                  onClick={() => onStatusChange(task.id, "in-progress")}
                >
                  <div className="h-2 w-2 rounded-full bg-amber-500 mr-2"></div>
                  In Progress
                </Button>
              )}
              {task.status !== "review" && (
                <Button
                  variant="outline"
                  size="sm"
                  className={cn(
                    "border-purple-500/30 hover:border-purple-500/70",
                    task.status === "review" && "bg-purple-500/10"
                  )}
                  onClick={() => onStatusChange(task.id, "review")}
                >
                  <div className="h-2 w-2 rounded-full bg-purple-500 mr-2"></div>
                  In Review
                </Button>
              )}
              {task.status !== "done" && (
                <Button
                  variant="outline"
                  size="sm"
                  className={cn(
                    "border-emerald-500/30 hover:border-emerald-500/70",
                    task.status === "done" && "bg-emerald-500/10"
                  )}
                  onClick={() => onStatusChange(task.id, "done")}
                >
                  <div className="h-2 w-2 rounded-full bg-emerald-500 mr-2"></div>
                  Completed
                </Button>
              )}
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
} 