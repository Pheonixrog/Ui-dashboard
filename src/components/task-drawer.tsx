'use client'

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Task } from "@/types"
import { format } from "date-fns"
import { 
  Calendar,
  Clock,
  Edit,
  Trash,
  CheckCheck,
  AlertTriangle,
  ArrowRightCircle,
  MessageSquare,
  Tag,
} from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface TaskDrawerProps {
  task: Task | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onEdit: (task: Task) => void
  onDelete: (taskId: string) => void
  onMarkComplete: (taskId: string) => void
}

export default function TaskDrawer({
  task,
  open,
  onOpenChange,
  onEdit,
  onDelete,
  onMarkComplete,
}: TaskDrawerProps) {
  if (!task) return null
  
  const isOverdue = new Date(task.dueDate) < new Date()
  const isDone = task.status === "done"

  const priorityColors = {
    low: 'bg-emerald-500 text-white',
    medium: 'bg-blue-500 text-white',
    high: 'bg-amber-500 text-white',
    urgent: 'bg-rose-500 text-white',
  }
  
  const statusColors = {
    backlog: 'bg-slate-500 text-white',
    todo: 'bg-violet-500 text-white',
    'in-progress': 'bg-orange-500 text-white',
    review: 'bg-purple-500 text-white',
    done: 'bg-emerald-500 text-white',
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md overflow-y-auto">
        <SheetHeader className="pb-4 border-b space-y-4">
          <SheetTitle className="text-xl font-bold leading-tight">{task.title}</SheetTitle>
          <SheetDescription className="flex flex-wrap gap-2">
            <Badge className={cn(statusColors[task.status], "shadow-sm")}>
              {task.status === 'in-progress' ? 'In Progress' : 
               task.status === 'todo' ? 'To Do' : 
               task.status.charAt(0).toUpperCase() + task.status.slice(1)}
            </Badge>
            <Badge className={cn(priorityColors[task.priority], "shadow-sm")}>
              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
            </Badge>
          </SheetDescription>
        </SheetHeader>
        
        <div className="space-y-6 py-6">
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">Description</h3>
            <p className="text-sm leading-relaxed">{task.description}</p>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-3 rounded-lg bg-secondary/20 hover:bg-secondary/30 transition-colors">
              <div className="bg-background p-2 rounded-full shadow-sm">
                <Calendar className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h3 className="text-sm font-medium">Due Date</h3>
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  {format(new Date(task.dueDate), "PPP")}
                  {isOverdue && !isDone && (
                    <Badge variant="destructive" className="shadow-sm">
                      Overdue
                    </Badge>
                  )}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 p-3 rounded-lg bg-secondary/20 hover:bg-secondary/30 transition-colors">
              <div className="bg-background p-2 rounded-full shadow-sm">
                <Clock className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h3 className="text-sm font-medium">Created</h3>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(task.createdAt), "PPP")}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 p-3 rounded-lg bg-secondary/20 hover:bg-secondary/30 transition-colors">
              <Avatar className="h-10 w-10 border-2 border-background shadow-sm">
                <AvatarImage src={task.assignee.avatar} alt={task.assignee.name} />
                <AvatarFallback>{task.assignee.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-sm font-medium">Assignee</h3>
                <p className="text-sm text-muted-foreground">{task.assignee.name}</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-medium">Tags</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {task.tags.map((tag) => (
                <Badge 
                  key={tag} 
                  variant="secondary" 
                  className="bg-secondary/30 hover:bg-secondary/50 transition-colors shadow-sm"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
        
        <SheetFooter className="absolute bottom-0 left-0 right-0 p-6 border-t bg-background">
          <div className="flex w-full justify-between items-center">
            <Button 
              variant="destructive" 
              size="sm" 
              onClick={() => {
                onDelete(task.id)
                onOpenChange(false)
              }}
            >
              <Trash className="h-4 w-4 mr-2" />
              Delete
            </Button>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => {
                  onEdit(task)
                  onOpenChange(false)
                }}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              
              {!isDone ? (
                <Button 
                  className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
                  size="sm"
                  onClick={() => {
                    onMarkComplete(task.id)
                    onOpenChange(false)
                  }}
                >
                  <CheckCheck className="h-4 w-4 mr-2" />
                  Mark Complete
                </Button>
              ) : (
                <Button 
                  className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                  size="sm"
                  onClick={() => {
                    onMarkComplete(task.id)
                    onOpenChange(false)
                  }}
                >
                  <ArrowRightCircle className="h-4 w-4 mr-2" />
                  Move to In Progress
                </Button>
              )}
            </div>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
} 