"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ViewMerchants } from "@/components/merchant/view-merchants";
import { CreateMerchant } from "@/components/merchant/create-merchant-form";

export default function MerchantPage() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState("view");
  
  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab === "create" || tab === "view") {
      setActiveTab(tab);
    }
  }, [searchParams]);

  return (
    <div className="px-4 lg:px-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList>
          <TabsTrigger value="view">View Merchants</TabsTrigger>
          <TabsTrigger value="create">Create Merchant</TabsTrigger>
        </TabsList>
        
        <TabsContent value="view" className="mt-4">
          <ViewMerchants />
        </TabsContent>
        
        <TabsContent value="create" className="mt-4">
          <CreateMerchant />
        </TabsContent>
      </Tabs>
    </div>
  );
} 