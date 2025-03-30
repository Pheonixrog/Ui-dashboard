'use client'

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Priority, Status, Task, User } from "@/types"
import { motion } from "framer-motion"
import { Search, X, SlidersHorizontal, Check } from "lucide-react"
import { useState } from "react"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export interface TaskFilters {
  search: string
  status: Status | null
  priority: Priority | null
  assignee: string | null
}

interface TaskSearchProps {
  filters: TaskFilters
  onFiltersChange: (filters: TaskFilters) => void
  onClearFilters: () => void
  tasks: Task[]
  users: User[]
}

export default function TaskSearch({
  filters,
  onFiltersChange,
  onClearFilters,
  tasks,
  users,
}: TaskSearchProps) {
  const [showFilters, setShowFilters] = useState(false)

  const statusOptions: { value: Status | 'all'; label: string }[] = [
    { value: 'all', label: "All Statuses" },
    { value: "backlog", label: "Backlog" },
    { value: "todo", label: "To Do" },
    { value: "in-progress", label: "In Progress" },
    { value: "review", label: "Review" },
    { value: "done", label: "Done" },
  ]

  const priorityOptions: { value: Priority | 'all'; label: string; color: string }[] = [
    { value: 'all', label: "All Priorities", color: "bg-slate-400" },
    { value: "low", label: "Low", color: "bg-emerald-500" },
    { value: "medium", label: "Medium", color: "bg-blue-500" },
    { value: "high", label: "High", color: "bg-amber-500" },
    { value: "urgent", label: "Urgent", color: "bg-rose-500" },
  ]

  const hasActiveFilters = 
    Boolean(filters.status) || 
    Boolean(filters.priority) || 
    Boolean(filters.assignee) || 
    Boolean(filters.search)

  const handleStatusChange = (status: Status | 'all') => {
    onFiltersChange({
      ...filters,
      status: status === 'all' ? null : status,
    })
  }

  const handlePriorityChange = (priority: Priority | 'all') => {
    onFiltersChange({
      ...filters,
      priority: priority === 'all' ? null : priority,
    })
  }

  const handleAssigneeChange = (assigneeId: string | 'all') => {
    onFiltersChange({
      ...filters,
      assignee: assigneeId === 'all' ? null : assigneeId,
    })
  }
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({
      ...filters,
      search: e.target.value,
    })
  }

  return (
    <div>
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search tasks..."
            className="pl-8 bg-background border-2 focus-visible:ring-0 focus-visible:border-primary"
            value={filters.search}
            onChange={handleSearchChange}
          />
          {filters.search && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-0.5 top-0.5 h-8 w-8 text-muted-foreground hover:text-foreground"
              onClick={() => onFiltersChange({ ...filters, search: "" })}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className={`border-2 ${hasActiveFilters ? 'border-primary text-primary' : ''}`}
            >
              <SlidersHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Filter Tasks</DropdownMenuLabel>
            <DropdownMenuSeparator />
            
            <DropdownMenuLabel className="font-normal text-xs text-muted-foreground pt-2">
              Status
            </DropdownMenuLabel>
            {statusOptions.map((status) => (
              <DropdownMenuCheckboxItem
                key={status.value}
                checked={
                  status.value === 'all' 
                    ? !filters.status 
                    : filters.status === status.value
                }
                onCheckedChange={() => handleStatusChange(status.value)}
              >
                {status.label}
              </DropdownMenuCheckboxItem>
            ))}
            
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="font-normal text-xs text-muted-foreground pt-2">
              Priority
            </DropdownMenuLabel>
            {priorityOptions.map((priority) => (
              <DropdownMenuCheckboxItem
                key={priority.value}
                checked={
                  priority.value === 'all' 
                    ? !filters.priority 
                    : filters.priority === priority.value
                }
                onCheckedChange={() => handlePriorityChange(priority.value)}
              >
                <div className="flex items-center">
                  <div className={`w-2 h-2 rounded-full ${priority.color} mr-2`}></div>
                  {priority.label}
                </div>
              </DropdownMenuCheckboxItem>
            ))}
            
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="font-normal text-xs text-muted-foreground pt-2">
              Assignee
            </DropdownMenuLabel>
            <DropdownMenuCheckboxItem
              checked={!filters.assignee}
              onCheckedChange={() => handleAssigneeChange('all')}
            >
              All Assignees
            </DropdownMenuCheckboxItem>
            {users.map((user) => (
              <DropdownMenuCheckboxItem
                key={user.id}
                checked={filters.assignee === user.id}
                onCheckedChange={() => handleAssigneeChange(user.id)}
              >
                {user.name}
              </DropdownMenuCheckboxItem>
            ))}
            
            <DropdownMenuSeparator />
            <div className="p-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full text-xs"
                onClick={onClearFilters}
                disabled={!hasActiveFilters}
              >
                Clear Filters
              </Button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      {hasActiveFilters && (
        <motion.div 
          className="flex flex-wrap gap-2 mt-3"
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          {filters.status && (
            <Badge variant="secondary" className="px-2 py-0.5 gap-1">
              {statusOptions.find(s => s.value === filters.status)?.label}
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 p-0 ml-1 text-muted-foreground hover:text-foreground"
                onClick={() => handleStatusChange('all')}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          
          {filters.priority && (
            <Badge variant="secondary" className="px-2 py-0.5 gap-1">
              {priorityOptions.find(p => p.value === filters.priority)?.label}
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 p-0 ml-1 text-muted-foreground hover:text-foreground"
                onClick={() => handlePriorityChange('all')}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          
          {filters.assignee && (
            <Badge variant="secondary" className="px-2 py-0.5 gap-1">
              {users.find(u => u.id === filters.assignee)?.name || 'Unknown'}
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 p-0 ml-1 text-muted-foreground hover:text-foreground"
                onClick={() => handleAssigneeChange('all')}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          
          {filters.search && (
            <Badge variant="secondary" className="px-2 py-0.5 gap-1">
              "{filters.search}"
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 p-0 ml-1 text-muted-foreground hover:text-foreground"
                onClick={() => onFiltersChange({...filters, search: ""})}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
        </motion.div>
      )}
    </div>
  )
} 