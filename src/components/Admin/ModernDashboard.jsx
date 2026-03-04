'use client'
import React, { useState, useEffect } from "react";

import { motion } from "framer-motion";

import { useRouter } from 'next/navigation';

import {

  DocumentTextIcon,

  EyeIcon,

  ArrowTrendingUpIcon,

  ArrowTrendingDownIcon,

  UsersIcon,

  CalendarIcon,

  PlusIcon,

  ArrowTopRightOnSquareIcon,

  ExclamationTriangleIcon,

} from "@heroicons/react/24/outline";

import Card, { CardContent, CardHeader, CardTitle } from "../UI/Card";

import Button from "../UI/Button";

import dashboardAPI from "../../lib/dashboardAPI";

import toast from "react-hot-toast";



const ModernDashboard = () => {

  const router = useRouter();



  // State for dashboard data

  const [dashboardData, setDashboardData] = useState({ stats: null });

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);



  // Fetch dashboard data on component mount

  useEffect(() => {

    const fetchDashboardData = async () => {

      try {

        setLoading(true);

        setError(null);



        // Fetch stats data

        const [statsData] = await Promise.all([dashboardAPI.getDashboardStats()]);



        // Transform stats data into the format expected by the UI

        const stats = [

          {

            id: 1,

            name: "Total Pages",

            value: statsData.pages.total.toString(),

            change: "+12%", // This would need historical data to calculate

            changeType: "increase",

            icon: DocumentTextIcon,

            color: "blue",

          },

          {

            id: 2,

            name: "Published Pages",

            value: statsData.pages.published.toString(),

            change: "+8%",

            changeType: "increase",

            icon: EyeIcon,

            color: "green",

          },

          {

            id: 3,

            name: "Total Media",

            value: statsData.media.totalMedia?.toString() || "0",

            change: "+5%",

            changeType: "increase",

            icon: DocumentTextIcon,

            color: "purple",

          },

          {

            id: 4,

            name: "Contact Messages",

            value: statsData.contact.totalMessages?.toString() || "0",

            change: "+15%",

            changeType: "increase",

            icon: UsersIcon,

            color: "orange",

          },

        ];



        setDashboardData({ stats });

      } catch (err) {

        console.error("Error fetching dashboard data:", err);

        setError(err.message || "Failed to load dashboard data");

        toast.error("Failed to load dashboard data");

      } finally {

        setLoading(false);

      }

    };



    fetchDashboardData();

  }, []);



  // Time formatting helper removed (not used after Recent Activity removal)



  // Helper function to handle quick action clicks

  const handleQuickAction = (action) => {

    switch (action.id) {

      case 1: // Create New Page

        router.push("/admin/pages/enhanced-create");

        toast.success("Redirecting to page creation...");

        break;

      case 2: // Manage Pages

        router.push("/admin/pages");

        toast.success("Opening pages management...");

        break;

      case 3: // View Site

        window.open("/", "_blank");

        toast.success("Opening site in new tab...");

        break;

      case 4: // Analytics

        // For now, show a message since analytics page might not exist yet

        toast("Analytics feature coming soon!", {

          icon: "ℹ",

          duration: 3000,

        });

        break;

      default:

        console.log("Unknown action:", action);

    }

  };



  const quickActions = [

    {

      id: 1,

      name: "Create New Page",

      description: "Add a new page to your site",

      icon: PlusIcon,

      action: "/admin/pages/enhanced-create",

      color: "blue",

    },

    {

      id: 2,

      name: "Manage Pages",

      description: "Edit and organize your pages",

      icon: DocumentTextIcon,

      action: "/admin/pages",

      color: "purple",

    },

    {

      id: 3,

      name: "View Site",

      description: "Preview your live website",

      icon: ArrowTopRightOnSquareIcon,

      action: "/",

      color: "green",

    },

    {

      id: 4,

      name: "Analytics",

      description: "View detailed statistics",

      icon: ArrowTrendingUpIcon,

      action: "/admin/analytics",

      color: "orange",

    },

  ];



  // getColorClasses removed (not used after simplification)



  // Recent activity has been removed from the dashboard UI per request.



  // Loading state

  if (loading) {

    return (

      <div className="space-y-6 text-white">

        <div className="mb-8">

          <h2 className="text-3xl font-bold text-[var(--color-text-inverse)] mb-2">

            Welcome back! 

          </h2>

          <p className="text-[var(--color-ww-100)] text-lg">

            Loading your dashboard...

          </p>

        </div>



        {/* Loading skeleton */}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

          {[1, 2, 3, 4].map((i) => (

            <Card

              key={i}

              className="bg-[var(--color-white-10)] border border-[var(--color-white-20)] shadow animate-pulse"

            >

              <CardContent>

                <div className="flex items-center justify-between">

                  <div className="space-y-2">

                    <div className="h-4 bg-[var(--color-white-20)] rounded w-20"></div>

                    <div className="h-8 bg-[var(--color-white-20)] rounded w-16"></div>

                    <div className="h-3 bg-[var(--color-white-20)] rounded w-24"></div>

                  </div>

                  <div className="h-12 w-12 bg-[var(--color-white-20)] rounded-lg"></div>

                </div>

              </CardContent>

            </Card>

          ))}

        </div>

      </div>

    );

  }



  // Error state

  if (error) {

    return (

      <div className="space-y-6 text-white">

        <div className="mb-8">

          <h2 className="text-3xl font-bold text-[var(--color-text-inverse)] mb-2">

            Welcome back! 

          </h2>

          <p className="text-[var(--color-ww-100)] text-lg">

            There was an error loading your dashboard.

          </p>

        </div>



        <Card className="bg-[var(--tw-red-500)]/10 border border-[var(--tw-red-500)]/20 shadow">

          <CardContent className="p-6">

            <div className="flex items-center space-x-3">

              <ExclamationTriangleIcon className="h-6 w-6 text-[var(--tw-red-400)]" />

              <div>

                <h3 className="text-lg font-medium text-[var(--tw-red-400)]">

                  Error Loading Dashboard

                </h3>

                <p className="text-[var(--tw-red-300)]">{error}</p>

                <Button

                  onClick={() => window.location.reload()}

                  className="mt-3 bg-[var(--tw-red-600)] hover:bg-[var(--tw-red-700)] text-[var(--color-text-inverse)]"

                >

                  Retry

                </Button>

              </div>

            </div>

          </CardContent>

        </Card>

      </div>

    );

  }



  const { stats } = dashboardData;



  return (

    <div

      className="dashboard admin-dashboard space-y-6 text-white"

      data-dashboard="true"

    >

      {/* Welcome Section */}

      <div className="mb-8">

        <motion.div

          initial={{ opacity: 0, y: 20 }}

          animate={{ opacity: 1, y: 0 }}

          transition={{ duration: 0.5 }}

        >

          <h2 className="text-3xl font-bold text-[var(--color-text-inverse)] mb-2">

            Welcome back! 

          </h2>

          <p className="text-[var(--color-ww-100)] text-lg">

            Here's what's happening with your website today.

          </p>

        </motion.div>

      </div>



      {/* Stats Grid */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

        {stats.map((stat, index) => {

          const IconComponent = stat.icon;

          const TrendIcon =

            stat.changeType === "increase"

              ? ArrowTrendingUpIcon

              : ArrowTrendingDownIcon;



          return (

            <motion.div

              key={stat.id}

              initial={{ opacity: 0, y: 20 }}

              animate={{ opacity: 1, y: 0 }}

              transition={{ duration: 0.5, delay: index * 0.1 }}

            >

              <Card className="bg-[var(--color-white-10)] border border-[var(--color-white-20)] shadow transition-transform duration-200 hover:-translate-y-0.5">

                <CardContent>

                  <div className="flex items-center justify-between">

                    <div>

                      <p className="text-sm font-medium text-[var(--color-ww-100)]">

                        {stat.name}

                      </p>

                      <p className="text-3xl font-bold text-[var(--color-text-inverse)] mt-2">

                        {stat.value}

                      </p>

                      <div className="flex items-center mt-2">

                        <TrendIcon

                          className={`h-4 w-4 mr-1 ${

                            stat.changeType === "increase"

                              ? "text-[var(--tw-green-500)]"

                              : "text-[var(--tw-red-500)]"

                          }`}

                        />

                        <span

                          className={`text-sm font-medium ${

                            stat.changeType === "increase"

                              ? "text-[var(--tw-green-400)]"

                              : "text-[var(--tw-red-400)]"

                          }`}

                        >

                          {stat.change}

                        </span>

                        <span className="text-sm text-[var(--color-text-light)] ml-2">

                          vs last month

                        </span>

                      </div>

                    </div>

                    <div

                      className={`p-3 rounded-lg bg-[var(--color-white-10)] border border-[var(--color-white-20)]`}

                    >

                      <IconComponent

                        className={`h-6 w-6 text-[var(--color-text-inverse)]/90`}

                      />

                    </div>

                  </div>

                </CardContent>

              </Card>

            </motion.div>

          );

        })}

      </div>



      {/* Quick Actions & Recent Activity */}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Quick Actions */}

        <motion.div

          className="lg:col-span-2"

          initial={{ opacity: 0, x: -20 }}

          animate={{ opacity: 1, x: 0 }}

          transition={{ duration: 0.5, delay: 0.4 }}

        >

          <Card className="bg-[var(--color-white-10)] border border-[var(--color-white-20)] shadow">

            <CardHeader>

              <CardTitle className="text-[var(--color-text-inverse)]">

                Quick Actions

              </CardTitle>

            </CardHeader>

            <CardContent>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {quickActions.map((action, index) => {

                  const IconComponent = action.icon;

                  return (

                    <motion.div

                      key={action.id}

                      initial={{ opacity: 0, y: 12 }}

                      animate={{ opacity: 1, y: 0 }}

                      transition={{ duration: 0.35, delay: index * 0.05 }}

                      whileHover={{ scale: 1.01 }}

                      onClick={() => handleQuickAction(action)}

                      className="cursor-pointer"

                    >

                      <Card className="bg-[var(--color-white-10)] border border-[var(--color-white-20)] hover:-translate-y-0.5 transition-transform duration-200">

                        <CardContent>

                          <div className="flex items-center justify-between">

                            <div>

                              <p className="text-sm font-medium text-[var(--color-ww-100)]">

                                {action.name}

                              </p>

                              <p className="text-base font-semibold text-[var(--color-text-inverse)] mt-2">

                                {action.description}

                              </p>

                              <div className="mt-2 text-sm text-[var(--color-text-light)]">

                                Click to continue

                              </div>

                            </div>

                            <div className="p-3 rounded-lg bg-[var(--color-white-10)] border border-[var(--color-white-20)]">

                              <IconComponent className="h-6 w-6 text-[var(--color-text-inverse)]/90" />

                            </div>

                          </div>

                        </CardContent>

                      </Card>

                    </motion.div>

                  );

                })}

              </div>

            </CardContent>

          </Card>

        </motion.div>



        {/* Recent Activity removed per request */}

      </div>



      {/* System Status removed per request */}

    </div>

  );

};



export default ModernDashboard;

