'use client'

import React, { useState } from 'react';
import AdminSidebar from "@/components/AdminSidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CheckCircle, XCircle, Eye } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from 'next/navigation';

// Mock data aligned with database schema
const pendingProviders = [
  {
    id: 1,
    business_name: "John's Plumbing Services",
    owner_name: "John Smith",
    email: "john@plumbingservices.com",
    phone_number: "+1234567890",
    service_category: "Plumber",
    created_at: "2024-03-15",
  },
  {
    id: 2,
    business_name: "Elite Electrical Solutions",
    owner_name: "Sarah Johnson",
    email: "sarah@eliteelectrical.com",
    phone_number: "+1987654321",
    service_category: "Electrical",
    created_at: "2024-03-14",
  },
  {
    id: 3,
    business_name: "Swift HVAC Systems",
    owner_name: "Michael Chen",
    email: "michael@swifthvac.com",
    phone_number: "+1234509876",
    service_category: "HVAC",
    created_at: "2024-03-13",
  },
  {
    id: 4,
    business_name: "Precision Painting Pro",
    owner_name: "David Wilson",
    email: "david@precisionpaint.com",
    phone_number: "+1122334455",
    service_category: "Painter",
    created_at: "2024-03-12",
  },
  {
    id: 5,
    business_name: "GreenThumb Landscaping",
    owner_name: "Emma Rodriguez",
    email: "emma@greenthumb.com",
    phone_number: "+1555666777",
    service_category: "Landscaping",
    created_at: "2024-03-11",
  },
  {
    id: 6,
    business_name: "SecureHome Locksmith",
    owner_name: "James Lee",
    email: "james@securehome.com",
    phone_number: "+1777888999",
    service_category: "Locksmith",
    created_at: "2024-03-10",
  },
  {
    id: 7,
    business_name: "Crystal Clear Windows",
    owner_name: "Lisa Anderson",
    email: "lisa@crystalwindows.com",
    phone_number: "+1444555666",
    service_category: "Window Cleaning",
    created_at: "2024-03-09",
  },
  {
    id: 8,
    business_name: "FastFix Appliance Repair",
    owner_name: "Robert Taylor",
    email: "robert@fastfix.com",
    phone_number: "+1999000111",
    service_category: "Appliance Repair",
    created_at: "2024-03-08",
  },
  {
    id: 9,
    business_name: "Modern Roofing Solutions",
    owner_name: "Patricia Martinez",
    email: "patricia@modernroof.com",
    phone_number: "+1222333444",
    service_category: "Roofing",
    created_at: "2024-03-07",
  },
  {
    id: 10,
    business_name: "Quality Carpet Care",
    owner_name: "Thomas Brown",
    email: "thomas@qualitycarpet.com",
    phone_number: "+1666777888",
    service_category: "Carpet Cleaning",
    created_at: "2024-03-06",
  },
  {
    id: 11,
    business_name: "Expert Pest Control",
    owner_name: "Kevin White",
    email: "kevin@expertpest.com",
    phone_number: "+1333444555",
    service_category: "Pest Control",
    created_at: "2024-03-05",
  },
  {
    id: 12,
    business_name: "Garage Door Masters",
    owner_name: "Amanda Clark",
    email: "amanda@garagemasters.com",
    phone_number: "+1888999000",
    service_category: "Garage Door Repair",
    created_at: "2024-03-04",
  },
  {
    id: 13,
    business_name: "Pool Care Experts",
    owner_name: "Daniel Garcia",
    email: "daniel@poolcare.com",
    phone_number: "+1777666555",
    service_category: "Pool Maintenance",
    created_at: "2024-03-03",
  },
  {
    id: 14,
    business_name: "Home Security Pro",
    owner_name: "Rachel Kim",
    email: "rachel@homesecurity.com",
    phone_number: "+1222111333",
    service_category: "Security Systems",
    created_at: "2024-03-02",
  },
  {
    id: 15,
    business_name: "Drywall Solutions",
    owner_name: "Mark Thompson",
    email: "mark@drywallpro.com",
    phone_number: "+1444333222",
    service_category: "Drywall",
    created_at: "2024-03-01",
  },
  {
    id: 16,
    business_name: "Flooring Experts",
    owner_name: "Jessica Wong",
    email: "jessica@flooringexp.com",
    phone_number: "+1555444666",
    service_category: "Flooring",
    created_at: "2024-02-29",
  },
  {
    id: 17,
    business_name: "Tree Care Services",
    owner_name: "Brian Miller",
    email: "brian@treecare.com",
    phone_number: "+1666555444",
    service_category: "Tree Service",
    created_at: "2024-02-28",
  },
  {
    id: 18,
    business_name: "Smart Home Installation",
    owner_name: "Sophie Turner",
    email: "sophie@smarthome.com",
    phone_number: "+1999888777",
    service_category: "Smart Home",
    created_at: "2024-02-27",
  },
  {
    id: 19,
    business_name: "Fence Installation Pro",
    owner_name: "Chris Evans",
    email: "chris@fencepro.com",
    phone_number: "+1111222333",
    service_category: "Fencing",
    created_at: "2024-02-26",
  },
  {
    id: 20,
    business_name: "Gutter Cleaning Express",
    owner_name: "Maria Sanchez",
    email: "maria@gutterexpress.com",
    phone_number: "+1777888999",
    service_category: "Gutter Cleaning",
    created_at: "2024-02-25",
  },
];

