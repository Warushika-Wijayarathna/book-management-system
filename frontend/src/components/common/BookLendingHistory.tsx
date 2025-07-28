import React, { useEffect, useState } from 'react';
import { Lending } from '../../types/Lending';
import { getLendingsByBook } from '../../services/lendingService';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHistory, faCalendarAlt, faUser, faCheckCircle, faExclamationTriangle, faClock } from '@fortawesome/free-solid-svg-icons';

interface BookLendingHistoryProps {
  bookId: string;
}

interface PopulatedLending extends Omit<Lending, 'readerId'> {
  readerId: {
    _id: string;
    name: string;
    email: string;
  };
}

const BookLendingHistory: React.FC<BookLendingHistoryProps> = ({ bookId }) => {
  const [lendings, setLendings] = useState<PopulatedLending[]>([]);
  const [loading, setLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const fetchLendingHistory = async () => {
    setLoading(true);
    try {
      const data = await getLendingsByBook(bookId);
      // Type assertion with proper type checking
      setLendings(data as unknown as PopulatedLending[]);
    } catch (error) {
      console.error('Error fetching lending history:', error);
      toast.error('Failed to fetch lending history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isExpanded) {
      fetchLendingHistory();
    }
  }, [isExpanded, bookId]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'borrowed':
        return <FontAwesomeIcon icon={faClock} className="text-yellow-500" />;
      case 'returned':
        return <FontAwesomeIcon icon={faCheckCircle} className="text-green-500" />;
      case 'overdue':
        return <FontAwesomeIcon icon={faExclamationTriangle} className="text-red-500" />;
      case 'returnedLate':
        return <FontAwesomeIcon icon={faExclamationTriangle} className="text-orange-500" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'borrowed':
        return 'Currently Borrowed';
      case 'returned':
        return 'Returned';
      case 'overdue':
        return 'Overdue';
      case 'returnedLate':
        return 'Returned Late';
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'borrowed':
        return 'bg-yellow-100 text-yellow-800';
      case 'returned':
        return 'bg-green-100 text-green-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      case 'returnedLate':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const currentlyBorrowed = lendings.filter(l => l.status === 'borrowed' || l.status === 'overdue');
  const previousHistory = lendings.filter(l => l.status === 'returned' || (l.status as string) === 'returnedLate');

  return (
    <div className="border rounded-lg bg-white shadow-sm">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <FontAwesomeIcon icon={faHistory} className="text-gray-600" />
          <span className="font-medium text-gray-900">Lending History</span>
          <span className="text-sm text-gray-500">({lendings.length} records)</span>
        </div>
        <FontAwesomeIcon
          icon={faCalendarAlt}
          className={`text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
        />
      </button>

      {isExpanded && (
        <div className="border-t">
          {loading ? (
            <div className="p-4 text-center text-gray-500">
              Loading lending history...
            </div>
          ) : lendings.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              No lending history found for this book.
            </div>
          ) : (
            <div className="p-4 space-y-4">
              {/* Currently Borrowed */}
              {currentlyBorrowed.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <FontAwesomeIcon icon={faClock} className="text-yellow-500" />
                    Currently Borrowed ({currentlyBorrowed.length})
                  </h4>
                  <div className="space-y-2">
                    {currentlyBorrowed.map((lending) => (
                      <div key={lending._id} className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <FontAwesomeIcon icon={faUser} className="text-gray-600" />
                            <span className="font-medium text-gray-900">
                              {lending.readerId?.name || 'Unknown Reader'}
                            </span>
                            <span className="text-sm text-gray-500">
                              ({lending.readerId?.email || 'No email'})
                            </span>
                          </div>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(lending.status)}`}>
                            {getStatusIcon(lending.status)}
                            <span className="ml-1">{getStatusText(lending.status)}</span>
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                          <div>
                            <span className="font-medium">Borrowed:</span> {formatDate(lending.borrowedDate)}
                          </div>
                          <div>
                            <span className="font-medium">Due:</span> {formatDate(lending.dueDate)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Previous History */}
              {previousHistory.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <FontAwesomeIcon icon={faHistory} className="text-gray-600" />
                    Previous History ({previousHistory.length})
                  </h4>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {previousHistory
                      .sort((a, b) => new Date(b.returnedDate || b.borrowedDate).getTime() - new Date(a.returnedDate || a.borrowedDate).getTime())
                      .map((lending) => (
                        <div key={lending._id} className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <FontAwesomeIcon icon={faUser} className="text-gray-600" />
                              <span className="font-medium text-gray-900">
                                {lending.readerId?.name || 'Unknown Reader'}
                              </span>
                              <span className="text-sm text-gray-500">
                                ({lending.readerId?.email || 'No email'})
                              </span>
                            </div>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(lending.status)}`}>
                              {getStatusIcon(lending.status)}
                              <span className="ml-1">{getStatusText(lending.status)}</span>
                            </span>
                          </div>
                          <div className="grid grid-cols-3 gap-4 text-sm text-gray-600">
                            <div>
                              <span className="font-medium">Borrowed:</span> {formatDate(lending.borrowedDate)}
                            </div>
                            <div>
                              <span className="font-medium">Due:</span> {formatDate(lending.dueDate)}
                            </div>
                            <div>
                              <span className="font-medium">Returned:</span> {lending.returnedDate ? formatDate(lending.returnedDate) : 'N/A'}
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BookLendingHistory;
