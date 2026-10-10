import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllSlots } from '../api/slotApi';
import { RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

function SlotCard({ slot, onClick }) {
  const statusClass = slot.status.toLowerCase();
  const canBook = slot.status === 'AVAILABLE';

  return (
    <div
      id={`slot-card-${slot.id}`}
      className={`slot-card ${statusClass}`}
      onClick={() => canBook && onClick(slot)}
      title={!canBook ? `${slot.status}` : `Book slot ${slot.slotNumber}`}
    >
      <div className="slot-number">{slot.slotNumber}</div>
      <div className="slot-floor">Floor {slot.floor ?? 1}</div>
      <span className={`badge badge-${statusClass}`}>
        {slot.status === 'AVAILABLE' ? '✓ ' : slot.status === 'OCCUPIED' ? '✗ ' : '⏸ '}
        {slot.status}
      </span>
      {slot.vehicleNumber && (
        <div className="slot-vehicle">🚗 {slot.vehicleNumber}</div>
      )}
    </div>
  );
}

export default function SlotMapPage() {
  const [slots,   setSlots]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter,  setFilter]  = useState('ALL');
  const navigate = useNavigate();

  const fetchSlots = async () => {
    setLoading(true);
    try {
      const data = await getAllSlots();
      setSlots(data);
    } catch {
      toast.error('Failed to load slots');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSlots(); }, []);

  const filtered = filter === 'ALL' ? slots : slots.filter(s => s.status === filter);
  const counts = {
    AVAILABLE: slots.filter(s => s.status === 'AVAILABLE').length,
    OCCUPIED:  slots.filter(s => s.status === 'OCCUPIED').length,
    RESERVED:  slots.filter(s => s.status === 'RESERVED').length,
  };

  const handleSelectSlot = (slot) => {
    navigate('/book', { state: { slot } });
    toast.success(`Slot ${slot.slotNumber} selected. Complete your booking!`);
  };

  return (
    <div className="page-wrapper">
      <div className="page-content">
        <div className="section-header">
          <div>
            <h1 className="section-title">Parking Slot Map</h1>
            <p className="section-subtitle">Click on a green slot to book it</p>
          </div>
          <button id="refresh-slots-btn" className="btn btn-ghost" onClick={fetchSlots} disabled={loading}>
            <RefreshCw size={16} className={loading ? 'pulse' : ''} />
            Refresh
          </button>
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 28 }}>
          {['ALL', 'AVAILABLE', 'OCCUPIED', 'RESERVED'].map(f => (
            <button
              key={f}
              id={`filter-${f.toLowerCase()}-btn`}
              className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setFilter(f)}
            >
              {f === 'ALL' ? `All (${slots.length})` :
               f === 'AVAILABLE' ? `🟢 Available (${counts.AVAILABLE})` :
               f === 'OCCUPIED'  ? `🔴 Occupied (${counts.OCCUPIED})` :
                                   `🟡 Reserved (${counts.RESERVED})`}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="loading-center"><div className="spinner" /></div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🅿️</div>
            <div className="empty-state-title">No slots found</div>
            <div className="empty-state-desc">No slots match the current filter</div>
          </div>
        ) : (
          <div className="grid-auto">
            {filtered.map(slot => (
              <SlotCard key={slot.id} slot={slot} onClick={handleSelectSlot} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
