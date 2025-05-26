"use client";

import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IconQrcode, IconReceipt, IconPlus } from "@tabler/icons-react";

export default function MerchantPaymentsPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Payments</h1>
        <p className="text-muted-foreground">
          Manage payment links and QR codes
        </p>
      </div>

      <Tabs defaultValue="payment-links" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2 mb-6">
          <TabsTrigger value="payment-links">
            <IconReceipt className="h-4 w-4 mr-2" />
            Payment Links
          </TabsTrigger>
          <TabsTrigger value="qr-codes">
            <IconQrcode className="h-4 w-4 mr-2" />
            QR Codes
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="payment-links" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Your Payment Links</h2>
            <Button size="sm">
              <IconPlus className="h-4 w-4 mr-2" />
              Create New Link
            </Button>
          </div>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>No Payment Links</CardTitle>
              <CardDescription>
                You haven't created any payment links yet
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Create a payment link to share with your customers for one-time or recurring payments.
              </p>
              <Button variant="outline" className="mt-4">
                <IconPlus className="h-4 w-4 mr-2" />
                Create Payment Link
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="qr-codes" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Your QR Codes</h2>
            <Button size="sm">
              <IconPlus className="h-4 w-4 mr-2" />
              Generate QR Code
            </Button>
          </div>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>No QR Codes</CardTitle>
              <CardDescription>
                You haven't generated any QR codes yet
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Generate a QR code for in-person payments. Your customers can scan the code to complete payment.
              </p>
              <Button variant="outline" className="mt-4">
                <IconPlus className="h-4 w-4 mr-2" />
                Generate QR Code
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 