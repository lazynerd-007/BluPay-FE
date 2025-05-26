"use client";

import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { IconSearch, IconDownload, IconFilter, IconCalendar } from "@tabler/icons-react";

// Mock transactions data
const mockTransactions = [
  {
    id: "TXN-001",
    date: "2023-11-15T10:32:15",
    amount: 1250.00,
    currency: "GHS",
    status: "completed",
    type: "payment",
    customer: "John Doe",
    reference: "REF-12345",
    submerchant: "Store A"
  },
  {
    id: "TXN-002",
    date: "2023-11-15T09:18:43",
    amount: 500.00,
    currency: "GHS",
    status: "completed",
    type: "payment",
    customer: "Sarah Johnson",
    reference: "REF-12346",
    submerchant: "Store B"
  },
  {
    id: "TXN-003",
    date: "2023-11-14T16:45:22",
    amount: 1850.75,
    currency: "GHS",
    status: "pending",
    type: "payment",
    customer: "Michael Brown",
    reference: "REF-12347",
    submerchant: "Store A"
  },
  {
    id: "TXN-004",
    date: "2023-11-14T14:20:11",
    amount: 750.50,
    currency: "GHS",
    status: "completed",
    type: "payment",
    customer: "Emma Wilson",
    reference: "REF-12348",
    submerchant: "Store C"
  },
  {
    id: "TXN-005",
    date: "2023-11-14T11:05:38",
    amount: 2500.00,
    currency: "GHS",
    status: "failed",
    type: "payment",
    customer: "David Lee",
    reference: "REF-12349",
    submerchant: "Store B"
  }
];

// List of submerchants
const submerchants = [
  { id: "1", name: "Store A" },
  { id: "2", name: "Store B" },
  { id: "3", name: "Store C" },
  { id: "4", name: "Store D" },
];

// Transaction types
const transactionTypes = [
  { id: "all", name: "All Types" },
  { id: "payment", name: "Payment" },
  { id: "refund", name: "Refund" },
  { id: "payout", name: "Payout" },
  { id: "chargeback", name: "Chargeback" },
];

// Table columns for export selection
const tableColumns = [
  { id: "id", name: "ID", checked: true },
  { id: "date", name: "Date", checked: true },
  { id: "customer", name: "Customer", checked: true },
  { id: "amount", name: "Amount", checked: true },
  { id: "currency", name: "Currency", checked: true },
  { id: "reference", name: "Reference", checked: true },
  { id: "status", name: "Status", checked: true },
  { id: "type", name: "Type", checked: true },
  { id: "submerchant", name: "Submerchant", checked: true },
];

