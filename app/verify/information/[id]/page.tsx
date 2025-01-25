'use client'

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import AdminSidebar from "@/components/AdminSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle, XCircle, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface Provider {
  id: number;
  business_photo: string;
  business_name: string;
  owner_name: string;
  service_category: string;
  custom_category: string | null;
  category_display: string;
  email: string;
  phone_number: string;
  verification_status: string;
  verification_notes: string | null;
}

interface ApiResponse {
  provider: Provider;
  timestamps: {
    registered_at: string;
    days_since_registration: number;
  };
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000';

const ProviderInformation = () => {
  const params = useParams();
  const router = useRouter();
  const providerId = params.id;
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [provider, setProvider] = useState<Provider | null>(null);
  const [timestamps, setTimestamps] = useState<ApiResponse['timestamps'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchProviderDetails();
  }, [providerId]);

  const fetchProviderDetails = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/provider/${providerId}/details`, {
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
        },
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch provider details: ${errorText}`);
      }
      
      const data: ApiResponse = await response.json();
      setProvider(data.provider);
      setTimestamps(data.timestamps);
    } catch (error) {
      console.error('Error fetching provider details:', error);
      setError(error instanceof Error ? error.message : 'Failed to load provider details');
    } finally {
      setLoading(false);
    }
  };
  
  const handleApprove = async () => {
    try {
      setActionLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/admin/provider/${providerId}/verify`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          status: 'approved',
          notes: 'Application approved'
        }),
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to approve provider: ${errorText}`);
      }
      
      router.push('/verify');
    } catch (error) {
      console.error('Error approving provider:', error);
      setError(error instanceof Error ? error.message : 'Failed to approve provider');
    } finally {
      setActionLoading(false);
    }
  };
  
  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      setError('Please provide a reason for rejection');
      return;
    }
  
    try {
      setActionLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/admin/provider/${providerId}/verify`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          status: 'rejected',
          notes: rejectionReason
        }),
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to reject provider: ${errorText}`);
      }
      
      setIsRejectModalOpen(false);
      router.push('/verify');
    } catch (error) {
      console.error('Error rejecting provider:', error);
      setError(error instanceof Error ? error.message : 'Failed to reject provider');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex justify-center items-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="p-8">
        <Alert>
          <AlertDescription>Provider not found</AlertDescription>
        </Alert>
      </div>
    );
  }

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
            <CardTitle>Business Photo</CardTitle>
          </CardHeader>
          <CardContent>
            {provider.business_photo ? (
              <div className="relative w-48 h-48">
                <img
                  src={provider.business_photo}
                  alt="Business Photo"
                  className="rounded-lg object-cover w-full h-full"
                />
              </div>
            ) : (
              <p className="text-muted-foreground">No business photo provided</p>
            )}
          </CardContent>
        </Card>

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
                  {provider.category_display}
                </p>
              </div>
              <div>
                <p className="font-medium">Registration Date</p>
                <p className="text-muted-foreground">
                  {timestamps ? `${new Date(timestamps.registered_at).toLocaleDateString()} (${timestamps.days_since_registration} days ago)` : 'Loading...'}
                </p>
              </div>
              <div>
                <p className="font-medium">Status</p>
                <p className="text-muted-foreground capitalize">{provider.verification_status}</p>
              </div>
              {provider.verification_notes && (
                <div>
                  <p className="font-medium">Verification Notes</p>
                  <p className="text-muted-foreground">{provider.verification_notes}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button 
            size="lg"
            variant="outline"
            className="bg-green-50 text-green-600 hover:bg-green-100 hover:text-green-700"
            onClick={handleApprove}
            disabled={actionLoading}
          >
            {actionLoading ? (
              <Loader2 className="h-5 w-5 animate-spin mr-2" />
            ) : (
              <CheckCircle className="h-5 w-5 mr-2" />
            )}
            Approve Application
          </Button>
          <Button 
            size="lg"
            variant="outline"
            className="bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700"
            onClick={() => setIsRejectModalOpen(true)}
            disabled={actionLoading}
          >
            {actionLoading ? (
              <Loader2 className="h-5 w-5 animate-spin mr-2" />
            ) : (
              <XCircle className="h-5 w-5 mr-2" />
            )}
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
              disabled={actionLoading}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={actionLoading || !rejectionReason.trim()}
            >
              {actionLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                'Confirm Rejection'
              )}
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