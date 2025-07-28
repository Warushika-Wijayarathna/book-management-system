import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBook,
  faUsers,
  faHandHolding,
  faExchangeAlt
} from "@fortawesome/free-solid-svg-icons";
import { dashboardService, LibraryMetrics as LibraryMetricsType } from "../../services/dashboardService";

export default function LibraryMetrics() {
  const [metrics, setMetrics] = useState<LibraryMetricsType>({
    totalBooks: 0,
    totalReaders: 0,
    activeBorrowings: 0,
    totalBorrowings: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const data = await dashboardService.getLibraryMetrics();
        setMetrics(data);
      } catch (error) {
        console.error('Error fetching library metrics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-2xl border p-5 bg-white animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-2xl border p-5 bg-white hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100">
              <FontAwesomeIcon icon={faBook} className="text-blue-600 text-xl" />
            </div>
            <h4 className="ml-3 text-lg font-semibold text-gray-700">Total Books</h4>
          </div>
          <p className="mt-3 text-3xl font-bold text-blue-600">{metrics.totalBooks.toLocaleString()}</p>
          <p className="text-sm text-gray-500 mt-1">Books in collection</p>
        </div>

        <div className="rounded-2xl border p-5 bg-white hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100">
              <FontAwesomeIcon icon={faUsers} className="text-green-600 text-xl" />
            </div>
            <h4 className="ml-3 text-lg font-semibold text-gray-700">Total Readers</h4>
          </div>
          <p className="mt-3 text-3xl font-bold text-green-600">{metrics.totalReaders.toLocaleString()}</p>
          <p className="text-sm text-gray-500 mt-1">Registered members</p>
        </div>

        <div className="rounded-2xl border p-5 bg-white hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-orange-100">
              <FontAwesomeIcon icon={faHandHolding} className="text-orange-600 text-xl" />
            </div>
            <h4 className="ml-3 text-lg font-semibold text-gray-700">Active Borrowings</h4>
          </div>
          <p className="mt-3 text-3xl font-bold text-orange-600">{metrics.activeBorrowings.toLocaleString()}</p>
          <p className="text-sm text-gray-500 mt-1">Currently borrowed</p>
        </div>

        <div className="rounded-2xl border p-5 bg-white hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100">
              <FontAwesomeIcon icon={faExchangeAlt} className="text-purple-600 text-xl" />
            </div>
            <h4 className="ml-3 text-lg font-semibold text-gray-700">Total Borrowings</h4>
          </div>
          <p className="mt-3 text-3xl font-bold text-purple-600">{metrics.totalBorrowings.toLocaleString()}</p>
          <p className="text-sm text-gray-500 mt-1">All time transactions</p>
        </div>
      </div>
  );
}
