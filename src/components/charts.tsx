'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { priorityDistribution, statusDistribution } from "@/data/sample-data"
import { motion, AnimatePresence } from "framer-motion"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, Area, AreaChart } from "recharts"
import { Task } from "@/types"
import { useEffect, useState } from "react"
import { ChevronDown, ChevronUp, BarChart as BarChartIcon, PieChart as PieChartIcon, AreaChart as AreaChartIcon } from "lucide-react"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    return (
      <div className="bg-popover border border-border rounded-lg shadow-lg p-3 text-sm">
        <p className="font-bold flex items-center mb-1">
          <span className="h-3 w-3 rounded-full mr-2" style={{ backgroundColor: data.color || payload[0].fill }}></span>
          {data.name}
        </p>
        <p className="font-bold text-lg">{data.value}</p>
      </div>
    )
  }
  return null
}

interface ChartsProps {
  tasks: Task[]
}

export default function Charts({ tasks }: ChartsProps) {
  const [chartType, setChartType] = useState<'pie' | 'bar' | 'area'>('pie')
  const [activeTab, setActiveTab] = useState('status')
  const [statusData, setStatusData] = useState(statusDistribution)
  const [priorityData, setPriorityData] = useState(priorityDistribution)
  const [timeData, setTimeData] = useState<any[]>([])

  // Compute chart data from tasks
  useEffect(() => {
    if (!tasks.length) return
    
    // Status distribution
    const statusCounts: Record<string, number> = {}
    const statusColors: Record<string, string> = {
      backlog: "#488df4",
      todo: "#b24fff",
      "in-progress": "#ff9f45",
      review: "#a04fff",
      done: "#3ecf8e",
    }
    
    tasks.forEach(task => {
      statusCounts[task.status] = (statusCounts[task.status] || 0) + 1
    })
    
    const newStatusData = Object.entries(statusCounts).map(([status, count]) => ({
      name: status === 'in-progress' ? 'In Progress' : 
            status === 'todo' ? 'To Do' : 
            status.charAt(0).toUpperCase() + status.slice(1),
      value: count,
      color: statusColors[status]
    }))
    
    setStatusData(newStatusData)
    
    // Priority distribution
    const priorityCounts: Record<string, number> = {}
    const priorityColors: Record<string, string> = {
      low: "#3ecf8e",
      medium: "#4896ff",
      high: "#ff9f45",
      urgent: "#ff5c5c",
    }
    
    tasks.forEach(task => {
      priorityCounts[task.priority] = (priorityCounts[task.priority] || 0) + 1
    })
    
    const newPriorityData = Object.entries(priorityCounts).map(([priority, count]) => ({
      name: priority.charAt(0).toUpperCase() + priority.slice(1),
      value: count,
      color: priorityColors[priority]
    }))
    
    setPriorityData(newPriorityData)
    
    // Time-based data (tasks over time)
    const timeSeriesData: Record<string, Record<string, number>> = {}
    const dates = tasks.map(task => new Date(task.createdAt).toLocaleDateString()).sort()
    
    if (dates.length > 0) {
      const uniqueDates = [...new Set(dates)]
      const statusKeys = Object.keys(statusCounts)
      
      uniqueDates.forEach(date => {
        timeSeriesData[date] = {}
        statusKeys.forEach(status => {
          timeSeriesData[date][status] = 0
        })
      })
      
      tasks.forEach(task => {
        const date = new Date(task.createdAt).toLocaleDateString()
        timeSeriesData[date][task.status] = (timeSeriesData[date][task.status] || 0) + 1
      })
      
      const timeChartData = Object.entries(timeSeriesData).map(([date, statuses]) => ({
        date,
        ...statuses,
        total: Object.values(statuses).reduce((a, b) => a + b, 0)
      }))
      
      setTimeData(timeChartData)
    }
  }, [tasks])

  const renderPieChart = (data: typeof statusData) => (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={chartType === 'pie' ? 60 : 80}
          outerRadius={chartType === 'pie' ? 100 : 120}
          paddingAngle={4}
          dataKey="value"
          stroke="transparent"
          animationBegin={200}
          animationDuration={1000}
        >
          {data.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={entry.color}
              style={{
                filter: 'drop-shadow(0px 0px 6px rgba(0, 0, 0, 0.3))'
              }}
            />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend 
          layout="horizontal" 
          verticalAlign="bottom" 
          align="center"
          formatter={(value) => <span className="text-xs">{value}</span>}
          iconType="circle"
          iconSize={10}
        />
      </PieChart>
    </ResponsiveContainer>
  )

  const renderBarChart = (data: typeof statusData) => (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
        <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
        <Tooltip content={<CustomTooltip />} />
        <Bar 
          dataKey="value" 
          radius={[4, 4, 0, 0]}
          barSize={40} 
          animationDuration={1000}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )

  const renderAreaChart = () => (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart
        data={timeData}
        margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
        <XAxis dataKey="date" tick={{ fontSize: 12 }} />
        <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
        <Tooltip />
        <Area 
          type="monotone" 
          dataKey="done" 
          stackId="1" 
          stroke="#3ecf8e" 
          fill="#3ecf8e" 
          fillOpacity={0.8} 
        />
        <Area 
          type="monotone" 
          dataKey="review" 
          stackId="1" 
          stroke="#a04fff" 
          fill="#a04fff" 
          fillOpacity={0.7} 
        />
        <Area 
          type="monotone" 
          dataKey="in-progress" 
          stackId="1" 
          stroke="#ff9f45" 
          fill="#ff9f45" 
          fillOpacity={0.6}
        />
        <Area 
          type="monotone" 
          dataKey="todo" 
          stackId="1" 
          stroke="#b24fff" 
          fill="#b24fff" 
          fillOpacity={0.5}
        />
        <Area 
          type="monotone" 
          dataKey="backlog" 
          stackId="1" 
          stroke="#488df4" 
          fill="#488df4" 
          fillOpacity={0.4}
        />
      </AreaChart>
    </ResponsiveContainer>
  )

  const totalTasks = tasks.length
  const completedTasks = tasks.filter(task => task.status === 'done').length
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  return (
    <motion.div 
      className="grid grid-cols-1 gap-6 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card className="border border-border/50 bg-card/50 backdrop-blur-sm hover:border-border hover:bg-card/70 transition-all">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle className="text-xl font-bold">
              Task Analytics
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {totalTasks} total tasks, {completionRate}% completion rate
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="flex border rounded-lg overflow-hidden p-1 bg-secondary/20">
              <Button 
                size="sm"
                variant="ghost" 
                className={`px-2 py-1 ${chartType === 'pie' ? 'bg-secondary' : ''}`}
                onClick={() => setChartType('pie')}
              >
                <PieChartIcon className="h-4 w-4" />
              </Button>
              <Button 
                size="sm"
                variant="ghost" 
                className={`px-2 py-1 ${chartType === 'bar' ? 'bg-secondary' : ''}`}
                onClick={() => setChartType('bar')}
              >
                <BarChartIcon className="h-4 w-4" />
              </Button>
              <Button 
                size="sm"
                variant="ghost" 
                className={`px-2 py-1 ${chartType === 'area' ? 'bg-secondary' : ''}`}
                onClick={() => setChartType('area')}
              >
                <AreaChartIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="status" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="status">
                Status Distribution
              </TabsTrigger>
              <TabsTrigger value="priority">
                Priority Distribution
              </TabsTrigger>
            </TabsList>
            
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab + chartType}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <TabsContent value="status" className="space-y-4">
                  {chartType === 'area' ? renderAreaChart() : 
                   chartType === 'bar' ? renderBarChart(statusData) : 
                   renderPieChart(statusData)}
                  
                  <div className="flex flex-wrap gap-2 justify-center mt-4">
                    {statusData.map((item) => (
                      <Badge 
                        key={item.name}
                        className="px-3 py-1 text-xs font-medium"
                        style={{ backgroundColor: item.color, color: 'white' }}
                      >
                        {item.name}: {item.value} tasks
                      </Badge>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="priority" className="space-y-4">
                  {chartType === 'bar' ? renderBarChart(priorityData) : renderPieChart(priorityData)}
                  
                  <div className="flex flex-wrap gap-2 justify-center mt-4">
                    {priorityData.map((item) => (
                      <Badge 
                        key={item.name}
                        className="px-3 py-1 text-xs font-medium"
                        style={{ backgroundColor: item.color, color: 'white' }}
                      >
                        {item.name}: {item.value} tasks
                      </Badge>
                    ))}
                  </div>
                </TabsContent>
              </motion.div>
            </AnimatePresence>
          </Tabs>
        </CardContent>
      </Card>
    </motion.div>
  )
} 