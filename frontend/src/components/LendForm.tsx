import React, { useState } from 'react';

interface LendFormProps {
  onLend: () => void;
}

const LendForm: React.FC<LendFormProps> = ({ onLend }) => {
  const [open, setOpen] = useState(false);
  const [readerId, setReaderId] = useState('');
  const [bookId, setBookId] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/lendings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ readerId, bookId, dueDate }),
      });
      if (!res.ok) throw new Error('Failed to lend');
      setReaderId('');
      setBookId('');
      setDueDate('');
      onLend();
      setOpen(false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={() => setOpen(o => !o)} style={{ marginBottom: 8 }}>
        {open ? 'Hide Lend Form' : 'Show Lend Form'}
      </button>
      {open && (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <input
            placeholder="Reader ID"
            value={readerId}
            onChange={e => setReaderId(e.target.value)}
            required
          />
          <input
            placeholder="Book ID"
            value={bookId}
            onChange={e => setBookId(e.target.value)}
            required
          />
          <input
            type="date"
            value={dueDate}
            onChange={e => setDueDate(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>{loading ? 'Lending...' : 'Lend Book'}</button>
          {error && <div style={{ color: 'red' }}>{error}</div>}
        </form>
      )}
    </div>
  );
};

export default LendForm;

