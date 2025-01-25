    import React, { useState, useEffect } from 'react';
    import { Users, Store, CheckCircle, Box, Clock, Activity } from "lucide-react";
    import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
    import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Cell } from 'recharts';
    import { motion } from "framer-motion";
    import { useRouter } from 'next/navigation';

    // Types
    interface DashboardStats {
      total_users: number;
      total_verified_providers: number;
      total_completed_services: number;
      total_active_services: number;
    }

    interface Activity {
      type: string;
      id: number;
      status?: string;
      booking_date?: string;
      booking_time?: string;
      rating?: number;
      review_text?: string;
      user_name: string;
      service_title: string;
      provider_name: string;
      created_at: string;
    }

    interface TopService {
      id: number;
      service_title: string;
      bookings: {
        total: number;
        completed: number;
      };
      growth: number;
    }

    interface Review {
      id: number;
      service_title: string;
      rating: number;
      review_text: string;
    }

    interface TopProvider {
      rank: number;
      id: number;
      business_name: string;
      business_photo: string;
      category: string;
      rating: {
        average: number | null;
        count: number;
      };
      bookings: {
        total: number;
        completed: number;
      };
    }

    interface MonthlyBooking {
      Month: string;
      Count: number;
    }

    const Dashboard = () => {
      const router = useRouter();
      const [dashboardStats, setDashboardStats] = useState<DashboardStats>({
        total_users: 0,
        total_verified_providers: 0,
        total_completed_services: 0,
        total_active_services: 0
      });
      const [topServices, setTopServices] = useState<TopService[]>([]);
      const [latestReviews, setLatestReviews] = useState<Review[]>([]);
      const [topProviders, setTopProviders] = useState<TopProvider[]>([]);
      const [monthlyBookings, setMonthlyBookings] = useState<MonthlyBooking[]>([]);
      const [recentActivities, setRecentActivities] = useState<Activity[]>([]);



      useEffect(() => {
        const fetchAllData = async () => {
          try {
            // Fetch dashboard stats
            const statsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/dashboard/stats`);
            const statsData = await statsResponse.json();
            setDashboardStats(statsData);

            // Add this with other fetch calls in fetchAllData
const activitiesResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/activities/recent`);
const activitiesData = await activitiesResponse.json();
setRecentActivities(activitiesData);

            // Fetch top services
            const servicesResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/services/top`);
            const servicesData = await servicesResponse.json();
            setTopServices(servicesData);

            // Fetch latest reviews
            const reviewsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reviews/latest`);
            const reviewsData = await reviewsResponse.json();
            setLatestReviews(reviewsData);

            const providersResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/providers/top`);
            const providersData = await providersResponse.json();
            setTopProviders(providersData);

            // Fetch monthly bookings
            const bookingsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/bookings/monthly-completed`);
            const bookingsData = await bookingsResponse.json();
            setMonthlyBookings(bookingsData);
          } catch (error) {
            console.error('Error fetching dashboard data:', error);
          }
        };

        fetchAllData();
      }, []);

      const getTimeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
        
        if (diffInMinutes < 60) {
          return `${diffInMinutes} minutes ago`;
        } else if (diffInMinutes < 1440) {
          const hours = Math.floor(diffInMinutes / 60);
          return `${hours} hours ago`;
        } else {
          const days = Math.floor(diffInMinutes / 1440);
          return `${days} days ago`;
        }
      };

      return (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-8 space-y-8"
        >
          {/* Welcome Section */}
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-blue-500 to-purple-600">
              Hello, Admin
            </h2>
            <p className="text-lg text-muted-foreground">
              Here's what's happening across your platform today
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
      
            <motion.div 
              whileHover={{ scale: 1.02 }} 
              transition={{ duration: 0.2 }}
              onClick={() => router.push('/service-providers')}
              className="cursor-pointer"
            >
              <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Service Providers</p>
                      <p className="text-3xl font-bold">{dashboardStats.total_verified_providers}</p>
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
      
          {/* Charts and Activities Grid */}
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
    <BarChart 
      data={monthlyBookings}
      margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
      barSize={40}
    >
      <CartesianGrid 
        strokeDasharray="3 3" 
        vertical={false}
        opacity={0.1} 
      />
      <XAxis
        dataKey="Month"
        tickFormatter={(value) => value.substring(0, 3)}
        axisLine={false}
        tickLine={false}
        dy={10}
        tick={{ fill: '#6b7280', fontSize: 14 }}
      />
      <YAxis
        axisLine={false}
        tickLine={false}
        dx={-10}
        tick={{ fill: '#6b7280', fontSize: 14 }}
        domain={[0, Math.max(...monthlyBookings.map(item => item.Count)) + 2]}
        ticks={[0, 1, 2, 3, 4, 5]} // Explicit ticks for better control
        allowDecimals={false}
      />
      <Tooltip
        cursor={{ fill: 'rgba(147, 51, 234, 0.1)' }}
        content={({ active, payload, label }) => {
          if (active && payload && payload.length) {
            return (
              <div className="bg-white px-3 py-2 rounded-lg shadow-md border">
                <p className="font-medium text-sm">{label}</p>
                <p className="text-sm text-purple-600 font-semibold">
                  {payload[0].value} Bookings
                </p>
              </div>
            );
          }
          return null;
        }}
      />
      <Bar 
        dataKey="Count" 
        radius={[4, 4, 0, 0]}
        fill="#8b5cf6"
      />
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
          key={activity.id}
          className="flex items-start space-x-4 p-3 hover:bg-white/50 rounded-lg backdrop-blur-sm transition-all duration-300"
        >
          <div className={`p-2 rounded-full ${
            activity.type === 'booking' 
              ? activity.status === 'completed' 
                ? 'bg-green-100' 
                : 'bg-blue-100'
              : 'bg-yellow-100'
          }`}>
            <Activity className={`h-4 w-4 ${
              activity.type === 'booking'
                ? activity.status === 'completed'
                  ? 'text-green-600'
                  : 'text-blue-600'
                : 'text-yellow-600'
            }`} />
          </div>
          <div className="flex-1">
            <p className="font-medium">
              {activity.type === 'booking' 
                ? `${activity.status === 'completed' ? 'Completed' : 'New'} Booking`
                : 'New Review'}
            </p>
            <p className="text-sm text-muted-foreground">
              {activity.service_title} - {activity.user_name}
              {activity.type === 'review' && activity.rating && (
                <span className="ml-1 text-yellow-500">
                  {'★'.repeat(activity.rating)}
                </span>
              )}
            </p>
            {activity.type === 'booking' && activity.booking_date && (
              <p className="text-xs text-muted-foreground">
                Scheduled for: {new Date(activity.booking_date).toLocaleDateString()} at {activity.booking_time}
              </p>
            )}
            {activity.type === 'review' && activity.review_text && (
              <p className="text-xs text-gray-600 italic">"{activity.review_text}"</p>
            )}
            <p className="text-xs text-muted-foreground mt-1 flex items-center">
              <Clock className="h-3 w-3 mr-1" /> {getTimeAgo(activity.created_at)}
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
                  {topServices.map((service) => (
                    <div key={service.id} className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-lg">
                      <div className="space-y-1">
                        <p className="font-medium">{service.service_title}</p>
                        <p className="text-sm text-muted-foreground">{service.bookings.total} bookings</p>
                      </div>
                      <span className="text-sm text-green-600">
                        ↑ {service.growth}%
                      </span>
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
                  {latestReviews.map((review) => (
                    <div key={review.id} className="space-y-2 p-2 hover:bg-slate-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">{review.service_title}</p>
                        <div className="flex">
                          {Array(5).fill(0).map((_, i) => (
                            <span key={i} className={`text-sm ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}>
                              ★
                            </span>
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{review.review_text}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
      
        {/* Top Providers */}
<Card className="bg-gradient-to-br from-white to-purple-50">
  <CardHeader>
    <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">Top Providers</CardTitle>
    <CardDescription>Best performing service providers</CardDescription>
  </CardHeader>
  <CardContent>
    <div className="space-y-6">
      {topProviders.map((provider, index) => (
        <motion.div
          key={provider.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="group relative p-4 rounded-xl bg-white shadow-sm hover:shadow-md transition-all duration-300"
        >
          <div className="absolute top-0 right-0 mt-4 mr-4">
            <div className={`px-3 py-1 rounded-full ${
              provider.rank <= 3 
                ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-white' 
                : 'bg-gray-100 text-gray-600'
            } text-sm font-semibold`}>
              #{provider.rank}
            </div>
          </div>
          
          <div className="flex items-start space-x-4">
            <div className="relative">
              <div className="h-16 w-16 rounded-lg bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center text-2xl text-white font-bold overflow-hidden shadow-lg group-hover:scale-105 transition-transform duration-300">
                {provider.business_photo ? (
                  <img 
                    src={provider.business_photo} 
                    alt={provider.business_name} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  provider.business_name.charAt(0)
                )}
              </div>
              {provider.rating.average !== null && (
                <div className="absolute -bottom-2 -right-2 bg-white rounded-full px-2 py-1 shadow-sm">
                  <div className="flex items-center">
                    <span className="text-sm font-bold">{provider.rating.average.toFixed(1)}</span>
                    <span className="text-yellow-400 ml-1">★</span>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex-1 pt-1">
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-purple-600 transition-colors duration-300">
                {provider.business_name}
              </h3>
              
              <div className="mt-2 flex flex-wrap gap-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  {provider.category}
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {provider.bookings.completed} completed
                </span>
                {provider.rating.count > 0 && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {provider.rating.count} reviews
                  </span>
                )}
              </div>
              
              <div className="mt-3 w-full bg-gray-100 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(provider.bookings.completed / Math.max(...topProviders.map(p => p.bookings.completed))) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  </CardContent>
</Card>
          </div>
      
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