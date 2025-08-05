import React from "react"

export default function StatsCard({
  title,
  value,
  icon,
  change
}: {
  title: string
  value: string
  icon: React.ReactNode
  change: string
}) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
          <p className="text-sm text-green-500 mt-2">{change}</p>
        </div>
        <div className="bg-blue-100 p-3 rounded-full">
          {icon}
        </div>
      </div>
    </div>
  )
}