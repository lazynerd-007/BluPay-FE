"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  IconDownload, 
  IconCalendar, 
  IconFilter, 
  IconFileAnalytics, 
  IconCash, 
  IconReportMoney, 
  IconTrendingUp, 
  IconBuildingBank, 
  IconBuildingStore,
  IconAdjustments,
  IconTable,
  IconFileSpreadsheet,
  IconSquareCheck,
  IconChevronDown
} from "@tabler/icons-react";
import { useCurrency } from "@/lib/currency-context";

// Mock data for financial reports
const financialData = [
  {
    id: 1,
    date: "2025-05-20",
    transactionType: "Collection",
    partnerBank: "Ghana Commercial Bank",
    merchant: "Chensha City Ghana Ltd",
    totalAmount: "15,230.00",
    commission: "304.60",
    partnerShare: "152.30",
    merchantShare: "76.15",
    systemShare: "76.15",
    transactionCount: 42,
    status: "Settled"
  },
  {
    id: 2,
    date: "2025-05-19",
    transactionType: "Payout",
    partnerBank: "Ecobank Ghana",
    merchant: "Timings Ltd",
    totalAmount: "8,750.00",
    commission: "175.00",
    partnerShare: "87.50",
    merchantShare: "43.75",
    systemShare: "43.75",
    transactionCount: 23,
    status: "Settled"
  },
  {
    id: 3,
    date: "2025-05-18",
    transactionType: "Collection",
    partnerBank: "Stanbic Bank Ghana",
    merchant: "BluWave Limited",
    totalAmount: "22,450.00",
    commission: "449.00",
    partnerShare: "224.50",
    merchantShare: "112.25",
    systemShare: "112.25",
    transactionCount: 56,
    status: "Pending"
  },
  {
    id: 4,
    date: "2025-05-17",
    transactionType: "Collection",
    partnerBank: "Zenith Bank Ghana",
    merchant: "Blu Penguin",
    totalAmount: "5,600.00",
    commission: "112.00",
    partnerShare: "56.00",
    merchantShare: "28.00",
    systemShare: "28.00",
    transactionCount: 18,
    status: "Settled"
  },
  {
    id: 5,
    date: "2025-05-16",
    transactionType: "Payout",
    partnerBank: "Standard Chartered Bank Ghana",
    merchant: "Chensha City Ghana Ltd",
    totalAmount: "12,350.00",
    commission: "247.00",
    partnerShare: "123.50",
    merchantShare: "61.75",
    systemShare: "61.75",
    transactionCount: 35,
    status: "Pending"
  },
  {
    id: 6,
    date: "2025-05-15",
    transactionType: "Collection",
    partnerBank: "Ghana Commercial Bank",
    merchant: "BluWave Limited",
    totalAmount: "18,920.00",
    commission: "378.40",
    partnerShare: "189.20",
    merchantShare: "94.60",
    systemShare: "94.60",
    transactionCount: 47,
    status: "Settled"
  },
  {
    id: 7,
    date: "2025-05-14",
    transactionType: "Payout",
    partnerBank: "Ecobank Ghana",
    merchant: "Timings Ltd",
    totalAmount: "9,480.00",
    commission: "189.60",
    partnerShare: "94.80",
    merchantShare: "47.40",
    systemShare: "47.40",
    transactionCount: 28,
    status: "Settled"
  },
  {
    id: 8,
    date: "2025-05-13",
    transactionType: "Collection",
    partnerBank: "Stanbic Bank Ghana",
    merchant: "Blu Penguin",
    totalAmount: "7,850.00",
    commission: "157.00",
    partnerShare: "78.50",
    merchantShare: "39.25",
    systemShare: "39.25",
    transactionCount: 22,
    status: "Pending"
  }
];

// Ghana banks for dropdown
const ghanaBanks = [
  { id: "all", name: "-- All --" },
  { id: "gcb", name: "Ghana Commercial Bank (GCB)" },
  { id: "ecobank", name: "Ecobank Ghana" },
  { id: "stanbic", name: "Stanbic Bank Ghana" },
  { id: "zenith", name: "Zenith Bank Ghana" },
  { id: "scb", name: "Standard Chartered Bank Ghana" },
];

