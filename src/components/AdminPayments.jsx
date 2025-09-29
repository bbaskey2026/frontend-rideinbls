import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from "recharts";
import {
  TrendingUp,
  DollarSign,
  CreditCard,
  Users,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  AlertCircle,
  Car,
  MapPin
} from "lucide-react";
import "./AdminPayments.css";
import API_ENDPOINTS from "../config/api"; 
const AdminPayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalAmount, setTotalAmount] = useState(0);
  const [netRevenue, setNetRevenue] = useState(0); // Revenue after refunds
  const [analytics, setAnalytics] = useState({
    dailyRevenue: [],
    monthlyStats: {},
    statusDistribution: [],
    topUsers: [],
    vehicleTypeRevenue: [],
    revenueComparison: [],
    averageBookingValue: 0,
    totalRefunds: 0,
    popularRoutes: [],
    hourlyBookings: []
  });

  const fetchPayments = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      
      const res = await axios.get(API_ENDPOINTS.PAYMENTS.ALL_PAYMENTS, { headers });;
      
      let data = res.data;
      if (res.data.success && res.data.data) {
        data = res.data.data;
      } else if (res.data.payments) {
        data = res.data.payments;
      }

      if (!Array.isArray(data)) {
        throw new Error('Invalid data format: expected array of payments');
      }

      console.log('Fetched payments:', data);
      setPayments(data);

      // Calculate financial metrics properly
      const financialMetrics = calculateFinancialMetrics(data);
      setTotalAmount(financialMetrics.totalRevenue);
      setNetRevenue(financialMetrics.netRevenue);

      // Generate comprehensive analytics
      const analyticsData = {
        dailyRevenue: generateDailyRevenue(data),
        statusDistribution: generateStatusDistribution(data),
        monthlyStats: generateMonthlyStats(data),
        topUsers: generateTopUsers(data),
        vehicleTypeRevenue: generateVehicleTypeRevenue(data),
        revenueComparison: generateRevenueComparison(data),
        averageBookingValue: financialMetrics.averageBookingValue,
        totalRefunds: financialMetrics.totalRefunds,
        popularRoutes: generatePopularRoutes(data),
        hourlyBookings: generateHourlyBookings(data)
      };
      
      setAnalytics(analyticsData);

    } catch (err) {
      console.error("Error fetching payments:", err);
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.error || 
                          err.message || 
                          'Failed to fetch payment data';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  // Fixed financial metrics calculation
  const calculateFinancialMetrics = (payments) => {
    let totalRevenue = 0;
    let totalRefunds = 0;
    let successfulPayments = 0;

    payments.forEach(p => {
      const amount = parseFloat(p.amountPaid) || 0;
      const status = p.paymentStatus?.toLowerCase() || 'unknown';
      
      if (status === 'paid' || status === 'completed' || status === 'success') {
        totalRevenue += amount;
        successfulPayments++;
      } else if (status === 'refunded') {
        totalRefunds += amount;
        // Don't count refunded amounts as revenue
      }
    });

    const netRevenue = totalRevenue - totalRefunds;
    const averageBookingValue = successfulPayments > 0 ? Math.round(totalRevenue / successfulPayments) : 0;

    return {
      totalRevenue,
      totalRefunds,
      netRevenue,
      averageBookingValue,
      successfulPayments
    };
  };

  // Fixed daily revenue calculation
  const generateDailyRevenue = (payments) => {
    const last30Days = {};
    
    // Initialize last 30 days
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      last30Days[dateStr] = { 
        revenue: 0, 
        refunds: 0, 
        netRevenue: 0, 
        transactions: 0, 
        date: dateStr 
      };
    }

    // Fill with actual data
    payments.forEach(p => {
      if (!p.createdAt) return;
      
      const paymentDate = new Date(p.createdAt);
      if (isNaN(paymentDate.getTime())) return;
      
      const dateStr = paymentDate.toISOString().split('T')[0];
      const amount = parseFloat(p.amountPaid) || 0;
      const status = p.paymentStatus?.toLowerCase() || 'unknown';
      
      if (last30Days[dateStr]) {
        last30Days[dateStr].transactions += 1;
        
        if (status === 'paid' || status === 'completed' || status === 'success') {
          last30Days[dateStr].revenue += amount;
        } else if (status === 'refunded') {
          last30Days[dateStr].refunds += amount;
        }
        
        last30Days[dateStr].netRevenue = last30Days[dateStr].revenue - last30Days[dateStr].refunds;
      }
    });

    return Object.values(last30Days).map(day => ({
      date: new Date(day.date).toLocaleDateString('en', { month: 'short', day: 'numeric' }),
      revenue: day.revenue,
      refunds: day.refunds,
      netRevenue: day.netRevenue,
      transactions: day.transactions
    }));
  };

  // Fixed status distribution
  const generateStatusDistribution = (payments) => {
    const statusCount = payments.reduce((acc, p) => {
      let status = (p.paymentStatus?.toLowerCase() || 'unknown');
      
      // Normalize status names
      if (status === 'completed' || status === 'success') {
        status = 'paid';
      }
      
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});

    const colors = { 
      paid: '#22c55e', 
      pending: '#f59e0b', 
      failed: '#ef4444',
      refunded: '#8b5cf6',
      cancelled: '#6b7280',
      unknown: '#94a3b8'
    };

    return Object.entries(statusCount).map(([status, count]) => ({
      name: status.charAt(0).toUpperCase() + status.slice(1),
      value: count,
      color: colors[status] || '#6b7280',
      percentage: ((count / payments.length) * 100).toFixed(1)
    }));
  };

  // Fixed monthly stats with proper growth calculation
  const generateMonthlyStats = (payments) => {
    const now = new Date();
    
    const getMonthPayments = (monthOffset) => {
      const targetDate = new Date();
      targetDate.setMonth(targetDate.getMonth() - monthOffset);
      
      return payments.filter(p => {
        if (!p.createdAt) return false;
        const d = new Date(p.createdAt);
        if (isNaN(d.getTime())) return false;
        return d.getMonth() === targetDate.getMonth() && 
               d.getFullYear() === targetDate.getFullYear();
      });
    };

    const thisMonth = getMonthPayments(0);
    const lastMonth = getMonthPayments(1);

    const thisMonthRevenue = thisMonth
      .filter(p => ['paid', 'completed', 'success'].includes(p.paymentStatus?.toLowerCase()))
      .reduce((sum, p) => sum + (parseFloat(p.amountPaid) || 0), 0);

    const lastMonthRevenue = lastMonth
      .filter(p => ['paid', 'completed', 'success'].includes(p.paymentStatus?.toLowerCase()))
      .reduce((sum, p) => sum + (parseFloat(p.amountPaid) || 0), 0);

    const transactionGrowth = lastMonth.length === 0 ? 
      (thisMonth.length > 0 ? 100 : 0) : 
      ((thisMonth.length - lastMonth.length) / lastMonth.length * 100);

    const revenueGrowth = lastMonthRevenue === 0 ?
      (thisMonthRevenue > 0 ? 100 : 0) :
      ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue * 100);

    return {
      thisMonth: thisMonth.length,
      lastMonth: lastMonth.length,
      thisMonthRevenue,
      lastMonthRevenue,
      transactionGrowth: Math.round(transactionGrowth * 10) / 10,
      revenueGrowth: Math.round(revenueGrowth * 10) / 10
    };
  };

  // Fixed top users calculation
  const generateTopUsers = (payments) => {
    const userTotals = {};
    
    payments.forEach(p => {
      if (!p.user) return;
      
      const userId = p.user.email || p.user._id || 'unknown';
      const amount = parseFloat(p.amountPaid) || 0;
      const status = p.paymentStatus?.toLowerCase() || 'unknown';
      
      if (!userTotals[userId]) {
        userTotals[userId] = { 
          name: p.user.name || p.user.username || 'Unknown User', 
          email: p.user.email || 'No email', 
          total: 0, 
          refunded: 0,
          netTotal: 0,
          transactions: 0,
          lastActivity: p.createdAt
        };
      }
      
      userTotals[userId].transactions += 1;
      
      if (status === 'paid' || status === 'completed' || status === 'success') {
        userTotals[userId].total += amount;
      } else if (status === 'refunded') {
        userTotals[userId].refunded += amount;
      }
      
      userTotals[userId].netTotal = userTotals[userId].total - userTotals[userId].refunded;
      
      // Keep track of most recent activity
      if (new Date(p.createdAt) > new Date(userTotals[userId].lastActivity)) {
        userTotals[userId].lastActivity = p.createdAt;
      }
    });

    return Object.values(userTotals)
      .filter(user => user.netTotal > 0) // Only show users with positive net revenue
      .sort((a, b) => b.netTotal - a.netTotal)
      .slice(0, 10);
  };

  // Fixed vehicle type revenue calculation
  const generateVehicleTypeRevenue = (payments) => {
    const typeRevenue = {};
    
    payments.forEach(p => {
      const amount = parseFloat(p.amountPaid) || 0;
      const status = p.paymentStatus?.toLowerCase() || 'unknown';
      const type = p.vehicle?.type || p.vehicleType || p.vehicle?.name || 'Unknown';
      
      if (!typeRevenue[type]) {
        typeRevenue[type] = { 
          type, 
          revenue: 0, 
          refunded: 0,
          netRevenue: 0,
          bookings: 0,
          successfulBookings: 0
        };
      }
      
      typeRevenue[type].bookings += 1;
      
      if (status === 'paid' || status === 'completed' || status === 'success') {
        typeRevenue[type].revenue += amount;
        typeRevenue[type].successfulBookings += 1;
      } else if (status === 'refunded') {
        typeRevenue[type].refunded += amount;
      }
      
      typeRevenue[type].netRevenue = typeRevenue[type].revenue - typeRevenue[type].refunded;
    });

    return Object.values(typeRevenue)
      .filter(type => type.successfulBookings > 0)
      .sort((a, b) => b.netRevenue - a.netRevenue);
  };

  // Fixed revenue comparison for last 6 months
  const generateRevenueComparison = (payments) => {
    const last6Months = [];
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      
      const monthPayments = payments.filter(p => {
        if (!p.createdAt) return false;
        const pDate = new Date(p.createdAt);
        if (isNaN(pDate.getTime())) return false;
        return pDate.getFullYear() === date.getFullYear() && 
               pDate.getMonth() === date.getMonth();
      });

      const monthRevenue = monthPayments
        .filter(p => ['paid', 'completed', 'success'].includes(p.paymentStatus?.toLowerCase()))
        .reduce((sum, p) => sum + (parseFloat(p.amountPaid) || 0), 0);

      const monthRefunds = monthPayments
        .filter(p => p.paymentStatus?.toLowerCase() === 'refunded')
        .reduce((sum, p) => sum + (parseFloat(p.amountPaid) || 0), 0);

      last6Months.push({
        month: date.toLocaleDateString('en', { month: 'short', year: '2-digit' }),
        revenue: monthRevenue,
        refunds: monthRefunds,
        netRevenue: monthRevenue - monthRefunds
      });
    }
    
    return last6Months;
  };

  // Fixed popular routes calculation
  const generatePopularRoutes = (payments) => {
    const routes = {};
    
    payments.forEach(p => {
      const status = p.paymentStatus?.toLowerCase() || 'unknown';
      const amount = parseFloat(p.amountPaid) || 0;
      
      const origin = p.origin || p.pickup || p.route?.origin || 'Unknown';
      const destination = p.destination || p.dropoff || p.route?.destination || 'Unknown';
      const routeKey = `${origin} → ${destination}`;
      
      if (!routes[routeKey]) {
        routes[routeKey] = { 
          route: routeKey, 
          bookings: 0, 
          revenue: 0,
          refunded: 0,
          netRevenue: 0
        };
      }
      
      routes[routeKey].bookings += 1;
      
      if (status === 'paid' || status === 'completed' || status === 'success') {
        routes[routeKey].revenue += amount;
      } else if (status === 'refunded') {
        routes[routeKey].refunded += amount;
      }
      
      routes[routeKey].netRevenue = routes[routeKey].revenue - routes[routeKey].refunded;
    });

    return Object.values(routes)
      .filter(route => route.bookings > 0)
      .sort((a, b) => b.bookings - a.bookings)
      .slice(0, 10);
  };

  // Fixed hourly bookings calculation
  const generateHourlyBookings = (payments) => {
    const hourlyData = {};
    
    // Initialize all hours
    for (let i = 0; i < 24; i++) {
      hourlyData[i] = { 
        hour: i, 
        bookings: 0, 
        revenue: 0,
        successfulBookings: 0
      };
    }
    
    payments.forEach(p => {
      if (!p.createdAt) return;
      
      const date = new Date(p.createdAt);
      if (isNaN(date.getTime())) return;
      
      const hour = date.getHours();
      const amount = parseFloat(p.amountPaid) || 0;
      const status = p.paymentStatus?.toLowerCase() || 'unknown';
      
      hourlyData[hour].bookings += 1;
      
      if (status === 'paid' || status === 'completed' || status === 'success') {
        hourlyData[hour].revenue += amount;
        hourlyData[hour].successfulBookings += 1;
      }
    });

    return Object.values(hourlyData).map(h => ({
      hour: `${h.hour.toString().padStart(2, '0')}:00`,
      bookings: h.bookings,
      successfulBookings: h.successfulBookings,
      revenue: h.revenue
    }));
  };

  const MetricCard = ({ title, value, change, icon: Icon, color = "blue", subtitle }) => (
    <div className={`metric-card ${color}`}>
      <div className="metric-header">
        <span className="metric-title">{title}</span>
        <Icon className="metric-icon" size={20} />
      </div>
      <div className="metric-value">{value}</div>
      {subtitle && <div className="metric-subtitle">{subtitle}</div>}
      {change !== undefined && (
        <div className={`metric-change ${change >= 0 ? 'positive' : 'negative'}`}>
          {change >= 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
          {Math.abs(change).toFixed(1)}% vs last month
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="dashboard">
        <div className="dashboard-loading">
          <RefreshCw className="loading-spinner" size={32} />
          <p>Loading payment analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard">
        <div className="dashboard-error">
          <AlertCircle size={32} />
          <h3>Error Loading Data</h3>
          <p>{error}</p>
          <button onClick={fetchPayments} className="retry-button">
            <RefreshCw size={16} />
            Retry
          </button>
        </div>
      </div>
    );
  }

  const successfulPayments = payments.filter(p => 
    ['paid', 'completed', 'success'].includes(p.paymentStatus?.toLowerCase())
  );
  
  const successRate = payments.length > 0 ? 
    (successfulPayments.length / payments.length * 100) : 0;

  const uniqueUsers = new Set(
    payments
      .filter(p => p.user?.email)
      .map(p => p.user.email)
  ).size;

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Payment Analytics Dashboard</h1>
        <div className="header-actions">
          <div className="date-range">
            <Calendar size={16} />
            <span>Last 30 days</span>
          </div>
          <button onClick={fetchPayments} className="refresh-btn" title="Refresh data">
            <RefreshCw size={16} />
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="metrics-grid">
        <MetricCard
          title="Net Revenue"
          value={`₹${netRevenue.toLocaleString('en-IN')}`}
          subtitle={`Gross: ₹${totalAmount.toLocaleString('en-IN')}`}
          change={analytics.monthlyStats.revenueGrowth}
          icon={DollarSign}
          color="green"
        />
        <MetricCard
          title="Total Transactions"
          value={payments.length.toLocaleString()}
          change={analytics.monthlyStats.transactionGrowth}
          icon={CreditCard}
          color="blue"
        />
        <MetricCard
          title="Success Rate"
          value={`${successRate.toFixed(1)}%`}
          subtitle={`${successfulPayments.length} successful`}
          icon={TrendingUp}
          color="green"
        />
        <MetricCard
          title="Average Booking Value"
          value={`₹${analytics.averageBookingValue.toLocaleString('en-IN')}`}
          icon={DollarSign}
          color="blue"
        />
        <MetricCard
          title="Active Users"
          value={uniqueUsers.toLocaleString()}
          icon={Users}
          color="purple"
        />
        <MetricCard
          title="Total Refunds"
          value={`₹${analytics.totalRefunds.toLocaleString('en-IN')}`}
          subtitle="Amount refunded"
          icon={AlertCircle}
          color="red"
        />
      </div>

      {/* Charts Grid */}
      <div className="charts-grid">
        {/* Revenue Trend with Net Revenue */}
        <div className="chart-container large">
          <h3>Revenue Trend (Last 30 Days)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={analytics.dailyRevenue}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" stroke="#666" fontSize={12} />
              <YAxis stroke="#666" fontSize={12} tickFormatter={v => `₹${v/1000}k`} />
              <Tooltip 
                formatter={(v, name) => {
                  const formatName = name === 'revenue' ? 'Gross Revenue' : 
                                   name === 'refunds' ? 'Refunds' : 'Net Revenue';
                  return [`₹${v.toLocaleString('en-IN')}`, formatName];
                }}
                labelFormatter={(label) => `Date: ${label}`}
              />
              <Area type="monotone" dataKey="revenue" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
              <Area type="monotone" dataKey="refunds" stackId="2" stroke="#ef4444" fill="#ef4444" fillOpacity={0.6} />
              <Line type="monotone" dataKey="netRevenue" stroke="#22c55e" strokeWidth={3} dot={{ r: 3 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly Revenue Comparison with Net Revenue */}
        <div className="chart-container">
          <h3>Monthly Revenue Comparison</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={analytics.revenueComparison}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#666" fontSize={12} />
              <YAxis stroke="#666" fontSize={12} tickFormatter={v => `₹${v/1000}k`} />
              <Tooltip formatter={(v, name) => {
                const formatName = name === 'revenue' ? 'Gross Revenue' : 
                                 name === 'refunds' ? 'Refunds' : 'Net Revenue';
                return [`₹${v.toLocaleString('en-IN')}`, formatName];
              }} />
              <Bar dataKey="revenue" fill="#3b82f6" />
              <Bar dataKey="refunds" fill="#ef4444" />
              <Bar dataKey="netRevenue" fill="#22c55e" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Payment Status Distribution */}
        <div className="chart-container">
          <h3>Payment Status Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={analytics.statusDistribution}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, percentage }) => `${name} ${percentage}%`}
                fontSize={12}
              >
                {analytics.statusDistribution.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [value, 'Count']} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Hourly Booking Pattern */}
        <div className="chart-container">
          <h3>Hourly Booking Pattern</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={analytics.hourlyBookings}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="hour" stroke="#666" fontSize={12} />
              <YAxis stroke="#666" fontSize={12} />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="bookings" 
                stroke="#8b5cf6" 
                strokeWidth={2}
                dot={{ r: 3 }}
                name="Total Bookings"
              />
              <Line 
                type="monotone" 
                dataKey="successfulBookings" 
                stroke="#22c55e" 
                strokeWidth={2}
                dot={{ r: 3 }}
                name="Successful Bookings"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Data Tables */}
      {analytics.vehicleTypeRevenue.length > 0 && (
        <div className="table-container">
          <h3>Revenue by Vehicle Type</h3>
          <div className="table-wrapper">
            <table className="modern-table">
              <thead>
                <tr>
                  <th>Vehicle Type</th>
                  <th>Bookings</th>
                  <th>Gross Revenue</th>
                  <th>Refunds</th>
                  <th>Net Revenue</th>
                  <th>Avg. per Booking</th>
                  <th>Success Rate</th>
                </tr>
              </thead>
              <tbody>
                {analytics.vehicleTypeRevenue.map(type => {
                  const successRate = type.bookings > 0 ? 
                    (type.successfulBookings / type.bookings * 100) : 0;
                  const avgPerBooking = type.successfulBookings > 0 ? 
                    (type.revenue / type.successfulBookings) : 0;
                  
                  return (
                    <tr key={type.type}>
                      <td>{type.type}</td>
                      <td>{type.bookings}</td>
                      <td>₹{type.revenue.toLocaleString('en-IN')}</td>
                      <td className="text-red-600">₹{type.refunded.toLocaleString('en-IN')}</td>
                      <td className="font-semibold">₹{type.netRevenue.toLocaleString('en-IN')}</td>
                      <td>₹{Math.round(avgPerBooking).toLocaleString('en-IN')}</td>
                      <td>{successRate.toFixed(1)}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {analytics.popularRoutes.length > 0 && (
        <div className="table-container">
          <h3>Popular Routes</h3>
          <div className="table-wrapper">
            <table className="modern-table">
              <thead>
                <tr>
                  <th>Route</th>
                  <th>Bookings</th>
                  <th>Gross Revenue</th>
                  <th>Refunds</th>
                  <th>Net Revenue</th>
                  <th>Avg. Revenue</th>
                </tr>
              </thead>
              <tbody>
                {analytics.popularRoutes.map((route, index) => (
                  <tr key={index}>
                    <td>
                      <div className="route-cell">
                        <MapPin size={14} />
                        {route.route}
                      </div>
                    </td>
                    <td>{route.bookings}</td>
                    <td>₹{route.revenue.toLocaleString('en-IN')}</td>
                    <td className="text-red-600">₹{route.refunded.toLocaleString('en-IN')}</td>
                    <td className="font-semibold">₹{route.netRevenue.toLocaleString('en-IN')}</td>
                    <td>₹{Math.round(route.netRevenue / route.bookings).toLocaleString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="table-container">
        <h3>Top Users by Net Revenue</h3>
        <div className="table-wrapper">
          <table className="modern-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Transactions</th>
                <th>Gross Revenue</th>
                <th>Refunds</th>
                <th>Net Revenue</th>
                <th>Last Activity</th>
              </tr>
            </thead>
            <tbody>
              {analytics.topUsers.map((user, index) => (
                <tr key={user.email || index}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.transactions}</td>
                  <td>₹{user.total.toLocaleString('en-IN')}</td>
                  <td className="text-red-600">₹{user.refunded.toLocaleString('en-IN')}</td>
                  <td className="font-semibold">₹{user.netTotal.toLocaleString('en-IN')}</td>
                  <td>{new Date(user.lastActivity).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="table-container">
        <h3>Recent Transactions</h3>
        <div className="table-wrapper">
          <table className="modern-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>User</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Vehicle</th>
                <th>Route</th>
                <th>Transaction ID</th>
              </tr>
            </thead>
            <tbody>
              {payments
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .slice(0, 15)
                .map((payment, index) => {
                  const amount = parseFloat(payment.amountPaid) || 0;
                  const status = payment.paymentStatus?.toLowerCase() || 'unknown';
                  const isRefund = status === 'refunded';
                  
                  return (
                    <tr key={payment._id || index}>
                      <td>{new Date(payment.createdAt).toLocaleDateString()}</td>
                      <td>
                        <div>
                          <div className="font-medium">
                            {payment.user?.name || payment.user?.email || 'Unknown'}
                          </div>
                          {payment.user?.email && payment.user?.name && (
                            <div className="text-sm text-gray-500">{payment.user.email}</div>
                          )}
                        </div>
                      </td>
                      <td className={isRefund ? 'text-red-600 font-medium' : ''}>
                        {isRefund ? '-' : ''}₹{amount.toLocaleString('en-IN')}
                      </td>
                      <td>
                        <span className={`status-badge ${status}`}>
                          {payment.paymentStatus || 'Unknown'}
                        </span>
                      </td>
                      <td>
                        <div>
                          <div>{payment.vehicle?.name || payment.vehicleName || '-'}</div>
                          {payment.vehicle?.type && (
                            <div className="text-sm text-gray-500">{payment.vehicle.type}</div>
                          )}
                        </div>
                      </td>
                      <td>
                        {payment.origin && payment.destination ? 
                          `${payment.origin} → ${payment.destination}` : 
                          payment.route ? 
                            `${payment.route.origin || ''} → ${payment.route.destination || ''}` :
                            '-'
                        }
                      </td>
                      <td className="font-mono text-sm">
                        {payment.transactionId || payment.paymentId || payment._id?.slice(-8) || '-'}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="summary-section">
        <div className="summary-grid">
          <div className="summary-card">
            <h4>Financial Summary</h4>
            <div className="summary-item">
              <span>Gross Revenue:</span>
              <span className="font-semibold">₹{totalAmount.toLocaleString('en-IN')}</span>
            </div>
            <div className="summary-item">
              <span>Total Refunds:</span>
              <span className="text-red-600 font-semibold">-₹{analytics.totalRefunds.toLocaleString('en-IN')}</span>
            </div>
            <div className="summary-item border-t pt-2">
              <span className="font-semibold">Net Revenue:</span>
              <span className="font-bold text-green-600">₹{netRevenue.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <div className="summary-card">
            <h4>Transaction Summary</h4>
            <div className="summary-item">
              <span>Total Transactions:</span>
              <span className="font-semibold">{payments.length}</span>
            </div>
            <div className="summary-item">
              <span>Successful:</span>
              <span className="text-green-600 font-semibold">{successfulPayments.length}</span>
            </div>
            <div className="summary-item">
              <span>Failed/Cancelled:</span>
              <span className="text-red-600 font-semibold">
                {payments.length - successfulPayments.length - analytics.statusDistribution.find(s => s.name === 'Refunded')?.value || 0}
              </span>
            </div>
            <div className="summary-item">
              <span>Refunded:</span>
              <span className="text-orange-600 font-semibold">
                {analytics.statusDistribution.find(s => s.name === 'Refunded')?.value || 0}
              </span>
            </div>
          </div>

          <div className="summary-card">
            <h4>Performance Metrics</h4>
            <div className="summary-item">
              <span>Success Rate:</span>
              <span className="font-semibold">{successRate.toFixed(1)}%</span>
            </div>
            <div className="summary-item">
              <span>Average Order Value:</span>
              <span className="font-semibold">₹{analytics.averageBookingValue.toLocaleString('en-IN')}</span>
            </div>
            <div className="summary-item">
              <span>Refund Rate:</span>
              <span className="font-semibold">
                {payments.length > 0 ? 
                  ((analytics.statusDistribution.find(s => s.name === 'Refunded')?.value || 0) / payments.length * 100).toFixed(1) : 0
                }%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPayments;