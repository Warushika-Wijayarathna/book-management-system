import React, { useEffect, useState } from "react";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import PageMeta from "../components/common/PageMeta";
import { useModalContext } from "../context/ModalContext";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faSearch } from "@fortawesome/free-solid-svg-icons";
import { getBooks } from "../services/bookService";
import { getReaders, addReader } from "../services/readerService";
import AddReaderForm from "../components/form/AddReaderForm";
import CustomDialog from "../components/common/CustomDialog"; // Make sure path is correct

export default function LendPage() {
  const [lendings, setLendings] = useState<any[]>([]);
  const [formData, setFormData] = useState<any | null>(null);
  const [editingLendingId, setEditingLendingId] = useState<string | null>(null);
  const { setModalOpen } = useModalContext();
  const [formOpen, setFormOpen] = useState(false);
  const [books, setBooks] = useState<any[]>([]);
  const [readers, setReaders] = useState<any[]>([]);
  const [bookSuggestions, setBookSuggestions] = useState<any[]>([]);
  const [readerSuggestions, setReaderSuggestions] = useState<any[]>([]);
  const [showAddReaderModal, setShowAddReaderModal] = useState(false);
  const [pendingLendData, setPendingLendData] = useState<any | null>(null);
  const [showBookNotFoundDialog, setShowBookNotFoundDialog] = useState(false);
  const [showReaderNotFoundDialog, setShowReaderNotFoundDialog] = useState(false);
  const [searchedBook, setSearchedBook] = useState<any | null>(null);
  const [searchedReader, setSearchedReader] = useState<any | null>(null);
  const [bookSearchValue, setBookSearchValue] = useState("");
  const [readerSearchValue, setReaderSearchValue] = useState("");

  useEffect(() => {
    fetchLendings();
    fetchBooks();
    fetchReaders();
  }, []);

  useEffect(() => {
    if (formOpen) {
      const today = new Date();
      const due = new Date(today);
      due.setDate(today.getDate() + 14);
      const format = (d: Date) => d.toISOString().split("T")[0];
      setFormData((prev: any) => ({
        ...prev,
        lendDate: format(today),
        dueDate: format(due),
      }));
    }
  }, [formOpen]);

  const fetchLendings = async () => {
    setLendings([]); // Replace with real fetch later
  };

  const fetchBooks = async () => {
    try {
      const books = await getBooks();
      setBooks(books);
    } catch {
      toast.error("Failed to load books");
    }
  };

  const fetchReaders = async () => {
    try {
      const readers = await getReaders();
      setReaders(readers);
    } catch {
      toast.error("Failed to load readers");
    }
  };

  const handleAddClick = () => {
    setFormData({});
    setEditingLendingId(null);
    setFormOpen(true);
  };

  const handleEditClick = (lending: any) => {
    setFormData({ ...lending });
    setEditingLendingId(lending._id);
    setFormOpen(true);
  };

  const handleDeleteClick = async (id: string) => {
    setModalOpen(true); // You can use modal context here if needed
    toast.success("Lending deleted successfully");
    fetchLendings();
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!formData) return;
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleBookIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFormChange(e);
    const value = e.target.value;
    setBookSuggestions(value ? books.filter(b => b.isbn.includes(value)) : []);
  };

  const handleReaderIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFormChange(e);
    const value = e.target.value;
    setReaderSuggestions(value ? readers.filter(r => r.contactNumber.includes(value)) : []);
  };

  const selectBookSuggestion = (isbn: string) => {
    setFormData({ ...formData, bookId: isbn });
    setBookSuggestions([]);
  };

  const selectReaderSuggestion = (contactNumber: string) => {
    setFormData({ ...formData, readerId: contactNumber });
    setReaderSuggestions([]);
  };

  const handleBookSearch = () => {
    const found = books.find(b => b.isbn === bookSearchValue);
    setSearchedBook(found || null);
    if (!found) toast.error("Book not found");
  };

  const handleReaderSearch = () => {
    const found = readers.find(r => r.contactNumber === readerSearchValue);
    setSearchedReader(found || null);
    if (!found) setShowReaderNotFoundDialog(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchedBook || !searchedReader) return;
    try {
      if (editingLendingId) {
        toast.success("Lending updated successfully");
      } else {
        toast.success("Lending added successfully");
      }
      setFormOpen(false);
      fetchLendings();
    } catch {
      toast.error(editingLendingId ? "Failed to update lending" : "Failed to add lending");
    }
  };

  const handleAddReader = async (readerData: any) => {
    try {
      const newReader = await addReader(readerData);
      setReaders(prev => [...prev, newReader]);
      setShowAddReaderModal(false);
      toast.success("Reader added successfully");
      setFormData({ ...pendingLendData, readerId: newReader._id });
    } catch {
      toast.error("Failed to add reader");
    }
  };

  return (
    <div className="px-4 py-6">
      <PageMeta title="Lending Management" description="Manage lendings in the library" />
      <PageBreadcrumb pageTitle="Lending Management" />

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Lendings Table */}
        <div className={`flex-1 transition-all ${formOpen ? 'lg:w-3/5' : 'w-full'}`}>
          <div className="bg-white dark:bg-white/[0.03] rounded-2xl p-6 shadow-md">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Lendings</h1>
              <button
                onClick={handleAddClick}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
              >
                + Lend
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-left border-collapse">
                <thead className="bg-gray-100 text-gray-600 uppercase text-xs font-semibold">
                  <tr>
                    <th className="px-4 py-3">Book ID</th>
                    <th className="px-4 py-3">Reader ID</th>
                    <th className="px-4 py-3">Lend Date</th>
                    <th className="px-4 py-3">Due Date</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y">
                  {lendings.map((lending) => (
                    <tr key={lending._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">{lending.bookId}</td>
                      <td className="px-4 py-3">{lending.readerId}</td>
                      <td className="px-4 py-3">{lending.lendDate}</td>
                      <td className="px-4 py-3">{lending.dueDate}</td>
                      <td className="px-4 py-3">
                        <div className="flex space-x-2">
                          <button onClick={() => handleEditClick(lending)} className="text-blue-600 hover:text-blue-800">
                            <FontAwesomeIcon icon={faEdit} />
                          </button>
                          <button onClick={() => handleDeleteClick(lending._id)} className="text-red-600 hover:text-red-800">
                            <FontAwesomeIcon icon={faTrash} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {lendings.length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center py-6 text-gray-400">No lendings found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Lending Form */}
        {formOpen && (
          <div className="lg:w-2/5 bg-gray-50 p-6 rounded-lg shadow-inner h-fit">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Lending Form</h2>
              <button onClick={() => setFormOpen(false)} className="text-gray-600 hover:text-gray-900">✕</button>
            </div>
            {/* Book Search */}
            <div className="mb-4">
              <label className="block mb-1 text-sm font-medium text-gray-700">Book ISBN</label>
              <div className="flex gap-2 relative">
                <input
                  type="text"
                  value={bookSearchValue}
                  onChange={e => {
                    setBookSearchValue(e.target.value);
                    setSearchedBook(null);
                    setBookSuggestions(e.target.value ? books.filter(b => b.isbn.includes(e.target.value)) : []);
                  }}
                  className="w-full border px-4 py-2 rounded-lg"
                  placeholder="Enter Book ISBN"
                />
                <button type="button" onClick={handleBookSearch} className="bg-blue-500 text-white px-3 py-2 rounded-lg flex items-center justify-center">
                  <FontAwesomeIcon icon={faSearch} />
                </button>
                {bookSuggestions.length > 0 && (
                  <ul className="absolute left-0 top-full w-full bg-white border mt-1 rounded shadow max-h-40 overflow-y-auto z-20">
                    {bookSuggestions.map((b) => (
                      <li key={b._id} className="px-4 py-2 hover:bg-blue-100 cursor-pointer text-sm"
                        onClick={() => {
                          setBookSearchValue(b.isbn);
                          setSearchedBook(b);
                          setBookSuggestions([]);
                        }}>
                        {b.isbn} — {b.title}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              {searchedBook && (
                <div className="mt-2 text-green-700 text-sm">Found: {searchedBook.title} by {searchedBook.author}</div>
              )}
            </div>
            {/* Reader Search */}
            <div className="mb-4">
              <label className="block mb-1 text-sm font-medium text-gray-700">Reader Contact Number</label>
              <div className="flex gap-2 relative">
                <input
                  type="text"
                  value={readerSearchValue}
                  onChange={e => {
                    setReaderSearchValue(e.target.value);
                    setSearchedReader(null);
                    setReaderSuggestions(e.target.value ? readers.filter(r => r.contactNumber.includes(e.target.value)) : []);
                  }}
                  className="w-full border px-4 py-2 rounded-lg"
                  placeholder="Enter Reader Contact Number"
                />
                <button type="button" onClick={handleReaderSearch} className="bg-blue-500 text-white px-3 py-2 rounded-lg flex items-center justify-center">
                  <FontAwesomeIcon icon={faSearch} />
                </button>
                {readerSuggestions.length > 0 && (
                  <ul className="absolute left-0 top-full w-full bg-white border mt-1 rounded shadow max-h-40 overflow-y-auto z-20">
                    {readerSuggestions.map((r) => (
                      <li key={r._id} className="px-4 py-2 hover:bg-blue-100 cursor-pointer text-sm"
                        onClick={() => {
                          setReaderSearchValue(r.contactNumber);
                          setSearchedReader(r);
                          setReaderSuggestions([]);
                        }}>
                        {r.contactNumber} — {r.name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              {searchedReader && (
                <div className="mt-2 text-green-700 text-sm">Found: {searchedReader.name} ({searchedReader.email})</div>
              )}
            </div>

            {/* Lending Form Fields */}
            <form onSubmit={handleFormSubmit} className="space-y-6 relative z-0">
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block mb-1 text-sm font-medium text-gray-700">Lend Date</label>
                  <input
                    type="date"
                    name="lendDate"
                    value={formData?.lendDate || ""}
                    readOnly
                    className="w-full border bg-gray-100 text-gray-500 px-4 py-2 rounded-lg cursor-not-allowed"
                  />
                </div>
                <div className="flex-1">
                  <label className="block mb-1 text-sm font-medium text-gray-700">Due Date</label>
                  <input
                    type="date"
                    name="dueDate"
                    value={formData?.dueDate || ""}
                    readOnly
                    className="w-full border bg-gray-100 text-gray-500 px-4 py-2 rounded-lg cursor-not-allowed"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setFormOpen(false)} className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-lg">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg" disabled={!searchedBook || !searchedReader}>{editingLendingId ? "Update" : "Lend"}</button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Add Reader Modal */}
      {showAddReaderModal && (
        <AddReaderForm onAdd={handleAddReader} onClose={() => setShowAddReaderModal(false)} />
      )}

      {/* Book Not Found Dialog */}
      {showBookNotFoundDialog && (
        <CustomDialog
          title="Book Not Found"
          message="The entered book ID was not found. Would you like to re-enter it?"
          onCancel={() => setShowBookNotFoundDialog(false)}
          onConfirm={() => {
            setFormData(prev => ({ ...prev, bookId: "" }));
            setShowBookNotFoundDialog(false);
          }}
          confirmText="Re-enter"
          cancelText="Cancel"
        />
      )}

      {/* Reader Not Found Dialog */}
      {showReaderNotFoundDialog && (
        <CustomDialog
          title="Reader Not Found"
          message="The entered reader was not found. Would you like to add a new reader?"
          onCancel={() => setShowReaderNotFoundDialog(false)}
          onConfirm={() => {
            setShowReaderNotFoundDialog(false);
            setShowAddReaderModal(true);
          }}
          confirmText="Add Reader"
          cancelText="Cancel"
        />
      )}
    </div>
  );
}
