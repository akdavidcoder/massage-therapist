"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useToast } from "@/hooks/use-toast"
import {
  DollarSign,
  TrendingUp,
  Wallet,
  CalendarIcon,
  Search,
  Download,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react"
import { format } from "date-fns"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

interface Payment {
  _id: string
  clientName: string
  clientEmail: string
  serviceName: string
  amount: number
  cryptoAmount: number
  walletAddress: string
  status: "pending" | "paid" | "failed"
  date: Date
  bookingId: string
}

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [filteredPayments, setFilteredPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({})
  const [stats, setStats] = useState({
    totalRevenue: 0,
    monthlyRevenue: 0,
    pendingPayments: 0,
    successRate: 0,
  })
  const [revenueChart, setRevenueChart] = useState([])
  const [paymentMethods, setPaymentMethods] = useState([])
  const { toast } = useToast()

  useEffect(() => {
    fetchPayments()
    fetchPaymentStats()
  }, [])

  useEffect(() => {
    filterPayments()
  }, [payments, searchTerm, statusFilter, dateRange])

  const fetchPayments = async () => {
    try {
      const response = await fetch("/api/admin/payments")
      if (response.ok) {
        const data = await response.json()
        setPayments(data)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch payments",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchPaymentStats = async () => {
    try {
      const response = await fetch("/api/admin/payments/stats")
      if (response.ok) {
        const data = await response.json()
        setStats(data.stats)
        setRevenueChart(data.revenueChart)
        setPaymentMethods(data.paymentMethods)
      }
    } catch (error) {
      console.error("Failed to fetch payment stats:", error)
    }
  }

  const filterPayments = () => {
    let filtered = payments

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (payment) =>
          payment.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          payment.clientEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
          payment.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          payment.walletAddress.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((payment) => payment.status === statusFilter)
    }

    // Date range filter
    if (dateRange.from) {
      filtered = filtered.filter((payment) => new Date(payment.date) >= dateRange.from!)
    }
    if (dateRange.to) {
      filtered = filtered.filter((payment) => new Date(payment.date) <= dateRange.to!)
    }

    setFilteredPayments(filtered)
  }

  const updatePaymentStatus = async (paymentId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/payments/${paymentId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Payment status updated successfully",
        })
        fetchPayments()
        fetchPaymentStats()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update payment status",
        variant: "destructive",
      })
    }
  }

  const exportPayments = () => {
    const csvContent = [
      ["Date", "Client", "Service", "Amount", "Crypto Amount", "Wallet", "Status"].join(","),
      ...filteredPayments.map((payment) =>
        [
          format(new Date(payment.date), "yyyy-MM-dd"),
          payment.clientName,
          payment.serviceName,
          payment.amount,
          payment.cryptoAmount,
          payment.walletAddress,
          payment.status,
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `payments-${format(new Date(), "yyyy-MM-dd")}.csv`
    a.click()
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Crypto Payments & Revenue</h1>
          <p className="text-muted-foreground">Track payment transactions and revenue analytics</p>
        </div>
        <Button onClick={exportPayments}>
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">All time earnings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.monthlyRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingPayments}</div>
            <p className="text-xs text-muted-foreground">Awaiting confirmation</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.successRate}%</div>
            <p className="text-xs text-muted-foreground">Payment success rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend (Last 30 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueChart}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value}`, "Revenue"]} />
                <Line type="monotone" dataKey="revenue" stroke="#22c55e" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={paymentMethods}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {paymentMethods.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search payments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline">
                  <CalendarIcon className="w-4 h-4 mr-2" />
                  Date Range
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar mode="range" selected={dateRange} onSelect={setDateRange} numberOfMonths={2} />
              </PopoverContent>
            </Popover>
          </div>

          {/* Payments Table */}
          <div className="space-y-4">
            {filteredPayments.map((payment) => (
              <div key={payment._id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Wallet className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium">{payment.clientName}</div>
                    <div className="text-sm text-muted-foreground">{payment.serviceName}</div>
                    <div className="text-xs text-muted-foreground">
                      {payment.walletAddress.slice(0, 8)}...{payment.walletAddress.slice(-6)}
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <div className="font-medium">${payment.amount}</div>
                  <div className="text-sm text-muted-foreground">{payment.cryptoAmount} ETH</div>
                </div>

                <div className="text-center">
                  <div className="text-sm text-muted-foreground">{format(new Date(payment.date), "MMM dd, yyyy")}</div>
                  <div className="text-xs text-muted-foreground">{format(new Date(payment.date), "HH:mm")}</div>
                </div>

                <div className="flex items-center space-x-2">
                  <Badge
                    variant={
                      payment.status === "paid" ? "default" : payment.status === "pending" ? "secondary" : "destructive"
                    }
                  >
                    {payment.status}
                  </Badge>

                  {payment.status === "pending" && (
                    <div className="flex space-x-1">
                      <Button size="sm" variant="outline" onClick={() => updatePaymentStatus(payment._id, "paid")}>
                        <CheckCircle className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => updatePaymentStatus(payment._id, "failed")}>
                        <XCircle className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {filteredPayments.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">No payments found matching your criteria</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
