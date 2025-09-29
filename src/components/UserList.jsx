import { useEffect, useState } from "react";
import axios from "axios";
import { 
  Users, 
  Search, 
  Filter, 
  RefreshCw, 
  UserCheck, 
  UserX, 
  Mail, 
  Phone, 
  Calendar,
  AlertCircle,
  Download,
  Eye,
  Edit3,
  Trash2,
  Shield,
  ShieldOff
} from "lucide-react";
import "./UserList.css";
import API_ENDPOINTS from "../config/api";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [sortField, setSortField] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);
  const [actionLoading, setActionLoading] = useState({});

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      
     const res = await axios.get(API_ENDPOINTS.ADMIN.USERS.BASE, { headers });

      
      // Handle different response formats
      let userData = [];
      if (res.data.success && res.data.users) {
        userData = res.data.users;
        console.log("Fetched Users Response:", res.data);
        console.log("Raw API response:", res.data);
console.log("First user structure:", res.data.users?.[0]);
      } else if (res.data.data) {
        userData = res.data.data;
      } else if (Array.isArray(res.data)) {
        userData = res.data;
      } else {
        throw new Error('Invalid response format');
      }

      // Validate and sanitize user data
      const sanitizedUsers = userData.map((user, index) => {
        // Ensure we have a valid MongoDB ObjectId
        const userId = user._id || user.id;
        if (!userId) {
          console.error(`User at index ${index} missing ID:`, user);
          return null;
        }

        return {
          _id: userId,
          name: user.name || user.username || 'Unknown User',
          email: user.email || 'No email provided',
          phone: user.phone || user.phoneNumber || 'Not provided',
          role: user.role || 'user',
          isActive: user.isActive !== undefined ? user.isActive : true,
          createdAt: user.createdAt || new Date().toISOString(),
          updatedAt: user.updatedAt || user.createdAt || new Date().toISOString(),
          avatar: user.avatar || user.profilePicture || null,
          lastLoginAt: user.lastLoginAt || null,
          bookingsCount: user.bookingsCount || 0
        };
      }).filter(user => user !== null); // Remove any null entries

      setUsers(sanitizedUsers);
    } catch (err) {
      console.error("Error fetching users:", err);
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.error || 
                          err.message || 
                          'Failed to fetch users';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (userId) => {
    // Validate userId before proceeding
    if (!userId || userId === 'undefined' || userId === 'null') {
      alert('Error: Invalid user ID');
      console.error('Invalid userId for deletion:', userId);
      return;
    }

    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    setActionLoading(prev => ({ ...prev, [`delete_${userId}`]: true }));
    
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      
      console.log('Attempting to delete user with ID:', userId);
      
     const response = await axios.delete(API_ENDPOINTS.ADMIN.USERS.BY_ID(userId), { headers });

      
      console.log('Delete response:', response.data);
      
      // Remove user from local state
      setUsers(prevUsers => prevUsers.filter(user => user._id !== userId));
      
      // Show success message (you can replace this with a toast notification)
      alert('User deleted successfully');
    } catch (err) {
      console.error("Error deleting user:", err);
      console.error("UserId that failed:", userId);
      
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.error || 
                          err.message || 
                          'Failed to delete user';
      alert(`Error: ${errorMessage}`);
    } finally {
      setActionLoading(prev => ({ ...prev, [`delete_${userId}`]: false }));
    }
  };

  const toggleUserStatus = async (userId, currentStatus) => {
    // Validate userId before proceeding
    if (!userId || userId === 'undefined' || userId === 'null') {
      alert('Error: Invalid user ID');
      console.error('Invalid userId for status toggle:', userId);
      return;
    }

    const action = currentStatus ? 'block' : 'unblock';
    const confirmMessage = currentStatus 
      ? 'Are you sure you want to block this user?' 
      : 'Are you sure you want to unblock this user?';
    
    if (!window.confirm(confirmMessage)) {
      return;
    }

    setActionLoading(prev => ({ ...prev, [`toggle_${userId}`]: true }));
    
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      
      const endpoint = currentStatus
  ? API_ENDPOINTS.ADMIN.USERS.BLOCK(userId)
  : API_ENDPOINTS.ADMIN.USERS.UNBLOCK(userId);



      
      console.log('Attempting to toggle user status. UserID:', userId, 'Action:', action);
      
    const response = await axios.patch(endpoint, {}, { headers });
      
      console.log('Toggle response:', response.data);
      
      // Update user status in local state
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user._id === userId 
            ? { ...user, isActive: !currentStatus }
            : user
        )
      );
      
      // Show success message
      alert(`User ${action}ed successfully`);
    } catch (err) {
      console.error(`Error ${action}ing user:`, err);
      console.error("UserId that failed:", userId);
      
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.error || 
                          err.message || 
                          `Failed to ${action} user`;
      alert(`Error: ${errorMessage}`);
    } finally {
      setActionLoading(prev => ({ ...prev, [`toggle_${userId}`]: false }));
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter and sort users
  const filteredAndSortedUsers = users
    .filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           user.phone.includes(searchTerm);
      const matchesRole = roleFilter === "all" || user.role === roleFilter;
      return matchesSearch && matchesRole;
    })
    .sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];
      
      // Handle date sorting
      if (sortField === 'createdAt' || sortField === 'updatedAt' || sortField === 'lastLoginAt') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }
      
      // Handle string sorting
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  // Pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredAndSortedUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredAndSortedUsers.length / usersPerPage);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const getRoleColor = (role) => {
    const colors = {
      admin: '#ef4444',
      manager: '#f59e0b',
      user: '#3b82f6',
      driver: '#22c55e',
      moderator: '#8b5cf6'
    };
    return colors[role.toLowerCase()] || '#6b7280';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not available';
    try {
      return new Date(dateString).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Invalid date';
    }
  };

  const exportToCSV = () => {
    const csvContent = [
      ['Name', 'Email', 'Phone', 'Role', 'Status', 'Created At', 'Bookings'].join(','),
      ...filteredAndSortedUsers.map(user => [
        user.name,
        user.email,
        user.phone,
        user.role,
        user.isActive ? 'Active' : 'Inactive',
        formatDate(user.createdAt),
        user.bookingsCount
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'users_export.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="user-list-container">
        <div className="loading-state">
          <RefreshCw className="loading-spinner" size={32} />
          <p>Loading users...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="user-list-container">
        <div className="error-state">
          <AlertCircle size={32} />
          <h3>Error Loading Users</h3>
          <p>{error}</p>
          <button onClick={fetchUsers} className="retry-button">
            <RefreshCw size={16} />
            Retry
          </button>
        </div>
      </div>
    );
  }

  const uniqueRoles = [...new Set(users.map(user => user.role))];

  return (
    <div className="user-list-container">
      <div className="user-list-header">
        <div className="header-title">
          <Users size={28} />
          <div>
            <h2>User Management</h2>
            <p>{filteredAndSortedUsers.length} total users</p>
          </div>
        </div>
        <div className="header-actions">
          <button onClick={fetchUsers} className="refresh-btn" title="Refresh">
            <RefreshCw size={16} />
          </button>
          <button onClick={exportToCSV} className="export-btn">
            <Download size={16} />
            Export CSV
          </button>
        </div>
      </div>

      <div className="filters-section">
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search users by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
        
        <div className="filter-controls">
          <div className="filter-group">
            <Filter size={16} />
            <select
              value={roleFilter}
              onChange={(e) => {
                setRoleFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="all">All Roles</option>
              {uniqueRoles.map(role => (
                <option key={role} value={role}>
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="table-container">
        <div className="table-wrapper">
          <table className="users-table">
            <thead>
              <tr>
                <th>User</th>
                <th 
                  onClick={() => handleSort('email')}
                  className={`sortable ${sortField === 'email' ? sortOrder : ''}`}
                >
                  Contact
                </th>
                <th 
                  onClick={() => handleSort('role')}
                  className={`sortable ${sortField === 'role' ? sortOrder : ''}`}
                >
                  Role
                </th>
                <th>Status</th>
                <th 
                  onClick={() => handleSort('createdAt')}
                  className={`sortable ${sortField === 'createdAt' ? sortOrder : ''}`}
                >
                  Joined
                </th>
                <th 
                  onClick={() => handleSort('lastLoginAt')}
                  className={`sortable ${sortField === 'lastLoginAt' ? sortOrder : ''}`}
                >
                  Last Login
                </th>
                <th>Bookings</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.length === 0 ? (
                <tr>
                  <td colSpan="8" className="no-data">
                    <Users size={32} />
                    <p>No users found matching your criteria</p>
                  </td>
                </tr>
              ) : (
                currentUsers.map((user) => (
                  <tr key={user._id} className={!user.isActive ? 'inactive-user' : ''}>
                    <td className="user-info">
                      <div className="user-avatar">
                        {user.avatar ? (
                          <img src={user.avatar} alt={user.name} />
                        ) : (
                          <div className="avatar-placeholder">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div className="user-details">
                        <div className="user-name">{user.name}</div>
                        <div className="user-id">ID: {user._id ? user._id.slice(-6) : 'No ID'}</div>
                      </div>
                    </td>
                    <td className="contact-info">
                      <div className="contact-item">
                        <Mail size={14} />
                        <span>{user.email}</span>
                      </div>
                      <div className="contact-item">
                        <Phone size={14} />
                        <span>{user.phone}</span>
                      </div>
                    </td>
                    <td>
                      <span 
                        className="role-badge"
                        style={{ backgroundColor: getRoleColor(user.role) }}
                      >
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge ${user.isActive ? 'active' : 'inactive'}`}>
                        {user.isActive ? (
                          <>
                            <UserCheck size={14} />
                            Active
                          </>
                        ) : (
                          <>
                            <UserX size={14} />
                            Inactive
                          </>
                        )}
                      </span>
                    </td>
                    <td className="date-cell">
                      <Calendar size={14} />
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="date-cell">
                      <Calendar size={14} />
                      {user.lastLoginAt ? formatDate(user.lastLoginAt) : 'Never'}
                    </td>
                    <td className="bookings-cell">
                      {user.bookingsCount || 0}
                    </td>
                    <td className="actions-cell">
                      <div className="action-buttons">
                        <button className="action-btn view" title="View Details">
                          <Eye size={14} />
                        </button>
                        <button className="action-btn edit" title="Edit User">
                          <Edit3 size={14} />
                        </button>
                        <button 
                          className={`action-btn ${user.isActive ? 'block' : 'unblock'}`}
                          title={user.isActive ? 'Block User' : 'Unblock User'}
                          onClick={() => toggleUserStatus(user._id, user.isActive)}
                          disabled={actionLoading[`toggle_${user._id}`]}
                        >
                          {actionLoading[`toggle_${user._id}`] ? (
                            <RefreshCw size={14} className="spinning" />
                          ) : user.isActive ? (
                            <ShieldOff size={14} />
                          ) : (
                            <Shield size={14} />
                          )}
                        </button>
                        <button 
                          className="action-btn delete" 
                          title="Delete User"
                          onClick={() => deleteUser(user._id)}
                          disabled={actionLoading[`delete_${user._id}`]}
                        >
                          {actionLoading[`delete_${user._id}`] ? (
                            <RefreshCw size={14} className="spinning" />
                          ) : (
                            <Trash2 size={14} />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button 
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="pagination-btn"
          >
            Previous
          </button>
          
          <div className="pagination-info">
            <span>
              Page {currentPage} of {totalPages} 
              ({filteredAndSortedUsers.length} users)
            </span>
          </div>

          <button 
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="pagination-btn"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default UserList;