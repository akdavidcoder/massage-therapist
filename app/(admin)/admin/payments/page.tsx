'use client'

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, GripVertical, CreditCard, DollarSign, Bitcoin, Smartphone, Banknote, Building2, Apple, Chrome, Zap, Square } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

interface PaymentMethod {
  _id: string;
  name: string;
  type: 'cashapp' | 'paypal' | 'crypto' | 'venmo' | 'zelle' | 'bank_transfer' | 'apple_pay' | 'google_pay' | 'stripe' | 'square';
  enabled: boolean;
  details: {
    cashtag?: string;
    paypalEmail?: string;
    walletAddress?: string;
    cryptoType?: string;
    venmoHandle?: string;
    zelleEmail?: string;
    zellePhone?: string;
    // For Bank Transfer
    bankName?: string;
    accountNumber?: string;
    routingNumber?: string;
    accountHolderName?: string;
    // For Apple Pay
    applePayEmail?: string;
    applePayPhone?: string;
    // For Google Pay
    googlePayEmail?: string;
    googlePayPhone?: string;
    // For Stripe
    stripeAccountId?: string;
    stripePublishableKey?: string;
    // For Square
    squareApplicationId?: string;
    squareLocationId?: string;
  };
  instructions?: string;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

interface PaymentMethodForm {
  name: string;
  type: 'cashapp' | 'paypal' | 'crypto' | 'venmo' | 'zelle' | 'bank_transfer' | 'apple_pay' | 'google_pay' | 'stripe' | 'square';
  enabled: boolean;
  details: {
    cashtag?: string;
    paypalEmail?: string;
    walletAddress?: string;
    cryptoType?: string;
    venmoHandle?: string;
    zelleEmail?: string;
    zellePhone?: string;
    // For Bank Transfer
    bankName?: string;
    accountNumber?: string;
    routingNumber?: string;
    accountHolderName?: string;
    // For Apple Pay
    applePayEmail?: string;
    applePayPhone?: string;
    // For Google Pay
    googlePayEmail?: string;
    googlePayPhone?: string;
    // For Stripe
    stripeAccountId?: string;
    stripePublishableKey?: string;
    // For Square
    squareApplicationId?: string;
    squareLocationId?: string;
  };
  instructions?: string;
}

const paymentTypeIcons = {
  cashapp: <Smartphone className="w-5 h-5" />,
  paypal: <CreditCard className="w-5 h-5" />,
  crypto: <Bitcoin className="w-5 h-5" />,
  venmo: <DollarSign className="w-5 h-5" />,
  zelle: <Banknote className="w-5 h-5" />,
  bank_transfer: <Building2 className="w-5 h-5" />,
  apple_pay: <Apple className="w-5 h-5" />,
  google_pay: <Chrome className="w-5 h-5" />,
  stripe: <Zap className="w-5 h-5" />,
  square: <Square className="w-5 h-5" />
};

export default function AdminPaymentMethods() {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMethod, setEditingMethod] = useState<PaymentMethod | null>(null);
  const [formData, setFormData] = useState<PaymentMethodForm>({
    name: '',
    type: 'cashapp',
    enabled: true,
    details: {},
    instructions: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  const fetchPaymentMethods = async () => {
    try {
      const response = await fetch('/api/admin/payment-methods');
      const data = await response.json();
      if (data.success) {
        setPaymentMethods(data.paymentMethods);
      }
    } catch (error) {
      console.error('Failed to fetch payment methods', error);
      toast({ title: 'Error', description: 'Failed to fetch payment methods', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const url = editingMethod 
        ? `/api/admin/payment-methods/${editingMethod._id}`
        : '/api/admin/payment-methods';
      
      const method = editingMethod ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast({ title: 'Success', description: `Payment method ${editingMethod ? 'updated' : 'created'} successfully` });
        fetchPaymentMethods();
        resetForm();
        setIsDialogOpen(false);
      } else {
        throw new Error(data.error);
      }
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const handleDelete = async (methodId: string) => {
    if (!confirm('Are you sure you want to delete this payment method?')) return;
    
    try {
      const response = await fetch(`/api/admin/payment-methods/${methodId}`, {
        method: 'DELETE'
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast({ title: 'Success', description: 'Payment method deleted successfully' });
        fetchPaymentMethods();
      } else {
        throw new Error(data.error);
      }
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const handleToggleEnabled = async (method: PaymentMethod) => {
    try {
      const response = await fetch(`/api/admin/payment-methods/${method._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...method, enabled: !method.enabled })
      });
      
      const data = await response.json();
      
      if (data.success) {
        fetchPaymentMethods();
      } else {
        throw new Error(data.error);
      }
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const handleEdit = (method: PaymentMethod) => {
    setEditingMethod(method);
    setFormData({
      name: method.name,
      type: method.type,
      enabled: method.enabled,
      details: method.details,
      instructions: method.instructions || ''
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setEditingMethod(null);
    setFormData({
      name: '',
      type: 'cashapp',
      enabled: true,
      details: {},
      instructions: ''
    });
  };

  const onDragEnd = async (result: any) => {
    if (!result.destination) return;
    
    const items = Array.from(paymentMethods);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    // Update display order
    const updatedMethods = items.map((item, index) => ({
      ...item,
      displayOrder: index
    }));
    
    setPaymentMethods(updatedMethods);
    
    try {
      await fetch('/api/admin/payment-methods', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentMethods: updatedMethods })
      });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to update order', variant: 'destructive' });
    }
  };

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
        );
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
        );
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
        );
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
        );
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
                placeholder="(555) 123-4567"
                value={formData.details.zellePhone || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  details: { ...formData.details, zellePhone: e.target.value }
                })}
              />
            </div>
          </>
        );
      case 'bank_transfer':
        return (
          <div>
            <Label htmlFor="bankName">Bank Name</Label>
            <Input
              id="bankName"
              placeholder="Your bank name"
              value={formData.details.bankName || ''}
              onChange={(e) => setFormData({
                ...formData,
                details: { ...formData.details, bankName: e.target.value }
              })}
            />
            <Label htmlFor="accountNumber">Account Number</Label>
            <Input
              id="accountNumber"
              placeholder="Your account number"
              value={formData.details.accountNumber || ''}
              onChange={(e) => setFormData({
                ...formData,
                details: { ...formData.details, accountNumber: e.target.value }
              })}
            />
            <Label htmlFor="routingNumber">Routing Number</Label>
            <Input
              id="routingNumber"
              placeholder="Your routing number"
              value={formData.details.routingNumber || ''}
              onChange={(e) => setFormData({
                ...formData,
                details: { ...formData.details, routingNumber: e.target.value }
              })}
            />
            <Label htmlFor="accountHolderName">Account Holder's Name</Label>
            <Input
              id="accountHolderName"
              placeholder="Your name"
              value={formData.details.accountHolderName || ''}
              onChange={(e) => setFormData({
                ...formData,
                details: { ...formData.details, accountHolderName: e.target.value }
              })}
            />
          </div>
        );
      case 'apple_pay':
        return (
          <>
            <Label htmlFor="applePayEmail">Apple Pay Email</Label>
            <Input
              id="applePayEmail"
              type="email"
              placeholder="your@email.com"
              value={formData.details.applePayEmail || ''}
              onChange={(e) => setFormData({
                ...formData,
                details: { ...formData.details, applePayEmail: e.target.value }
              })}
            />
            <Label htmlFor="applePayPhone">Apple Pay Phone</Label>
            <Input
              id="applePayPhone"
              placeholder="Your phone number"
              value={formData.details.applePayPhone || ''}
              onChange={(e) => setFormData({
                ...formData,
                details: { ...formData.details, applePayPhone: e.target.value }
              })}
            />
          </>
        );
      case 'google_pay':
        return (
          <>
            <Label htmlFor="googlePayEmail">Google Pay Email</Label>
            <Input
              id="googlePayEmail"
              type="email"
              placeholder="your@email.com"
              value={formData.details.googlePayEmail || ''}
              onChange={(e) => setFormData({
                ...formData,
                details: { ...formData.details, googlePayEmail: e.target.value }
              })}
            />
            <Label htmlFor="googlePayPhone">Google Pay Phone</Label>
            <Input
              id="googlePayPhone"
              placeholder="Your phone number"
              value={formData.details.googlePayPhone || ''}
              onChange={(e) => setFormData({
                ...formData,
                details: { ...formData.details, googlePayPhone: e.target.value }
              })}
            />
          </>
        );
      case 'stripe':
        return (
          <>
            <Label htmlFor="stripeAccountId">Stripe Account ID</Label>
            <Input
              id="stripeAccountId"
              placeholder="Your Stripe account ID"
              value={formData.details.stripeAccountId || ''}
              onChange={(e) => setFormData({
                ...formData,
                details: { ...formData.details, stripeAccountId: e.target.value }
              })}
            />
            <Label htmlFor="stripePublishableKey">Stripe Publishable Key</Label>
            <Input
              id="stripePublishableKey"
              placeholder="Your Stripe publishable key"
              value={formData.details.stripePublishableKey || ''}
              onChange={(e) => setFormData({
                ...formData,
                details: { ...formData.details, stripePublishableKey: e.target.value }
              })}
            />
          </>
        );
      case 'square':
        return (
          <>
            <Label htmlFor="squareApplicationId">Square Application ID</Label>
            <Input
              id="squareApplicationId"
              placeholder="Your Square application ID"
              value={formData.details.squareApplicationId || ''}
              onChange={(e) => setFormData({
                ...formData,
                details: { ...formData.details, squareApplicationId: e.target.value }
              })}
            />
            <Label htmlFor="squareLocationId">Square Location ID</Label>
            <Input
              id="squareLocationId"
              placeholder="Your Square location ID"
              value={formData.details.squareLocationId || ''}
              onChange={(e) => setFormData({
                ...formData,
                details: { ...formData.details, squareLocationId: e.target.value }
              })}
            />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Payment Methods</CardTitle>
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
                    <Label htmlFor="name">Display Name</Label>
                    <Input
                      id="name"
                      placeholder="e.g., CashApp Payment"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="type">Payment Type</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value: any) => setFormData({ ...formData, type: value, details: {} })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cashapp">CashApp</SelectItem>
                        <SelectItem value="paypal">PayPal</SelectItem>
                        <SelectItem value="crypto">Cryptocurrency</SelectItem>
                        <SelectItem value="venmo">Venmo</SelectItem>
                        <SelectItem value="zelle">Zelle</SelectItem>
                        <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                        <SelectItem value="apple_pay">Apple Pay</SelectItem>
                        <SelectItem value="google_pay">Google Pay</SelectItem>
                        <SelectItem value="stripe">Stripe</SelectItem>
                        <SelectItem value="square">Square</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {renderDetailsForm()}
                  
                  <div>
                    <Label htmlFor="instructions">Instructions (Optional)</Label>
                    <Textarea
                      id="instructions"
                      placeholder="Additional instructions for customers"
                      value={formData.instructions}
                      onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={formData.enabled}
                      onCheckedChange={(checked) => setFormData({ ...formData, enabled: checked })}
                    />
                    <Label>Enabled</Label>
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
          {loading ? (
            <p>Loading...</p>
          ) : paymentMethods.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No payment methods configured.</p>
          ) : (
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="payment-methods">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
                    {paymentMethods.map((method, index) => (
                      <Draggable key={method._id} draggableId={method._id} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className="border rounded-lg p-4 bg-white"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <div {...provided.dragHandleProps}>
                                  <GripVertical className="w-4 h-4 text-muted-foreground" />
                                </div>
                                {paymentTypeIcons[method.type]}
                                <div>
                                  <div className="flex items-center space-x-2">
                                    <h3 className="font-medium">{method.name}</h3>
                                    <Badge variant={method.enabled ? 'default' : 'secondary'}>
                                      {method.enabled ? 'Enabled' : 'Disabled'}
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-muted-foreground capitalize">{method.type}</p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Switch
                                  checked={method.enabled}
                                  onCheckedChange={() => handleToggleEnabled(method)}
                                />
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleEdit(method)}
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleDelete(method._id)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
