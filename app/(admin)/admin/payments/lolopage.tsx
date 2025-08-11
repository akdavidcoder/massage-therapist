'use client'

import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent 
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectTrigger, 
  SelectValue, 
  SelectContent, 
  SelectItem 
} from '@/components/ui/select';
import { 
  Tabs, 
  TabsList, 
  TabsTrigger, 
  TabsContent 
} from '@/components/ui/tabs';
import { 
  Popover, 
  PopoverTrigger, 
  PopoverContent 
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { 
  Dialog, 
  DialogTrigger, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import {
  ResponsiveContainer,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  DragDropContext, 
  Droppable, 
  Draggable, 
  DropResult 
} from 'react-beautiful-dnd';
import { 
  DollarSign, 
  Save, 
  Search, 
  CalendarIcon, 
  Download, 
  CheckCircle, 
  Clock, 
  XCircle, 
  Plus, 
  Edit, 
  Trash2, 
  GripVertical, 
  Wallet, 
  TrendingUp 
} from 'lucide-react';

// Type definitions
interface Payment {
  _id: string;
  clientName: string;
  clientEmail: string;
  serviceName: string;
  amount: number;
  cryptoAmount: string;
  date: string;
  status: 'pending' | 'paid' | 'failed';
  walletAddress?: string;
}

interface DateRange {
  from?: Date;
  to?: Date;
}

interface PaymentMethodData {
  name: string;
  value: number;
  color: string;
}

interface PaymentMethod {
  _id: string;
  name: string;
  type: 'cashapp' | 'paypal' | 'crypto' | 'venmo' | 'zelle';
  enabled: boolean;
  details: any;
  instructions?: string;
  displayOrder?: number;
}

interface PaymentMethodForm {
  name: string;
  type: 'cashapp' | 'paypal' | 'crypto' | 'venmo' | 'zelle';
  enabled: boolean;
  details: any;
  instructions: string;
}

// Payment type icons mapping
const paymentTypeIcons: Record<string, JSX.Element> = {
  cashapp: <DollarSign className="w-5 h-5 text-green-600" />,
  paypal: <DollarSign className="w-5 h-5 text-blue-600" />,
  crypto: <DollarSign className="w-5 h-5 text-orange-600" />,
  venmo: <DollarSign className="w-5 h-5 text-blue-500" />,
  zelle: <DollarSign className="w-5 h-5 text-purple-600" />,
};

export default function PaymentsPage() {
  // States for individual payment transactions and filtering
  const [payments, setPayments] = useState<Payment[]>([])
  const [filteredPayments, setFilteredPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined)
  const [editableWalletAddress, setEditableWalletAddress] = useState<{ [key: string]: string }>({})

  // States for statistics and charts
  const [stats, setStats] = useState({ totalRevenue: 0, monthlyRevenue: 0, pendingPayments: 0, successRate: 0 })
  const [revenueChart, setRevenueChart] = useState<any[]>([])
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethodData[]>([])
  
  // States for the global company wallet address setting
  const [companyWalletAddress, setCompanyWalletAddress] = useState("")
  const [isSaving, setIsSaving] = useState(false)

  // States for payment methods management
  const [adminPaymentMethods, setAdminPaymentMethods] = useState<PaymentMethod[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingMethod, setEditingMethod] = useState<PaymentMethod | null>(null)
  const [formData, setFormData] = useState<PaymentMethodForm>({
    name: '',
    type: 'cashapp',
    enabled: true,
    details: {},
    instructions: ''
  })

  const { toast } = useToast()

  // Fetch all necessary data on component mount
  useEffect(() => {
    // Fetches the global setting
    const fetchWalletSetting = async () => {
      try {
        const response = await fetch('/api/admin/settings/wallet-address');
        const data = await response.json();
        if (data.success) {
          setCompanyWalletAddress(data.address);
        }
      } catch (error) {
        console.error("Could not fetch company wallet address setting", error);
        toast({ title: "Error", description: "Could not load company wallet setting.", variant: "destructive" });
      }
    };
    
    fetchWalletSetting();
    fetchPayments();
    fetchPaymentStats();
    fetchAdminPaymentMethods();
  }, [toast]);

  // Re-filter payments whenever the source data or filter criteria change
  useEffect(() => {
    filterPayments()
  }, [payments, searchTerm, statusFilter, dateRange])

  // --- Functions for managing INDIVIDUAL payment transactions ---
  const fetchPayments = async () => {
    // Mock function for now
    setPayments([])
  }
  
  const fetchPaymentStats = async () => {
    // Mock function for now
    setStats({ totalRevenue: 0, monthlyRevenue: 0, pendingPayments: 0, successRate: 0 })
  }
  
  const filterPayments = () => {
    setFilteredPayments(payments)
  }
  
  const handleWalletAddressChange = (paymentId: string, value: string) => {
    setEditableWalletAddress(prev => ({ ...prev, [paymentId]: value }))
  }
  
  const handleUpdateWalletAddress = async (paymentId: string) => {
    // Mock function for now
  }
  
  const updatePaymentStatus = async (paymentId: string, newStatus: string) => {
    // Mock function for now
  }

  // --- Payment Methods Management Functions ---
  const fetchAdminPaymentMethods = async () => {
    try {
      const response = await fetch('/api/admin/payment-methods')
      const data = await response.json()
      if (data.success) {
        setAdminPaymentMethods(data.paymentMethods)
      }
    } catch (error) {
      console.error('Failed to fetch payment methods', error)
      toast({ title: 'Error', description: 'Failed to fetch payment methods', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const url = editingMethod 
        ? `/api/admin/payment-methods/${editingMethod._id}`
        : '/api/admin/payment-methods'
      
      const method = editingMethod ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      
      const data = await response.json()
      
      if (data.success) {
        toast({ title: 'Success', description: `Payment method ${editingMethod ? 'updated' : 'created'} successfully` })
        fetchAdminPaymentMethods()
        resetForm()
        setIsDialogOpen(false)
      } else {
        throw new Error(data.error)
      }
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' })
    }
  }

  const handleDelete = async (methodId: string) => {
    if (!confirm('Are you sure you want to delete this payment method?')) return
    
    try {
      const response = await fetch(`/api/admin/payment-methods/${methodId}`, {
        method: 'DELETE'
      })
      
      const data = await response.json()
      
      if (data.success) {
        toast({ title: 'Success', description: 'Payment method deleted successfully' })
        fetchAdminPaymentMethods()
      } else {
        throw new Error(data.error)
      }
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' })
    }
  }

  const handleToggleEnabled = async (method: PaymentMethod) => {
    try {
      const response = await fetch(`/api/admin/payment-methods/${method._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...method, enabled: !method.enabled })
      })
      
      const data = await response.json()
      
      if (data.success) {
        fetchAdminPaymentMethods()
      } else {
        throw new Error(data.error)
      }
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' })
    }
  }

  const handleEdit = (method: PaymentMethod) => {
    setEditingMethod(method)
    setFormData({
      name: method.name,
      type: method.type,
      enabled: method.enabled,
      details: method.details,
      instructions: method.instructions || ''
    })
    setIsDialogOpen(true)
  }

  const resetForm = () => {
    setEditingMethod(null)
    setFormData({
      name: '',
      type: 'cashapp',
      enabled: true,
      details: {},
      instructions: ''
    })
  }

  const onDragEnd = async (result: DropResult) => {
    if (!result.destination) return
    
    const items = Array.from(adminPaymentMethods)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)
    
    const updatedMethods = items.map((item, index) => ({
      ...item,
      displayOrder: index
    }))
    
    setAdminPaymentMethods(updatedMethods)
    
    try {
      await fetch('/api/admin/payment-methods', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentMethods: updatedMethods })
      })
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to update order', variant: 'destructive' })
    }
  }

  const renderDetailsForm = () => {
    switch (formData.type) {
      case 'cashapp':
        return (
          <div>
            <Label htmlFor="cashtag">CashApp Tag</Label>
            <Input
              id="cashtag"
              placeholder="$yourtag"
              value={formData.details.cashtag || ''}
              onChange={(e) => setFormData({
                ...formData,
                details: { ...formData.details, cashtag: e.target.value }
              })}
            />
          </div>
        )
      case 'paypal':
        return (
          <div>
            <Label htmlFor="paypalEmail">PayPal Email</Label>
            <Input
              id="paypalEmail"
              type="email"
              placeholder="your@email.com"
              value={formData.details.paypalEmail || ''}
              onChange={(e) => setFormData({
                ...formData,
                details: { ...formData.details, paypalEmail: e.target.value }
              })}
            />
          </div>
        )
      case 'crypto':
        return (
          <>
            <div>
              <Label htmlFor="cryptoType">Crypto Type</Label>
              <Input
                id="cryptoType"
                placeholder="Bitcoin, USDC, etc."
                value={formData.details.cryptoType || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  details: { ...formData.details, cryptoType: e.target.value }
                })}
              />
            </div>
            <div>
              <Label htmlFor="walletAddress">Wallet Address</Label>
              <Textarea
                id="walletAddress"
                placeholder="Your wallet address"
                value={formData.details.walletAddress || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  details: { ...formData.details, walletAddress: e.target.value }
                })}
              />
            </div>
          </>
        )
      case 'venmo':
        return (
          <div>
            <Label htmlFor="venmoHandle">Venmo Handle</Label>
            <Input
              id="venmoHandle"
              placeholder="@yourhandle"
              value={formData.details.venmoHandle || ''}
              onChange={(e) => setFormData({
                ...formData,
                details: { ...formData.details, venmoHandle: e.target.value }
              })}
            />
          </div>
        )
      case 'zelle':
        return (
          <>
            <div>
              <Label htmlFor="zelleEmail">Zelle Email</Label>
              <Input
                id="zelleEmail"
                type="email"
                placeholder="your@email.com"
                value={formData.details.zelleEmail || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  details: { ...formData.details, zelleEmail: e.target.value }
                })}
              />
            </div>
            <div>
              <Label htmlFor="zellePhone">Zelle Phone (Optional)</Label>
              <Input
                id="zellePhone"
                placeholder="480-287-2633"
                value={formData.details.zellePhone || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  details: { ...formData.details, zellePhone: e.target.value }
                })}
              />
            </div>
          </>
        )
      default:
        return null
    }
  }

  // --- Function to save the GLOBAL company wallet address ---
  const handleSaveCompanyWallet = async () => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/admin/settings/wallet-address', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address: companyWalletAddress }),
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Server error");

      toast({
        title: "Success",
        description: "Company receiving wallet address has been updated.",
      });
    } catch (error: any) {
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Crypto Payments & Revenue</h1>
          <p className="text-muted-foreground">Manage settings and track all payment transactions.</p>
        </div>
      </div>
      
      {/* Card for Managing Company Wallet Address */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <Wallet className="w-5 h-5 mr-2" />
            Company Receiving Wallet Address
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Set the single wallet address that customers will see on the booking page. They will be instructed to send their payment to this address.
          </p>
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 space-y-2 sm:space-y-0">
            <Input 
              value={companyWalletAddress}
              onChange={(e) => setCompanyWalletAddress(e.target.value)}
              placeholder="Enter your company's crypto wallet address"
              className="flex-grow"
            />
            <Button onClick={handleSaveCompanyWallet} disabled={isSaving} className="w-full sm:w-auto">
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? "Saving..." : "Save Address"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">All-time earnings</p>
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
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.successRate}%</div>
            <p className="text-xs text-muted-foreground">Payment success rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabbed Interface */}
      <Tabs defaultValue="payments" className="space-y-4">
        <TabsList>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="payment-methods">Payment Methods</TabsTrigger>
        </TabsList>
        
        {/* Payments Tab */}
        <TabsContent value="payments" className="space-y-4">
          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={revenueChart}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="revenue" stroke="#8884d8" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Payment Methods Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={paymentMethods}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
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

          {/* Payment Transactions */}
          <Card>
            <CardHeader>
              <CardTitle>Individual Payment Transactions</CardTitle>
              <p className="text-sm text-muted-foreground pt-1">
                Track and manage each individual booking payment. The address shown here is the customer's *sending* address for reconciliation.
              </p>
            </CardHeader>
            <CardContent>
              {/* Filter Controls */}
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by client name or email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-[280px] justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateRange?.from ? (
                        dateRange.to ? (
                          <>
                            {format(dateRange.from, "LLL dd, y")} -{" "}
                            {format(dateRange.to, "LLL dd, y")}
                          </>
                        ) : (
                          format(dateRange.from, "LLL dd, y")
                        )
                      ) : (
                        <span>Pick a date range</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      initialFocus
                      mode="range"
                      defaultMonth={dateRange?.from}
                      selected={dateRange}
                      onSelect={setDateRange}
                      numberOfMonths={2}
                    />
                  </PopoverContent>
                </Popover>
                <Button variant="outline" size="icon">
                  <Download className="h-4 w-4" />
                </Button>
              </div>

              {/* Payments List */}
              <div className="space-y-4">
                {filteredPayments.map((payment) => (
                  <div key={payment._id} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div>
                        <div className="font-medium">{payment.clientName}</div>
                        <div className="text-sm text-muted-foreground">{payment.clientEmail}</div>
                        <div className="text-xs text-muted-foreground">{payment.serviceName}</div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-xs font-medium text-muted-foreground mb-1">Customer's Sending Address</div>
                      <div className="flex items-center space-x-2">
                        <Input
                          value={editableWalletAddress[payment._id] || payment.walletAddress || ""}
                          onChange={(e) => handleWalletAddressChange(payment._id, e.target.value)}
                          className="text-xs h-8 flex-grow"
                          placeholder="Customer's sending address"
                        />
                        {editableWalletAddress[payment._id] !== payment.walletAddress && (
                          <Button size="icon" variant="outline" onClick={() => handleUpdateWalletAddress(payment._id)}>
                            <Save className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>

                    <div className="text-center md:text-left">
                      <div className="font-medium">${payment.amount}</div>
                      <div className="text-sm text-muted-foreground">{payment.cryptoAmount} CRYPTO</div>
                      <div className="text-xs text-muted-foreground">{format(new Date(payment.date), "MMM dd, yyyy")}</div>
                    </div>

                    <div className="flex items-center justify-end space-x-2">
                      <Badge variant={payment.status === 'paid' ? 'default' : payment.status === 'pending' ? 'secondary' : 'destructive'}>
                        {payment.status === 'paid' && <CheckCircle className="w-3 h-3 mr-1" />}
                        {payment.status === 'pending' && <Clock className="w-3 h-3 mr-1" />}
                        {payment.status === 'failed' && <XCircle className="w-3 h-3 mr-1" />}
                        {payment.status}
                      </Badge>
                      <Button size="sm" variant="outline" onClick={() => updatePaymentStatus(payment._id, 'paid')}>
                        Mark Paid
                      </Button>
                    </div>
                  </div>
                ))}
                {filteredPayments.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No payment transactions found matching your criteria.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Payment Methods Tab */}
        <TabsContent value="payment-methods" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Payment Methods Management</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Configure the payment methods available to customers during booking.
                  </p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={resetForm}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Payment Method
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>
                        {editingMethod ? 'Edit Payment Method' : 'Add Payment Method'}
                      </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <Label htmlFor="name">Method Name</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="e.g., CashApp, PayPal"
                          required
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="type">Payment Type</Label>
                        <Select value={formData.type} onValueChange={(value: any) => setFormData({ ...formData, type: value })}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="cashapp">CashApp</SelectItem>
                            <SelectItem value="paypal">PayPal</SelectItem>
                            <SelectItem value="crypto">Cryptocurrency</SelectItem>
                            <SelectItem value="venmo">Venmo</SelectItem>
                            <SelectItem value="zelle">Zelle</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      {renderDetailsForm()}
                      
                      <div>
                        <Label htmlFor="instructions">Payment Instructions</Label>
                        <Textarea
                          id="instructions"
                          value={formData.instructions}
                          onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                          placeholder="Additional instructions for customers"
                          rows={3}
                        />
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={formData.enabled}
                          onCheckedChange={(checked) => setFormData({ ...formData, enabled: checked })}
                        />
                        <Label>Enable this payment method</Label>
                      </div>
                      
                      <div className="flex justify-end space-x-2">
                        <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button type="submit">
                          {editingMethod ? 'Update' : 'Create'}
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="payment-methods">
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
                      {adminPaymentMethods.map((method, index) => (
                        <Draggable key={method._id} draggableId={method._id} index={index}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className="flex items-center justify-between p-4 border rounded-lg bg-card"
                            >
                              <div className="flex items-center space-x-4">
                                <div {...provided.dragHandleProps}>
                                  <GripVertical className="w-5 h-5 text-muted-foreground" />
                                </div>
                                {paymentTypeIcons[method.type]}
                                <div>
                                  <div className="font-medium">{method.name}</div>
                                  <div className="text-sm text-muted-foreground capitalize">{method.type}</div>
                                </div>
                              </div>
                              
                              <div className="flex items-center space-x-2">
                                <Switch
                                  checked={method.enabled}
                                  onCheckedChange={() => handleToggleEnabled(method)}
                                />
                                <Button size="icon" variant="outline" onClick={() => handleEdit(method)}>
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button size="icon" variant="outline" onClick={() => handleDelete(method._id)}>
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                      {adminPaymentMethods.length === 0 && (
                        <div className="text-center py-8 text-muted-foreground">
                          No payment methods configured. Add your first payment method to get started.
                        </div>
                      )}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}