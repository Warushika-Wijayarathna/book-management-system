import React, { useEffect, useState } from "react";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import PageMeta from "../components/common/PageMeta";
import { getReaders, addReader, updateReader, deleteReader } from "../services/readerService";
import { Reader, ReaderFormData } from "../types/Reader";
import { useModalContext } from "../context/ModalContext";
import { useAuth } from "../context/useAuth";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import SearchBar from "../components/common/SearchBar";

export default function ReaderPage() {
  const { isLoggedIn, isAuthenticating } = useAuth();
  const [readers, setReaders] = useState<Reader[]>([]);
  const [filteredReaders, setFilteredReaders] = useState<Reader[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [formData, setFormData] = useState<ReaderFormData | null>(null);
  const [editingReaderId, setEditingReaderId] = useState<string | null>(null);
  const { isModalOpen, setModalOpen } = useModalContext();

  useEffect(() => {
    // Only fetch readers if user is authenticated and not currently authenticating
    if (isLoggedIn && !isAuthenticating) {
      fetchReaders();
    }
  }, [isLoggedIn, isAuthenticating]);

  useEffect(() => {
    // Filter readers whenever search term changes
    if (!searchTerm.trim()) {
      setFilteredReaders(readers);
    } else {
      const lowercaseSearch = searchTerm.toLowerCase();
      setFilteredReaders(readers.filter(reader =>
        reader.name.toLowerCase().includes(lowercaseSearch) ||
        reader.email.toLowerCase().includes(lowercaseSearch) ||
        reader.contactNumber.includes(lowercaseSearch) ||
        (reader.address && reader.address.toLowerCase().includes(lowercaseSearch))
      ));
    }
  }, [searchTerm, readers]);

  const fetchReaders = async () => {
    try {
      // Debug: Check if authorization header is set
      console.log('Fetching readers - checking auth token in localStorage:', localStorage.getItem("accessToken"));
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

    // Validate required fields
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
        {/* Reader Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-xl">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 border-b text-left">Name</th>
                <th className="py-2 px-4 border-b text-left">Email</th>
                <th className="py-2 px-4 border-b text-left">Contact No</th>
                <th className="py-2 px-4 border-b text-left">Address</th>
                <th className="py-2 px-4 border-b text-left">Registered</th>
                <th className="py-2 px-4 border-b text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredReaders.map(reader => (
                <tr key={reader._id} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-4">{reader.name}</td>
                  <td className="py-2 px-4">{reader.email}</td>
                  <td className="py-2 px-4">{reader.contactNumber}</td>
                  <td className="py-2 px-4">{reader.address}</td>
                  <td className="py-2 px-4">{reader.createdAt}</td>
                  <td className="py-2 px-4">
                    <div className="flex items-center space-x-2">
                      <button className="px-3 py-1 bg-blue-500 text-white rounded flex items-center justify-center" onClick={() => handleEditClick(reader)}>
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      <button className="px-3 py-1 bg-red-500 text-white rounded flex items-center justify-center" onClick={() => handleDeleteClick(reader._id)}>
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
