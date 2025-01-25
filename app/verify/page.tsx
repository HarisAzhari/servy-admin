'use client'

import React, { useState, useEffect } from 'react';
import AdminSidebar from "@/components/AdminSidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CheckCircle, XCircle, Eye, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

// Types
interface Provider {
  id: number;
  business_name: string;
  owner_name: string;
  email: string;
  phone_number: string;
  service_category: string;
  created_at: string;
}

interface VerificationCounts {
  counts: {
    approved: {
      last_30_days: number;
      last_7_days: number;
      total: number;
    };
    pending: {
      last_30_days: number;
      last_7_days: number;
      total: number;
    };
    rejected: {
      last_30_days: number;
      last_7_days: number;
      total: number;
    };
  };
  latest_pending: Provider[];
  summary: {
    approved_percentage: number;
    pending_percentage: number;
    rejected_percentage: number;
  };
  total_providers: number;
}

// API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000';

// API endpoints
const API_ENDPOINTS = {
  VERIFICATION_COUNTS: `${API_BASE_URL}/api/admin/verification/counts`,
  PENDING_PROVIDERS: `${API_BASE_URL}/api/admin/providers/pending`,
  VERIFY_PROVIDER: (id: number) => `${API_BASE_URL}/api/admin/provider/${id}/verify`,
};

const VerifyPageContent = () => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [verificationCounts, setVerificationCounts] = useState<VerificationCounts | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Rejection modal state
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [rejectionNotes, setRejectionNotes] = useState('');
  const [selectedProviderId, setSelectedProviderId] = useState<number | null>(null);
  
  const itemsPerPage = 6;

  // Fetch verification counts and pending providers
  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(null);
        const [countsResponse, providersResponse] = await Promise.all([
          fetch(API_ENDPOINTS.VERIFICATION_COUNTS, {
            credentials: 'include',
            headers: {
              'Accept': 'application/json',
            },
          }),
          fetch(API_ENDPOINTS.PENDING_PROVIDERS, {
            credentials: 'include',
            headers: {
              'Accept': 'application/json',
            },
          })
        ]);

        if (!countsResponse.ok || !providersResponse.ok) {
          throw new Error('Failed to fetch data');
        }

        const countsData = await countsResponse.json();
        const providersData = await providersResponse.json();

        setVerificationCounts(countsData);
        setProviders(Array.isArray(providersData) ? providersData : providersData.providers || []);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        console.error('Error fetching data:', errorMessage);
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle provider verification
  const handleVerification = async (providerId: number, status: 'approved' | 'rejected', notes?: string) => {
    setActionLoading(providerId);
    try {
      const response = await fetch(API_ENDPOINTS.VERIFY_PROVIDER(providerId), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status,
          notes: notes || (status === 'approved' ? 'Provider approved by admin' : 'Provider rejected by admin')
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update provider status');
      }

      // Remove the provider from the list
      setProviders(prev => prev.filter(p => p.id !== providerId));
      
      // Update counts
      if (verificationCounts) {
        setVerificationCounts(prev => {
          if (!prev) return null;
          return {
            ...prev,
            counts: {
              ...prev.counts,
              pending: {
                ...prev.counts.pending,
                total: prev.counts.pending.total - 1
              },
              [status]: {
                ...prev.counts[status],
                total: prev.counts[status].total + 1
              }
            }
          };
        });
      }

      toast.success(`Provider ${status} successfully`);
      
      // Reset rejection dialog state
      setIsRejectDialogOpen(false);
      setRejectionNotes('');
      setSelectedProviderId(null);
    } catch (error) {
      console.error('Error updating provider status:', error);
      toast.error('Failed to update provider status');
    } finally {
      setActionLoading(null);
    }
  };

  const handleRejectClick = (providerId: number) => {
    setSelectedProviderId(providerId);
    setIsRejectDialogOpen(true);
  };

  const handleRejectConfirm = () => {
    if (selectedProviderId && rejectionNotes.trim()) {
      handleVerification(selectedProviderId, 'rejected', rejectionNotes.trim());
    } else {
      toast.error('Please provide rejection notes');
    }
  };

  const handleNavigateToDashboard = () => {
    router.push('/');
  };

  const handleViewProviderInfo = (providerId: number) => {
    router.push(`/verify/information/${providerId}`);
  };

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = providers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(providers.length / itemsPerPage);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
        <div className="text-red-500 text-center max-w-md">
          <h3 className="text-lg font-semibold mb-2">Error Loading Data</h3>
          <p className="text-sm">{error}</p>
        </div>
        <Button 
          onClick={() => window.location.reload()} 
          variant="outline"
          size="sm"
        >
          Try Again
        </Button>
      </div>
    );
  }

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
                <p className="text-2xl font-bold">{verificationCounts?.counts.pending.total || 0}</p>
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
                <p className="text-2xl font-bold">{verificationCounts?.counts.approved.total || 0}</p>
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
                <p className="text-2xl font-bold">{verificationCounts?.counts.rejected.total || 0}</p>
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
            Showing {providers.length > 0 ? indexOfFirstItem + 1 : 0} to {Math.min(indexOfLastItem, providers.length)} of {providers.length} applications
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
                >
                  <TableCell 
                    className="font-medium"
                    onClick={() => handleViewProviderInfo(provider.id)}
                  >
                    <div>
                      {provider.business_name}
                      <div className="text-sm text-muted-foreground">{provider.email}</div>
                    </div>
                  </TableCell>
                  <TableCell onClick={() => handleViewProviderInfo(provider.id)}>
                    {provider.owner_name}
                  </TableCell>
                  <TableCell onClick={() => handleViewProviderInfo(provider.id)}>
                    {provider.service_category}
                  </TableCell>
                  <TableCell onClick={() => handleViewProviderInfo(provider.id)}>
                    {provider.phone_number}
                  </TableCell>
                  <TableCell onClick={() => handleViewProviderInfo(provider.id)}>
                    {new Date(provider.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="bg-green-50 text-green-600 hover:bg-green-100 hover:text-green-700"
                        onClick={() => handleVerification(provider.id, 'approved')}
                        disabled={actionLoading === provider.id}
                      >
                        {actionLoading === provider.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve
                          </>
                        )}
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700"
                        onClick={() => handleRejectClick(provider.id)}
                        disabled={actionLoading === provider.id}
                      >
                        {actionLoading === provider.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            <XCircle className="h-4 w-4 mr-1" />
                            Reject
                          </>
                        )}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {providers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    No pending applications
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

{/* Pagination Controls */}
{providers.length > 0 && (
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
          )}
        </CardContent>
      </Card>

      {/* Rejection Alert Dialog */}
      <AlertDialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <AlertDialogContent className="max-w-[500px]">
          <AlertDialogHeader>
            <AlertDialogTitle>Reject Provider Application</AlertDialogTitle>
            <AlertDialogDescription>
              Please provide a reason for rejecting this provider application.
              This note will be stored for administrative purposes.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Textarea
              placeholder="Enter rejection notes..."
              value={rejectionNotes}
              onChange={(e) => setRejectionNotes(e.target.value)}
              className="min-h-[100px] resize-none"
            />
          </div>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel
              onClick={() => {
                setIsRejectDialogOpen(false);
                setRejectionNotes('');
                setSelectedProviderId(null);
              }}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 text-white hover:bg-red-700"
              onClick={handleRejectConfirm}
              disabled={!rejectionNotes.trim()}
            >
              Confirm Rejection
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
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