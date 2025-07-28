import FilterDropdown from '../common/FilterDropdown';

interface LendingFiltersProps {
  lendings: any[];
  onFiltersChange: (filters: LendingFilters) => void;
  activeFilters: LendingFilters;
}

export interface LendingFilters {
  status: string[];
  dueDateRange: string[];
  borrowedDateRange: string[];
  overdueOnly: string[];
}

export default function LendingFilters({ lendings, onFiltersChange, activeFilters }: LendingFiltersProps) {
  // Status options
  const statusOptions = [
    { value: 'borrowed', label: 'Currently Borrowed' },
    { value: 'returned', label: 'Returned' },
    { value: 'overdue', label: 'Overdue' }
  ];

  // Due date range options
  const dueDateRanges = [
    { value: 'overdue', label: 'Overdue' },
    { value: 'due-today', label: 'Due Today' },
    { value: 'due-this-week', label: 'Due This Week' },
    { value: 'due-next-week', label: 'Due Next Week' },
    { value: 'due-this-month', label: 'Due This Month' },
    { value: 'due-later', label: 'Due Later' }
  ];

  // Borrowed date range options
  const borrowedDateRanges = [
    { value: 'today', label: 'Borrowed Today' },
    { value: 'this-week', label: 'This Week' },
    { value: 'last-week', label: 'Last Week' },
    { value: 'this-month', label: 'This Month' },
    { value: 'last-month', label: 'Last Month' },
    { value: 'last-3-months', label: 'Last 3 Months' },
    { value: 'older', label: 'Older than 3 Months' }
  ];

  // Count lendings for each filter option
  const statusOptionsWithCount = statusOptions.map(option => {
    const count = lendings.filter(lending => lending.status === option.value).length;
    return { ...option, count };
  });

  const dueDateOptionsWithCount = dueDateRanges.map(range => {
    let count = 0;
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    lendings.forEach(lending => {
      if (!lending.dueDate) return;

      const dueDate = new Date(lending.dueDate);
      const dueDateOnly = new Date(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate());

      switch (range.value) {
        case 'overdue':
          if (dueDateOnly < today && lending.status !== 'returned') {
            count++;
          }
          break;
        case 'due-today':
          if (dueDateOnly.getTime() === today.getTime() && lending.status !== 'returned') {
            count++;
          }
          break;
        case 'due-this-week':
          const weekEnd = new Date(today.getTime() + (7 * 24 * 60 * 60 * 1000));
          if (dueDateOnly >= today && dueDateOnly <= weekEnd && lending.status !== 'returned') {
            count++;
          }
          break;
        case 'due-next-week':
          const nextWeekStart = new Date(today.getTime() + (7 * 24 * 60 * 60 * 1000));
          const nextWeekEnd = new Date(today.getTime() + (14 * 24 * 60 * 60 * 1000));
          if (dueDateOnly >= nextWeekStart && dueDateOnly <= nextWeekEnd && lending.status !== 'returned') {
            count++;
          }
          break;
        case 'due-this-month':
          if (dueDateOnly.getMonth() === today.getMonth() &&
              dueDateOnly.getFullYear() === today.getFullYear() &&
              lending.status !== 'returned') {
            count++;
          }
          break;
        case 'due-later':
          const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
          if (dueDateOnly >= nextMonth && lending.status !== 'returned') {
            count++;
          }
          break;
      }
    });

    return { ...range, count };
  }).filter(option => option.count > 0);

  const borrowedDateOptionsWithCount = borrowedDateRanges.map(range => {
    let count = 0;
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    lendings.forEach(lending => {
      if (!lending.borrowedDate) return;

      const borrowedDate = new Date(lending.borrowedDate);
      const borrowedDateOnly = new Date(borrowedDate.getFullYear(), borrowedDate.getMonth(), borrowedDate.getDate());

      switch (range.value) {
        case 'today':
          if (borrowedDateOnly.getTime() === today.getTime()) {
            count++;
          }
          break;
        case 'this-week':
          const weekStart = new Date(today.getTime() - (today.getDay() * 24 * 60 * 60 * 1000));
          if (borrowedDateOnly >= weekStart && borrowedDateOnly <= today) {
            count++;
          }
          break;
        case 'last-week':
          const lastWeekStart = new Date(today.getTime() - ((today.getDay() + 7) * 24 * 60 * 60 * 1000));
          const lastWeekEnd = new Date(today.getTime() - (today.getDay() * 24 * 60 * 60 * 1000));
          if (borrowedDateOnly >= lastWeekStart && borrowedDateOnly < lastWeekEnd) {
            count++;
          }
          break;
        case 'this-month':
          if (borrowedDateOnly.getMonth() === today.getMonth() &&
              borrowedDateOnly.getFullYear() === today.getFullYear()) {
            count++;
          }
          break;
        case 'last-month':
          const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1);
          if (borrowedDateOnly.getMonth() === lastMonth.getMonth() &&
              borrowedDateOnly.getFullYear() === lastMonth.getFullYear()) {
            count++;
          }
          break;
        case 'last-3-months':
          const threeMonthsAgo = new Date(today.getTime() - (90 * 24 * 60 * 60 * 1000));
          if (borrowedDateOnly >= threeMonthsAgo) {
            count++;
          }
          break;
        case 'older':
          const threeMonthsAgoForOlder = new Date(today.getTime() - (90 * 24 * 60 * 60 * 1000));
          if (borrowedDateOnly < threeMonthsAgoForOlder) {
            count++;
          }
          break;
      }
    });

    return { ...range, count };
  }).filter(option => option.count > 0);

  const handleFilterChange = (filterType: keyof LendingFilters, values: string[]) => {
    onFiltersChange({
      ...activeFilters,
      [filterType]: values
    });
  };

  return (
    <div className="flex flex-wrap gap-3 mb-4 p-4 bg-gray-50 rounded-lg">
      <FilterDropdown
        title="Status"
        options={statusOptionsWithCount}
        selectedValues={activeFilters.status}
        onSelectionChange={(values) => handleFilterChange('status', values)}
        showCounts={true}
      />

      <FilterDropdown
        title="Due Date"
        options={dueDateOptionsWithCount}
        selectedValues={activeFilters.dueDateRange}
        onSelectionChange={(values) => handleFilterChange('dueDateRange', values)}
        showCounts={true}
      />

      <FilterDropdown
        title="Borrowed Date"
        options={borrowedDateOptionsWithCount}
        selectedValues={activeFilters.borrowedDateRange}
        onSelectionChange={(values) => handleFilterChange('borrowedDateRange', values)}
        showCounts={true}
      />
    </div>
  );
}