// Merchants for dropdown
const merchants = [
  { id: "all", name: "-- All --" },
  { id: "bluwave", name: "BluWave Limited", parent: true },
  { id: "blupenguin", name: "Blu Penguin", parent: true },
  { id: "chensha", name: "Chensha City Ghana Ltd", parent: false, parentId: "bluwave" },
  { id: "timings", name: "Timings Ltd", parent: false, parentId: "blupenguin" },
  { id: "digitalplus", name: "Digital Plus", parent: false, parentId: "bluwave" },
  { id: "futuretech", name: "Future Tech Ghana", parent: false, parentId: "blupenguin" },
  { id: "quickserve", name: "QuickServe Ltd", parent: false, parentId: "bluwave" },
  { id: "payexpress", name: "PayExpress Ghana", parent: false, parentId: "blupenguin" },
];

// Report Types
const reportTypes = [
  { id: "daily", name: "Daily Summary" },
  { id: "weekly", name: "Weekly Summary" },
  { id: "monthly", name: "Monthly Summary" },
  { id: "quarterly", name: "Quarterly Summary" },
  { id: "yearly", name: "Yearly Summary" },
  { id: "custom", name: "Custom Period" },
];

// Available columns for export customization
const availableColumns = [
  { id: "date", label: "Date", checked: true },
  { id: "transactionType", label: "Transaction Type", checked: true },
  { id: "partnerBank", label: "Partner Bank", checked: true },
  { id: "merchant", label: "Merchant", checked: true },
  { id: "totalAmount", label: "Total Amount", checked: true },
  { id: "commission", label: "Commission", checked: true },
  { id: "partnerShare", label: "Partner Share", checked: true },
  { id: "merchantShare", label: "Merchant Share", checked: true },
  { id: "systemShare", label: "System Share", checked: true },
  { id: "transactionCount", label: "Transaction Count", checked: true },
  { id: "status", label: "Status", checked: true },
  { id: "averageValue", label: "Average Transaction Value", checked: false },
  { id: "highestValue", label: "Highest Transaction Value", checked: false },
  { id: "lowestValue", label: "Lowest Transaction Value", checked: false },
  { id: "failureRate", label: "Failure Rate", checked: false },
  { id: "settlementTime", label: "Settlement Time", checked: false },
];

