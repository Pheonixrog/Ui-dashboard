'use client'

import { useState, useEffect } from 'react'
import { DndProvider, useDrag, useDrop } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Task, Status, Priority } from '@/types'
import { users } from '@/data/sample-data'
import { format } from 'date-fns'
import { 
  CheckCircle2, 
  Clock, 
  Calendar, 
  AlertTriangle, 
  Plus,
  Search,
  Edit,
  Trash,
  Eye,
  Filter,
  ListFilter,
  ArrowDownCircle,
  ArrowRightCircle,
  ArrowUpCircle,
  AlertOctagon,
  MessageSquare,
  MoreHorizontal,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import TaskDialog from './task-dialog'
import { Button } from './ui/button'
import TaskDrawer from './task-drawer'
import { useToast } from '@/hooks/use-toast'
import ConfirmDialog from './confirm-dialog'
import TaskSearch, { TaskFilters } from './task-search'
import { cn } from '@/lib/utils'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

interface TaskCardProps {
  task: Task
  onDrag: (id: string, status: Status) => void
  onView: (task: Task) => void
  onEdit: (task: Task) => void
  onDelete: (taskId: string) => void
}

function TaskCard({ task, onDrag, onView, onEdit, onDelete }: TaskCardProps) {
  const { toast } = useToast()
  
  const [{ isDragging }, dragRef] = useDrag({
    type: 'TASK',
    item: { id: task.id, status: task.status },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  const priorityColors = {
    low: {
      bg: 'bg-emerald-400/20',
      text: 'text-emerald-500',
      border: 'border-emerald-500/30',
      icon: <ArrowDownCircle className="h-3.5 w-3.5" />
    },
    medium: {
      bg: 'bg-blue-400/20',
      text: 'text-blue-500',
      border: 'border-blue-500/30',
      icon: <ArrowRightCircle className="h-3.5 w-3.5" />
    },
    high: {
      bg: 'bg-amber-400/20',
      text: 'text-amber-500',
      border: 'border-amber-500/30',
      icon: <ArrowUpCircle className="h-3.5 w-3.5" />
    },
    urgent: {
      bg: 'bg-rose-400/20',
      text: 'text-rose-500',
      border: 'border-rose-500/30',
      icon: <AlertOctagon className="h-3.5 w-3.5" />
    },
  }

  const statusColors = {
    backlog: 'bg-slate-200 text-slate-700',
    todo: 'bg-purple-200 text-purple-700', 
    'in-progress': 'bg-amber-200 text-amber-700',
    review: 'bg-blue-200 text-blue-700',
    done: 'bg-emerald-200 text-emerald-700',
  }

  const isOverdue = new Date(task.dueDate) < new Date()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "group w-full cursor-grab task-card-hover",
        isDragging && "rotate-2 scale-95 cursor-grabbing"
      )}
      ref={dragRef}
    >
      <Card className={cn(
        "backdrop-blur-sm transition-all duration-200 shadow-md border-2 smooth-border bg-card",
        isDragging 
          ? "opacity-60 border-primary/30 bg-primary/5 rotate-2" 
          : "border-border hover:border-primary/20"
      )}>
        <CardHeader className="p-3 pb-2">
          <div className="flex items-start justify-between gap-2">
            <div 
              className="flex-1 cursor-pointer group-hover:text-primary transition-colors"
              onClick={() => onView(task)}
            >
              <h3 className="font-semibold text-base line-clamp-2">
                {task.title}
              </h3>
            </div>
            
            <Badge className={cn(
              "shrink-0 transition-colors rounded-full px-2 py-0.5 text-xs border",
              statusColors[task.status]
            )}>
              {task.status === 'in-progress' ? 'in progress' : task.status}
            </Badge>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-7 w-7 cursor-pointer hover:bg-accent transition-colors rounded-full">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onView(task)} className="cursor-pointer">
                  <Eye className="h-4 w-4 mr-2" />
                  View
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEdit(task)} className="cursor-pointer">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDelete(task.id)} className="text-destructive cursor-pointer">
                  <Trash className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>

        <CardContent className="px-3 pb-3 space-y-3">
          <p className="text-sm text-muted-foreground line-clamp-2">
            {task.description}
          </p>

          <div className="flex flex-wrap gap-1.5">
            <Badge className={cn(
              "shrink-0 transition-all duration-200 flex items-center gap-1 cursor-default",
              priorityColors[task.priority].bg,
              priorityColors[task.priority].text,
              priorityColors[task.priority].border,
            )}>
              {priorityColors[task.priority].icon}
              <span>{task.priority}</span>
            </Badge>
            
            {task.tags.length > 0 && task.tags.slice(0, 2).map((tag) => (
              <Badge 
                key={tag} 
                variant="secondary" 
                className="cursor-default"
              >
                {tag}
              </Badge>
            ))}
            
            {task.tags.length > 2 && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge variant="outline" className="hover:bg-secondary/50 cursor-pointer">
                      +{task.tags.length - 2}
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    {task.tags.slice(2).join(', ')}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>

          <div className="flex items-center justify-between pt-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-1.5 text-sm cursor-pointer">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className={cn(
                      "font-medium",
                      isOverdue && task.status !== 'done' ? "text-destructive" : "text-muted-foreground"
                    )}>
                      {format(new Date(task.dueDate), 'MMM d')}
                    </span>
                    {isOverdue && task.status !== 'done' && (
                      <Badge variant="destructive" className="h-5 px-1">
                        <Clock className="h-3 w-3" />
                      </Badge>
                    )}
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Due: {format(new Date(task.dueDate), 'MMMM d, yyyy')}</p>
                  {isOverdue && task.status !== 'done' && <p>Task is overdue</p>}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-1 cursor-pointer">
                    <Badge className={cn(
                      "rounded-full h-2 w-2 p-0",
                      task.status === 'done' ? "bg-emerald-500" : "bg-slate-300"
                    )} />
                    <Avatar className="h-7 w-7 ring-2 ring-background">
                      <AvatarImage src={task.assignee.avatar} alt={task.assignee.name} />
                      <AvatarFallback>{task.assignee.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Assigned to {task.assignee.name}</p>
                  <p className="text-xs text-muted-foreground">{task.assignee.email}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

function Column({ 
  status, 
  tasks, 
  onDrop,
  onAddTask,
  onViewTask,
  onEditTask,
  onDeleteTask
}: { 
  status: Status; 
  tasks: Task[]; 
  onDrop: (id: string, status: Status) => void;
  onAddTask: (status: Status) => void;
  onViewTask: (task: Task) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
}) {
  const [{ isOver }, dropRef] = useDrop({
    accept: 'TASK',
    drop: (item: { id: string; status: Status }) => {
      if (item.status !== status) {
        onDrop(item.id, status);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  // Status display configurations
  const statusConfig = {
    backlog: {
      icon: <Clock className="h-5 w-5" />,
      color: 'from-blue-500/20 to-blue-500/5',
      bgColor: 'bg-card/80',
      textColor: 'text-blue-600 dark:text-blue-400',
      borderColor: 'border-border'
    },
    todo: {
      icon: <ListFilter className="h-5 w-5" />,
      color: 'from-purple-500/20 to-purple-500/5',
      bgColor: 'bg-card/80',
      textColor: 'text-purple-600 dark:text-purple-400',
      borderColor: 'border-border'
    },
    'in-progress': {
      icon: <ArrowRightCircle className="h-5 w-5" />,
      color: 'from-amber-500/20 to-amber-500/5',
      bgColor: 'bg-card/80',
      textColor: 'text-amber-600 dark:text-amber-400',
      borderColor: 'border-border'
    },
    review: {
      icon: <Eye className="h-5 w-5" />,
      color: 'from-indigo-500/20 to-indigo-500/5',
      bgColor: 'bg-card/80',
      textColor: 'text-indigo-600 dark:text-indigo-400',
      borderColor: 'border-border'
    },
    done: {
      icon: <CheckCircle2 className="h-5 w-5" />,
      color: 'from-emerald-500/20 to-emerald-500/5',
      bgColor: 'bg-card/80',
      textColor: 'text-emerald-600 dark:text-emerald-400',
      borderColor: 'border-border'
    },
  };

  const config = statusConfig[status];

  const formattedStatus = {
    backlog: 'Backlog',
    todo: 'To Do',
    'in-progress': 'In Progress',
    review: 'Review',
    done: 'Done',
  };

  return (
    <div 
      ref={dropRef} 
      className={cn(
        "w-full flex flex-col rounded-lg transition-all duration-150 shadow-md border",
        config.bgColor,
        config.borderColor,
        isOver && "ring-2 ring-primary/40 border-primary/10 bg-primary/5"
      )}
    >
      <div className={cn(
        "rounded-t-lg p-3 flex items-center justify-between sticky top-0 z-10",
        `bg-gradient-to-r ${config.color}`,
        `border-b ${config.borderColor}`,
        config.bgColor
      )}>
        <div className="flex items-center gap-2">
          <div className={cn("p-1.5 rounded-full", config.textColor, "bg-background/60")}>
            {config.icon}
          </div>
          <div>
            <h3 className={cn("font-semibold", config.textColor)}>
              {formattedStatus[status]}
            </h3>
            <p className="text-sm text-muted-foreground">
              {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
            </p>
          </div>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className={cn(
                  "h-8 w-8 rounded-full cursor-pointer hover:scale-105 transition-all duration-150",
                  "hover:bg-background hover:shadow-sm", 
                  config.textColor
                )}
                onClick={() => onAddTask(status)}
              >
                <Plus className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Add new {status} task</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className={cn(
        "p-3 overflow-x-auto hide-scrollbar",
        isOver && "bg-primary/5"
      )}>
        {tasks.length === 0 ? (
          <div className="text-center text-sm text-muted-foreground py-8 italic border-2 border-dashed rounded-lg border-border w-full">
            <p>Drop tasks here</p>
          </div>
        ) : (
          <div className="flex space-x-3 pb-2 min-w-fit">
            <AnimatePresence>
              {tasks.map((task) => (
                <motion.div 
                  key={task.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  className="min-w-[280px] max-w-[280px]"
                >
                  <TaskCard 
                    task={task} 
                    onDrag={onDrop} 
                    onView={onViewTask}
                    onEdit={onEditTask}
                    onDelete={onDeleteTask}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}

export default function TaskBoard({ tasks: propTasks, onTasksChange }: { tasks: Task[], onTasksChange: (tasks: Task[]) => void }) {
  const [tasks, setTasks] = useState<Task[]>(propTasks)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null)
  const [selectedStatus, setSelectedStatus] = useState<Status | null>(null)
  const [filters, setFilters] = useState<TaskFilters>({
    status: null,
    priority: null,
    assignee: null,
    search: '',
  })
  const { toast } = useToast()

  useEffect(() => {
    if (propTasks !== tasks) {
      setTasks(propTasks)
    }
  }, [propTasks])

  useEffect(() => {
    if (onTasksChange) {
      onTasksChange(tasks)
    }
  }, [tasks, onTasksChange])

  const filteredTasks = tasks.filter((task) => {
    if (
      filters.status && 
      filters.status !== 'all' && 
      task.status !== filters.status
    ) return false
    
    if (
      filters.priority && 
      filters.priority !== 'all' && 
      task.priority !== filters.priority
    ) return false
    
    if (
      filters.assignee && 
      filters.assignee !== 'all' && 
      task.assignee.id !== filters.assignee
    ) return false
    
    if (
      filters.search && 
      !task.title.toLowerCase().includes(filters.search.toLowerCase()) &&
      !task.description.toLowerCase().includes(filters.search.toLowerCase())
    ) return false
    
    return true
  })

  const handleDrop = (id: string, newStatus: Status) => {
    setTasks(prev => {
      const updated = prev.map(task => {
        if (task.id === id) {
          return { ...task, status: newStatus }
        }
        return task
      })
      return updated
    })
    
    toast({
      title: "Task updated",
      description: "Task status has been updated successfully.",
      variant: "success",
    })
  }

  const handleAddTask = (status: Status) => {
    setSelectedTask(null)
    setSelectedStatus(status)
    setDialogOpen(true)
  }

  const handleEditTask = (task: Task) => {
    setSelectedTask(task)
    setIsEditing(true)
    setDialogOpen(true)
  }

  const handleViewTask = (task: Task) => {
    setSelectedTask(task)
    setDrawerOpen(true)
  }

  const handleDeleteTask = (taskId: string) => {
    setTaskToDelete(taskId)
    setConfirmDialogOpen(true)
  }

  const confirmDeleteTask = () => {
    if (taskToDelete) {
      setTasks(prev => prev.filter(task => task.id !== taskToDelete))
      
      toast({
        title: "Task deleted",
        description: "Task has been deleted successfully.",
        variant: "success",
      })
    }
  }

  const handleMarkComplete = (taskId: string) => {
    setTasks(prev => {
      return prev.map(task => {
        if (task.id === taskId) {
          const newStatus: Status = task.status === 'done' ? 'in-progress' : 'done'
          return { ...task, status: newStatus }
        }
        return task
      })
    })
    
    toast({
      title: "Task updated",
      description: `Task marked as ${tasks.find(t => t.id === taskId)?.status === 'done' ? 'in progress' : 'complete'}.`,
      variant: "success",
    })
  }

  const handleSubmitTask = async (data: any) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      if (selectedTask) {
        // Update existing task
        setTasks(prev => {
          return prev.map(task => {
            if (task.id === selectedTask.id) {
              return {
                ...task,
                title: data.title,
                description: data.description,
                status: data.status,
                priority: data.priority,
                assignee: users.find(user => user.id === data.assigneeId) || task.assignee,
                dueDate: data.dueDate.toISOString(),
                tags: data.tags,
              }
            }
            return task
          })
        })
        
        toast({
          title: "Task updated",
          description: "Task has been updated successfully.",
          variant: "success",
        })
      } else {
        // Create new task
        const newTask: Task = {
          id: `task${tasks.length + 1}`,
          title: data.title,
          description: data.description,
          status: selectedStatus,
          priority: data.priority,
          createdAt: new Date().toISOString(),
          dueDate: data.dueDate.toISOString(),
          assignee: users.find(user => user.id === data.assigneeId) || users[0],
          tags: data.tags,
        }
        
        setTasks(prev => [...prev, newTask])
        
        toast({
          title: "Task created",
          description: "New task has been created successfully.",
          variant: "success",
        })
      }
      
      setDialogOpen(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleClearFilters = () => {
    setFilters({
      status: null,
      priority: null,
      assignee: null,
      search: '',
    })
  }

  const getTasksByStatus = (status: Status) => {
    return filteredTasks.filter(task => task.status === status)
  }

  const hasFiltersApplied = 
    Boolean(filters.status) || 
    Boolean(filters.priority) || 
    Boolean(filters.assignee) || 
    Boolean(filters.search)

  return (
    <div className="w-full h-full flex flex-col bg-background/40 p-4 rounded-lg shadow-sm border border-border">
      <div className="w-full mb-4 bg-card backdrop-blur-sm p-4 rounded-lg border border-border shadow-sm">
        <TaskSearch 
          filters={filters} 
          onFiltersChange={setFilters} 
          tasks={tasks}
          users={users}
          onClearFilters={handleClearFilters}
        />
      </div>

      {hasFiltersApplied && (
        <div className="w-full mb-4 p-3 bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-900 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
              <p className="text-sm text-yellow-700 dark:text-yellow-400">
                Showing filtered results ({filteredTasks.length} of {tasks.length} tasks)
              </p>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="h-8 border-yellow-200 dark:border-yellow-900 hover:bg-yellow-100 dark:hover:bg-yellow-950 text-yellow-700 dark:text-yellow-400"
              onClick={handleClearFilters}
            >
              Clear Filters
            </Button>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-auto">
        <DndProvider backend={HTML5Backend}>
          <div className="flex flex-col gap-6 pb-6 px-1 overflow-y-auto h-full max-h-[calc(100vh-160px)] custom-scrollbar">
            <Column 
              status="backlog" 
              tasks={getTasksByStatus('backlog')} 
              onDrop={handleDrop}
              onAddTask={handleAddTask}
              onViewTask={handleViewTask}
              onEditTask={handleEditTask}
              onDeleteTask={handleDeleteTask}
            />
            <Column 
              status="todo" 
              tasks={getTasksByStatus('todo')} 
              onDrop={handleDrop}
              onAddTask={handleAddTask}
              onViewTask={handleViewTask}
              onEditTask={handleEditTask}
              onDeleteTask={handleDeleteTask}
            />
            <Column 
              status="in-progress" 
              tasks={getTasksByStatus('in-progress')} 
              onDrop={handleDrop}
              onAddTask={handleAddTask}
              onViewTask={handleViewTask}
              onEditTask={handleEditTask}
              onDeleteTask={handleDeleteTask}
            />
            <Column 
              status="review" 
              tasks={getTasksByStatus('review')} 
              onDrop={handleDrop}
              onAddTask={handleAddTask}
              onViewTask={handleViewTask}
              onEditTask={handleEditTask}
              onDeleteTask={handleDeleteTask}
            />
            <Column 
              status="done" 
              tasks={getTasksByStatus('done')} 
              onDrop={handleDrop}
              onAddTask={handleAddTask}
              onViewTask={handleViewTask}
              onEditTask={handleEditTask}
              onDeleteTask={handleDeleteTask}
            />
          </div>
        </DndProvider>
      </div>

      <TaskDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        defaultValues={selectedTask}
        isEditing={isEditing}
        onSubmit={handleSubmitTask}
        users={users}
      />

      <TaskDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        task={selectedTask}
        onEdit={handleEditTask}
        onDelete={handleDeleteTask}
        onMarkComplete={handleMarkComplete}
      />

      <ConfirmDialog
        open={confirmDialogOpen}
        onOpenChange={setConfirmDialogOpen}
        title="Delete Task"
        description="Are you sure you want to delete this task? This action cannot be undone."
        actionLabel="Delete"
        onAction={confirmDeleteTask}
      />
    </div>
  )
} 