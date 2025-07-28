import FilterDropdown from '../common/FilterDropdown';
import { Book } from '../../types/Book';

interface BookFiltersProps {
  books: Book[];
  onFiltersChange: (filters: BookFilters) => void;
  activeFilters: BookFilters;
}

export interface BookFilters {
  genres: string[];
  authors: string[];
  yearRange: string[];
  availability: string[];
}

export default function BookFilters({ books, onFiltersChange, activeFilters }: BookFiltersProps) {
  // Get unique genres from all books
  const allGenres = Array.from(new Set(
    books.flatMap(book => book.genres || [])
  )).sort();

  // Get unique authors
  const allAuthors = Array.from(new Set(
    books.map(book => book.author)
  )).sort();

  // Generate year ranges
  const currentYear = new Date().getFullYear();
  const yearRanges = [
    { value: `${currentYear}-${currentYear}`, label: `${currentYear}` },
    { value: `${currentYear-5}-${currentYear-1}`, label: `${currentYear-5}-${currentYear-1}` },
    { value: `${currentYear-10}-${currentYear-6}`, label: `${currentYear-10}-${currentYear-6}` },
    { value: `2000-${currentYear-11}`, label: `2000-${currentYear-11}` },
    { value: '1900-1999', label: '1900-1999' },
    { value: '0-1899', label: 'Before 1900' }
  ];

  // Availability options
  const availabilityOptions = [
    { value: 'available', label: 'Available' },
    { value: 'unavailable', label: 'Out of Stock' },
    { value: 'low-stock', label: 'Low Stock (≤5 copies)' }
  ];

  // Count books for each filter option
  const genreOptions = allGenres.map(genre => ({
    value: genre,
    label: genre,
    count: books.filter(book => book.genres?.includes(genre)).length
  }));

  const authorOptions = allAuthors.map(author => ({
    value: author,
    label: author,
    count: books.filter(book => book.author === author).length
  }));

  const yearOptions = yearRanges.map(range => {
    const [start, end] = range.value.split('-').map(Number);
    const count = books.filter(book => {
      return book.publishedYear >= start && book.publishedYear <= end;
    }).length;
    return {
      value: range.value,
      label: range.label,
      count
    };
  }).filter(option => option.count > 0);

  const availabilityOptionsWithCount = availabilityOptions.map(option => {
    let count = 0;
    switch (option.value) {
      case 'available':
        count = books.filter(book => book.availableCopies > 0).length;
        break;
      case 'unavailable':
        count = books.filter(book => book.availableCopies === 0).length;
        break;
      case 'low-stock':
        count = books.filter(book => book.availableCopies > 0 && book.availableCopies <= 5).length;
        break;
    }
    return { ...option, count };
  });

  const handleFilterChange = (filterType: keyof BookFilters, values: string[]) => {
    onFiltersChange({
      ...activeFilters,
      [filterType]: values
    });
  };

  return (
    <div className="flex flex-wrap gap-3 mb-4 p-4 bg-gray-50 rounded-lg">
      <FilterDropdown
        title="Genres"
        options={genreOptions}
        selectedValues={activeFilters.genres}
        onSelectionChange={(values) => handleFilterChange('genres', values)}
        showCounts={true}
      />

      <FilterDropdown
        title="Authors"
        options={authorOptions}
        selectedValues={activeFilters.authors}
        onSelectionChange={(values) => handleFilterChange('authors', values)}
        showCounts={true}
      />

      <FilterDropdown
        title="Published Year"
        options={yearOptions}
        selectedValues={activeFilters.yearRange}
        onSelectionChange={(values) => handleFilterChange('yearRange', values)}
        showCounts={true}
      />

      <FilterDropdown
        title="Availability"
        options={availabilityOptionsWithCount}
        selectedValues={activeFilters.availability}
        onSelectionChange={(values) => handleFilterChange('availability', values)}
        showCounts={true}
      />
    </div>
  );
}