export default function FinancialReportsPage() {
  const { currency } = useCurrency();
  const [reportType, setReportType] = useState("daily");
  const [reportPeriod, setReportPeriod] = useState("thisMonth");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedBank, setSelectedBank] = useState("all");
  const [selectedMerchant, setSelectedMerchant] = useState("all");
  const [selectedSubMerchant, setSelectedSubMerchant] = useState("all");
  const [merchantSearchTerm, setMerchantSearchTerm] = useState("");
  const [transactionType, setTransactionType] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [exportColumns, setExportColumns] = useState(availableColumns);
  const [exportFormat, setExportFormat] = useState("csv");
  const [merchantToExport, setMerchantToExport] = useState<string | null>(null);
  const [transactionTypeToExport, setTransactionTypeToExport] = useState<string | null>(null);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [exportType, setExportType] = useState<"collection" | "payout" | "all">("all");

  // Toggle column selection for export
  const toggleExportColumn = (id: string) => {
    setExportColumns(
      exportColumns.map(col => 
        col.id === id ? { ...col, checked: !col.checked } : col
      )
    );
  };

  // Select all columns
  const selectAllColumns = () => {
    setExportColumns(exportColumns.map(col => ({ ...col, checked: true })));
  };

  // Deselect all columns
  const deselectAllColumns = () => {
    setExportColumns(exportColumns.map(col => ({ ...col, checked: false })));
  };

  // Handle export with selected columns
  const handleExport = () => {
    const selectedColumns = exportColumns.filter(col => col.checked).map(col => col.id);
    console.log(`Exporting in ${exportFormat} format with columns:`, selectedColumns);
    
    // In a real application, this would make an API call to generate the export file
    // For demo purposes, we'll just show a toast or alert
    alert(`Export initiated in ${exportFormat.toUpperCase()} format with ${selectedColumns.length} columns`);
  };

  // Export specific transaction type data (collection or payout)
  const handleExportTransactionType = (type: "collection" | "payout" | "all") => {
    const typeLabel = type === "all" ? "All Transactions" : type === "collection" ? "Collections" : "Payouts";
    
    const filteredForExport = financialData.filter(item => {
      return type === "all" || item.transactionType.toLowerCase() === type.toLowerCase();
    });
    
    const selectedColumns = exportColumns.filter(col => col.checked).map(col => col.id);
    
    console.log(`Exporting ${typeLabel} in ${exportFormat} format with columns:`, selectedColumns);
    console.log('Data to export:', filteredForExport);
    
    // In a real application, this would make an API call to generate the export file
    alert(`Export initiated: ${typeLabel} in ${exportFormat.toUpperCase()} format with ${selectedColumns.length} columns`);
  };

  // Export settlement data
  const handleExportSettlement = () => {
    const bank = ghanaBanks.find(b => b.id === selectedBank)?.name.replace("-- All --", "All Banks") || "All Banks";
    const merchant = merchants.find(m => m.id === selectedMerchant)?.name.replace("-- All --", "All Merchants") || "All Merchants";
    const dateRange = startDate && endDate 
      ? `from ${new Date(startDate).toLocaleDateString()} to ${new Date(endDate).toLocaleDateString()}`
      : "all dates";
    
    const filteredForExport = financialData.filter(item => {
      const matchesBank = selectedBank === "all" || 
        item.partnerBank.includes(ghanaBanks.find(bank => bank.id === selectedBank)?.name.replace("-- All --", "") || "");
      
      const matchesMerchant = selectedMerchant === "all" || 
        item.merchant.includes(merchants.find(m => m.id === selectedMerchant)?.name.replace("-- All --", "") || "");
      
      const matchesType = transactionType === "all" || 
        item.transactionType.toLowerCase() === transactionType.toLowerCase();
      
      return matchesBank && matchesMerchant && matchesType;
    });
    
    const selectedColumns = exportColumns.filter(col => col.checked).map(col => col.id);
    
    console.log(`Exporting Settlement Report for ${bank}, ${merchant}, ${dateRange} in ${exportFormat} format`);
    console.log('Data to export:', filteredForExport);
    
    // In a real application, this would make an API call to generate the export file
    alert(`Export initiated: Settlement Report for ${bank}, ${merchant}, ${dateRange} in ${exportFormat.toUpperCase()} format`);
  };

  // Status badge variant mapper
  const getStatusVariant = (status: string) => {
    const statusMap: Record<string, string> = {
      "Settled": "success",
      "Pending": "warning",
      "Failed": "destructive"
    };
    
    return statusMap[status] || "secondary";
  };

  // Filter merchants for dropdown search
  const filteredMerchants = useMemo(() => {
    return merchants.filter(merchant => 
      merchantSearchTerm === "" || 
      merchant.name.toLowerCase().includes(merchantSearchTerm.toLowerCase())
    );
  }, [merchantSearchTerm]);

  // Get available submerchants based on selected parent merchant
  const availableSubMerchants = useMemo(() => {
    if (selectedMerchant === "all") {
      return merchants.filter(m => !m.parent);
    }
    return merchants.filter(m => !m.parent && m.parentId === selectedMerchant);
  }, [selectedMerchant]);

  // Export specific merchant's transactions
  const handleExportMerchantTransactions = (merchantId: string, type: string) => {
    const merchant = merchants.find(m => m.id === merchantId);
    const txType = type === "all" ? "all transactions" : type;
    
    const filteredForExport = financialData.filter(item => {
      const matchesMerchant = merchantId === "all" || 
        item.merchant.includes(merchant?.name || "");
      
      const matchesType = type === "all" || 
        item.transactionType.toLowerCase() === type.toLowerCase();
      
      return matchesMerchant && matchesType;
    });
    
    const selectedColumns = exportColumns.filter(col => col.checked).map(col => col.id);
    
    console.log(`Exporting ${txType} for ${merchant?.name || 'All Merchants'} in ${exportFormat} format with columns:`, selectedColumns);
    console.log('Data to export:', filteredForExport);
    
    // In a real application, this would make an API call to generate the export file
    alert(`Export initiated: ${txType} for ${merchant?.name || 'All Merchants'} in ${exportFormat.toUpperCase()} format with ${selectedColumns.length} columns`);
  };

  // Filter data based on search and filters
  const filteredData = useMemo(() => {
    return financialData.filter(item => {
      const matchesSearch = 
        searchTerm === "" || 
        item.merchant.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.partnerBank.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.transactionType.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesBank = selectedBank === "all" || 
        item.partnerBank.includes(ghanaBanks.find(bank => bank.id === selectedBank)?.name.replace("-- All --", "") || "");
      
      const matchesMerchant = selectedMerchant === "all" || 
        item.merchant.includes(merchants.find(m => m.id === selectedMerchant)?.name.replace("-- All --", "") || "");
      
      const matchesSubMerchant = selectedSubMerchant === "all" || 
        item.merchant.includes(merchants.find(m => m.id === selectedSubMerchant)?.name.replace("-- All --", "") || "");
      
      const matchesType = transactionType === "all" || 
        item.transactionType.toLowerCase() === transactionType.toLowerCase();
      
      return matchesSearch && matchesBank && matchesMerchant && matchesSubMerchant && matchesType;
    });
  }, [searchTerm, selectedBank, selectedMerchant, selectedSubMerchant, transactionType, financialData]);

  // Calculate summary statistics
  const summaryStats = useMemo(() => {
    const totalTransactions = filteredData.reduce((sum, item) => sum + item.transactionCount, 0);
    const totalAmount = filteredData.reduce((sum, item) => sum + parseFloat(item.totalAmount.replace(/,/g, '')), 0);
    const totalCommission = filteredData.reduce((sum, item) => sum + parseFloat(item.commission.replace(/,/g, '')), 0);
    const totalPartnerShare = filteredData.reduce((sum, item) => sum + parseFloat(item.partnerShare.replace(/,/g, '')), 0);
    const totalMerchantShare = filteredData.reduce((sum, item) => sum + parseFloat(item.merchantShare.replace(/,/g, '')), 0);
    const totalSystemShare = filteredData.reduce((sum, item) => sum + parseFloat(item.systemShare.replace(/,/g, '')), 0);
    
    return {
      totalTransactions,
      totalAmount: totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      totalCommission: totalCommission.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      totalPartnerShare: totalPartnerShare.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      totalMerchantShare: totalMerchantShare.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      totalSystemShare: totalSystemShare.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
    };
  }, [filteredData]);
  
  return (
    <div className="px-4 lg:px-6 space-y-6">
      <div className="flex flex-col space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Financial Reports</h2>
        <p className="text-muted-foreground">
          View and analyze financial reports and commission distributions
        </p>
      </div>
      
      <Tabs defaultValue="summary" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="summary">Summary Reports</TabsTrigger>
          <TabsTrigger value="detailed">Detailed Reports</TabsTrigger>
          <TabsTrigger value="commission">Commission Reports</TabsTrigger>
          <TabsTrigger value="settlement">Settlement Reports</TabsTrigger>
        </TabsList>
        
        <TabsContent value="summary" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Filter Financial Reports</CardTitle>
              <CardDescription>
                Refine your financial reports with the filters below.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Report Type</label>
                  <Select value={reportType} onValueChange={setReportType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Report Type" />
                    </SelectTrigger>
                    <SelectContent>
                      {reportTypes.map((type) => (
                        <SelectItem key={type.id} value={type.id}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Partner Bank</label>
                  <Select value={selectedBank} onValueChange={setSelectedBank}>
                    <SelectTrigger>
                      <SelectValue placeholder="-- All --" />
                    </SelectTrigger>
                    <SelectContent>
                      {ghanaBanks.map((bank) => (
                        <SelectItem key={bank.id} value={bank.id}>
                          {bank.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Merchant</label>
                  <Select value={selectedMerchant} onValueChange={setSelectedMerchant}>
                    <SelectTrigger>
                      <SelectValue placeholder="-- All --" />
                    </SelectTrigger>
                    <SelectContent>
                      <div className="p-2">
                        <Input
                          placeholder="Search merchants..."
                          value={merchantSearchTerm}
                          onChange={(e) => setMerchantSearchTerm(e.target.value)}
                          className="mb-2"
                        />
                      </div>
                      <SelectItem value="all">-- All --</SelectItem>
                      {filteredMerchants
                        .filter(m => m.parent)
                        .map((merchant) => (
                          <SelectItem key={merchant.id} value={merchant.id}>
                            {merchant.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Sub Merchant</label>
                  <Select value={selectedSubMerchant} onValueChange={setSelectedSubMerchant}>
                    <SelectTrigger>
                      <SelectValue placeholder="-- All --" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">-- All --</SelectItem>
                      {availableSubMerchants.map((merchant) => (
                        <SelectItem key={merchant.id} value={merchant.id}>
                          {merchant.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Date Range</label>
                  <div className="flex gap-2">
                    <Input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-1/2"
                    />
                    <Input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-1/2"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Transaction Type</label>
                  <Select value={transactionType} onValueChange={setTransactionType}>
                    <SelectTrigger>
                      <SelectValue placeholder="-- All --" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">-- All --</SelectItem>
                      <SelectItem value="collection">Collection</SelectItem>
                      <SelectItem value="payout">Payout</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 lg:col-span-6 flex justify-end">
                  <div className="flex space-x-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="flex items-center gap-1">
                          <IconDownload className="h-4 w-4" />
                          <span>Export Report</span>
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Export Financial Report</DialogTitle>
                          <DialogDescription>
                            Select format and customize columns for export
                          </DialogDescription>
                        </DialogHeader>
                        
                        <div className="grid gap-4 py-4">
                          <div className="space-y-2">
                            <Label>Transaction Type</Label>
                            <Select value={exportType} onValueChange={(value) => setExportType(value as any)}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select transaction type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="all">All Transactions</SelectItem>
                                <SelectItem value="collection">Collections Only</SelectItem>
                                <SelectItem value="payout">Payouts Only</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="space-y-2">
                            <Label>Export Format</Label>
                            <Select value={exportFormat} onValueChange={setExportFormat}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select format" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="csv">CSV</SelectItem>
                                <SelectItem value="excel">Excel</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <Label>Columns to Export</Label>
                              <div className="flex gap-2">
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={selectAllColumns}
                                >
                                  Select All
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={deselectAllColumns}
                                >
                                  Clear All
                                </Button>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto border rounded-md p-2">
                              {exportColumns.map((column) => (
                                <div key={column.id} className="flex items-center space-x-2">
                                  <Checkbox 
                                    id={`col-${column.id}`} 
                                    checked={column.checked} 
                                    onCheckedChange={() => toggleExportColumn(column.id)}
                                  />
                                  <Label htmlFor={`col-${column.id}`}>{column.label}</Label>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                        
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setShowExportDialog(false)}>Cancel</Button>
                          <Button onClick={() => handleExportTransactionType(exportType)}>
                            Export Report
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="flex items-center gap-1">
                          <IconFileSpreadsheet className="h-4 w-4" />
                          <span>Quick Export</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Export Options</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleExportTransactionType("collection")}>
                          <IconDownload className="h-4 w-4 mr-2" />
                          Export Collections
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleExportTransactionType("payout")}>
                          <IconDownload className="h-4 w-4 mr-2" />
                          Export Payouts
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => setExportFormat("csv")}>
                          <IconSquareCheck className={`h-4 w-4 mr-2 ${exportFormat === "csv" ? "opacity-100" : "opacity-0"}`} />
                          CSV Format
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setExportFormat("excel")}>
                          <IconSquareCheck className={`h-4 w-4 mr-2 ${exportFormat === "excel" ? "opacity-100" : "opacity-0"}`} />
                          Excel Format
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
              
              <div className="mt-4">
                <Input
                  placeholder="Search by merchant, bank, or transaction type..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm"
                />
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">
                  Total Transaction Value
                </CardTitle>
                <IconCash className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{currency} {summaryStats.totalAmount}</div>
                <p className="text-xs text-muted-foreground">
                  {summaryStats.totalTransactions} transactions
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">
                  Total Commission
                </CardTitle>
                <IconReportMoney className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{currency} {summaryStats.totalCommission}</div>
                <p className="text-xs text-muted-foreground">
                  Across all transactions
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">
                  System Revenue
                </CardTitle>
                <IconTrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{currency} {summaryStats.totalSystemShare}</div>
                <p className="text-xs text-muted-foreground">
                  From commissions
                </p>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Financial Summary</CardTitle>
                  <CardDescription>
                    Overview of financial performance across all channels
                  </CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex items-center gap-1"
                    onClick={() => handleExportTransactionType("collection")}
                  >
                    <IconDownload className="h-4 w-4" />
                    <span>Export Collections</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex items-center gap-1"
                    onClick={() => handleExportTransactionType("payout")}
                  >
                    <IconDownload className="h-4 w-4" />
                    <span>Export Payouts</span>
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Transaction Type</TableHead>
                    <TableHead>Partner Bank</TableHead>
                    <TableHead>Merchant</TableHead>
                    <TableHead className="text-right">Total Amount</TableHead>
                    <TableHead className="text-right">Commission</TableHead>
                    <TableHead className="text-right">Partner Share</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{new Date(item.date).toLocaleDateString()}</TableCell>
                      <TableCell>{item.transactionType}</TableCell>
                      <TableCell>{item.partnerBank}</TableCell>
                      <TableCell>{item.merchant}</TableCell>
                      <TableCell className="text-right">{currency} {item.totalAmount}</TableCell>
                      <TableCell className="text-right">{currency} {item.commission}</TableCell>
                      <TableCell className="text-right">{currency} {item.partnerShare}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusVariant(item.status) as any}>
                          {item.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="detailed" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Detailed Financial Report</CardTitle>
              <CardDescription>
                Complete breakdown of all financial transactions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Transaction Type</TableHead>
                    <TableHead>Partner Bank</TableHead>
                    <TableHead>Merchant</TableHead>
                    <TableHead className="text-right">Total Amount</TableHead>
                    <TableHead className="text-right">Commission</TableHead>
                    <TableHead className="text-right">Partner Share</TableHead>
                    <TableHead className="text-right">Merchant Share</TableHead>
                    <TableHead className="text-right">System Share</TableHead>
                    <TableHead className="text-center">Transaction Count</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{new Date(item.date).toLocaleDateString()}</TableCell>
                      <TableCell>{item.transactionType}</TableCell>
                      <TableCell>{item.partnerBank}</TableCell>
                      <TableCell>{item.merchant}</TableCell>
                      <TableCell className="text-right">{currency} {item.totalAmount}</TableCell>
                      <TableCell className="text-right">{currency} {item.commission}</TableCell>
                      <TableCell className="text-right">{currency} {item.partnerShare}</TableCell>
                      <TableCell className="text-right">{currency} {item.merchantShare}</TableCell>
                      <TableCell className="text-right">{currency} {item.systemShare}</TableCell>
                      <TableCell className="text-center">{item.transactionCount}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusVariant(item.status) as any}>
                          {item.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="commission" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Commission Distribution Report</CardTitle>
              <CardDescription>
                Detailed breakdown of commission distribution between parties
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Total Partner Share</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{currency} {summaryStats.totalPartnerShare}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Total Merchant Share</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{currency} {summaryStats.totalMerchantShare}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Total System Share</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{currency} {summaryStats.totalSystemShare}</div>
                  </CardContent>
                </Card>
              </div>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Partner Bank</TableHead>
                    <TableHead>Merchant</TableHead>
                    <TableHead className="text-right">Total Amount</TableHead>
                    <TableHead className="text-right">Commission</TableHead>
                    <TableHead className="text-right">Partner Share</TableHead>
                    <TableHead className="text-right">Merchant Share</TableHead>
                    <TableHead className="text-right">System Share</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{new Date(item.date).toLocaleDateString()}</TableCell>
                      <TableCell>{item.partnerBank}</TableCell>
                      <TableCell>{item.merchant}</TableCell>
                      <TableCell className="text-right">{currency} {item.totalAmount}</TableCell>
                      <TableCell className="text-right">{currency} {item.commission}</TableCell>
                      <TableCell className="text-right">{currency} {item.partnerShare}</TableCell>
                      <TableCell className="text-right">{currency} {item.merchantShare}</TableCell>
                      <TableCell className="text-right">{currency} {item.systemShare}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settlement" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Settlement Status Report</CardTitle>
                  <CardDescription>
                    Status of settlements across all transactions
                  </CardDescription>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="flex items-center gap-1"
                    >
                      <IconDownload className="h-4 w-4" />
                      <span>Download Settlement File</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Download Settlement Report</DialogTitle>
                      <DialogDescription>
                        Select filters and format for the settlement report
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="grid gap-4 py-4">
                      <div className="space-y-2">
                        <Label>Partner Bank</Label>
                        <Select value={selectedBank} onValueChange={setSelectedBank}>
                          <SelectTrigger>
                            <SelectValue placeholder="-- All --" />
                          </SelectTrigger>
                          <SelectContent>
                            {ghanaBanks.map((bank) => (
                              <SelectItem key={bank.id} value={bank.id}>
                                {bank.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Merchant</Label>
                        <Select value={selectedMerchant} onValueChange={setSelectedMerchant}>
                          <SelectTrigger>
                            <SelectValue placeholder="-- All --" />
                          </SelectTrigger>
                          <SelectContent>
                            <div className="p-2">
                              <Input
                                placeholder="Search merchants..."
                                value={merchantSearchTerm}
                                onChange={(e) => setMerchantSearchTerm(e.target.value)}
                                className="mb-2"
                              />
                            </div>
                            <SelectItem value="all">-- All --</SelectItem>
                            {filteredMerchants
                              .filter(m => m.parent)
                              .map((merchant) => (
                                <SelectItem key={merchant.id} value={merchant.id}>
                                  {merchant.name}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Date Range</Label>
                        <div className="flex gap-2">
                          <Input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-1/2"
                          />
                          <Input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="w-1/2"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Export Format</Label>
                        <Select value={exportFormat} onValueChange={setExportFormat}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select format" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="csv">CSV</SelectItem>
                            <SelectItem value="excel">Excel</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Settlement Status</Label>
                        <Select defaultValue="all">
                          <SelectTrigger>
                            <SelectValue placeholder="-- All --" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">-- All --</SelectItem>
                            <SelectItem value="settled">Settled</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <DialogFooter>
                      <Button variant="outline">Cancel</Button>
                      <Button onClick={handleExportSettlement}>
                        Download Settlement File
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Settled Transactions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {filteredData.filter(item => item.status === "Settled").length}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {((filteredData.filter(item => item.status === "Settled").length / filteredData.length) * 100).toFixed(1)}% of total
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Pending Settlements</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {filteredData.filter(item => item.status === "Pending").length}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {((filteredData.filter(item => item.status === "Pending").length / filteredData.length) * 100).toFixed(1)}% of total
                    </p>
                  </CardContent>
                </Card>
              </div>
              
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Settlement Transactions</h3>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex items-center gap-1"
                    onClick={() => handleExportTransactionType("collection")}
                  >
                    <IconDownload className="h-4 w-4" />
                    <span>Export Collections</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex items-center gap-1"
                    onClick={() => handleExportTransactionType("payout")}
                  >
                    <IconDownload className="h-4 w-4" />
                    <span>Export Payouts</span>
                  </Button>
                </div>
              </div>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Transaction Type</TableHead>
                    <TableHead>Partner Bank</TableHead>
                    <TableHead>Merchant</TableHead>
                    <TableHead className="text-right">Total Amount</TableHead>
                    <TableHead className="text-center">Transaction Count</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{new Date(item.date).toLocaleDateString()}</TableCell>
                      <TableCell>{item.transactionType}</TableCell>
                      <TableCell>{item.partnerBank}</TableCell>
                      <TableCell>{item.merchant}</TableCell>
                      <TableCell className="text-right">{currency} {item.totalAmount}</TableCell>
                      <TableCell className="text-center">{item.transactionCount}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusVariant(item.status) as any}>
                          {item.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 