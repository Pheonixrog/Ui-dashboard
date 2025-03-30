'use client'

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { activities as sampleActivities } from "@/data/sample-data"
import { format, formatDistanceToNow } from "date-fns"
import { motion, AnimatePresence } from "framer-motion"
import { Activity, Task } from "@/types"
import { useState, useEffect, useCallback } from "react"
import { BellRing, Check, RefreshCw, Plus, Edit, Trash, Clock } from "lucide-react"
import { Badge } from "./ui/badge"

interface ActivityFeedProps {
  tasks?: Task[]
}

export default function ActivityFeed({ tasks }: ActivityFeedProps) {
  const [activities, setActivities] = useState<Activity[]>([])

  const getUserName = (userId: string): string => {
    // This would typically come from a user service or API
    const userMap: Record<string, string> = {
      'user-01': 'Alex Johnson',
      'user-02': 'Samantha Lee',
      'user-03': 'David Chen',
      'user-04': 'Maria Rodriguez',
      'user-05': 'James Wilson',
      'user-06': 'Emily Davis',
      'user-07': 'Michael Brown',
      'user-08': 'Michelle Kim',
      'user-09': 'Robert Taylor',
      'user-10': 'Jessica Martinez',
      'user-11': 'Daniel Smith',
      'user-12': 'Sarah Clark',
      'user-13': 'Thomas Garcia',
      'user-14': 'Rebecca Lewis',
    };
    
    return userMap[userId] || 'Unknown User';
  }

  // Generate activities based on tasks when they change
  useEffect(() => {
    if (!tasks) return
    
    const activityMap: Record<string, Activity> = {}
    
    // First, convert existing sample activities to a map for easy access
    sampleActivities.forEach(activity => {
      activityMap[activity.id] = activity
    })
    
    // Then add synthetic activities based on task dates
    tasks.forEach(task => {
      // Activity for task creation
      const creationId = `create-${task.id}`
      activityMap[creationId] = {
        id: creationId,
        user: {
          id: task.assigneeId,
          name: getUserName(task.assigneeId),
          avatar: "/avatars/01.png",
          email: `${task.assigneeId}@example.com`,
        },
        action: "created task",
        target: task.title,
        timestamp: task.createdAt,
      }
      
      // Activity for tasks with review status
      if (task.status === 'review') {
        const reviewId = `review-${task.id}`
        activityMap[reviewId] = {
          id: reviewId,
          user: {
            id: task.assigneeId,
            name: getUserName(task.assigneeId),
            avatar: "/avatars/01.png",
            email: `${task.assigneeId}@example.com`,
          },
          action: "submitted for review",
          target: task.title,
          timestamp: new Date(new Date(task.createdAt).getTime() + 86400000).toISOString(), // 1 day after creation
        }
      }
      
      // Activity for completed tasks
      if (task.status === 'done') {
        const completionId = `complete-${task.id}`
        activityMap[completionId] = {
          id: completionId,
          user: {
            id: task.assigneeId,
            name: getUserName(task.assigneeId),
            avatar: "/avatars/01.png",
            email: `${task.assigneeId}@example.com`,
          },
          action: "completed task",
          target: task.title,
          timestamp: task.updatedAt,
        }
      }
    })
    
    // Convert map back to array and sort by timestamp (newest first)
    const allActivities = Object.values(activityMap).sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )
    
    setActivities(allActivities.slice(0, 10)) // Limit to 10 activities
  }, [tasks])

  const getActionIcon = (action: string) => {
    switch (true) {
      case action.includes('created'):
        return <Plus className="h-4 w-4 text-blue-500" />
      case action.includes('completed'):
        return <Check className="h-4 w-4 text-emerald-500" />
      case action.includes('updated'):
        return <Edit className="h-4 w-4 text-amber-500" />
      case action.includes('deleted'):
        return <Trash className="h-4 w-4 text-rose-500" />
      case action.includes('commented'):
        return <BellRing className="h-4 w-4 text-purple-500" />
      case action.includes('review'):
        return <RefreshCw className="h-4 w-4 text-violet-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="space-y-6"
    >
      <Card className="border border-border/50 bg-card/50 backdrop-blur-sm hover:border-border hover:bg-card/70 transition-all">
        <CardHeader>
          <CardTitle className="text-lg">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <AnimatePresence initial={false}>
              {activities.map((activity, index) => (
                <motion.div 
                  key={activity.id}
                  className="flex items-start space-x-4"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <div className="relative">
                    <Avatar className="h-8 w-8 border-2 border-primary/20">
                      <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
                      <AvatarFallback>{activity.user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1 rounded-full bg-background p-0.5">
                      {getActionIcon(activity.action)}
                    </div>
                  </div>
                  
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">
                        <span className="font-bold">{activity.user.name}</span> {activity.action}{' '}
                        <Badge 
                          variant="outline" 
                          className="text-[10px] px-1.5 py-0 ml-0.5 bg-secondary/50 hover:bg-secondary/70 transition-colors"
                        >
                          {activity.target.length > 20
                          ? `${activity.target.substring(0, 20)}...`
                          : activity.target}
                        </Badge>
                      </p>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>
                        {format(new Date(activity.timestamp), 'MMM d, h:mm a')}
                      </span>
                      <span className="italic">
                        {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {activities.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <p>No recent activity</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      <Card className="border border-border/50 bg-card/50 backdrop-blur-sm hover:border-border hover:bg-card/70 transition-all overflow-hidden">
        <CardHeader className="pb-0">
          <CardTitle className="text-lg">Team Members</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mt-4 justify-center">
            <Avatar className="h-12 w-12 border-2 border-primary/20">
              <AvatarImage src="https://i.pravatar.cc/150?img=1" alt="Alex Johnson" />
              <AvatarFallback>AJ</AvatarFallback>
            </Avatar>
            <Avatar className="h-12 w-12 border-2 border-primary/20">
              <AvatarImage src="https://i.pravatar.cc/150?img=5" alt="Samantha Lee" />
              <AvatarFallback>SL</AvatarFallback>
            </Avatar>
            <Avatar className="h-12 w-12 border-2 border-primary/20">
              <AvatarImage src="https://i.pravatar.cc/150?img=3" alt="David Chen" />
              <AvatarFallback>DC</AvatarFallback>
            </Avatar>
            <Avatar className="h-12 w-12 border-2 border-primary/20">
              <AvatarImage src="https://i.pravatar.cc/150?img=9" alt="Maria Rodriguez" />
              <AvatarFallback>MR</AvatarFallback>
            </Avatar>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
} 