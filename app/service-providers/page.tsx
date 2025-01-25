'use client'
import React, { useState, useEffect } from 'react';
import { Store, Search, ChevronDown, Filter, Clock, Calendar, AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AdminSidebar from '@/components/AdminSidebar';


interface Rating {
  total_rating: number;
  rating_count: number;
}

interface Statistics {
  services: {
    total: number;
  };
  bookings: {
    total: number;
    completed: number;
    cancelled: number;
    completion_rate: number;
  };
  reports: {
    total: number;
    pending: number;
  };
}

interface ProviderDetails {
  provider: {
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
    created_at: string;
    rating: Rating;
  };
  statistics: Statistics;
  timestamps: {
    registered_at: string;
    days_since_registration: number;
  };
}

interface Provider {
  id: string;
  name: string;
  email: string;
  phone?: string;
  verified: boolean;
  rating?: number;
  services?: string[];
  completed_jobs?: number;
  created_at?: string;
}

export default function ServiceProvidersPage() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<ProviderDetails | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'verified' | 'pending'>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://127.0.0.1:5000/api/providers');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setProviders(Array.isArray(data) ? data : (data.providers || []));
        setError(null);
      } catch (error) {
        console.error('Error fetching providers:', error);
        setError('Failed to load providers. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProviders();
  }, []);

  const fetchProviderDetails = async (providerId: string) => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/api/admin/provider/${providerId}/details`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setSelectedProvider(data);
      setIsDetailsOpen(true);
    } catch (error) {
      console.error('Error fetching provider details:', error);
    }
  };

  const safeProviders = Array.isArray(providers) ? providers : [];
  
  const filteredProviders = safeProviders.filter(provider => {
    const matchesSearch = 
      provider.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      provider.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || 
      (filterStatus === 'verified' && provider.verified) ||
      (filterStatus === 'pending' && !provider.verified);
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="p-8 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          <p className="mt-4 text-gray-600">Loading providers...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <AdminSidebar>
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Service Providers</h1>
          <p className="text-muted-foreground">Manage and monitor your service providers</p>
        </div>
      </div>

      <div className="flex gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search providers..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex gap-2">
              <Filter className="h-4 w-4" />
              Filter
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setFilterStatus('all')}>All</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilterStatus('verified')}>Verified</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilterStatus('pending')}>Pending</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredProviders.map((provider) => (
          <Card 
            key={provider.id} 
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => fetchProviderDetails(provider.id)}
          >
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="space-y-3">
                  <div className="space-y-1">
                    <h3 className="font-semibold text-lg">{provider.name}</h3>
                    <p className="text-sm text-muted-foreground">{provider.email}</p>
                    {provider.phone && (
                      <p className="text-sm text-muted-foreground">{provider.phone}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {provider.rating && (
                      <span className="text-sm flex items-center gap-1">
                        {provider.rating} ★
                      </span>
                    )}
                  </div>
                  {provider.services && (
                    <div className="flex flex-wrap gap-2">
                      {provider.services.map((service, index) => (
                        <span
                          key={index}
                          className="text-xs bg-gray-100 px-2 py-1 rounded"
                        >
                          {service}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="pt-2 flex items-center gap-4 text-sm text-muted-foreground">
                    {provider.completed_jobs && (
                      <span>{provider.completed_jobs} jobs completed</span>
                    )}
                    {provider.created_at && (
                      <span>Joined {new Date(provider.created_at).toLocaleDateString()}</span>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Provider Details</DialogTitle>
          </DialogHeader>
          
          {selectedProvider && (
            <div className="space-y-6">
              {/* Provider Header */}
              <div className="flex items-start gap-4">
                {selectedProvider.provider.business_photo && (
                  <img
                    src={selectedProvider.provider.business_photo}
                    alt={selectedProvider.provider.business_name}
                    className="w-24 h-24 rounded-lg object-cover"
                  />
                )}
                <div>
                  <h2 className="text-xl font-semibold">{selectedProvider.provider.business_name}</h2>
                  <p className="text-muted-foreground">Owned by {selectedProvider.provider.owner_name}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className={`px-2 py-1 rounded text-sm ${
                      selectedProvider.provider.verification_status === 'verified'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {selectedProvider.provider.verification_status.charAt(0).toUpperCase() + 
                       selectedProvider.provider.verification_status.slice(1)}
                    </span>
                    <span className="text-sm flex items-center gap-1">
                      {selectedProvider.provider.rating.total_rating} ★ ({selectedProvider.provider.rating.rating_count} reviews)
                    </span>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium mb-2">Contact Information</h3>
                  <div className="space-y-2">
                    <p className="text-sm">Email: {selectedProvider.provider.email}</p>
                    <p className="text-sm">Phone: {selectedProvider.provider.phone_number}</p>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Service Category</h3>
                  <p className="text-sm">{selectedProvider.provider.category_display}</p>
                  {selectedProvider.provider.custom_category && (
                    <p className="text-sm text-muted-foreground">
                      Custom: {selectedProvider.provider.custom_category}
                    </p>
                  )}
                </div>
              </div>

              {/* Statistics */}
              <div className="grid grid-cols-3 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="font-medium mb-2">Services</h3>
                    <p className="text-2xl font-semibold">{selectedProvider.statistics.services.total}</p>
                    <p className="text-sm text-muted-foreground">Total services offered</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="font-medium mb-2">Bookings</h3>
                    <p className="text-2xl font-semibold">
                      {selectedProvider.statistics.bookings.completion_rate}%
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Completion rate ({selectedProvider.statistics.bookings.completed}/{selectedProvider.statistics.bookings.total})
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="font-medium mb-2">Reports</h3>
                    <p className="text-2xl font-semibold">{selectedProvider.statistics.reports.total}</p>
                    <p className="text-sm text-muted-foreground">
                      {selectedProvider.statistics.reports.pending} pending
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Registration Info */}
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Registered: {new Date(selectedProvider.timestamps.registered_at).toLocaleDateString()}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {selectedProvider.timestamps.days_since_registration} days ago
                </span>
              </div>

              {/* Verification Notes */}
              {selectedProvider.provider.verification_notes && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-yellow-700">
                    <AlertTriangle className="h-4 w-4" />
                    <h3 className="font-medium">Verification Notes</h3>
                  </div>
                  <p className="mt-2 text-sm text-yellow-600">
                    {selectedProvider.provider.verification_notes}
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {filteredProviders.length === 0 && (
        <div className="text-center py-10">
          <p className="text-gray-500">No providers found matching your criteria.</p>
        </div>
      )}
    </div>
    </AdminSidebar>

  );
}