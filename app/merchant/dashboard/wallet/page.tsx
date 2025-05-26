"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  IconWallet,
  IconArrowsRightLeft,
  IconSend,
  IconDownload,
  IconPlus,
  IconHistory,
  IconReceipt,
  IconAlertCircle,
  IconCalendar,
  IconBuildingBank,
} from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import Link from "next/link";

export default function MerchantWalletPage() {
  const [statementOpen, setStatementOpen] = useState(false);
  const [fundWalletOpen, setFundWalletOpen] = useState(false);
  const [fundingMethodModalOpen, setFundingMethodModalOpen] = useState(false);
  const [selectedFundingMethod, setSelectedFundingMethod] = useState("");
  const [fundAmount, setFundAmount] = useState("");
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerMobile, setCustomerMobile] = useState("");
  const [senderNetwork, setSenderNetwork] = useState("");
  const [momoModalOpen, setMomoModalOpen] = useState(false);
  const [collectionsModalOpen, setCollectionsModalOpen] = useState(false);

  const downloadStatement = () => {
    // In a real application, this would trigger the download
    console.log("Downloading statement from", startDate, "to", endDate);
    setStatementOpen(false);
  };

  const handleFundWallet = () => {
    // In a real application, this would process the payment
    console.log("Funding wallet with amount:", fundAmount);
    setFundWalletOpen(false);
  };

  const handleFundingMethodSelect = (method: string) => {
    setSelectedFundingMethod(method);
    setFundingMethodModalOpen(false);
    
    if (method === "collections") {
      setCollectionsModalOpen(true);
    } else if (method === "momo") {
      setMomoModalOpen(true);
    }
  };

  const handleCollectionsProceed = () => {
    console.log("Proceeding with Collections funding, amount:", fundAmount);
    setCollectionsModalOpen(false);
  };

  const handleMomoProceed = () => {
    console.log("Proceeding with MoMo funding");
    console.log("Customer:", customerName);
    console.log("Email:", customerEmail);
    console.log("Amount:", fundAmount);
    console.log("Mobile:", customerMobile);
    console.log("Network:", senderNetwork);
    setMomoModalOpen(false);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Wallet</h1>
        <p className="text-muted-foreground">
          Manage your merchant wallet, fund, and make transfers
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle>Balance</CardTitle>
            <CardDescription>Current wallet balance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center">
                <IconWallet className="h-8 w-8 text-primary mr-3" />
                <div>
                  <p className="text-muted-foreground text-sm">Available Balance</p>
                  <p className="text-3xl font-bold">GHS 12,500.00</p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {/* Funding Method Selection Dialog */}
                <Dialog open={fundingMethodModalOpen} onOpenChange={setFundingMethodModalOpen}>
                  <DialogTrigger asChild>
                    <Button className="flex items-center">
                      <IconPlus className="h-4 w-4 mr-2" />
                      Fund Wallet
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>BluPay Wallet Funding Form</DialogTitle>
                    </DialogHeader>
                    
                    <div className="py-6">
                      <h2 className="text-xl font-medium text-gray-700 mb-6">How do you wish to fund your wallet?</h2>
                      <Select onValueChange={handleFundingMethodSelect}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select funding method" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="collections">Collections</SelectItem>
                          <SelectItem value="momo">MoMo</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setFundingMethodModalOpen(false)} className="bg-red-500 hover:bg-red-600 text-white">
                        Cancel
                      </Button>
                      <Button className="bg-blue-500 hover:bg-blue-600" disabled={true}>
                        Next
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                
                {/* Collections Modal */}
                <Dialog open={collectionsModalOpen} onOpenChange={setCollectionsModalOpen}>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Fund Wallet</DialogTitle>
                      <DialogDescription>
                        You can transfer into your wallet to make a payout. You cannot transfer in more than your daily inflow.
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="amount">Enter amount</Label>
                        <Input
                          id="amount"
                          type="number"
                          placeholder="Enter amount"
                          value={fundAmount}
                          onChange={(e) => setFundAmount(e.target.value)}
                        />
                        <p className="text-sm text-red-500">*Max amount (0 GHS)</p>
                      </div>
                    </div>
                    
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setCollectionsModalOpen(false)} className="bg-red-500 hover:bg-red-600 text-white">
                        Cancel
                      </Button>
                      <Button 
                        onClick={handleCollectionsProceed}
                        disabled={!fundAmount || parseFloat(fundAmount) <= 0}
                        className="bg-blue-500 hover:bg-blue-600"
                      >
                        Proceed
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                
                {/* MoMo Modal */}
                <Dialog open={momoModalOpen} onOpenChange={setMomoModalOpen}>
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle className="text-xl">BluPay Wallet Funding Form</DialogTitle>
                    </DialogHeader>
                    
                    <div className="grid gap-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="customer-name">Customer Name:</Label>
                        <Input 
                          id="customer-name" 
                          placeholder="e.g. Banco Limited"
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="customer-email">Customer Email:</Label>
                        <Input 
                          id="customer-email" 
                          type="email"
                          placeholder="e.g. example@company.com"
                          value={customerEmail}
                          onChange={(e) => setCustomerEmail(e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="amount">Amount:</Label>
                        <Input 
                          id="amount" 
                          type="number"
                          placeholder="Enter amount"
                          value={fundAmount}
                          onChange={(e) => setFundAmount(e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="customer-mobile">Customer Mobile Number:</Label>
                        <Input 
                          id="customer-mobile" 
                          placeholder="e.g. +233 XX XXX XXXX"
                          value={customerMobile}
                          onChange={(e) => setCustomerMobile(e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="sender-network">Sender's Mobile Network:</Label>
                        <Select onValueChange={setSenderNetwork} value={senderNetwork}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select network" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="mtn">MTN</SelectItem>
                            <SelectItem value="vodafone">Vodafone</SelectItem>
                            <SelectItem value="airtel">Airtel</SelectItem>
                            <SelectItem value="tigo">Tigo</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setMomoModalOpen(false)} className="bg-red-500 hover:bg-red-600 text-white">
                        Cancel
                      </Button>
                      <Button onClick={handleMomoProceed} className="bg-blue-500 hover:bg-blue-600">
                        Fund Wallet
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                
                <Button variant="outline" className="flex items-center">
                  <IconSend className="h-4 w-4 mr-2" />
                  Transfer
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common wallet operations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Link href="/merchant/dashboard/transactions">
                <Button variant="outline" className="w-full justify-start">
                  <IconArrowsRightLeft className="h-4 w-4 mr-2" />
                  Transaction History
                </Button>
              </Link>
              
              {/* Statement Download Dialog */}
              <Dialog open={statementOpen} onOpenChange={setStatementOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full justify-start">
                    <IconReceipt className="h-4 w-4 mr-2" />
                    Download Statement
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Download Statement</DialogTitle>
                    <DialogDescription>
                      Select a date range for your account statement
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label>Start Date</Label>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          className={`w-full justify-start text-left font-normal ${!startDate ? 'text-muted-foreground' : ''}`}
                          type="button"
                          onClick={() => {
                            const datePickerElement = document.getElementById('statement-start-date');
                            if (datePickerElement) {
                              datePickerElement.click();
                            }
                          }}
                        >
                          <IconCalendar className="mr-2 h-4 w-4" />
                          {startDate ? format(startDate, 'PPP') : "Select start date"}
                        </Button>
                        <div className="hidden">
                          <Calendar
                            id="statement-start-date"
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
                            const datePickerElement = document.getElementById('statement-end-date');
                            if (datePickerElement) {
                              datePickerElement.click();
                            }
                          }}
                        >
                          <IconCalendar className="mr-2 h-4 w-4" />
                          {endDate ? format(endDate, 'PPP') : "Select end date"}
                        </Button>
                        <div className="hidden">
                          <Calendar
                            id="statement-end-date"
                            mode="single"
                            selected={endDate}
                            onSelect={setEndDate}
                            initialFocus
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setStatementOpen(false)}>
                      Cancel
                    </Button>
                    <Button 
                      onClick={downloadStatement}
                      disabled={!startDate || !endDate}
                    >
                      Download
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              
              <Link href="/merchant/dashboard/transfers">
                <Button variant="outline" className="w-full justify-start">
                  <IconHistory className="h-4 w-4 mr-2" />
                  Transfer History
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="history" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-3 mb-6">
          <TabsTrigger value="history" className="flex items-center">
            <IconHistory className="h-4 w-4 mr-2" />
            Transactions
          </TabsTrigger>
          <TabsTrigger value="pending" className="flex items-center">
            <IconAlertCircle className="h-4 w-4 mr-2" />
            Pending
          </TabsTrigger>
          <TabsTrigger value="settlement" className="flex items-center">
            <IconBuildingBank className="h-4 w-4 mr-2" />
            Settlement
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Transaction History</CardTitle>
                  <CardDescription>
                    Recent wallet transactions
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <IconDownload className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-4">
                  <div className="flex items-center space-x-4">
                    <div className="bg-green-100 p-2 rounded-full">
                      <IconDownload className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">Wallet Funding</p>
                      <p className="text-sm text-muted-foreground">Yesterday, 14:30</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-green-600">+GHS 5,000.00</p>
                    <Badge variant="outline">Completed</Badge>
                  </div>
                </div>
                
                <div className="flex items-center justify-between border-b pb-4">
                  <div className="flex items-center space-x-4">
                    <div className="bg-red-100 p-2 rounded-full">
                      <IconSend className="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                      <p className="font-medium">Transfer to Bank</p>
                      <p className="text-sm text-muted-foreground">Oct 15, 2023</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-red-600">-GHS 2,500.00</p>
                    <Badge variant="outline">Completed</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="pending" className="space-y-4">
          <Alert>
            <IconAlertCircle className="h-4 w-4" />
            <AlertDescription>
              You have no pending transactions
            </AlertDescription>
          </Alert>
        </TabsContent>
        
        <TabsContent value="settlement" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Settlement Details</CardTitle>
                  <CardDescription>
                    Your account settlement information
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <IconPlus className="h-4 w-4 mr-2" />
                  Add Account
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-4">
                  <div className="flex items-center space-x-4">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <IconBuildingBank className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">First Bank</p>
                      <p className="text-sm text-muted-foreground">Primary Settlement Account</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">••••••••1234</p>
                    <Badge variant="outline">Active</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 