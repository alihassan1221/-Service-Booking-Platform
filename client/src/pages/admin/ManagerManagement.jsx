import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Search,
  Filter,
  UserPlus,
  Shield,
  Eye,
  Edit,
  Trash2,
  Mail,
  Phone,
  Calendar,
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

const ManagerManagement = () => {
  const dispatch = useDispatch();
  const { users, isLoading } = useSelector((state) => state.users);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [selectedManager, setSelectedManager] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showManagerModal, setShowManagerModal] = useState(false);
  const [showAddManagerModal, setShowAddManagerModal] = useState(false);
  const [showEditManagerModal, setShowEditManagerModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Filter only managers (exclude admins and regular users)
  const managers = users.filter((user) => user.role === "manager");

  // Add manager form state
  const [newManager, setNewManager] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Edit manager form state
  const [editManager, setEditManager] = useState({
    name: "",
    email: "",
    role: "manager",
  });

  const isUpdateDisabled =
    !editManager.name.trim() ||
    !editManager.email.trim() ||
    !editManager.role.trim() ||
    isUpdating;

  const isCreateDisabled =
    !newManager.name.trim() ||
    !newManager.email.trim() ||
    !newManager.password.trim() ||
    !newManager.confirmPassword.trim() ||
    isCreating;

  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);

  // Filter and search managers
  const filteredManagers = managers.filter((manager) => {
    return (
      manager.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      manager.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Sort managers
  const sortedManagers = [...filteredManagers].sort((a, b) => {
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

  const handleDeleteManager = async () => {
    if (selectedManager) {
      try {
        await dispatch(deleteUser(selectedManager._id)).unwrap();
        setShowDeleteModal(false);
        setSelectedManager(null);
        toast.success("Manager deleted successfully");
      } catch (error) {
        console.error("Failed to delete manager:", error);
        toast.error(error.message || "Failed to delete manager");
      }
    }
  };

  const handleViewManager = (manager) => {
    setSelectedManager(manager);
    setShowManagerModal(true);
  };

  const handleEditManager = (manager) => {
    setSelectedManager(manager);
    setEditManager({
      name: manager.name,
      email: manager.email,
      role: manager.role,
    });
    setShowEditManagerModal(true);
  };

  const handleUpdateManager = async (e) => {
    e.preventDefault();
    setIsUpdating(true);

    try {
      const managerData = {
        name: editManager.name,
        email: editManager.email,
        role: editManager.role,
      };

      await dispatch(
        updateUser({ id: selectedManager._id, userData: managerData })
      ).unwrap();
      toast.success("Manager updated successfully");

      // Close modal and refresh users list
      setShowEditManagerModal(false);
      dispatch(getUsers());
    } catch (error) {
      console.error("Failed to update manager:", error);
      toast.error(error.message || "Failed to update manager");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAddManager = async (e) => {
    e.preventDefault();
    setIsCreating(true);

    // Validation
    if (newManager.password !== newManager.confirmPassword) {
      toast.error("Passwords do not match");
      setIsCreating(false);
      return;
    }

    if (newManager.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      setIsCreating(false);
      return;
    }

    try {
      const managerData = {
        name: newManager.name,
        email: newManager.email,
        password: newManager.password,
      };

      await dispatch(createManager(managerData)).unwrap();
      toast.success("Manager created successfully");

      // Reset form and close modal
      setNewManager({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
      setShowAddManagerModal(false);

      // Refresh users list
      dispatch(getUsers());
    } catch (error) {
      console.error("Failed to create manager:", error);
      toast.error(error.message || "Failed to create manager");
    } finally {
      setIsCreating(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewManager((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditManager((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <LoadingSpinner size="large" />
        <span className="ml-2 text-gray-600 dark:text-gray-400">
          Loading managers...
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
            Manager Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Create and manage manager accounts for your platform
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            onClick={() => setShowAddManagerModal(true)}
            className="flex items-center bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Add Manager
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
          <div className="flex items-center">
            <div className="p-3 rounded-2xl bg-blue-100 dark:bg-blue-800/30">
              <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                Total Managers
              </p>
              <p className="text-2xl font-bold text-blue-800 dark:text-blue-200">
                {managers.length}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
          <div className="flex items-center">
            <div className="p-3 rounded-2xl bg-green-100 dark:green-800/30">
              <UserPlus className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-green-600 dark:text-green-400">
                Active Managers
              </p>
              <p className="text-2xl font-bold text-green-800 dark:text-green-200">
                {managers.length}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
          <div className="flex items-center">
            <div className="p-3 rounded-2xl bg-purple-100 dark:bg-purple-800/30">
              <Calendar className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-purple-600 dark:text-purple-400">
                New This Month
              </p>
              <p className="text-2xl font-bold text-purple-800 dark:text-purple-200">
                {
                  managers.filter((m) => {
                    const monthAgo = new Date();
                    monthAgo.setMonth(monthAgo.getMonth() - 1);
                    return new Date(m.createdAt) > monthAgo;
                  }).length
                }
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search Input */}
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search managers by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4"
              />
            </div>
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
            Showing {sortedManagers.length} of {managers.length} managers
          </p>
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Filters applied
            </span>
          </div>
        </div>
      </Card>

      {/* Managers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedManagers.map((manager) => (
          <Card
            key={manager._id}
            className="p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white font-medium text-lg">
                  {manager.name.charAt(0).toUpperCase()}
                </div>
                <div className="ml-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {manager.name}
                  </h3>
                  <p className="text-sm text-blue-600 dark:text-blue-400">
                    Manager
                  </p>
                </div>
              </div>
              <div className="flex space-x-1">
                <button
                  onClick={() => handleViewManager(manager)}
                  className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 p-1"
                  title="View manager"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleEditManager(manager)}
                  className="text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300 p-1"
                  title="Edit manager"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    setSelectedManager(manager);
                    setShowDeleteModal(true);
                  }}
                  className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 p-1"
                  title="Delete manager"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <Mail className="w-4 h-4 mr-2" />
                <span className="truncate">{manager.email}</span>
              </div>

              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <Calendar className="w-4 h-4 mr-2" />
                <span>
                  Joined {new Date(manager.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center">
                <span className="text-xs font-medium text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-full">
                  Active
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  ID: {manager._id.slice(-6)}
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {sortedManagers.length === 0 && (
        <Card className="text-center py-16">
          <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No Managers Found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {searchTerm
              ? "Try adjusting your search terms"
              : "Get started by adding your first manager"}
          </p>
          <Button onClick={() => setShowAddManagerModal(true)}>
            <UserPlus className="w-4 h-4 mr-2" />
            Add First Manager
          </Button>
        </Card>
      )}

      {/* Add Manager Modal */}
      <Modal
        isOpen={showAddManagerModal}
        onClose={() => {
          setShowAddManagerModal(false);
          setNewManager({
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
          });
        }}
        title="Add New Manager"
        size="lg"
      >
        <form onSubmit={handleAddManager} className="space-y-4">
          <div className="grid grid-cols-1">
            <Input
              label="Full Name"
              name="name"
              type="text"
              placeholder="Enter manager's full name"
              value={newManager.name}
              onChange={handleInputChange}
              required={true}
            />
            <Input
              label="Email Address"
              name="email"
              type="email"
              placeholder="Enter manager's email"
              value={newManager.email}
              onChange={handleInputChange}
              required={true}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Password"
              name="password"
              type="password"
              placeholder="Enter temporary password"
              value={newManager.password}
              onChange={handleInputChange}
              required={true}
            />
            <Input
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              placeholder="Confirm password"
              value={newManager.confirmPassword}
              onChange={handleInputChange}
              required={true}
            />
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <div className="flex items-center">
              <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2" />
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Managers can approve/reject bookings and view all bookings, but
                cannot manage other managers or users.
              </p>
            </div>
          </div>

          <div className="flex space-x-3 justify-end pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowAddManagerModal(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isCreateDisabled}
              className={`bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 
    ${isCreateDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {isCreating ? (
                <>
                  <LoadingSpinner size="small" />
                  <span className="ml-2">Creating Manager...</span>
                </>
              ) : (
                "Create Manager"
              )}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Manager Modal */}
      <Modal
        isOpen={showEditManagerModal}
        onClose={() => setShowEditManagerModal(false)}
        title="Edit Manager Details"
        size="lg"
      >
        <form onSubmit={handleUpdateManager} className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <Input
              label="Full Name"
              name="name"
              type="text"
              placeholder="Enter manager's full name"
              value={editManager.name}
              onChange={handleEditInputChange}
              required={true}
            />
            <Input
              label="Email Address"
              name="email"
              type="email"
              placeholder="Enter manager's email"
              value={editManager.email}
              onChange={handleEditInputChange}
              required={true}
            />
          </div>
          <div>
            <label className="label">
              Role <span className="text-red-500">*</span>
            </label>
            <select
              name="role"
              value={editManager.role}
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
              <Shield className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mr-2" />
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                Note: Updating manager details will take effect immediately.
              </p>
            </div>
          </div>

          <div className="flex space-x-3 justify-end pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowEditManagerModal(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isUpdateDisabled}
              variant="accent"
              className={
                isUpdateDisabled ? "opacity-50 cursor-not-allowed" : ""
              }
            >
              {isUpdating ? (
                <>
                  <LoadingSpinner size="small" />
                  <span className="ml-2">Updating Manager...</span>
                </>
              ) : (
                "Update Manager"
              )}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Manager Detail Modal */}
      <Modal
        isOpen={showManagerModal}
        onClose={() => setShowManagerModal(false)}
        title="Manager Details"
      >
        {selectedManager && (
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white text-xl font-medium">
                {selectedManager.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {selectedManager.name}
                </h3>
                <p className="text-blue-600 dark:text-blue-400">Manager</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="label">Email Address</label>
                <p className="text-gray-900 dark:text-white">
                  {selectedManager.email}
                </p>
              </div>

              <div>
                <label className="label">Manager Since</label>
                <p className="text-gray-600 dark:text-gray-400">
                  {new Date(selectedManager.createdAt).toLocaleDateString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  )}
                </p>
              </div>

              <div>
                <label className="label">Status</label>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                  Active
                </span>
              </div>

              <div>
                <label className="label">Manager ID</label>
                <p className="text-sm text-gray-600 dark:text-gray-400 font-mono bg-gray-100 dark:bg-gray-800 p-2 rounded">
                  {selectedManager._id}
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
        title="Confirm Manager Deletion"
      >
        {selectedManager && (
          <div className="space-y-4">
            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
              <div className="flex items-center">
                <Trash2 className="w-5 h-5 text-red-600 dark:text-red-400 mr-2" />
                <p className="text-sm text-red-700 dark:text-red-300">
                  This action cannot be undone. The manager will be permanently
                  removed.
                </p>
              </div>
            </div>

            <p className="text-gray-600 dark:text-gray-400">
              Are you sure you want to delete{" "}
              <strong>{selectedManager.name}</strong>? This manager will lose
              access to the system immediately.
            </p>

            <div className="flex space-x-3 justify-end">
              <Button
                variant="outline"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={handleDeleteManager}
                className="bg-red-600 hover:bg-red-700"
              >
                Delete Manager
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ManagerManagement;
