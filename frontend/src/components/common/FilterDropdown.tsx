import { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faFilter, faTimes } from '@fortawesome/free-solid-svg-icons';

interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

interface FilterDropdownProps {
  title: string;
  options: FilterOption[];
  selectedValues: string[];
  onSelectionChange: (values: string[]) => void;
  multiSelect?: boolean;
  showCounts?: boolean;
}

export default function FilterDropdown({
  title,
  options,
  selectedValues,
  onSelectionChange,
  multiSelect = true,
  showCounts = false
}: FilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleOptionClick = (value: string) => {
    if (multiSelect) {
      const newValues = selectedValues.includes(value)
        ? selectedValues.filter(v => v !== value)
        : [...selectedValues, value];
      onSelectionChange(newValues);
    } else {
      onSelectionChange(selectedValues.includes(value) ? [] : [value]);
      setIsOpen(false);
    }
  };

  const clearFilters = () => {
    onSelectionChange([]);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-2 border rounded-lg text-sm transition-colors ${
          selectedValues.length > 0
            ? 'bg-blue-50 border-blue-300 text-blue-700'
            : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
        }`}
      >
        <FontAwesomeIcon icon={faFilter} className="w-3 h-3" />
        <span>{title}</span>
        {selectedValues.length > 0 && (
          <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs">
            {selectedValues.length}
          </span>
        )}
        <FontAwesomeIcon
          icon={faChevronDown}
          className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-48 max-h-64 overflow-y-auto">
          {selectedValues.length > 0 && (
            <div className="p-2 border-b border-gray-100">
              <button
                onClick={clearFilters}
                className="flex items-center gap-2 text-sm text-red-600 hover:text-red-700"
              >
                <FontAwesomeIcon icon={faTimes} className="w-3 h-3" />
                Clear all
              </button>
            </div>
          )}

          <div className="py-1">
            {options.map((option) => (
              <label
                key={option.value}
                className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 cursor-pointer"
              >
                <input
                  type={multiSelect ? "checkbox" : "radio"}
                  name={multiSelect ? undefined : title}
                  checked={selectedValues.includes(option.value)}
                  onChange={() => handleOptionClick(option.value)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <span className="flex-1 text-sm text-gray-700">{option.label}</span>
                {showCounts && option.count !== undefined && (
                  <span className="text-xs text-gray-500">({option.count})</span>
                )}
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
