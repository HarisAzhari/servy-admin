/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'
import React, { useState, useEffect } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
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
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlayCircle, AlertCircle, CheckCircle, XCircle, Filter, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Report = {
  id: number;
  provider_id: number;
  user_id: number;
  reason: string;
  description: string;
  has_video: boolean;
  status: string;
  admin_notes: string;
  created_at: string;
  updated_at: string;
  reporter_name: string;
  reporter_email: string;
  provider_name: string;
};

const ReportStatCard = ({ title, value, icon, className }: { title: string; value: number; icon: React.ReactNode; className: string }) => (
  <Card className="border-none shadow-md">
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      <div className={`p-2 rounded-full ${className} bg-opacity-10`}>
        {icon}
      </div>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
    </CardContent>
  </Card>
);

const ReportsPage = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [adminNotes, setAdminNotes] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredReports = reports.filter(report => 
    statusFilter === 'all' || report.status.toLowerCase() === statusFilter
  );

  const stats = {
    total: reports.length,
    pending: reports.filter(r => r.status.toLowerCase() === 'reviewed').length,
    resolved: reports.filter(r => r.status.toLowerCase() === 'resolved').length,
    dismissed: reports.filter(r => r.status.toLowerCase() === 'dismissed').length,
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/api/provider/reports');
      if (!response.ok) throw new Error('Failed to fetch reports');
      const data = await response.json();
      setReports(data.reports);
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (reportId: number) => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/api/provider/report/${reportId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: selectedStatus,
          admin_notes: adminNotes,
        }),
      });

      if (!response.ok) throw new Error('Failed to update report status');
      
      fetchReports();
      setShowDialog(false);
    } catch (error) {
      console.error('Error updating report status:', error);
    }
  };

  const handleViewReport = (report: Report) => {
    setSelectedReport(report);
    setSelectedStatus(report.status);
    setAdminNotes(report.admin_notes || '');
    setShowDialog(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'reviewed':
        return 'text-yellow-600 bg-yellow-100';
      case 'resolved':
        return 'text-green-600 bg-green-100';
      case 'dismissed':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <AdminSidebar>
      <div className="p-8 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Provider Reports</h1>
              <p className="text-gray-500 mt-1">Review and manage provider reports</p>
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-4">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                  <ChevronDown className="w-4 h-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => setStatusFilter('all')}>
                    All Reports
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter('reviewed')}>
                    Reviewed
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter('resolved')}>
                    Resolved
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter('dismissed')}>
                    Dismissed
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <ReportStatCard
              title="Total Reports"
              value={stats.total}
              icon={<AlertCircle className="w-4 h-4 text-blue-500" />}
              className="text-blue-500"
            />
            <ReportStatCard
              title="Pending Review"
              value={stats.pending}
              icon={<AlertCircle className="w-4 h-4 text-yellow-500" />}
              className="text-yellow-500"
            />
            <ReportStatCard
              title="Resolved"
              value={stats.resolved}
              icon={<CheckCircle className="w-4 h-4 text-green-500" />}
              className="text-green-500"
            />
            <ReportStatCard
              title="Dismissed"
              value={stats.dismissed}
              icon={<XCircle className="w-4 h-4 text-red-500" />}
              className="text-red-500"
            />
          </div>

          {/* Reports Table */}
          <Card className="border-none shadow-md">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 hover:bg-gray-50">
                    <TableHead className="font-semibold">Date</TableHead>
                    <TableHead className="font-semibold">Provider</TableHead>
                    <TableHead className="font-semibold">Reporter</TableHead>
                    <TableHead className="font-semibold">Reason</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="font-semibold">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReports.map((report) => (
                    <TableRow key={report.id} className="hover:bg-gray-50/50 transition-colors">
                      <TableCell className="font-medium">{formatDate(report.created_at)}</TableCell>
                      <TableCell>{report.provider_name}</TableCell>
                      <TableCell>{report.reporter_name}</TableCell>
                      <TableCell>{report.reason}</TableCell>
                      <TableCell>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                          {report.status.toUpperCase()}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          onClick={() => handleViewReport(report)}
                          className="hover:text-blue-500 transition-colors"
                        >
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Report Details Dialog */}
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold">Report Details</DialogTitle>
            </DialogHeader>

            {selectedReport && (
              <div className="space-y-6">
                <Card className="border-none shadow-sm bg-gray-50">
                  <CardContent className="p-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Provider</label>
                        <p className="mt-1 font-medium">{selectedReport.provider_name}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Reporter</label>
                        <p className="mt-1 font-medium">{selectedReport.reporter_name}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Email</label>
                        <p className="mt-1">{selectedReport.reporter_email}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Date</label>
                        <p className="mt-1">{formatDate(selectedReport.created_at)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Reason</label>
                    <p className="mt-1 text-lg font-medium">{selectedReport.reason}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500">Description</label>
                    <p className="mt-1 text-gray-700 whitespace-pre-wrap">{selectedReport.description}</p>
                  </div>

                  {selectedReport.has_video && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Evidence</label>
                      <Button 
                        variant="outline" 
                        className="mt-2 w-full border-2 hover:border-blue-500 transition-all duration-200"
                        onClick={() => window.open(`http://127.0.0.1:5000/api/provider/report/${selectedReport.id}/video`)}
                      >
                        <PlayCircle className="w-5 h-5 mr-2 text-blue-500" />
                        View Video Evidence
                      </Button>
                    </div>
                  )}

                  <div className="pt-4 border-t">
                    <label className="text-sm font-medium text-gray-500">Update Status</label>
                    <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="reviewed">Reviewed</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                        <SelectItem value="dismissed">Dismissed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500">Admin Notes</label>
                    <Textarea
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                      placeholder="Add notes about how this report was handled..."
                      className="mt-2"
                      rows={3}
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button 
                    variant="outline" 
                    onClick={() => setShowDialog(false)}
                    className="border-2"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={() => handleStatusUpdate(selectedReport.id)}
                    className="bg-blue-500 hover:bg-blue-600"
                  >
                    Update Status
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminSidebar>
  );
};

export default ReportsPage;