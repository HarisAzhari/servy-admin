import React, { useState, useEffect } from 'react';
import { Users, Store, CheckCircle, Box, Clock, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { motion } from "framer-motion";

const Dashboard = () => {
  // Add state for dashboard stats
  const [dashboardStats, setDashboardStats] = useState({
    total_users: 0,
    total_service_providers: 0,
    total_completed_services: 0,
    total_active_services: 0
  });

  // Add useEffect to fetch dashboard stats
  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        console.log("This is ",process.env.NEXT_PUBLIC_API_URL)
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/dashboard/stats`);
        if (!response.ok) {
          console.error('API Error:', {
            status: response.status,
            statusText: response.statusText,
          });
          const text = await response.text();
          console.error('Response text:', text);
          throw new Error(`API returned ${response.status}`);
        }
        const data = await response.json();
        setDashboardStats(data);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        // Optionally set an error state here to show to the user
      }
    };

    fetchDashboardStats();
  }, []);

  // Mock data for charts
  const bookingData = [
    { month: 'Jan', bookings: 65 },
    { month: 'Feb', bookings: 45 },
    { month: 'Mar', bookings: 78 },
    { month: 'Apr', bookings: 54 },
    { month: 'May', bookings: 89 },
    { month: 'Jun', bookings: 92 },
  ];

  // Mock recent activities
  const recentActivities = [
    {
      type: 'New Booking',
      service: 'House Cleaning',
      user: 'John Doe',
      time: '2 hours ago'
    },
    {
      type: 'Service Completed',
      service: 'Plumbing Repair',
      user: 'Alice Smith',
      time: '3 hours ago'
    },
    {
      type: 'New Provider',
      service: 'Electrical Services',
      user: 'Mike Johnson',
      time: '5 hours ago'
    }
  ];



  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-8 space-y-8"
    >
      {/* Welcome Section with gradient text */}
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-blue-500 to-purple-600">
          Hello, Admin
        </h2>
        <p className="text-lg text-muted-foreground">
          Heres whats happening across your platform today
        </p>
      </div>

      {/* Enhanced Metrics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                  <p className="text-3xl font-bold">{dashboardStats.total_users}</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
          <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Service Providers</p>
                  <p className="text-3xl font-bold">{dashboardStats.total_service_providers}</p>
                </div>
                <div className="bg-indigo-100 p-3 rounded-full">
                  <Store className="h-6 w-6 text-indigo-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
          <Card className="bg-gradient-to-br from-green-50 to-lime-50 hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Completed Services</p>
                  <p className="text-3xl font-bold">{dashboardStats.total_completed_services}</p>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
          <Card className="bg-gradient-to-br from-purple-50 to-pink-50 hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Services</p>
                  <p className="text-3xl font-bold">{dashboardStats.total_active_services}</p>
                </div>
                <div className="bg-purple-100 p-3 rounded-full">
                  <Box className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Enhanced Charts and Activities Grid */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        <Card className="bg-gradient-to-br from-white to-blue-50">
          <CardHeader>
            <CardTitle className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
              Booking Trends
            </CardTitle>
            <CardDescription>Monthly booking statistics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={bookingData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Bar
                    dataKey="bookings"
                    fill="url(#colorGradient)"
                    radius={[4, 4, 0, 0]}
                  >
                    <defs>
                      <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#8884d8" stopOpacity={0.3}/>
                      </linearGradient>
                    </defs>
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-white to-purple-50">
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>Latest platform activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  key={index}
                  className="flex items-start space-x-4 p-3 hover:bg-white/50 rounded-lg backdrop-blur-sm transition-all duration-300"
                >
                  <div className="bg-blue-100 p-2 rounded-full">
                    <Activity className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{activity.type}</p>
                    <p className="text-sm text-muted-foreground">{activity.service} - {activity.user}</p>
                    <p className="text-xs text-muted-foreground mt-1 flex items-center">
                      <Clock className="h-3 w-3 mr-1" /> {activity.time}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Platform Insights Grid */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
        {/* Top Services */}
        <Card>
          <CardHeader>
            <CardTitle>Top Services</CardTitle>
            <CardDescription>Most booked services this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: 'House Cleaning', bookings: 145, growth: 12 },
                { name: 'Plumbing Repair', bookings: 98, growth: 8 },
                { name: 'Electrical Work', bookings: 87, growth: 15 }
              ].map((service, index) => (
                <div key={index} className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-lg">
                  <div className="space-y-1">
                    <p className="font-medium">{service.name}</p>
                    <p className="text-sm text-muted-foreground">{service.bookings} bookings</p>
                  </div>
                  <span className="text-sm text-green-600">↑ {service.growth}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Latest Reviews */}
        <Card>
          <CardHeader>
            <CardTitle>Latest Reviews</CardTitle>
            <CardDescription>Recent service feedback</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { service: 'AC Repair', rating: 5, review: "Excellent service, very professional" },
                { service: 'Home Painting', rating: 4, review: "Great work, slightly delayed" },
                { service: 'Cleaning', rating: 5, review: "Outstanding attention to detail" }
              ].map((review, index) => (
                <div key={index} className="space-y-2 p-2 hover:bg-slate-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{review.service}</p>
                    <div className="flex">
                      {Array(5).fill(0).map((_, i) => (
                        <span key={i} className={`text-sm ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}>
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{review.review}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Provider Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Top Providers</CardTitle>
            <CardDescription>Best performing service providers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: 'Elite Cleaners', completions: 56, rating: 4.9 },
                { name: 'Swift Plumbing', completions: 43, rating: 4.8 },
                { name: 'Expert Electricals', completions: 38, rating: 4.7 }
              ].map((provider, index) => (
                <div key={index} className="flex items-center space-x-4 p-2 hover:bg-slate-50 rounded-lg">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center text-white font-bold">
                    {provider.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{provider.name}</p>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <span>{provider.completions} jobs</span>
                      <span className="mx-2">•</span>
                      <span className="flex items-center">
                        {provider.rating} <span className="text-yellow-400 ml-1">★</span>
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add this CSS to your global styles */}
      <style jsx global>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </motion.div>
  );
};

export default Dashboard;