export default function MerchantTransactionsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  
  // Filter state
  const [selectedSubmerchant, setSelectedSubmerchant] = useState("");
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [transactionType, setTransactionType] = useState("");
  
  // Export state
  const [exportColumns, setExportColumns] = useState(tableColumns);
  
  // Filter transactions based on all filters
  const filteredTransactions = mockTransactions.filter(transaction => {
    // Search filter
    const matchesSearch = 
      transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.reference.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Submerchant filter
    const matchesSubmerchant = !selectedSubmerchant || 
      transaction.submerchant === selectedSubmerchant;
    
    // Transaction type filter
    const matchesType = !transactionType || transactionType === "all" || 
      transaction.type === transactionType;
    
    // Date range filter
    const transactionDate = new Date(transaction.date);
    const afterStartDate = !startDate || transactionDate >= startDate;
    const beforeEndDate = !endDate || transactionDate <= endDate;
    
    return matchesSearch && matchesSubmerchant && matchesType && afterStartDate && beforeEndDate;
  });
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Get status badge variant
  const getStatusBadgeVariant = (status: string) => {
    switch(status) {
      case "completed":
        return "success";
      case "pending":
        return "warning";
      case "failed":
        return "destructive";
      default:
        return "secondary";
    }
  };

  // Handle export column selection
  const handleColumnToggle = (columnId: string) => {
    setExportColumns(prev => 
      prev.map(col => 
        col.id === columnId ? { ...col, checked: !col.checked } : col
      )
    );
  };
  
  // Reset filters
  const resetFilters = () => {
    setSelectedSubmerchant("");
    setStartDate(undefined);
    setEndDate(undefined);
    setTransactionType("");
  };

  // Apply filters and close modal
  const applyFilters = () => {
    setFilterOpen(false);
  };

  // Handle export
  const handleExport = () => {
    // In a real application, this would handle the actual export functionality
    console.log("Exporting with columns:", exportColumns.filter(col => col.checked).map(col => col.id));
    setExportOpen(false);
  };
  
  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Transactions</h2>
        <p className="text-muted-foreground">
          View and manage your payment transactions
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Transactions</CardDescription>
            <CardTitle className="text-2xl">126</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Last 30 days
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Collections</CardDescription>
            <CardTitle className="text-2xl">GHS 12,450.75</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Last 30 days
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Payout</CardDescription>
            <CardTitle className="text-2xl">GHS 8,325.50</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Last 30 days
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>View your recent transactions</CardDescription>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative w-full sm:w-64">
                <IconSearch className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search transactions..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex gap-2">
                {/* Filter Dialog */}
                <Dialog open={filterOpen} onOpenChange={setFilterOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="icon">
                      <IconFilter className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Filter Transactions</DialogTitle>
                      <DialogDescription>
                        Apply filters to narrow down your transaction list
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="submerchant">Sub Merchant</Label>
                        <select
                          id="submerchant"
                          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                          value={selectedSubmerchant}
                          onChange={(e) => setSelectedSubmerchant(e.target.value)}
                        >
                          <option value="">All Submerchants</option>
                          {submerchants.map((merchant) => (
                            <option key={merchant.id} value={merchant.name}>
                              {merchant.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      <div className="grid gap-2">
                        <Label>Start Date</Label>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            className={`w-full justify-start text-left font-normal ${!startDate ? 'text-muted-foreground' : ''}`}
                            type="button"
                            onClick={() => {
                              const datePickerElement = document.getElementById('start-date-picker');
                              if (datePickerElement) {
                                datePickerElement.click();
                              }
                            }}
                          >
                            <IconCalendar className="mr-2 h-4 w-4" />
                            {startDate ? format(startDate, 'PPP') : "Select date"}
                          </Button>
                          <div className="hidden">
                            <Calendar
                              id="start-date-picker"
                              mode="single"
                              selected={startDate}
                              onSelect={setStartDate}
                              initialFocus
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid gap-2">
                        <Label>End Date</Label>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            className={`w-full justify-start text-left font-normal ${!endDate ? 'text-muted-foreground' : ''}`}
                            type="button"
                            onClick={() => {
                              const datePickerElement = document.getElementById('end-date-picker');
                              if (datePickerElement) {
                                datePickerElement.click();
                              }
                            }}
                          >
                            <IconCalendar className="mr-2 h-4 w-4" />
                            {endDate ? format(endDate, 'PPP') : "Select date"}
                          </Button>
                          <div className="hidden">
                            <Calendar
                              id="end-date-picker"
                              mode="single"
                              selected={endDate}
                              onSelect={setEndDate}
                              initialFocus
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="transaction-type">Transaction Type</Label>
                        <select
                          id="transaction-type"
                          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                          value={transactionType}
                          onChange={(e) => setTransactionType(e.target.value)}
                        >
                          {transactionTypes.map((type) => (
                            <option key={type.id} value={type.id}>
                              {type.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    
                    <DialogFooter>
                      <Button variant="outline" onClick={resetFilters}>
                        Reset Filters
                      </Button>
                      <Button onClick={applyFilters}>Apply Filters</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                
                {/* Export Dialog */}
                <Dialog open={exportOpen} onOpenChange={setExportOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-2">
                      <IconDownload className="h-4 w-4" />
                      Export
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Export Transactions</DialogTitle>
                      <DialogDescription>
                        Select columns to include in your export
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="grid gap-4 py-4">
                      <Label>Columns to Export</Label>
                      <div className="grid grid-cols-2 gap-4">
                        {exportColumns.map((column) => (
                          <div key={column.id} className="flex items-center space-x-2">
                            <Checkbox 
                              id={`column-${column.id}`} 
                              checked={column.checked}
                              onCheckedChange={() => handleColumnToggle(column.id)}
                            />
                            <Label htmlFor={`column-${column.id}`}>{column.name}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setExportOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleExport}>Export</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Reference</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Submerchant</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-medium">{transaction.id}</TableCell>
                    <TableCell>{formatDate(transaction.date)}</TableCell>
                    <TableCell>{transaction.customer}</TableCell>
                    <TableCell>
                      {transaction.currency} {transaction.amount.toFixed(2)}
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      {transaction.reference}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(transaction.status) as any}>
                        {transaction.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{transaction.submerchant}</TableCell>
                  </TableRow>
                ))}
                
                {filteredTransactions.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      No transactions found matching your criteria.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          
          <div className="mt-4 text-sm text-muted-foreground">
            Showing {filteredTransactions.length} of {mockTransactions.length} transactions
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 