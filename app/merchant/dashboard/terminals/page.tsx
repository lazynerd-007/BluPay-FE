"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { IconPlus, IconDeviceMobile, IconQrcode } from "@tabler/icons-react";

// Mock terminals data
const mockTerminals = [
  {
    id: "TRM-001",
    name: "POS Terminal 1",
    type: "Physical",
    serialNumber: "BLU87654321",
    status: "active",
    lastActive: "2023-10-30T15:40:22",
  },
  {
    id: "TRM-002",
    name: "Mobile Terminal",
    type: "Virtual",
    serialNumber: "VRT12345678",
    status: "active",
    lastActive: "2023-11-01T09:15:43",
  },
  {
    id: "TRM-003",
    name: "Checkout Counter 3",
    type: "Physical",
    serialNumber: "BLU98765432",
    status: "inactive",
    lastActive: "2023-09-22T11:30:15",
  },
];

export default function MerchantTerminalsPage() {
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
      case "active":
        return "success";
      case "inactive":
        return "secondary";
      default:
        return "secondary";
    }
  };
  
  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Terminal Devices</h1>
        <p className="text-muted-foreground">
          Manage your payment terminals and devices
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Terminals</CardDescription>
            <CardTitle className="text-2xl">{mockTerminals.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Active and inactive terminals
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Active Terminals</CardDescription>
            <CardTitle className="text-2xl">
              {mockTerminals.filter(t => t.status === "active").length}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Currently active devices
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Inactive</CardDescription>
            <CardTitle className="text-2xl">
              {mockTerminals.filter(t => t.status === "inactive").length}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Disabled or inactive terminals
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Your Terminals</CardTitle>
              <CardDescription>Manage your terminal devices</CardDescription>
            </div>
            
            <div className="flex gap-2">
              <Button className="flex items-center gap-2">
                <IconPlus className="h-4 w-4" />
                Add New Device
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Terminal ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Serial Number</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Active</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockTerminals.map((terminal) => (
                  <TableRow key={terminal.id}>
                    <TableCell className="font-medium">{terminal.id}</TableCell>
                    <TableCell>{terminal.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <IconDeviceMobile className="h-4 w-4 text-muted-foreground" />
                        {terminal.type}
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      {terminal.serialNumber}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(terminal.status) as any}>
                        {terminal.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(terminal.lastActive)}</TableCell>
                  </TableRow>
                ))}
                
                {mockTerminals.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No terminals found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
