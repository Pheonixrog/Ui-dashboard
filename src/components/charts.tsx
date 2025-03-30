'use client'

import React, { useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts"
import { Task } from "@/types"

const COLORS = [
  "#0088FE", // blue
  "#00C49F", // green
  "#FFBB28", // yellow
  "#FF8042", // orange
  "#8884D8", // purple
]

type ChartType = "status" | "priority"

interface ChartData {
  name: string;
  value: number;
  color: string;
}

interface ChartProps {
  tasks: Task[]
}

export function Charts({ tasks }: ChartProps) {
  const [selectedChart, setSelectedChart] = useState<ChartType>("status")

  const getChartData = (): ChartData[] => {
    if (selectedChart === "status") {
      const statusCounts: Record<string, number> = {}
      
      tasks.forEach((task) => {
        statusCounts[task.status] = (statusCounts[task.status] || 0) + 1
      })
      
      return Object.entries(statusCounts).map(([status, count], index) => ({
        name: status.charAt(0).toUpperCase() + status.slice(1).replace("-", " "),
        value: count,
        color: COLORS[index % COLORS.length]
      }))
    } else {
      const priorityCounts: Record<string, number> = {}
      
      tasks.forEach((task) => {
        priorityCounts[task.priority] = (priorityCounts[task.priority] || 0) + 1
      })
      
      return Object.entries(priorityCounts).map(([priority, count], index) => ({
        name: priority.charAt(0).toUpperCase() + priority.slice(1),
        value: count,
        color: COLORS[index % COLORS.length]
      }))
    }
  }

  const renderPieChart = (data: ChartData[]) => (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={100}
          fill="#8884d8"
          dataKey="value"
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip 
          formatter={(value: number) => [`${value} tasks`, "Count"]}
          labelFormatter={(name) => `${name}`}
        />
      </PieChart>
    </ResponsiveContainer>
  )

  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Task Distribution</CardTitle>
        <CardDescription>
          View how your tasks are distributed across different categories
        </CardDescription>
        <Tabs
          defaultValue="status"
          value={selectedChart}
          onValueChange={(value) => setSelectedChart(value as ChartType)}
          className="mt-3"
        >
          <TabsList className="grid grid-cols-2 w-full max-w-[300px]">
            <TabsTrigger value="status">By Status</TabsTrigger>
            <TabsTrigger value="priority">By Priority</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        {renderPieChart(getChartData())}
      </CardContent>
    </Card>
  )
} 