/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import {
  Users,
  UserPlus,
  BarChart3,
  Settings,
  RefreshCw,
  Calendar,
  Shield,
  Activity,
  BookOpen,
  CheckCircle,
  Clock,
  XCircle,
  FileText,
  PieChart,
  AlertTriangle,
  Database,
  Server,
  Cpu,
  Network,
} from "lucide-react";
import { getUsers } from "../../store/slices/userSlice";
import { getAllBookings } from "../../store/slices/bookingSlice";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [systemHealth, setSystemHealth] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const dispatch = useDispatch();
  const { users } = useSelector((state) => state.users);
  const { bookings } = useSelector((state) => state.bookings);

  // Mock function to check system health - in real app, this would be API calls
  const checkSystemHealth = async () => {
    return {
      database: Math.random() > 0.1, // 90% chance of being healthy
      api: Math.random() > 0.05, // 95% chance of being healthy
      server: Math.random() > 0.02, // 98% chance of being healthy
      responseTime: Math.floor(Math.random() * 200) + 50, // 50-250ms
    };
  };

  const loadData = async () => {
    setRefreshing(true);
    try {
      const [usersData, bookingsData, healthData] = await Promise.all([
        dispatch(getUsers()).unwrap(),
        dispatch(getAllBookings()).unwrap(),
        checkSystemHealth(),
      ]);

      let healthScore = 100;
      if (!healthData.database) healthScore -= 40;
      if (!healthData.api) healthScore -= 40;
      if (!healthData.server) healthScore -= 20;
      if (healthData.responseTime > 500) healthScore -= 10;
      else if (healthData.responseTime > 300) healthScore -= 5;

      setSystemHealth({
        ...healthData,
        score: Math.max(0, healthScore),
      });
    } catch (error) {
      console.error("Error loading data:", error);
      // If API calls fail, assume system issues
      setSystemHealth({
        database: false,
        api: false,
        server: false,
        responseTime: 1000,
        score: 0,
      });
    } finally {
      setRefreshing(false);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (users && bookings && systemHealth) {
      const totalUsers = users.length;
      const managers = users.filter((u) => u.role === "manager").length;
      const regularUsers = users.filter((u) => u.role === "user").length;
      const totalBookings = bookings.length;
      const pendingBookings = bookings.filter(
        (b) => b.status === "pending"
      ).length;
      const approvedBookings = bookings.filter(
        (b) => b.status === "approved"
      ).length;
      const completedBookings = bookings.filter(
        (b) => b.status === "completed"
      ).length;
      const rejectedBookings = bookings.filter(
        (b) => b.status === "rejected"
      ).length;
      const activeBookings = pendingBookings + approvedBookings;

      setStats({
        totalUsers,
        managers,
        regularUsers,
        totalBookings,
        pendingBookings,
        approvedBookings,
        completedBookings,
        rejectedBookings,
        activeBookings,
      });
    }
  }, [users, bookings, systemHealth]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <LoadingSpinner size="large" />
        <span className="mt-4 text-gray-600 dark:text-gray-400">
          Loading dashboard...
        </span>
      </div>
    );
  }

  const StatCard = ({ title, value, icon: Icon, color, subtitle }) => (
    <Card className="p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className={`p-3 rounded-2xl ${color} bg-opacity-15`}>
            <Icon className={`w-6 h-6 ${color.replace("text-", "text-")}`} />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {title}
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {value}
            </p>
            {subtitle && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {subtitle}
              </p>
            )}
          </div>
        </div>
      </div>
    </Card>
  );

  const SystemStatusIndicator = ({ component, status, responseTime }) => (
    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
      <div className="flex items-center">
        <div
          className={`w-3 h-3 rounded-full mr-3 ${
            status ? "bg-green-500" : "bg-red-500"
          }`}
        ></div>
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {component}
        </span>
      </div>
      <span
        className={`text-sm ${
          status
            ? "text-green-600 dark:text-green-400"
            : "text-red-600 dark:text-red-400"
        }`}
      >
        {status ? "Operational" : "Offline"}
      </span>
    </div>
  );

  const QuickActionCard = ({
    icon: Icon,
    title,
    description,
    to,
    buttonText,
    variant = "primary",
  }) => (
    <Card className="p-6 hover:shadow-lg transition-all duration-300 group">
      <div className="flex items-start mb-4">
        <div className="p-3 rounded-2xl bg-blue-100 dark:bg-blue-900/20 group-hover:scale-110 transition-transform">
          <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        </div>
        <div className="ml-4 flex-1">
          <h4 className="font-semibold text-gray-900 dark:text-white">
            {title}
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {description}
          </p>
        </div>
      </div>
      <Link to={to}>
        <Button variant={variant} className="w-full">
          {buttonText}
        </Button>
      </Link>
    </Card>
  );

  const getHealthStatus = (score) => {
    if (score >= 90)
      return { text: "Excellent", color: "text-green-600", bg: "bg-green-100" };
    if (score >= 70)
      return { text: "Good", color: "text-blue-600", bg: "bg-blue-100" };
    if (score >= 50)
      return { text: "Fair", color: "text-yellow-600", bg: "bg-yellow-100" };
    return { text: "Poor", color: "text-red-600", bg: "bg-red-100" };
  };

  const healthStatus = systemHealth
    ? getHealthStatus(systemHealth.score)
    : getHealthStatus(0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Comprehensive overview of your service booking platform
          </p>
        </div>
        <Button
          onClick={loadData}
          disabled={refreshing}
          variant="outline"
          className="flex items-center whitespace-nowrap"
        >
          <RefreshCw
            className={`w-4 h-4 mr-2 ${refreshing ? "animate-spin" : ""}`}
          />
          Refresh Data
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={stats?.totalUsers || 0}
          icon={Users}
          color="text-blue-600 dark:text-blue-400"
          subtitle={`${stats?.managers || 0} managers`}
        />
        <StatCard
          title="Active Bookings"
          value={stats?.activeBookings || 0}
          icon={Activity}
          color="text-green-600 dark:text-green-400"
          subtitle={`${stats?.pendingBookings || 0} pending`}
        />
        <StatCard
          title="Total Bookings"
          value={stats?.totalBookings || 0}
          icon={BookOpen}
          color="text-purple-600 dark:text-purple-400"
          subtitle={`${stats?.completedBookings || 0} completed`}
        />
        <StatCard
          title="System Health"
          value={`${systemHealth?.score || 0}%`}
          icon={Settings}
          color={healthStatus.color}
          subtitle={healthStatus.text}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* System Health Overview */}
        <Card className="lg:col-span-1 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Activity className="w-5 h-5 mr-2 text-green-600" />
            System Health
          </h3>
          <div className="space-y-4">
            <SystemStatusIndicator
              component="Database"
              status={systemHealth?.database}
            />
            <SystemStatusIndicator
              component="API Server"
              status={systemHealth?.api}
            />
            <SystemStatusIndicator
              component="Application Server"
              status={systemHealth?.server}
            />
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center">
                <Network className="w-4 h-4 text-blue-600 mr-2" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Response Time
                </span>
              </div>
              <span
                className={`text-sm font-medium ${
                  systemHealth?.responseTime < 200
                    ? "text-green-600 dark:text-green-400"
                    : systemHealth?.responseTime < 500
                    ? "text-yellow-600 dark:text-yellow-400"
                    : "text-red-600 dark:text-red-400"
                }`}
              >
                {systemHealth?.responseTime}ms
              </span>
            </div>
          </div>
        </Card>

        {/* Quick Actions */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
            <Settings className="w-5 h-5 mr-2 text-blue-600" />
            Management Quick Actions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <QuickActionCard
              icon={Users}
              title="User Management"
              description="View, manage, and monitor all user accounts"
              to="/admin/users"
              buttonText="Manage Users"
              variant="primary"
            />
            <QuickActionCard
              icon={Shield}
              title="Manager Management"
              description="Create and manage manager accounts"
              to="/admin/managers"
              buttonText="Manage Managers"
              variant="primary"
            />
            <QuickActionCard
              icon={BookOpen}
              title="Booking Management"
              description="Monitor and manage all bookings"
              to="/manager/bookings"
              buttonText="View Bookings"
              variant="outline"
            />
            <QuickActionCard
              icon={PieChart}
              title="System Analytics"
              description="View detailed platform analytics"
              to="/admin/analytics"
              buttonText="View Analytics"
              variant="outline"
            />
          </div>
        </div>
      </div>

      {/* System Overview Section */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <Server className="w-5 h-5 mr-2 text-blue-600" />
          System Overview & Performance
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* System Health Indicator */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-4 rounded-lg">
            <div className="flex items-center mb-3">
              <Activity className="w-5 h-5 text-green-600 dark:text-green-400 mr-2" />
              <span className="font-medium text-green-800 dark:text-green-300">
                Overall Health
              </span>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-700 dark:text-green-300 mb-2">
                {systemHealth?.score || 0}%
              </div>
              <div className="w-full bg-green-200 dark:bg-green-700 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${systemHealth?.score || 0}%` }}
                ></div>
              </div>
              <p className="text-xs text-green-600 dark:text-green-400 mt-2">
                Based on system component status
              </p>
            </div>
          </div>

          {/* Database Health */}
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <div className="flex items-center mb-3">
              <Database className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2" />
              <span className="font-medium text-blue-800 dark:text-blue-300">
                Database
              </span>
            </div>
            <div className="text-center">
              <div
                className={`text-2xl font-bold mb-2 ${
                  systemHealth?.database
                    ? "text-blue-700 dark:text-blue-300"
                    : "text-red-700 dark:text-red-300"
                }`}
              >
                {systemHealth?.database ? "Online" : "Offline"}
              </div>
              <div className="text-sm text-blue-600 dark:text-blue-400">
                MongoDB Connection
              </div>
            </div>
          </div>

          {/* API Health */}
          <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
            <div className="flex items-center mb-3">
              <Cpu className="w-5 h-5 text-purple-600 dark:text-purple-400 mr-2" />
              <span className="font-medium text-purple-800 dark:text-purple-300">
                API Server
              </span>
            </div>
            <div className="text-center">
              <div
                className={`text-2xl font-bold mb-2 ${
                  systemHealth?.api
                    ? "text-purple-700 dark:text-purple-300"
                    : "text-red-700 dark:text-red-300"
                }`}
              >
                {systemHealth?.api ? "Online" : "Offline"}
              </div>
              <div className="text-sm text-purple-600 dark:text-purple-400">
                Express.js Server
              </div>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
            <div className="flex items-center mb-3">
              <Network className="w-5 h-5 text-orange-600 dark:text-orange-400 mr-2" />
              <span className="font-medium text-orange-800 dark:text-orange-300">
                Performance
              </span>
            </div>
            <div className="text-center">
              <div
                className={`text-2xl font-bold mb-2 ${
                  systemHealth?.responseTime < 200
                    ? "text-green-700 dark:text-green-300"
                    : systemHealth?.responseTime < 500
                    ? "text-yellow-700 dark:text-yellow-300"
                    : "text-red-700 dark:text-red-300"
                }`}
              >
                {systemHealth?.responseTime}ms
              </div>
              <div className="text-sm text-orange-600 dark:text-orange-400">
                Avg Response Time
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AdminDashboard;