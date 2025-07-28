import FilterDropdown from '../common/FilterDropdown';
import { Reader } from '../../types/Reader';

interface ReaderFiltersProps {
  readers: Reader[];
  onFiltersChange: (filters: ReaderFilters) => void;
  activeFilters: ReaderFilters;
}

export interface ReaderFilters {
  registrationDate: string[];
  location: string[];
  activityStatus: string[];
}

export default function ReaderFilters({ readers, onFiltersChange, activeFilters }: ReaderFiltersProps) {
  // Generate date ranges for registration
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const dateRanges = [
    { value: 'this-month', label: 'This Month' },
    { value: 'last-month', label: 'Last Month' },
    { value: 'last-3-months', label: 'Last 3 Months' },
    { value: 'last-6-months', label: 'Last 6 Months' },
    { value: 'this-year', label: 'This Year' },
    { value: 'last-year', label: 'Last Year' },
    { value: 'older', label: 'Older than 1 Year' }
  ];

  // Extract unique locations from addresses (simplified - you might want to parse addresses better)
  const allLocations = Array.from(new Set(
    readers.map(reader => {
      // Simple extraction of city/location from address
      const addressParts = reader.address?.split(',') || [];
      return addressParts[addressParts.length - 1]?.trim() || 'Unknown';
    }).filter(location => location && location !== 'Unknown')
  )).sort();

  // Activity status options
  const activityOptions = [
    { value: 'recently-active', label: 'Recently Active (< 30 days)' },
    { value: 'moderately-active', label: 'Moderately Active (30-90 days)' },
    { value: 'inactive', label: 'Inactive (> 90 days)' },
    { value: 'new-member', label: 'New Member (< 7 days)' }
  ];

  // Count readers for each filter option
  const dateOptions = dateRanges.map(range => {
    let count = 0;
    const now = new Date();

    readers.forEach(reader => {
      const createdDate = new Date(reader.createdAt);

      switch (range.value) {
        case 'this-month':
          if (createdDate.getFullYear() === now.getFullYear() &&
              createdDate.getMonth() === now.getMonth()) {
            count++;
          }
          break;
        case 'last-month':
          const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1);
          if (createdDate.getFullYear() === lastMonth.getFullYear() &&
              createdDate.getMonth() === lastMonth.getMonth()) {
            count++;
          }
          break;
        case 'last-3-months':
          const threeMonthsAgo = new Date(now.getTime() - (90 * 24 * 60 * 60 * 1000));
          if (createdDate >= threeMonthsAgo) {
            count++;
          }
          break;
        case 'last-6-months':
          const sixMonthsAgo = new Date(now.getTime() - (180 * 24 * 60 * 60 * 1000));
          if (createdDate >= sixMonthsAgo) {
            count++;
          }
          break;
        case 'this-year':
          if (createdDate.getFullYear() === now.getFullYear()) {
            count++;
          }
          break;
        case 'last-year':
          if (createdDate.getFullYear() === now.getFullYear() - 1) {
            count++;
          }
          break;
        case 'older':
          const oneYearAgo = new Date(now.getTime() - (365 * 24 * 60 * 60 * 1000));
          if (createdDate < oneYearAgo) {
            count++;
          }
          break;
      }
    });

    return { ...range, count };
  }).filter(option => option.count > 0);

  const locationOptions = allLocations.map(location => ({
    value: location,
    label: location,
    count: readers.filter(reader => reader.address?.includes(location)).length
  }));

  // For activity status, we'll use a simplified approach based on creation date
  // In a real app, you'd track actual activity (last login, last book borrowed, etc.)
  const activityOptionsWithCount = activityOptions.map(option => {
    let count = 0;
    const now = new Date();

    readers.forEach(reader => {
      const createdDate = new Date(reader.createdAt);
      const daysSinceCreation = Math.floor((now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24));

      switch (option.value) {
        case 'recently-active':
          if (daysSinceCreation <= 30) count++;
          break;
        case 'moderately-active':
          if (daysSinceCreation > 30 && daysSinceCreation <= 90) count++;
          break;
        case 'inactive':
          if (daysSinceCreation > 90) count++;
          break;
        case 'new-member':
          if (daysSinceCreation <= 7) count++;
          break;
      }
    });

    return { ...option, count };
  });

  const handleFilterChange = (filterType: keyof ReaderFilters, values: string[]) => {
    onFiltersChange({
      ...activeFilters,
      [filterType]: values
    });
  };

  return (
    <div className="flex flex-wrap gap-3 mb-4 p-4 bg-gray-50 rounded-lg">
      <FilterDropdown
        title="Registration Date"
        options={dateOptions}
        selectedValues={activeFilters.registrationDate}
        onSelectionChange={(values) => handleFilterChange('registrationDate', values)}
        showCounts={true}
      />

      {locationOptions.length > 0 && (
        <FilterDropdown
          title="Location"
          options={locationOptions}
          selectedValues={activeFilters.location}
          onSelectionChange={(values) => handleFilterChange('location', values)}
          showCounts={true}
        />
      )}

      <FilterDropdown
        title="Activity Status"
        options={activityOptionsWithCount}
        selectedValues={activeFilters.activityStatus}
        onSelectionChange={(values) => handleFilterChange('activityStatus', values)}
        showCounts={true}
      />
    </div>
  );
}
