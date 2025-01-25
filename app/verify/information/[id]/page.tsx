'use client'

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import AdminSidebar from "@/components/AdminSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle, XCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"

// Mock data structure
const pendingProviders = [
  {
    id: 1,
    business_name: "John's Plumbing Services",
    owner_name: "John Smith",
    email: "john@plumbingservices.com",
    phone_number: "+1 (555) 123-4567",
    service_category: "Plumbing",
    custom_category: null,
    created_at: "2024-03-15",
    documents: ["Business License", "Insurance", "Certifications"],
    business_address: "123 Main St, Anytown, USA",
    business_description: "Professional plumbing services with over 10 years of experience in residential and commercial projects.",
    service_areas: ["Downtown", "Suburbs", "Metropolitan Area"],
    working_hours: "Monday-Friday: 8AM-6PM, Saturday: 9AM-3PM",
  },
  {
    id: 2,
    business_name: "Elite Electrical Solutions",
    owner_name: "Sarah Johnson",
    email: "sarah@eliteelectrical.com",
    phone_number: "+1 (555) 234-5678",
    service_category: "Electrical",
    custom_category: null,
    created_at: "2024-03-14",
    documents: ["Trade License", "Insurance", "Safety Certifications"],
    business_address: "456 Oak Avenue, Metropolis, USA",
    business_description: "Licensed electrical contractors specializing in residential and light commercial electrical services.",
    service_areas: ["City Center", "North Side", "South Side"],
    working_hours: "Monday-Saturday: 7AM-7PM",
  }
];

const ProviderInformation = () => {
  const params = useParams();
  const router = useRouter();
  const providerId = params.id;
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  const provider = pendingProviders.find(p => p.id === Number(providerId));

  if (!provider) {
    return <div>Provider not found</div>;
  }

  const handleReject = () => {
    // Here you would handle the actual rejection with the reason
    console.log('Rejecting provider:', providerId, 'Reason:', rejectionReason);
    setIsRejectModalOpen(false);
    setRejectionReason("");
    // Optionally redirect back to the verification list
    router.push('/verify');
  };

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Provider Information</h2>
          <p className="text-lg text-muted-foreground">
            Review detailed information for {provider.business_name}
          </p>
        </div>
        <Button
          onClick={() => router.back()}
          variant="outline"
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Business Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-medium">Business Name</p>
                <p className="text-muted-foreground">{provider.business_name}</p>
              </div>
              <div>
                <p className="font-medium">Owner Name</p>
                <p className="text-muted-foreground">{provider.owner_name}</p>
              </div>
              <div>
                <p className="font-medium">Email</p>
                <p className="text-muted-foreground">{provider.email}</p>
              </div>
              <div>
                <p className="font-medium">Phone Number</p>
                <p className="text-muted-foreground">{provider.phone_number}</p>
              </div>
              <div>
                <p className="font-medium">Service Category</p>
                <p className="text-muted-foreground">
                  {provider.custom_category || provider.service_category}
                </p>
              </div>
              <div>
                <p className="font-medium">Application Date</p>
                <p className="text-muted-foreground">{provider.created_at}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Business Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="font-medium">Business Address</p>
              <p className="text-muted-foreground">{provider.business_address}</p>
            </div>
            <div>
              <p className="font-medium">Business Description</p>
              <p className="text-muted-foreground">{provider.business_description}</p>
            </div>
            <div>
              <p className="font-medium">Service Areas</p>
              <div className="flex flex-wrap gap-2 mt-1">
                {provider.service_areas.map((area, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm"
                  >
                    {area}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <p className="font-medium">Working Hours</p>
              <p className="text-muted-foreground">{provider.working_hours}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Required Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {provider.documents.map((doc, index) => (
                <div
                  key={index}
                  className="p-3 bg-blue-50 text-blue-700 rounded-lg flex items-center gap-2"
                >
                  {doc}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button 
            size="lg"
            variant="outline"
            className="bg-green-50 text-green-600 hover:bg-green-100 hover:text-green-700"
          >
            <CheckCircle className="h-5 w-5 mr-2" />
            Approve Application
          </Button>
          <Button 
            size="lg"
            variant="outline"
            className="bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700"
            onClick={() => setIsRejectModalOpen(true)}
          >
            <XCircle className="h-5 w-5 mr-2" />
            Reject Application
          </Button>
        </div>
      </div>

      {/* Rejection Modal */}
      <Dialog open={isRejectModalOpen} onOpenChange={setIsRejectModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Reject Application</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting {provider.business_name}'s application.
              This will be sent to the service provider.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Textarea
              id="rejection-reason"
              placeholder="Enter rejection reason..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsRejectModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={!rejectionReason.trim()}
            >
              Confirm Rejection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const ProviderInformationPage = () => {
  return (
    <AdminSidebar>
      <ProviderInformation />
    </AdminSidebar>
  );
};

export default ProviderInformationPage; 