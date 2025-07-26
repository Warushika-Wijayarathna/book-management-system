import React, { useEffect, useState } from 'react';
import LendForm from './LendForm';
import LendingList from './LendingList';

const LendPage: React.FC = () => {
  const [lendings, setLendings] = useState([]);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    fetch('/api/lendings')
      .then(res => res.json())
      .then(data => setLendings(data));
  }, [refresh]);

  return (
    <div style={{ display: 'flex', gap: '2rem' }}>
      <div style={{ minWidth: 300 }}>
        <LendForm onLend={() => setRefresh(r => !r)} />
      </div>
      <div style={{ flex: 1 }}>
        <LendingList lendings={lendings} />
      </div>
    </div>
  );
};

export default LendPage;

