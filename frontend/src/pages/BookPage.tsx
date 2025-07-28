import React, { useEffect, useState } from "react";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import PageMeta from "../components/common/PageMeta";
import BookLendingHistory from "../components/common/BookLendingHistory";
import { getBooks, addBook, updateBook, deleteBook } from "../services/bookService";
import { Book, BookFormData } from "../types/Book";
import { storage } from "../services/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import DropzoneComponent from "../components/form/form-elements/DropZone";
import { useModalContext } from "../context/ModalContext";
import { useAuth } from "../context/useAuth";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';
import SearchBar from "../components/common/SearchBar";
import BookFilters, { BookFilters as BookFiltersType } from "../components/filters/BookFilters";

export default function BookPage() {
  const { isLoggedIn, isAuthenticating } = useAuth();
  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [activeFilters, setActiveFilters] = useState<BookFiltersType>({
    genres: [],
    authors: [],
    yearRange: [],
    availability: []
  });
  const [formData, setFormData] = useState<BookFormData | null>(null);
  const [editingBookId, setEditingBookId] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [dropzoneReset, setDropzoneReset] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [newGenre, setNewGenre] = useState<string>("");
  const { isModalOpen, setModalOpen } = useModalContext();

  const genreSuggestions = [
    "Fiction", "Non-fiction", "Fantasy", "Science Fiction", "Mystery",
    "Thriller", "Romance", "Horror", "Adventure", "Historical Fiction",
    "Biography", "Self-help", "Philosophy", "Poetry", "Drama",
    "Satire", "Young Adult", "Children's", "Art", "Travel"
  ];

  useEffect(() => {
    if (isLoggedIn && !isAuthenticating) {
      console.log('BookPage - Fetching books...');
      fetchBooks();
    } else {
      console.log('BookPage - Not fetching books:', { isLoggedIn, isAuthenticating });
    }
  }, [isLoggedIn, isAuthenticating]);

  useEffect(() => {
    applyFilters();
  }, [searchTerm, books, activeFilters]);

  const fetchBooks = async () => {
    try {
      const books = await getBooks();
      setBooks(books);
      setFilteredBooks(books);
    } catch (error) {
      console.error('Error fetching books:', error);
      toast.error("Failed to load books");
    }
  };

  const applyFilters = () => {
    let filtered = books;

    if (searchTerm.trim()) {
      const lowercaseSearch = searchTerm.toLowerCase();
      filtered = filtered.filter(book =>
        book.title.toLowerCase().includes(lowercaseSearch) ||
        book.author.toLowerCase().includes(lowercaseSearch) ||
        book.isbn.toLowerCase().includes(lowercaseSearch) ||
        (book.genres && book.genres.some(genre =>
          genre.toLowerCase().includes(lowercaseSearch)
        ))
      );
    }

    if (activeFilters.genres.length > 0) {
      filtered = filtered.filter(book =>
        book.genres && book.genres.some(genre => activeFilters.genres.includes(genre))
      );
    }

    if (activeFilters.authors.length > 0) {
      filtered = filtered.filter(book =>
        activeFilters.authors.includes(book.author)
      );
    }

    if (activeFilters.yearRange.length > 0) {
      filtered = filtered.filter(book => {
        return activeFilters.yearRange.some(range => {
          const [start, end] = range.split('-').map(Number);
          return book.publishedYear >= start && book.publishedYear <= end;
        });
      });
    }

    if (activeFilters.availability.length > 0) {
      filtered = filtered.filter(book => {
        return activeFilters.availability.some(availability => {
          switch (availability) {
            case 'available':
              return book.availableCopies > 0;
            case 'unavailable':
              return book.availableCopies === 0;
            case 'low-stock':
              return book.availableCopies > 0 && book.availableCopies <= 5;
            default:
              return true;
          }
        });
      });
    }

    setFilteredBooks(filtered);
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const handleFiltersChange = (filters: BookFiltersType) => {
    setActiveFilters(filters);
  };

  const handleAddClick = () => {
    setFormData({
      title: "",
      author: "",
      isbn: "",
      publishedYear: new Date().getFullYear(),
      genres: [],
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
    setFormData({
      ...formBookData,
      genres: Array.isArray(book.genres) ? book.genres : []
    });
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

  const handleAddGenre = () => {
    if (!formData) return;
    if (!newGenre.trim()) {
      toast.error("Please enter a genre");
      return;
    }
    if (formData.genres.includes(newGenre.trim())) {
      toast.error("This genre is already added");
      return;
    }

    setFormData({
      ...formData,
      genres: [...formData.genres, newGenre.trim()]
    });
    setNewGenre("");
  };

  const handleRemoveGenre = (genreToRemove: string) => {
    if (!formData) return;
    setFormData({
      ...formData,
      genres: formData.genres.filter(genre => genre !== genreToRemove)
    });
  };

  const handleAddSuggestedGenre = (genre: string) => {
    if (!formData) return;
    if (formData.genres.includes(genre)) {
      toast.error("This genre is already added");
      return;
    }
    setFormData({
      ...formData,
      genres: [...formData.genres, genre]
    });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;

    const requiredFields = ["title", "author", "isbn", "publishedYear"];
    for (const field of requiredFields) {
      if (!formData[field as keyof BookFormData]) {
        toast.error(`Please fill out the "${field}" field.`);
        return;
      }
    }

    if (!formData.genres || formData.genres.length === 0) {
      toast.error("Please add at least one genre");
      return;
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

          {/* Search Bar */}
          <div className="mb-4">
            <SearchBar
              placeholder="Search by title, author, ISBN, or genre..."
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>

          {/* Book Filters - New Component */}
          <div className="mb-4">
            <BookFilters
              books={books}
              activeFilters={activeFilters}
              onFiltersChange={handleFiltersChange}
            />
          </div>

          {/* Book Rows */}
          <div className="space-y-4">
            {filteredBooks.map(book => (
                <div key={book._id} className="bg-white rounded-xl shadow border">
                  {/* Book Info Row */}
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex items-start gap-6">
                      {/* Book Image */}
                      <div className="flex-shrink-0">
                        {book.imageUrl ? (
                            <img src={book.imageUrl} alt={book.title} className="w-24 h-32 object-cover rounded shadow-sm" />
                        ) : (
                            <div className="w-24 h-32 bg-gray-200 flex items-center justify-center rounded shadow-sm text-gray-500 text-xs">No Image</div>
                        )}
                      </div>

                      {/* Book Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-xl text-gray-900 mb-1 truncate">{book.title}</h4>
                            <p className="text-lg text-gray-600 mb-2">by {book.author}</p>
                          </div>
                          <div className="flex items-center gap-3 ml-4">
                            <button
                              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
                              onClick={() => handleEditClick(book)}
                              title="Edit Book"
                            >
                              <FontAwesomeIcon icon={faEdit} />
                              <span className="hidden sm:inline">Edit</span>
                            </button>
                            <button
                              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
                              onClick={() => handleDeleteClick(book._id)}
                              title="Delete Book"
                            >
                              <FontAwesomeIcon icon={faTrash} />
                              <span className="hidden sm:inline">Delete</span>
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-3">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">ISBN:</span>
                            <span className="truncate">{book.isbn}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">Year:</span> {book.publishedYear}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">Copies:</span> {book.availableCopies}/{book.totalCopies} available
                          </div>
                        </div>

                        {/* Genres */}
                        <div className="mb-2">
                          <span className="font-medium text-sm text-gray-700 mr-2">Genres:</span>
                          <div className="inline-flex flex-wrap gap-1">
                            {book.genres && book.genres.length > 0 ? (
                              book.genres.map((genre, index) => (
                                <span key={index} className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                                  {genre}
                                </span>
                              ))
                            ) : (
                              <span className="text-xs text-gray-400 italic">No genres</span>
                            )}
                          </div>
                        </div>

                        {/* Availability Status */}
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm text-gray-700">Status:</span>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            book.availableCopies > 0 
                              ? book.availableCopies <= 5 
                                ? 'bg-yellow-100 text-yellow-800' 
                                : 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {book.availableCopies > 0
                              ? book.availableCopies <= 5
                                ? 'Low Stock'
                                : 'Available'
                              : 'Out of Stock'
                            }
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Lending History Section */}
                  <div className="px-6 pb-6">
                    <BookLendingHistory bookId={book._id} />
                  </div>
                </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredBooks.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500 text-lg mb-2">No books found</div>
              <div className="text-gray-400">Try adjusting your search or filter criteria</div>
            </div>
          )}

          {/* Modal */}
          {isModalOpen && formData && (
              <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-[99999]">
                <div className="bg-white p-6 rounded shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
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

                    {/* Genres Section */}
                    <label className="block mb-1">Genres</label>
                    <div className="flex flex-wrap gap-1 mb-2 p-2 border rounded">
                      {formData.genres && formData.genres.map((genre, index) => (
                        <div key={index} className="flex items-center bg-blue-100 rounded px-2 py-1">
                          <span className="text-sm mr-1">{genre}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveGenre(genre)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <FontAwesomeIcon icon={faTimes} size="sm" />
                          </button>
                        </div>
                      ))}
                      {(!formData.genres || formData.genres.length === 0) && (
                        <span className="text-sm text-gray-400 italic">No genres added yet</span>
                      )}
                    </div>

                    <div className="flex gap-2 mb-4">
                      <input
                        type="text"
                        placeholder="Add a genre"
                        value={newGenre}
                        onChange={(e) => setNewGenre(e.target.value)}
                        className="flex-1 border px-2 py-1"
                      />
                      <button
                        type="button"
                        onClick={handleAddGenre}
                        className="bg-green-500 text-white px-2 py-1 rounded"
                      >
                        <FontAwesomeIcon icon={faPlus} />
                      </button>
                    </div>

                    {/* Genre Suggestions */}
                    <div className="mb-4">
                      <label className="block text-sm mb-1">Common Genres:</label>
                      <div className="flex flex-wrap gap-1">
                        {genreSuggestions.map((genre) => (
                          <button
                            key={genre}
                            type="button"
                            onClick={() => handleAddSuggestedGenre(genre)}
                            disabled={formData.genres && formData.genres.includes(genre)}
                            className={`text-xs px-2 py-1 rounded ${
                              formData.genres && formData.genres.includes(genre)
                                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                : "bg-blue-50 text-blue-700 hover:bg-blue-100"
                            }`}
                          >
                            {genre}
                          </button>
                        ))}
                      </div>
                    </div>

                    <label>Total Copies</label>
                    <input type="number" name="totalCopies" value={formData.totalCopies} onChange={handleFormChange} className="mb-2 w-full border px-2 py-1" />
                    <label>Available Copies</label>
                    <input type="number" name="availableCopies" value={formData.availableCopies} onChange={handleFormChange} className="mb-2 w-full border px-2 py-1" />
                    <label>Image</label>
                    <DropzoneComponent
                      onFileUploaded={(file) => setImageFile(file)}
                      reset={dropzoneReset}
                      imageUrl={formData.imageUrl}
                    />
                    <div className="mt-4 flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setModalOpen(false)}
                        className="px-4 py-2 bg-gray-300 rounded"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isUploading}
                        className={`px-4 py-2 rounded ${isUploading ? "bg-blue-300" : "bg-blue-600 text-white"}`}
                      >
                        {isUploading ? "Saving..." : "Save"}
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
