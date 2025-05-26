"use client";

import { useState } from "react";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useCurrency } from "@/lib/currency-context";
import { IconDownload, IconRefresh } from "@tabler/icons-react";

// Mock data for the analytics dashboard
const paymentMethodData = [
  { name: "Card", value: 45 },
  { name: "Bank Transfer", value: 30 },
  { name: "Mobile Money", value: 15 },
  { name: "USSD", value: 10 },
];

const locationData = [
  { name: "Lagos", value: 35 },
  { name: "Accra", value: 25 },
  { name: "Nairobi", value: 20 },
  { name: "Abuja", value: 10 },
  { name: "Kumasi", value: 10 },
];

const deviceData = [
  { name: "Mobile", value: 65 },
  { name: "Desktop", value: 25 },
  { name: "Tablet", value: 8 },
  { name: "Other", value: 2 },
];

// New usage data for POS, API, Mobile
const usageData = [
  { name: "POS", value: 45 },
  { name: "API", value: 30 },
  { name: "Mobile", value: 25 },
];

// Add interfaces for chart data
interface ChartDataItem {
  name: string;
  value: number;
}

interface HourlyDataItem {
  hour: string;
  count: number;
}

export default function AnalyticsPage() {
  const { currency } = useCurrency();
  const [dateRange, setDateRange] = useState("30d");
  
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
        <div className="flex items-center gap-2">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Date Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
              <SelectItem value="90d">Last 90 Days</SelectItem>
              <SelectItem value="12m">Last 12 Months</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <IconRefresh className="h-4 w-4" />
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <IconDownload className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Revenue</CardDescription>
            <CardTitle className="text-2xl">{currency} 487,342.20</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground flex items-center">
              <span className="text-emerald-500 mr-1">↑ 12.5%</span> 
              compared to previous period
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Success Rate</CardDescription>
            <CardTitle className="text-2xl">94.2%</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground flex items-center">
              <span className="text-emerald-500 mr-1">↑ 3.1%</span>
              compared to previous period
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Transactions</CardDescription>
            <CardTitle className="text-2xl">12,487</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground flex items-center">
              <span className="text-emerald-500 mr-1">↑ 8.7%</span>
              compared to previous period
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Average Transaction Value</CardDescription>
            <CardTitle className="text-2xl">{currency} 39.10</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground flex items-center">
              <span className="text-red-500 mr-1">↓ 2.3%</span>
              compared to previous period
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Revenue Over Time</CardTitle>
            <CardDescription>
              Revenue trends for the selected period
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartAreaInteractive />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Payment Methods</CardTitle>
            <CardDescription>
              Distribution by payment method
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ChartPieComponent data={paymentMethodData} />
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="transactions" className="w-full">
        <TabsList>
          <TabsTrigger value="transactions">Transaction Breakdown</TabsTrigger>
          <TabsTrigger value="locations">Geographic Analysis</TabsTrigger>
          <TabsTrigger value="devices">Usage Analysis</TabsTrigger>
        </TabsList>
        
        <TabsContent value="transactions" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Transaction Status</CardTitle>
                <CardDescription>
                  Breakdown of transaction outcomes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Successful</p>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div className="bg-emerald-500 h-full rounded-full" style={{ width: "94.2%" }}></div>
                      </div>
                    </div>
                    <p className="font-medium">94.2%</p>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Pending</p>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div className="bg-amber-500 h-full rounded-full" style={{ width: "3.1%" }}></div>
                      </div>
                    </div>
                    <p className="font-medium">3.1%</p>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Failed</p>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div className="bg-red-500 h-full rounded-full" style={{ width: "2.7%" }}></div>
                      </div>
                    </div>
                    <p className="font-medium">2.7%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Transaction Volume by Time</CardTitle>
                <CardDescription>
                  Hourly transaction distribution
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[250px]">
                  <ChartBarComponent />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="locations" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Top Locations</CardTitle>
                <CardDescription>
                  Transaction volume by location
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ChartPieComponent data={locationData} />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Regional Performance</CardTitle>
                <CardDescription>
                  Success rates by region
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Lagos</p>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div className="bg-blue-500 h-full rounded-full" style={{ width: "96.5%" }}></div>
                      </div>
                    </div>
                    <p className="font-medium">96.5%</p>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Accra</p>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div className="bg-blue-500 h-full rounded-full" style={{ width: "94.8%" }}></div>
                      </div>
                    </div>
                    <p className="font-medium">94.8%</p>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Nairobi</p>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div className="bg-blue-500 h-full rounded-full" style={{ width: "93.2%" }}></div>
                      </div>
                    </div>
                    <p className="font-medium">93.2%</p>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Abuja</p>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div className="bg-blue-500 h-full rounded-full" style={{ width: "92.1%" }}></div>
                      </div>
                    </div>
                    <p className="font-medium">92.1%</p>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Kumasi</p>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div className="bg-blue-500 h-full rounded-full" style={{ width: "91.5%" }}></div>
                      </div>
                    </div>
                    <p className="font-medium">91.5%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="devices" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Usage Distribution</CardTitle>
                <CardDescription>
                  Transactions by usage type
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ChartPieComponent data={usageData} />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Channel Performance</CardTitle>
                <CardDescription>
                  Success rates by channel
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">POS</p>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div className="bg-purple-500 h-full rounded-full" style={{ width: "97.2%" }}></div>
                      </div>
                    </div>
                    <p className="font-medium">97.2%</p>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">API</p>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div className="bg-purple-500 h-full rounded-full" style={{ width: "95.8%" }}></div>
                      </div>
                    </div>
                    <p className="font-medium">95.8%</p>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Mobile</p>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div className="bg-purple-500 h-full rounded-full" style={{ width: "93.5%" }}></div>
                      </div>
                    </div>
                    <p className="font-medium">93.5%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Simple Pie Chart Component
function ChartPieComponent({ data }: { data: ChartDataItem[] }) {
  return (
    <div className="h-full w-full flex items-center justify-center">
      <div className="relative h-60 w-60">
        <svg viewBox="0 0 100 100" className="h-full w-full">
          <circle cx="50" cy="50" r="40" fill="#f9fafb" />
          {data.map((item, index) => {
            // Calculate a simple pie slice
            const total = data.reduce((sum, d) => sum + d.value, 0);
            const startAngle = data
              .slice(0, index)
              .reduce((sum, d) => sum + (d.value / total) * 360, 0);
            const endAngle = startAngle + (item.value / total) * 360;
            
            // Convert angle to radians and calculate x,y
            const startRad = ((startAngle - 90) * Math.PI) / 180;
            const endRad = ((endAngle - 90) * Math.PI) / 180;
            
            const x1 = 50 + 40 * Math.cos(startRad);
            const y1 = 50 + 40 * Math.sin(startRad);
            const x2 = 50 + 40 * Math.cos(endRad);
            const y2 = 50 + 40 * Math.sin(endRad);
            
            // Determine if the slice is larger than 180 degrees
            const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;
            
            // Colors
            const colors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];
            
            return (
              <path
                key={index}
                d={`M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                fill={colors[index % colors.length]}
              />
            );
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-bold">
            {data[0].value}%
          </span>
          <span className="text-xs text-muted-foreground">
            {data[0].name}
          </span>
        </div>
      </div>
      <div className="ml-4 space-y-2">
        {data.map((item, index) => {
          const colors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];
          return (
            <div key={index} className="flex items-center">
              <div 
                className="w-3 h-3 mr-2 rounded-sm" 
                style={{ backgroundColor: colors[index % colors.length] }}
              ></div>
              <span className="text-sm">{item.name} ({item.value}%)</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Bar Chart Component
function ChartBarComponent() {
  // Mock hourly data
  const hourlyData: HourlyDataItem[] = [
    { hour: "00:00", count: 15 },
    { hour: "02:00", count: 8 },
    { hour: "04:00", count: 5 },
    { hour: "06:00", count: 12 },
    { hour: "08:00", count: 25 },
    { hour: "10:00", count: 45 },
    { hour: "12:00", count: 55 },
    { hour: "14:00", count: 40 },
    { hour: "16:00", count: 35 },
    { hour: "18:00", count: 48 },
    { hour: "20:00", count: 35 },
    { hour: "22:00", count: 25 },
  ];
  
  const maxCount = Math.max(...hourlyData.map(d => d.count));
  
  return (
    <div className="h-full flex flex-col">
      <div className="flex-grow relative">
        <div className="absolute inset-0 flex items-end">
          {hourlyData.map((item, index) => {
            const height = (item.count / maxCount) * 100;
            return (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div 
                  className="w-5/6 bg-blue-500 rounded-t"
                  style={{ height: `${height}%` }}
                ></div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="mt-2 grid grid-cols-12">
        {hourlyData.map((item, index) => (
          <div key={index} className="text-center">
            <span className="text-xs text-muted-foreground">
              {index % 2 === 0 ? item.hour : ''}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
} 