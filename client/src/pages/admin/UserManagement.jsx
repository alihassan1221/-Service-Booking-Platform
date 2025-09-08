import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Search,
  Filter,
  Users,
  UserPlus,
  Eye,
  Edit,
  Trash2,
} from "lucide-react";
import {
  getUsers,
  deleteUser,
  createManager,
  updateUser,
} from "../../store/slices/userSlice";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import Modal from "../../components/common/Modal";
import Input from "../../components/common/Input";
import { toast } from "react-toastify";

const UserManagement = () => {
  const dispatch = useDispatch();
  const { users, isLoading, message } = useSelector((state) => state.users);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Add user form state
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user",
  });

  // Edit user form state
  const [editUser, setEditUser] = useState({
    name: "",
    email: "",
    role: "user",
  });

  const isEditFormValid =
    editUser.name.trim() &&
    editUser.role.trim() &&
    editUser.email.trim() &&
    !isUpdating;

  const isAddFormValid =
    newUser.name.trim() &&
    newUser.email.trim() &&
    newUser.password.trim() &&
    newUser.confirmPassword.trim() &&
    newUser.password === newUser.confirmPassword &&
    !isCreating;

  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);

  // Filter and search users
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  // Sort users
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.createdAt) - new Date(a.createdAt);
      case "oldest":
        return new Date(a.createdAt) - new Date(b.createdAt);
      case "name":
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  const handleDeleteUser = async () => {
    if (selectedUser) {
      try {
        await dispatch(deleteUser(selectedUser._id)).unwrap();
        setShowDeleteModal(false);
        setSelectedUser(null);
        toast.success("User deleted successfully");
      } catch (error) {
        console.error("Failed to delete user:", error);
        toast.error(message || error.message || "Failed to delete user");
      }
    }
  };

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setEditUser({
      name: user.name,
      email: user.email,
      role: user.role,
    });
    setShowEditUserModal(true);
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    setIsUpdating(true);

    try {
      const userData = {
        name: editUser.name,
        email: editUser.email,
        role: editUser.role,
      };

      await dispatch(updateUser({ id: selectedUser._id, userData })).unwrap();
      toast.success("User updated successfully");

      setShowEditUserModal(false);
      dispatch(getUsers());
    } catch (error) {
      console.error("Failed to update user:", error);
      toast.error(message || error.message || "Failed to update user");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    setIsCreating(true);

    // Validation
    if (newUser.password !== newUser.confirmPassword) {
      toast.error("Passwords do not match");
      setIsCreating(false);
      return;
    }

    if (newUser.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      setIsCreating(false);
      return;
    }

    try {
      const userData = {
        name: newUser.name,
        email: newUser.email,
        password: newUser.password,
        role: newUser.role,
      };

      if (newUser.role === "manager" || newUser.role === 'user') {
        await dispatch(createManager(userData)).unwrap();
        toast.success("Manager created successfully");
      }

      // Reset form and close modal
      setNewUser({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "user",
      });
      setShowAddUserModal(false);

      // Refresh users list
      dispatch(getUsers());
    } catch (error) {
      console.error("Failed to create user:", error);
      toast.error(message || error || error.message || "Failed to create user");
    } finally {
      setIsCreating(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <LoadingSpinner size="large" />
        <span className="ml-2 text-gray-600 dark:text-gray-400">
          Loading users...
        </span>
      </div>
    );
  }

  return (
    <div className="">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            User Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage all users and their permissions
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            onClick={() => setShowAddUserModal(true)}
            className="flex items-center"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Add User
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <Card className="p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search Input */}
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4"
              />
            </div>
          </div>

          {/* Role Filter */}
          <div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="input-field"
            >
              <option value="all">All Roles</option>
              <option value="user">Users</option>
              <option value="manager">Managers</option>
              <option value="admin">Admins</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="input-field"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="name">Sort by Name</option>
            </select>
          </div>
        </div>

        {/* Results Info */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Showing {sortedUsers.length} of {users.length} users
          </p>
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Filters applied
            </span>
          </div>
        </div>
      </Card>

      {/* Users Table */}
      <Card className="p-6 mb-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {sortedUsers.map((user) => (
                <tr
                  key={user._id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white font-medium">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {user.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.role === "admin"
                          ? "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400"
                          : user.role === "manager"
                          ? "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
                          : "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
                      }`}
                    >
                      {user.role?.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                      Active
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => handleViewUser(user)}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 p-1"
                        title="View user"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEditUser(user)}
                        className="text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300 p-1"
                        title="Edit user"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setShowDeleteModal(true);
                        }}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 p-1"
                        title="Delete user"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {sortedUsers.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">No users found</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Try adjusting your search or filters
              </p>
            </div>
          )}
        </div>
      </Card>

      {/* Add User Modal */}
      <Modal
        isOpen={showAddUserModal}
        onClose={() => setShowAddUserModal(false)}
        title="Add New User"
        size="lg"
      >
        <form onSubmit={handleAddUser} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">
                Full Name <span className="text-red-500">*</span>
              </label>
              <Input
                name="name"
                type="text"
                placeholder="Enter user's full name"
                value={newUser.name}
                onChange={handleInputChange}
                required={true}
              />
            </div>
            <div>
              <label className="label">
                Email Address <span className="text-red-500">*</span>
              </label>
              <Input
                name="email"
                type="email"
                placeholder="Enter user's email"
                value={newUser.email}
                onChange={handleInputChange}
                required={true}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">
                Password <span className="text-red-500">*</span>
              </label>
              <Input
                name="password"
                type="password"
                placeholder="Enter password"
                value={newUser.password}
                onChange={handleInputChange}
                required={true}
              />
            </div>
            <div>
              <label className="label">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <Input
                name="confirmPassword"
                type="password"
                placeholder="Confirm password"
                value={newUser.confirmPassword}
                onChange={handleInputChange}
                required={true}
              />
            </div>
          </div>

          <div>
            <label className="label">
              Role <span className="text-red-500">*</span>
            </label>
            <select
              name="role"
              value={newUser.role}
              onChange={handleInputChange}
              className="input-field"
              required={true}
            >
              <option value="user">User</option>
              <option value="manager">Manager</option>
            </select>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Select the role for this user. Managers can approve/reject
              bookings.
            </p>
          </div>

          <div className="flex space-x-3 justify-end pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowAddUserModal(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!isAddFormValid}
              className={!isAddFormValid ? "opacity-50 cursor-not-allowed" : ""}
            >
              {isCreating ? (
                <>
                  <LoadingSpinner size="small" />
                  <span className="ml-2">Creating User...</span>
                </>
              ) : (
                "Create User"
              )}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit User Modal */}
      <Modal
        isOpen={showEditUserModal}
        onClose={() => setShowEditUserModal(false)}
        title="Edit User Details"
        size="lg"
      >
        <form onSubmit={handleUpdateUser} className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="label">
                Full Name <span className="text-red-500">*</span>
              </label>
              <Input
                name="name"
                type="text"
                placeholder="Enter user's full name"
                value={editUser.name}
                onChange={handleEditInputChange}
                required={true}
              />
            </div>
            <div>
              <label className="label">
                Email Address <span className="text-red-500">*</span>
              </label>
              <Input
                name="email"
                type="email"
                placeholder="Enter user's email"
                value={editUser.email}
                onChange={handleEditInputChange}
                required={true}
              />
            </div>
          </div>

          <div>
            <label className="label">
              Role <span className="text-red-500">*</span>
            </label>
            <select
              name="role"
              value={editUser.role}
              onChange={handleEditInputChange}
              className="input-field"
              required={true}
            >
              <option value="user">User</option>
              <option value="manager">Manager</option>
            </select>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Select the role for this user. Managers can approve/reject
              bookings.
            </p>
          </div>

          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
            <div className="flex items-center">
              <Edit className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mr-2" />
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                Note: Updating user details will take effect immediately.
              </p>
            </div>
          </div>

          <div className="flex space-x-3 justify-end pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowEditUserModal(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="accent"
              disabled={!isEditFormValid}
              className={!isEditFormValid ? "opacity-50 cursor-not-allowed" : ""}
            >
              {isUpdating ? (
                <>
                  <LoadingSpinner size="small" />
                  <span className="ml-2">Updating User...</span>
                </>
              ) : (
                "Update User"
              )}
            </Button>
          </div>
        </form>
      </Modal>

      {/* User Detail Modal */}
      <Modal
        isOpen={showUserModal}
        onClose={() => setShowUserModal(false)}
        title="User Details"
      >
        {selectedUser && (
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white text-xl font-medium">
                {selectedUser.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {selectedUser.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {selectedUser.email}
                </p>
              </div>
            </div>

            <div className="grid gap-4">
              <div>
                <label className="label">Role</label>
                <p className="text-gray-900 dark:text-white capitalize">
                  {selectedUser.role}
                </p>
              </div>
              <div>
                <label className="label">Status</label>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                  Active
                </span>
              </div>
              <div>
                <label className="label">User ID</label>
                <p className="text-sm text-gray-600 dark:text-gray-400 font-mono">
                  {selectedUser._id}
                </p>
              </div>
              <div>
                <label className="label">Joined</label>
                <p className="text-gray-600 dark:text-gray-400">
                  {new Date(selectedUser.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Confirm Deletion"
      >
        {selectedUser && (
          <div className="space-y-4">
            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
              <div className="flex items-center">
                <Trash2 className="w-5 h-5 text-red-600 dark:text-red-400 mr-2" />
                <p className="text-sm text-red-700 dark:text-red-300">
                  This action cannot be undone. The {selectedUser.role} will be
                  permanently removed.
                </p>
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              Are you sure you want to delete{" "}
              <strong>{selectedUser.name}</strong>? This action cannot be
              undone.
            </p>
            <div className="flex space-x-3 justify-end">
              <Button
                variant="outline"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </Button>
              <Button variant="danger" onClick={handleDeleteUser}>
                Delete User
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default UserManagement;