const VerifyPageContent = () => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = pendingProviders.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(pendingProviders.length / itemsPerPage);

  // Add this function to handle navigation
  const handleNavigateToDashboard = () => {
    router.push('/');  // Navigate to root/dashboard
  };

  const handleViewProviderInfo = (providerId: number) => {
    router.push(`/verify/information/${providerId}`);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-8 space-y-8"
    >
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Service Provider Verification</h2>
          <p className="text-lg text-muted-foreground">
            Review and approve pending service provider applications
          </p>
        </div>
        <Button
          onClick={handleNavigateToDashboard}
          variant="outline"
          className="gap-2"
        >
          Back to Dashboard
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="shadow-sm bg-gradient-to-br from-yellow-50 to-orange-50 border-none">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="bg-yellow-100/80 p-2 rounded-full">
                <Eye className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold">{pendingProviders.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm bg-gradient-to-br from-green-50 to-emerald-50 border-none">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="bg-green-100/80 p-2 rounded-full">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Approved</p>
                <p className="text-2xl font-bold">3</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm bg-gradient-to-br from-red-50 to-rose-50 border-none">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="bg-red-100/80 p-2 rounded-full">
                <XCircle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Rejected</p>
                <p className="text-2xl font-bold">1</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Applications Table */}
      <Card className="shadow-sm bg-gradient-to-br from-white to-slate-50/30">
        <CardHeader className="pb-3">
          <CardTitle>Pending Applications</CardTitle>
          <CardDescription>
            Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, pendingProviders.length)} of {pendingProviders.length} applications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Business Name</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Service Type</TableHead>
                <TableHead>Phone Number</TableHead>
                <TableHead>Applied Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentItems.map((provider) => (
                <TableRow 
                  key={provider.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleViewProviderInfo(provider.id)}
                >
                  <TableCell className="font-medium">
                    <div>
                      {provider.business_name}
                      <div className="text-sm text-muted-foreground">{provider.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>{provider.owner_name}</TableCell>
                  <TableCell>{provider.service_category}</TableCell>
                  <TableCell>{provider.phone_number}</TableCell>
                  <TableCell>{provider.created_at}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="bg-green-50 text-green-600 hover:bg-green-100 hover:text-green-700"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700"
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination Controls */}
          <div className="flex items-center justify-center space-x-2 py-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const VerifyPage = () => {
  return (
    <AdminSidebar>
      <VerifyPageContent />
    </AdminSidebar>
  );
};

export default VerifyPage; 