import React, { useEffect, useState } from "react";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import PageMeta from "../components/common/PageMeta";
import ReaderLendingHistory from "../components/common/ReaderLendingHistory";
import { getReaders, addReader, updateReader, deleteReader } from "../services/readerService";
import { Reader, ReaderFormData } from "../types/Reader";
import { useModalContext } from "../context/ModalContext";
import { useAuth } from "../context/useAuth";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import SearchBar from "../components/common/SearchBar";
import ReaderFilters, { ReaderFilters as ReaderFiltersType } from "../components/filters/ReaderFilters";

export default function ReaderPage() {
  const { isLoggedIn, isAuthenticating } = useAuth();
  const [readers, setReaders] = useState<Reader[]>([]);
  const [filteredReaders, setFilteredReaders] = useState<Reader[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [activeFilters, setActiveFilters] = useState<ReaderFiltersType>({
    registrationDate: [],
    location: [],
    activityStatus: []
  });
  const [formData, setFormData] = useState<ReaderFormData | null>(null);
  const [editingReaderId, setEditingReaderId] = useState<string | null>(null);
  const { isModalOpen, setModalOpen } = useModalContext();

  useEffect(() => {
    if (isLoggedIn && !isAuthenticating) {
      fetchReaders();
    }
  }, [isLoggedIn, isAuthenticating]);

  useEffect(() => {
    applyFilters();
  }, [searchTerm, readers, activeFilters]);

  const applyFilters = () => {
    let filtered = readers;

    if (searchTerm.trim()) {
      const lowercaseSearch = searchTerm.toLowerCase();
      filtered = filtered.filter(reader =>
        reader.name.toLowerCase().includes(lowercaseSearch) ||
        reader.email.toLowerCase().includes(lowercaseSearch) ||
        reader.contactNumber.includes(lowercaseSearch) ||
        (reader.address && reader.address.toLowerCase().includes(lowercaseSearch))
      );
    }

    if (activeFilters.registrationDate.length > 0) {
      filtered = filtered.filter(reader => {
        const createdDate = new Date(reader.createdAt);
        const now = new Date();

        return activeFilters.registrationDate.some(range => {
          switch (range) {
            case 'this-month':
              return createdDate.getFullYear() === now.getFullYear() &&
                     createdDate.getMonth() === now.getMonth();
            case 'last-month':
              const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1);
              return createdDate.getFullYear() === lastMonth.getFullYear() &&
                     createdDate.getMonth() === lastMonth.getMonth();
            case 'last-3-months':
              const threeMonthsAgo = new Date(now.getTime() - (90 * 24 * 60 * 60 * 1000));
              return createdDate >= threeMonthsAgo;
            case 'last-6-months':
              const sixMonthsAgo = new Date(now.getTime() - (180 * 24 * 60 * 60 * 1000));
              return createdDate >= sixMonthsAgo;
            case 'this-year':
              return createdDate.getFullYear() === now.getFullYear();
            case 'last-year':
              return createdDate.getFullYear() === now.getFullYear() - 1;
            case 'older':
              const oneYearAgo = new Date(now.getTime() - (365 * 24 * 60 * 60 * 1000));
              return createdDate < oneYearAgo;
            default:
              return true;
          }
        });
      });
    }

    if (activeFilters.location.length > 0) {
      filtered = filtered.filter(reader =>
        activeFilters.location.some(location => reader.address?.includes(location))
      );
    }

    if (activeFilters.activityStatus.length > 0) {
      filtered = filtered.filter(reader => {
        const createdDate = new Date(reader.createdAt);
        const now = new Date();
        const daysSinceCreation = Math.floor((now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24));

        return activeFilters.activityStatus.some(status => {
          switch (status) {
            case 'recently-active':
              return daysSinceCreation <= 30;
            case 'moderately-active':
              return daysSinceCreation > 30 && daysSinceCreation <= 90;
            case 'inactive':
              return daysSinceCreation > 90;
            case 'new-member':
              return daysSinceCreation <= 7;
            default:
              return true;
          }
        });
      });
    }

    setFilteredReaders(filtered);
  };

  const fetchReaders = async () => {
    try {
      const readers = await getReaders();
      setReaders(readers);
      setFilteredReaders(readers);
    } catch (error) {
      console.error('Error fetching readers:', error);
      toast.error("Failed to load readers");
    }
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const handleFilterChange = (newFilters: ReaderFiltersType) => {
    setActiveFilters(newFilters);
  };

  const handleAddClick = () => {
    setFormData({
      name: "",
      email: "",
      contactNumber: "",
      address: "",
      createdAt: new Date().toISOString().slice(0, 10),
    });
    setEditingReaderId(null);
    setModalOpen(true);
  };

  const handleEditClick = (reader: Reader) => {
    const { _id, ...formReaderData } = reader;
    setFormData({ ...formReaderData });
    setEditingReaderId(reader._id);
    setModalOpen(true);
  };

  const handleDeleteClick = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this reader?")) return;
    try {
      await deleteReader(id);
      toast.success("Reader deleted successfully");
      fetchReaders();
    } catch (error) {
      toast.error("Failed to delete reader");
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!formData) return;
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;

    const requiredFields = ["name", "email", "contactNumber", "address"];
    for (const field of requiredFields) {
      if (!formData[field as keyof ReaderFormData]) {
        toast.error(`Please fill out the "${field}" field.`);
        return;
      }
    }

    try {
      if (editingReaderId) {
        await updateReader(editingReaderId, formData);
        toast.success("Reader updated successfully");
      } else {
        await addReader(formData);
        toast.success("Reader added successfully");
      }
      setModalOpen(false);
      fetchReaders();
    } catch (error) {
      toast.error(editingReaderId ? "Failed to update reader" : "Failed to add reader");
    }
  };

  return (
    <div>
      <PageMeta title="Reader Management" description="Manage readers in the library" />
      <PageBreadcrumb pageTitle="Reader Management" />
      <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
        <div className="mb-6 flex justify-between items-center">
          <h3 className="font-semibold text-gray-800 text-theme-xl dark:text-white/90 sm:text-2xl">Readers</h3>
          <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={handleAddClick}>Add Reader</button>
        </div>
        {/* Search Bar */}
        <div className="mb-4">
          <SearchBar
            placeholder="Search by name, email, contact number, or address"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        {/* Reader Filters */}
        <div className="mb-4">
          <ReaderFilters
            readers={readers}
            activeFilters={activeFilters}
            onFiltersChange={handleFilterChange}
          />
        </div>
        {/* Reader Rows */}
        <div className="space-y-4">
          {filteredReaders.map(reader => (
            <div key={reader._id} className="bg-white rounded-xl shadow border">
              {/* Reader Info Row */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6 flex-1">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-lg text-gray-900 mb-1">{reader.name}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Email:</span>
                          <span className="truncate">{reader.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Contact:</span> {reader.contactNumber}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Registered:</span> {new Date(reader.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="mt-2 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Address:</span>
                          <span className="truncate">{reader.address}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
                      onClick={() => handleEditClick(reader)}
                      title="Edit Reader"
                    >
                      <FontAwesomeIcon icon={faEdit} />
                      <span className="hidden sm:inline">Edit</span>
                    </button>
                    <button
                      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
                      onClick={() => handleDeleteClick(reader._id)}
                      title="Delete Reader"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                      <span className="hidden sm:inline">Delete</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Lending History Section */}
              <div className="px-6 pb-6">
                <ReaderLendingHistory readerId={reader._id} />
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredReaders.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg mb-2">No readers found</div>
            <div className="text-gray-400">Try adjusting your search or filter criteria</div>
          </div>
        )}

        {/* Modal */}
        {isModalOpen && formData && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-[99999]">
            <div className="bg-white p-6 rounded shadow-xl w-full max-w-md">
              <h4 className="mb-4 font-semibold">{editingReaderId ? "Edit Reader" : "Add Reader"}</h4>
              <form onSubmit={handleFormSubmit}>
                <label>Name</label>
                <input name="name" value={formData.name} onChange={handleFormChange} className="mb-2 w-full border px-2 py-1" />
                <label>Email</label>
                <input name="email" value={formData.email} onChange={handleFormChange} className="mb-2 w-full border px-2 py-1" />
                <label>Contact No</label>
                <input name="contactNumber" value={formData.contactNumber} onChange={handleFormChange} className="mb-2 w-full border px-2 py-1" />
                <label>Address</label>
                <input name="address" value={formData.address} onChange={handleFormChange} className="mb-2 w-full border px-2 py-1" />
                <div className="mt-4 flex justify-end gap-2">
                  <button type="button" className="px-4 py-2 bg-gray-400 text-white rounded" onClick={() => setModalOpen(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
                    {editingReaderId ? "Update" : "Add"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
