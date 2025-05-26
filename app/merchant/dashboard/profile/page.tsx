"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  IconUser,
  IconBuildingStore,
  IconShield,
  IconEdit,
  IconDeviceFloppy,
  IconUpload,
} from "@tabler/icons-react";

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  
  // Mock user data
  const [userData, setUserData] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "+234 812 345 6789",
    role: "Admin",
    lastLogin: "2023-11-10 09:45 AM",
  });

  // Mock business data
  const [businessData, setBusinessData] = useState({
    businessName: "JD Enterprises",
    businessType: "Limited Company",
    registrationNumber: "RC-123456",
    taxId: "TIN-987654321",
    industry: "Retail",
    address: "123 Business Avenue, Lagos",
    website: "https://jdenterprises.com",
    establishedDate: "2020-01-15",
  });

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Profile</h1>
        <p className="text-muted-foreground">
          Manage your personal and business information
        </p>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src="/images/placeholder-avatar.png" alt="Profile" />
            <AvatarFallback className="text-2xl">JD</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-xl font-semibold">{userData.firstName} {userData.lastName}</h2>
            <p className="text-muted-foreground">{businessData.businessName}</p>
          </div>
        </div>
        <Button 
          variant={isEditing ? "default" : "outline"} 
          onClick={handleEditToggle}
          className="flex items-center gap-2"
        >
          {isEditing ? (
            <>
              <IconDeviceFloppy className="h-4 w-4" />
              Save Changes
            </>
          ) : (
            <>
              <IconEdit className="h-4 w-4" />
              Edit Profile
            </>
          )}
        </Button>
      </div>

      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-3 mb-6">
          <TabsTrigger value="personal" className="flex items-center gap-1">
            <IconUser className="h-4 w-4" />
            Personal
          </TabsTrigger>
          <TabsTrigger value="business" className="flex items-center gap-1">
            <IconBuildingStore className="h-4 w-4" />
            Business
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-1">
            <IconShield className="h-4 w-4" />
            Security
          </TabsTrigger>
        </TabsList>

        {/* Personal Information Tab */}
        <TabsContent value="personal" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Manage your personal contact details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input 
                    id="firstName" 
                    value={userData.firstName} 
                    disabled={!isEditing}
                    onChange={(e) => setUserData({...userData, firstName: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input 
                    id="lastName" 
                    value={userData.lastName} 
                    disabled={!isEditing}
                    onChange={(e) => setUserData({...userData, lastName: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={userData.email} 
                    disabled={!isEditing}
                    onChange={(e) => setUserData({...userData, email: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input 
                    id="phone" 
                    value={userData.phone} 
                    disabled={!isEditing}
                    onChange={(e) => setUserData({...userData, phone: e.target.value})}
                  />
                </div>
              </div>

              <Separator className="my-4" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Input id="role" value={userData.role} disabled />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastLogin">Last Login</Label>
                  <Input id="lastLogin" value={userData.lastLogin} disabled />
                </div>
              </div>

              {isEditing && (
                <div className="mt-6">
                  <Label htmlFor="profilePicture">Profile Picture</Label>
                  <div className="mt-2 flex items-center gap-4">
                    <Button variant="outline" className="flex items-center gap-2">
                      <IconUpload className="h-4 w-4" />
                      Upload New Picture
                    </Button>
                    <p className="text-xs text-muted-foreground">
                      Recommended: Square image, at least 500x500 pixels, max 2MB
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Business Information Tab */}
        <TabsContent value="business" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Business Information</CardTitle>
              <CardDescription>
                Details about your business
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="businessName">Business Name</Label>
                  <Input 
                    id="businessName" 
                    value={businessData.businessName} 
                    disabled={!isEditing}
                    onChange={(e) => setBusinessData({...businessData, businessName: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="businessType">Business Type</Label>
                  <Input 
                    id="businessType" 
                    value={businessData.businessType} 
                    disabled={!isEditing}
                    onChange={(e) => setBusinessData({...businessData, businessType: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="registrationNumber">Registration Number</Label>
                  <Input 
                    id="registrationNumber" 
                    value={businessData.registrationNumber} 
                    disabled={!isEditing}
                    onChange={(e) => setBusinessData({...businessData, registrationNumber: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="taxId">Tax ID</Label>
                  <Input 
                    id="taxId" 
                    value={businessData.taxId} 
                    disabled={!isEditing}
                    onChange={(e) => setBusinessData({...businessData, taxId: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="industry">Industry</Label>
                  <Input 
                    id="industry" 
                    value={businessData.industry} 
                    disabled={!isEditing}
                    onChange={(e) => setBusinessData({...businessData, industry: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="establishedDate">Established Date</Label>
                  <Input 
                    id="establishedDate" 
                    value={businessData.establishedDate} 
                    disabled={!isEditing}
                    onChange={(e) => setBusinessData({...businessData, establishedDate: e.target.value})}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address">Business Address</Label>
                  <Input 
                    id="address" 
                    value={businessData.address} 
                    disabled={!isEditing}
                    onChange={(e) => setBusinessData({...businessData, address: e.target.value})}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="website">Website</Label>
                  <Input 
                    id="website" 
                    value={businessData.website} 
                    disabled={!isEditing}
                    onChange={(e) => setBusinessData({...businessData, website: e.target.value})}
                  />
                </div>
              </div>

              {isEditing && (
                <div className="mt-6">
                  <Label htmlFor="businessLogo">Business Logo</Label>
                  <div className="mt-2 flex items-center gap-4">
                    <Button variant="outline" className="flex items-center gap-2">
                      <IconUpload className="h-4 w-4" />
                      Upload Logo
                    </Button>
                    <p className="text-xs text-muted-foreground">
                      Recommended: Square image, at least 200x200 pixels, max 1MB
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Manage your account security settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input id="current-password" type="password" disabled={!isEditing} />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input id="new-password" type="password" disabled={!isEditing} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input id="confirm-password" type="password" disabled={!isEditing} />
                </div>
              </div>

              <Separator className="my-4" />
              
              <div>
                <h3 className="text-lg font-medium mb-2">Two-Factor Authentication</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Add an extra layer of security to your account by enabling two-factor authentication.
                </p>
                <Button variant={isEditing ? "default" : "outline"} disabled={!isEditing}>
                  Enable Two-Factor Authentication
                </Button>
              </div>

              <Separator className="my-4" />
              
              <div>
                <h3 className="text-lg font-medium mb-2">Login Sessions</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Manage your active login sessions across devices.
                </p>
                <div className="rounded-md border p-4 mb-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Current Session</p>
                      <p className="text-sm text-muted-foreground">Lagos, Nigeria • Chrome on Windows</p>
                      <p className="text-xs text-muted-foreground">Started: Today at 09:45 AM</p>
                    </div>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      Active
                    </Badge>
                  </div>
                </div>
                <Button variant="outline" className="w-full">
                  Log Out All Other Devices
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
