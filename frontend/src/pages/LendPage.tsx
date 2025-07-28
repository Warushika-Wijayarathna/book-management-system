import React, { useEffect, useState } from "react";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import PageMeta from "../components/common/PageMeta";
import { useModalContext } from "../context/ModalContext";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faSearch } from "@fortawesome/free-solid-svg-icons";
import { getBooks } from "../services/bookService";
import { getReaders, addReader } from "../services/readerService";
import { getLendings, lendBook, returnBook } from "../services/lendingService";
import AddReaderForm from "../components/form/AddReaderForm";
import CustomDialog from "../components/common/CustomDialog";
import SearchBar from "../components/common/SearchBar";

export default function LendPage() {
  const [lendings, setLendings] = useState<any[]>([]);
  const [filteredLendings, setFilteredLendings] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [formData, setFormData] = useState<any>({});
  const [editingLendingId, setEditingLendingId] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [books, setBooks] = useState<any[]>([]);
  const [readers, setReaders] = useState<any[]>([]);
  const [bookSuggestions, setBookSuggestions] = useState<any[]>([]);
  const [readerSuggestions, setReaderSuggestions] = useState<any[]>([]);
  const [showAddReaderModal, setShowAddReaderModal] = useState(false);
  const [showReaderNotFoundDialog, setShowReaderNotFoundDialog] = useState(false);
  const [searchedBook, setSearchedBook] = useState<any | null>(null);
  const [searchedReader, setSearchedReader] = useState<any | null>(null);
  const [bookSearchValue, setBookSearchValue] = useState("");
  const [readerSearchValue, setReaderSearchValue] = useState("");
  const [statusOptions] = useState([
    { value: "borrowed", label: "Borrowed" },
    { value: "returned", label: "Returned" },
    { value: "returnedLate", label: "Returned Late" },
    { value: "overdue", label: "Overdue" },
  ]);
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  const { setModalOpen } = useModalContext();

  useEffect(() => {
    fetchLendings();
    fetchBooks();
    fetchReaders();
  }, []);

  useEffect(() => {
    // Filter lendings whenever search term changes
    if (!searchTerm.trim()) {
      setFilteredLendings(lendings);
    } else {
      const lowercaseSearch = searchTerm.toLowerCase();
      setFilteredLendings(lendings.filter(lending => {
        // Check book info
        const bookTitle = typeof lending.bookId === 'object' ? lending.bookId.title?.toLowerCase() || '' : '';
        const bookIsbn = typeof lending.bookId === 'object' ? lending.bookId.isbn?.toLowerCase() || '' : '';

        // Check reader info
        const readerName = typeof lending.readerId === 'object' ? lending.readerId.name?.toLowerCase() || '' : '';
        const readerContact = typeof lending.readerId === 'object' ? lending.readerId.contactNumber?.toLowerCase() || '' : '';

        return bookTitle.includes(lowercaseSearch) ||
               bookIsbn.includes(lowercaseSearch) ||
               readerName.includes(lowercaseSearch) ||
               readerContact.includes(lowercaseSearch) ||
               (lending.status && lending.status.toLowerCase().includes(lowercaseSearch));
      }));
    }
  }, [searchTerm, lendings]);

  const fetchLendings = async () => {
    try {
      const data = await getLendings();
      setLendings(data);
      setFilteredLendings(data); // Initialize filtered lendings
    } catch {
      toast.error("Failed to load lendings");
    }
  };

  const fetchBooks = async () => {
    try {
      const b = await getBooks();
      setBooks(b);
      return b;
    } catch {
      toast.error("Failed to load books");
      return [];
    }
  };

  const fetchReaders = async () => {
    try {
      const r = await getReaders();
      setReaders(r);
      return r;
    } catch {
      toast.error("Failed to load readers");
      return [];
    }
  };

  const handleEditClick = async (lending: any) => {
    // Ensure books and readers are loaded before opening modal
    if (books.length === 0) await fetchBooks();
    if (readers.length === 0) await fetchReaders();
    // Find full book and reader objects using both _id and id for robustness
    let book = lending.bookId;
    let reader = lending.readerId;
    if (typeof book === 'string') {
      book = books.find((b: any) => b._id === lending.bookId || b.id === lending.bookId) || lending.bookId;
    }
    if (typeof reader === 'string') {
      reader = readers.find((r: any) => r._id === lending.readerId || r.id === lending.readerId) || lending.readerId;
    }
    // Only open modal if book and reader are found
    if (!book || !reader || typeof book === 'string' || typeof reader === 'string') {
      toast.error("Lending details could not be loaded. Please try again after data is loaded.");
      return;
    }
    setFormData({ ...lending, bookId: book, readerId: reader });
    setEditingLendingId(lending._id);
    setFormOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingLendingId) {
      try {
        if (formData.status === "returned") {
          await returnBook(editingLendingId);
        } else {
          toast.info("Only 'Returned' status is supported for update.");
        }
        toast.success("Lending updated successfully");
      } catch (err: any) {
        toast.error(err?.response?.data?.message || "Failed to update lending");
      }
      setFormOpen(false);
      fetchLendings();
      return;
    }
    if (!searchedBook || !searchedReader) return;
    try {
      await lendBook({
        bookId: searchedBook._id,
        readerId: searchedReader._id,
        days: 14,
      });
      toast.success("Lending added successfully");
      setFormOpen(false);
      fetchLendings();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to add lending");
    }
  };

  const handleAddReader = async (readerData: any) => {
    try {
      const newReader = await addReader(readerData);
      setReaders(prev => [...prev, newReader]);
      setShowAddReaderModal(false);
      toast.success("Reader added successfully");
      setReaderSearchValue(newReader.contactNumber);
      setSearchedReader(newReader);
    } catch {
      toast.error("Failed to add reader");
    }
  };

  // Helper to check if add form is dirty
  const isAddFormDirty = () => {
    return (
      !editingLendingId && (
        bookSearchValue || readerSearchValue || searchedBook || searchedReader
      )
    );
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  return (
      <div className="px-4 py-6">
        <PageMeta title="Lending Management" description="Manage lendings in the library" />
        <PageBreadcrumb pageTitle="Lending Management" />

        <div className="flex flex-col lg:flex-row gap-6">
          <div className={`flex-1 ${formOpen ? 'lg:w-3/5' : 'w-full'}`}>
            <div className="bg-white rounded-2xl p-6 shadow-md">
              <div className="flex justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Lendings</h1>
                <button onClick={() => setFormOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg">
                  + Lend
                </button>
              </div>

              {/* Search bar for filtering lendings */}
              <div className="mb-4">
                <SearchBar
                  placeholder="Search by book title, ISBN, reader name, or status"
                  value={searchTerm}
                  onChange={handleSearch}
                />
              </div>

              <table className="min-w-full text-sm border-collapse">
                <thead className="bg-gray-100 text-gray-600 text-xs font-semibold">
                <tr>
                  <th className="px-4 py-3">Book</th>
                  <th className="px-4 py-3">Reader</th>
                  <th className="px-4 py-3">Lend Date</th>
                  <th className="px-4 py-3">Due Date</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
                </thead>
                <tbody className="bg-white divide-y">
                {filteredLendings.map((lending) => (
                    <tr key={lending._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        {typeof lending.bookId === 'object' && lending.bookId
                          ? (lending.bookId.title || lending.bookId.isbn || 'Unknown Book')
                          : lending.bookId}
                      </td>
                      <td className="px-4 py-3">
                        {typeof lending.readerId === 'object' && lending.readerId
                          ? (lending.readerId.name || lending.readerId.contactNumber || 'Unknown Reader')
                          : lending.readerId}
                      </td>
                      <td className="px-4 py-3">
                        {lending.borrowedDate
                          ? new Date(lending.borrowedDate).toLocaleDateString()
                          : lending.lendDate
                            ? new Date(lending.lendDate).toLocaleDateString()
                            : 'N/A'}
                      </td>
                      <td className="px-4 py-3">
                        {lending.dueDate
                          ? new Date(lending.dueDate).toLocaleDateString()
                          : 'N/A'}
                      </td>
                      <td className="px-4 py-3">
                        {lending.status === "borrowed" && (
                            <span className="px-2 py-1 rounded text-xs font-semibold bg-blue-100 text-blue-700">Borrowed</span>
                        )}
                        {lending.status === "returned" && (
                            <span className="px-2 py-1 rounded text-xs font-semibold bg-green-100 text-green-700">Returned</span>
                        )}
                        {lending.status === "overdue" && (
                            <span className="px-2 py-1 rounded text-xs font-semibold bg-red-100 text-red-700">Overdue</span>
                        )}
                        {lending.status === "returnedLate" && (
                            <span className="px-2 py-1 rounded text-xs font-semibold bg-amber-100 text-amber-700">Returned Late</span>
                        )}
                      </td>
                      <td className="px-4 py-3 flex space-x-2">
                        <button onClick={() => handleEditClick(lending)} className="text-blue-600">
                          <FontAwesomeIcon icon={faEdit} />
                        </button>
                      </td>
                    </tr>
                ))}
                {filteredLendings.length === 0 && (
                    <tr><td colSpan={6} className="text-center py-6 text-gray-400">No lendings found.</td></tr>
                )}
                </tbody>
              </table>
            </div>
          </div>

          {formOpen && (
              <div className="lg:w-2/5 bg-gray-50 p-6 rounded-lg shadow-inner">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">Lending Form</h2>
                  <button
                    onClick={() => {
                      setBookSearchValue("");
                      setReaderSearchValue("");
                      setSearchedBook(null);
                      setSearchedReader(null);
                      setFormData({});
                      setEditingLendingId(null); // Reset editing ID when closing
                      if (!editingLendingId && isAddFormDirty()) {
                        setShowCancelDialog(true);
                      } else {
                        setFormOpen(false);
                      }
                    }}
                    className="text-gray-600"
                  >✕</button>
                </div>

                <form onSubmit={handleFormSubmit} className="space-y-6">
                  {editingLendingId ? (
                    <>
                      {/* Book, Reader, Lend Date, Due Date as labels for update */}
                      <div className="mb-4">
                        <label className="block mb-1 text-sm font-medium text-gray-700">Book</label>
                        <div className="px-4 py-2 bg-gray-100 rounded text-gray-700">
                          {formData.bookId?.title || formData.bookId?.isbn || formData.bookId || "-"}
                        </div>
                      </div>
                      <div className="mb-4">
                        <label className="block mb-1 text-sm font-medium text-gray-700">Reader</label>
                        <div className="px-4 py-2 bg-gray-100 rounded text-gray-700">
                          {formData.readerId?.name || formData.readerId?.contactNumber || formData.readerId || "-"}
                        </div>
                      </div>
                      <div className="flex gap-4 mb-4">
                        <div className="flex-1">
                          <label className="block mb-1 font-medium">Lend Date</label>
                          <div className="px-4 py-2 bg-gray-100 rounded text-gray-700">
                            {formData.lendDate || formData.borrowedDate || "-"}
                          </div>
                        </div>
                        <div className="flex-1">
                          <label className="block mb-1 font-medium">Due Date</label>
                          <div className="px-4 py-2 bg-gray-100 rounded text-gray-700">
                            {formData.dueDate || "-"}
                          </div>
                        </div>
                      </div>
                      <div className="mb-4">
                        <label className="block mb-1 text-sm font-medium text-gray-700">Status</label>
                        <select
                          value={formData.status || ""}
                          onChange={e => setFormData({ ...formData, status: e.target.value })}
                          className="w-full border px-4 py-2 rounded-lg"
                          required
                        >
                          <option value="" disabled>Select status</option>
                          <option value="returned">Return Book</option>
                        </select>
                        {new Date() > new Date(formData.dueDate) && (
                          <p className="text-sm text-amber-600 mt-1">
                            ⚠️ This book is overdue and will be marked as "Returned Late"
                          </p>
                        )}
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Book and Reader fields for new lending only */}
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
                              autoComplete="off"
                          />
                          <button
                              type="button"
                              onClick={() => {
                                const found = books.find(b => b.isbn === bookSearchValue);
                                if (!found) {
                                  toast.error("Please select a book from the suggestions.");
                                  return;
                                }
                                if (found.availableCopies <= 0) {
                                  toast.error("This book is currently not available for lending.");
                                  setSearchedBook(null);
                                  setBookSuggestions([]);
                                  setBookSearchValue("");
                                  return;
                                }
                                setSearchedBook(found);
                                setBookSuggestions([]);
                              }}
                              className="bg-blue-500 text-white px-3 py-2 rounded-lg flex items-center justify-center"
                          >
                            <FontAwesomeIcon icon={faSearch} />
                          </button>
                          {bookSuggestions.length > 0 && (
                              <ul className="absolute left-0 top-full w-full bg-white border mt-1 rounded shadow max-h-40 overflow-y-auto z-20">
                                {bookSuggestions.map((b) => (
                                    <li key={b._id} className="px-4 py-2 hover:bg-blue-100 cursor-pointer text-sm"
                                        onClick={() => {
                                          if (b.availableCopies <= 0) {
                                            toast.error("This book is currently not available for lending.");
                                            setSearchedBook(null);
                                            setBookSuggestions([]);
                                            setBookSearchValue("");
                                            return;
                                          }
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
                              autoComplete="off"
                          />
                          <button
                              type="button"
                              onClick={() => {
                                const found = readers.find(r => r.contactNumber === readerSearchValue);
                                if (!found) {
                                  toast.error("Please select a reader from the suggestions.");
                                  return;
                                }
                                setSearchedReader(found);
                                setReaderSuggestions([]);
                              }}
                              className="bg-blue-500 text-white px-3 py-2 rounded-lg flex items-center justify-center"
                          >
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
                                      {r.contactNumber} �� {r.name}
                                    </li>
                                ))}
                              </ul>
                          )}
                        </div>
                        {searchedReader && (
                            <div className="mt-2 text-green-700 text-sm">Found: {searchedReader.name} ({searchedReader.email})</div>
                        )}
                      </div>

                      {/* Lend Date and Due Date for adding only */}
                      <div className="flex gap-4 mb-4">
                        <div className="flex-1">
                          <label className="block mb-1 font-medium">Lend Date</label>
                          <input
                              type="date"
                              value={formData?.lendDate || ""}
                              onChange={e => setFormData({ ...formData, lendDate: e.target.value })}
                              className="w-full border px-4 py-2 rounded"
                              required
                          />
                        </div>
                        <div className="flex-1">
                          <label className="block mb-1 font-medium">Due Date</label>
                          <input
                              type="date"
                              value={formData?.dueDate || ""}
                              onChange={e => setFormData({ ...formData, dueDate: e.target.value })}
                              className="w-full border px-4 py-2 rounded"
                              required
                          />
                        </div>
                      </div>
                    </>
                  )}

                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setBookSearchValue("");
                        setReaderSearchValue("");
                        setSearchedBook(null);
                        setSearchedReader(null);
                        setFormData({});
                        setEditingLendingId(null); // Reset editing ID when closing
                        if (!editingLendingId && isAddFormDirty()) {
                          setShowCancelDialog(true);
                        } else {
                          setFormOpen(false);
                        }
                      }}
                      className="bg-gray-300 px-4 py-2 rounded"
                    >
                      Cancel
                    </button>
                    <button type="submit" className="bg-blue-600 text-white px-5 py-2 rounded"
                      disabled={editingLendingId ? !formData.status : (!searchedBook || !searchedReader)}>
                      {editingLendingId ? "Update Status" : "Lend"}
                    </button>
                  </div>

                {/* Cancel confirmation dialog for add form */}
                {showCancelDialog && (
                  <CustomDialog
                    title="Discard Lending?"
                    message="You have unsaved changes. Do you want to discard and close the form?"
                    onCancel={() => setShowCancelDialog(false)}
                    onConfirm={() => {
                      setShowCancelDialog(false);
                      setFormOpen(false);
                      setBookSearchValue("");
                      setReaderSearchValue("");
                      setSearchedBook(null);
                      setSearchedReader(null);
                      setFormData({});
                    }}
                    confirmText="Yes, Discard"
                    cancelText="No"
                  />
                )}
                </form>
              </div>
          )}
        </div>

        {showAddReaderModal && <AddReaderForm onAdd={handleAddReader} onClose={() => setShowAddReaderModal(false)} />}

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
