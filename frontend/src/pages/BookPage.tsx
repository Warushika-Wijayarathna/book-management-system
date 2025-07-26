import React, { useEffect, useState } from "react";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import PageMeta from "../components/common/PageMeta";
import { getBooks, addBook, updateBook, deleteBook } from "../services/bookService";
import { Book, BookFormData } from "../types/Book";
import { storage } from "../services/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import DropzoneComponent from "../components/form/form-elements/DropZone";
import { useModalContext } from "../context/ModalContext";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

export default function BookPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [formData, setFormData] = useState<BookFormData | null>(null);
  const [editingBookId, setEditingBookId] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [dropzoneReset, setDropzoneReset] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { isModalOpen, setModalOpen } = useModalContext();

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const books = await getBooks();
      setBooks(books);
    } catch (error) {
      toast.error("Failed to load books");
    }
  };

  const handleAddClick = () => {
    setFormData({
      title: "",
      author: "",
      isbn: "",
      publishedYear: new Date().getFullYear(),
      category: "",
      totalCopies: 1,
      availableCopies: 1,
      addedDate: new Date(),
      imageUrl: "",
    });
    setEditingBookId(null);
    setDropzoneReset(true);
    setModalOpen(true);
  };

  const handleEditClick = (book: Book) => {
    const { _id, ...formBookData } = book;
    setFormData({ ...formBookData });
    setEditingBookId(book._id);
    setDropzoneReset(true);
    setModalOpen(true);
  };

  const handleDeleteClick = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this book?")) return;
    try {
      await deleteBook(id);
      toast.success("Book deleted successfully");
      fetchBooks();
    } catch (error) {
      toast.error("Failed to delete book");
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!formData) return;
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;

    // Validate required fields
    const requiredFields = ["title", "author", "isbn", "publishedYear", "category"];
    for (const field of requiredFields) {
      if (!formData[field as keyof BookFormData]) {
        toast.error(`Please fill out the "${field}" field.`);
        return;
      }
    }

    setIsUploading(true);
    let imageUrl = formData.imageUrl || "";

    try {
      if (imageFile) {
        const imageRef = ref(storage, `books/${Date.now()}_${imageFile.name}`);
        await uploadBytes(imageRef, imageFile);
        imageUrl = await getDownloadURL(imageRef);
      }

      const bookData = { ...formData, imageUrl };

      if (editingBookId) {
        await updateBook(editingBookId, bookData);
        toast.success("Book updated successfully");
      } else {
        await addBook(bookData);
        toast.success("Book added successfully");
      }

      setModalOpen(false);
      setImageFile(null);
      setDropzoneReset(true);
      fetchBooks();
    } catch (error) {
      console.error("Error saving book:", error);
      toast.error(editingBookId ? "Failed to update book" : "Failed to add book");
    } finally {
      setIsUploading(false);
    }
  };

  return (
      <div>
        <PageMeta title="Book Management" description="Manage books in the library" />
        <PageBreadcrumb pageTitle="Book Management" />
        <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
          <div className="mb-6 flex justify-between items-center">
            <h3 className="font-semibold text-gray-800 text-theme-xl dark:text-white/90 sm:text-2xl">Books</h3>
            <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={handleAddClick}>Add Book</button>
          </div>

          {/* Book Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {books.map(book => (
                <div key={book._id} className="bg-white rounded-xl shadow border p-4 flex flex-col items-center">
                  {book.imageUrl ? (
                      <img src={book.imageUrl} alt={book.title} className="w-32 h-40 object-cover rounded mb-3" />
                  ) : (
                      <div className="w-32 h-40 bg-gray-200 flex items-center justify-center rounded mb-3 text-gray-500">No Image</div>
                  )}
                  <div className="w-full text-center">
                    <h4 className="font-bold text-lg mb-1">{book.title}</h4>
                    <p className="text-sm text-gray-600 mb-1">by {book.author}</p>
                    <p className="text-xs text-gray-500 mb-1">ISBN: {book.isbn}</p>
                    <p className="text-xs text-gray-500 mb-1">Year: {book.publishedYear}</p>
                    <p className="text-xs text-gray-500 mb-1">Category: {book.category}</p>
                    <p className="text-xs text-gray-500 mb-1">Total: {book.totalCopies} | Available: {book.availableCopies}</p>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <button className="px-3 py-1 bg-blue-500 text-white rounded flex items-center justify-center" onClick={() => handleEditClick(book)}>
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button className="px-3 py-1 bg-red-500 text-white rounded flex items-center justify-center" onClick={() => handleDeleteClick(book._id)}>
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                </div>
            ))}
          </div>

          {/* Modal */}
          {isModalOpen && formData && (
              <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-[99999]">
                <div className="bg-white p-6 rounded shadow-xl w-full max-w-md">
                  <h4 className="mb-4 font-semibold">{editingBookId ? "Edit Book" : "Add Book"}</h4>
                  <form onSubmit={handleFormSubmit}>
                    <label>Title</label>
                    <input name="title" value={formData.title} onChange={handleFormChange} className="mb-2 w-full border px-2 py-1" />
                    <label>Author</label>
                    <input name="author" value={formData.author} onChange={handleFormChange} className="mb-2 w-full border px-2 py-1" />
                    <label>ISBN</label>
                    <input name="isbn" value={formData.isbn} onChange={handleFormChange} className="mb-2 w-full border px-2 py-1" />
                    <label>Published Year</label>
                    <input type="number" name="publishedYear" value={formData.publishedYear} onChange={handleFormChange} className="mb-2 w-full border px-2 py-1" />
                    <label>Category</label>
                    <input name="category" value={formData.category} onChange={handleFormChange} className="mb-2 w-full border px-2 py-1" />
                    <label>Total Copies</label>
                    <input type="number" name="totalCopies" value={formData.totalCopies} onChange={handleFormChange} className="mb-2 w-full border px-2 py-1" />
                    <label>Available Copies</label>
                    <input type="number" name="availableCopies" value={formData.availableCopies} onChange={handleFormChange} className="mb-2 w-full border px-2 py-1" />
                    <label>Image</label>
                    <DropzoneComponent
                        key={dropzoneReset.toString()}
                        onDrop={(files) => {
                          setImageFile(files[0] || null);
                          setDropzoneReset(false);
                        }}
                        reset={dropzoneReset}
                    />
                    <div className="mt-4 flex justify-end gap-2">
                      <button
                          type="button"
                          className="px-4 py-2 bg-gray-400 text-white rounded"
                          onClick={() => setModalOpen(false)}
                          disabled={isUploading}
                      >
                        Cancel
                      </button>
                      <button
                          type="submit"
                          className="px-4 py-2 bg-blue-600 text-white rounded flex items-center justify-center gap-2"
                          disabled={isUploading}
                      >
                        {isUploading ? (
                            <>
                              <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l5-5-5-5v4a12 12 0 100 24v-4l-5 5 5 5v-4a8 8 0 01-8-8z" />
                              </svg>
                              <span>Uploading...</span>
                            </>
                        ) : (
                            <span>{editingBookId ? "Update" : "Add"}</span>
                        )}
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
