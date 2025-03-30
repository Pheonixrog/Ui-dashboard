'use client'

import React from "react"
import { Input } from "@/components/ui/input"
import { Search, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Priority, Status, Task, User } from "@/types"
import { motion } from "framer-motion"
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
  searchQuery: string
  onSearchChange: (query: string) => void
  onClearSearch: () => void
  placeholder?: string
  activeFilters?: { id: string; label: string }[]
  onRemoveFilter?: (id: string) => void
}

export default function TaskSearch({
  filters,
  onFiltersChange,
  onClearFilters,
  users,
  searchQuery,
  onSearchChange,
  onClearSearch,
  placeholder = "Search tasks...",
  activeFilters = [],
  onRemoveFilter,
}: TaskSearchProps) {
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
    <div className="w-full space-y-2">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder={placeholder}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-8 pr-10 border-border/50 bg-background/50 focus-visible:bg-background"
        />
        {searchQuery && (
          <Button
            variant="ghost"
            className="absolute right-0 top-0 h-9 w-9 p-0"
            onClick={onClearSearch}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Clear search</span>
          </Button>
        )}
      </div>
      
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {activeFilters.map((filter) => (
            <Badge
              key={filter.id}
              variant="secondary"
              className={cn(
                "py-1 px-2 text-xs",
                onRemoveFilter && "pr-1"
              )}
            >
              {filter.label}
              {onRemoveFilter && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 ml-1 hover:bg-secondary-foreground/10 rounded-full"
                  onClick={() => onRemoveFilter(filter.id)}
                >
                  <X className="h-2.5 w-2.5" />
                  <span className="sr-only">Remove {filter.label} filter</span>
                </Button>
              )}
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
} 