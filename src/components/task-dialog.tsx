'use client'

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Priority, Status, Task, User } from "@/types"
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { X, Loader2, Calendar as CalendarIcon } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Textarea } from "./ui/textarea"
import { users } from "@/data/sample-data"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { Badge } from "./ui/badge"
import { motion, AnimatePresence } from "framer-motion"
import { Calendar } from "@/components/ui/calendar"

const taskSchema = z.object({
  title: z
    .string()
    .min(3, { message: "Title must be at least 3 characters" })
    .max(50, { message: "Title must be less than 50 characters" }),
  description: z
    .string()
    .min(5, { message: "Description must be at least 5 characters" })
    .max(500, { message: "Description must be less than 500 characters" }),
  status: z.enum(["backlog", "todo", "in-progress", "review", "done"] as const),
  priority: z.enum(["low", "medium", "high", "urgent"] as const),
  assigneeId: z.string().min(1, { message: "Please select an assignee" }),
  dueDate: z.date(),
  tags: z.array(z.string()).default([]),
})

type TaskFormValues = z.infer<typeof taskSchema>

interface TaskDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (values: TaskFormValues) => void
  initialData?: Task | null
  isSubmitting?: boolean
}

export default function TaskDialog({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  isSubmitting = false,
}: TaskDialogProps) {
  const [tagInput, setTagInput] = useState("")

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: initialData
      ? {
          title: initialData.title,
          description: initialData.description,
          status: initialData.status,
          priority: initialData.priority,
          assigneeId: initialData.assignee.id,
          dueDate: new Date(initialData.dueDate),
          tags: initialData.tags,
        }
      : {
          title: "",
          description: "",
          status: "todo",
          priority: "medium",
          assigneeId: "",
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // One week from now
          tags: [],
        },
  })

  function addTag(tag: string) {
    if (!tag.trim()) return
    
    const currentTags = form.getValues("tags")
    if (!currentTags.includes(tag)) {
      form.setValue("tags", [...currentTags, tag])
    }
    setTagInput("")
  }

  function removeTag(tag: string) {
    const currentTags = form.getValues("tags")
    form.setValue(
      "tags",
      currentTags.filter((t) => t !== tag)
    )
  }

  const priorities: { value: Priority; label: string; color: string }[] = [
    { value: "low", label: "Low", color: "bg-emerald-500 text-white" },
    { value: "medium", label: "Medium", color: "bg-blue-500 text-white" },
    { value: "high", label: "High", color: "bg-amber-500 text-white" },
    { value: "urgent", label: "Urgent", color: "bg-rose-500 text-white" },
  ]

  const statuses: { value: Status; label: string; color: string }[] = [
    { value: "backlog", label: "Backlog", color: "bg-slate-500 text-white" },
    { value: "todo", label: "To Do", color: "bg-violet-500 text-white" },
    { value: "in-progress", label: "In Progress", color: "bg-orange-500 text-white" },
    { value: "review", label: "Review", color: "bg-purple-500 text-white" },
    { value: "done", label: "Done", color: "bg-emerald-500 text-white" },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-primary/80 via-primary to-primary/80 bg-clip-text text-transparent">
            {initialData ? "Edit Task" : "Create New Task"}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground/80">
            {initialData
              ? "Update the details of your task below."
              : "Fill out the form below to create a new task."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Title</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter task title" 
                      className="border-2 focus-visible:ring-offset-0 focus-visible:ring-primary/20 focus-visible:border-primary" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter task description" 
                      className="min-h-[120px] border-2 focus-visible:ring-offset-0 focus-visible:ring-primary/20 focus-visible:border-primary resize-none" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Status</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="border-2 focus:ring-offset-0 focus:ring-primary/20 focus:border-primary">
                          <SelectValue placeholder="Select a status" />
                        </SelectTrigger>
                        <SelectContent>
                          {statuses.map((status) => (
                            <SelectItem
                              key={status.value}
                              value={status.value}
                              className="focus:bg-primary/5"
                            >
                              <div className="flex items-center gap-2">
                                <div className={`h-2 w-2 rounded-full ${status.color}`} />
                                {status.label}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Priority</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="border-2 focus:ring-offset-0 focus:ring-primary/20 focus:border-primary">
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          {priorities.map((priority) => (
                            <SelectItem
                              key={priority.value}
                              value={priority.value}
                              className="focus:bg-primary/5"
                            >
                              <div className="flex items-center gap-2">
                                <div className={`h-2 w-2 rounded-full ${priority.color}`} />
                                {priority.label}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="assigneeId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Assignee</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="border-2 focus:ring-offset-0 focus:ring-primary/20 focus:border-primary">
                          <SelectValue placeholder="Select assignee" />
                        </SelectTrigger>
                        <SelectContent>
                          {users.map((user) => (
                            <SelectItem
                              key={user.id}
                              value={user.id}
                              className="focus:bg-primary/5"
                            >
                              <div className="flex items-center gap-2">
                                <Avatar className="h-6 w-6">
                                  <AvatarImage src={user.avatar} />
                                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                {user.name}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Due Date</FormLabel>
                    <FormControl>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal border-2 focus:ring-offset-0 focus:ring-primary/20 focus:border-primary",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                            className="rounded-md border"
                          />
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4">
              <FormLabel className="text-sm font-medium">Tags</FormLabel>
              <div className="flex flex-wrap gap-2">
                {form.watch("tags").map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="px-2 py-1 text-sm bg-secondary/30 hover:bg-secondary/50 transition-colors group"
                  >
                    {tag}
                    <X
                      className="h-3 w-3 ml-1 cursor-pointer opacity-50 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeTag(tag)}
                    />
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Add a tag"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === ",") {
                      e.preventDefault()
                      addTag(tagInput)
                    }
                  }}
                  className="border-2 focus-visible:ring-offset-0 focus-visible:ring-primary/20 focus-visible:border-primary"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => addTag(tagInput)}
                  disabled={!tagInput}
                  className="shrink-0"
                >
                  Add
                </Button>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="submit"
                disabled={isSubmitting}
                className={cn(
                  "w-full sm:w-auto transition-all",
                  isSubmitting && "opacity-80"
                )}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {initialData ? "Updating..." : "Creating..."}
                  </>
                ) : (
                  <>{initialData ? "Update Task" : "Create Task"}</>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
} 