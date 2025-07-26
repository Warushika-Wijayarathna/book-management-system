import React from 'react';

interface LendingListProps {
  lendings: any[];
}

const LendingList: React.FC<LendingListProps> = ({ lendings }) => {
  return (
    <div style={{ display: 'flex', gap: 16, overflowX: 'auto' }}>
      {lendings.map((lending, idx) => (
        <div key={lending._id || idx} style={{ border: '1px solid #ccc', borderRadius: 8, padding: 16, minWidth: 220 }}>
          <div><strong>Reader:</strong> {lending.readerId?.name || lending.readerId || '-'}</div>
          <div><strong>Book:</strong> {lending.bookId?.title || lending.bookId || '-'}</div>
          <div><strong>Due Date:</strong> {lending.dueDate ? new Date(lending.dueDate).toLocaleDateString() : '-'}</div>
          <div><strong>Status:</strong> {lending.returned ? 'Returned' : 'Lent'}</div>
        </div>
      ))}
    </div>
  );
};

export default LendingList;

