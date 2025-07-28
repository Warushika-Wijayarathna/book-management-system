import React, { useEffect, useState } from 'react';
import { Lending } from '../../types/Lending';
import { getLendingsByReader } from '../../services/lendingService';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHistory, faCalendarAlt, faBook, faCheckCircle, faExclamationTriangle, faClock, faBookOpen } from '@fortawesome/free-solid-svg-icons';

interface ReaderLendingHistoryProps {
  readerId: string;
}

interface PopulatedLending extends Omit<Lending, 'bookId'> {
  bookId: {
    _id: string;
    title: string;
    author: string;
    isbn: string;
    imageUrl?: string;
  };
}

const ReaderLendingHistory: React.FC<ReaderLendingHistoryProps> = ({ readerId }) => {
  const [lendings, setLendings] = useState<PopulatedLending[]>([]);
  const [loading, setLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const fetchLendingHistory = async () => {
    setLoading(true);
    try {
      const data = await getLendingsByReader(readerId);
      // Type assertion with proper type checking
      setLendings(data as unknown as PopulatedLending[]);
    } catch (error) {
      console.error('Error fetching reader lending history:', error);
      toast.error('Failed to fetch lending history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isExpanded) {
      fetchLendingHistory();
    }
  }, [isExpanded, readerId]);

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
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'returned':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'overdue':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'returnedLate':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
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
              No lending history found for this reader.
            </div>
          ) : (
            <div className="p-4 space-y-4">
              {/* Currently Borrowed Books */}
              {currentlyBorrowed.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <FontAwesomeIcon icon={faBookOpen} className="text-yellow-500" />
                    Currently Borrowed ({currentlyBorrowed.length})
                  </h4>
                  <div className="space-y-3">
                    {currentlyBorrowed.map((lending) => (
                      <div key={lending._id} className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          {/* Book Image */}
                          <div className="flex-shrink-0">
                            {lending.bookId?.imageUrl ? (
                              <img 
                                src={lending.bookId.imageUrl} 
                                alt={lending.bookId.title} 
                                className="w-16 h-20 object-cover rounded border"
                              />
                            ) : (
                              <div className="w-16 h-20 bg-gray-200 flex items-center justify-center rounded border text-gray-500 text-xs">
                                No Image
                              </div>
                            )}
                          </div>
                          
                          {/* Book Details */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h5 className="font-semibold text-gray-900 truncate">
                                  {lending.bookId?.title || 'Unknown Book'}
                                </h5>
                                <p className="text-sm text-gray-600">
                                  by {lending.bookId?.author || 'Unknown Author'}
                                </p>
                                <p className="text-xs text-gray-500">
                                  ISBN: {lending.bookId?.isbn || 'N/A'}
                                </p>
                              </div>
                              <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(lending.status)}`}>
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
                            
                            {/* Days calculation */}
                            {lending.status === 'overdue' && (
                              <div className="mt-2 text-sm text-red-600">
                                <FontAwesomeIcon icon={faExclamationTriangle} className="mr-1" />
                                Overdue by {Math.ceil((new Date().getTime() - new Date(lending.dueDate).getTime()) / (1000 * 60 * 60 * 24))} days
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Previous Lending History */}
              {previousHistory.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <FontAwesomeIcon icon={faHistory} className="text-gray-600" />
                    Previous History ({previousHistory.length})
                  </h4>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {previousHistory
                      .sort((a, b) => new Date(b.returnedDate || b.borrowedDate).getTime() - new Date(a.returnedDate || a.borrowedDate).getTime())
                      .map((lending) => (
                        <div key={lending._id} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                          <div className="flex items-start gap-3">
                            {/* Book Image */}
                            <div className="flex-shrink-0">
                              {lending.bookId?.imageUrl ? (
                                <img 
                                  src={lending.bookId.imageUrl} 
                                  alt={lending.bookId.title} 
                                  className="w-16 h-20 object-cover rounded border"
                                />
                              ) : (
                                <div className="w-16 h-20 bg-gray-200 flex items-center justify-center rounded border text-gray-500 text-xs">
                                  No Image
                                </div>
                              )}
                            </div>
                            
                            {/* Book Details */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <h5 className="font-semibold text-gray-900 truncate">
                                    {lending.bookId?.title || 'Unknown Book'}
                                  </h5>
                                  <p className="text-sm text-gray-600">
                                    by {lending.bookId?.author || 'Unknown Author'}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    ISBN: {lending.bookId?.isbn || 'N/A'}
                                  </p>
                                </div>
                                <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(lending.status)}`}>
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
                              
                              {/* Duration calculation */}
                              {lending.returnedDate && (
                                <div className="mt-2 text-sm text-gray-500">
                                  Duration: {Math.ceil((new Date(lending.returnedDate).getTime() - new Date(lending.borrowedDate).getTime()) / (1000 * 60 * 60 * 24))} days
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Summary Statistics */}
              {lendings.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h5 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                    <FontAwesomeIcon icon={faBook} className="text-blue-600" />
                    Reading Statistics
                  </h5>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="text-center">
                      <div className="font-semibold text-blue-900">{lendings.length}</div>
                      <div className="text-blue-700">Total Books</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-blue-900">{currentlyBorrowed.length}</div>
                      <div className="text-blue-700">Currently Borrowed</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-blue-900">{previousHistory.length}</div>
                      <div className="text-blue-700">Books Returned</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-blue-900">
                        {lendings.filter(l => l.status === 'overdue').length}
                      </div>
                      <div className="text-blue-700">Overdue</div>
                    </div>
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

export default ReaderLendingHistory;
