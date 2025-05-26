"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
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
  IconWallet,
  IconArrowRight,
  IconArrowLeft,
  IconChecks,
  IconX,
  IconHistory,
  IconCreditCard,
  IconExclamationCircle,
  IconCash,
  IconSend,
  IconLockAccess,
  IconAlertTriangle,
  IconEye,
  IconCheck,
  IconRefresh
} from "@tabler/icons-react";
import { useCurrency } from "@/lib/currency-context";
import { ViewOVA } from "./view-ova";
import { RequestOVA } from "./request-ova";
import { ApprovalOVA } from "./approval-ova";

export default function OVAPage() {
  const { currency } = useCurrency();
  
  return (
    <div className="px-4 lg:px-6 space-y-6">
      <div className="flex flex-col space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Online Virtual Account (OVA)</h2>
        <p className="text-muted-foreground">
          Manage your collection and payout virtual accounts
        </p>
      </div>
      
      <Tabs defaultValue="view" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="view">
            <IconWallet className="mr-2 h-4 w-4" />
            View OVA
          </TabsTrigger>
          <TabsTrigger value="request">
            <IconSend className="mr-2 h-4 w-4" />
            Request Transfer
          </TabsTrigger>
          <TabsTrigger value="approval">
            <IconChecks className="mr-2 h-4 w-4" />
            Approval
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="view">
          <ViewOVA />
        </TabsContent>
        
        <TabsContent value="request">
          <RequestOVA />
        </TabsContent>
        
        <TabsContent value="approval">
          <ApprovalOVA />
        </TabsContent>
      </Tabs>
    </div>
  );
} 