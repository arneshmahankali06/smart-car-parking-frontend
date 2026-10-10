import { useEffect, useState } from 'react';
import { getAllSlots, createSlot, updateSlotStatus, deleteSlot } from '../api/slotApi';
import { Plus, Trash2, Edit3, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminSlotsPage() {
  const [slots,   setSlots]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [form,    setForm]    = useState({ slotNumber: '', floor: 1 });
  const [adding,  setAdding]  = useState(false);
  const [showForm, setShowForm] = useState(false);

  const load = () => {
    setLoading(true);
    getAllSlots().then(setSlots).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    setAdding(true);
    try {
      await createSlot({ slotNumber: form.slotNumber.toUpperCase(), floor: Number(form.floor) });
      toast.success(`Slot ${form.slotNumber.toUpperCase()} added!`);
      setForm({ slotNumber: '', floor: 1 });
      setShowForm(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add slot');
    } finally {
      setAdding(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await updateSlotStatus(id, status);
      toast.success('Status updated');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    }
  };

  const handleDelete = async (id, slotNumber) => {
    if (!window.confirm(`Delete slot ${slotNumber}?`)) return;
    try {
      await deleteSlot(id);
      toast.success(`Slot ${slotNumber} deleted`);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <div className="page-wrapper">
      <div className="page-content">
        <div className="section-header">
          <div>
            <h1 className="section-title">Manage Parking Slots</h1>
            <p className="section-subtitle">{slots.length} total slots configured</p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button id="admin-refresh-slots-btn" className="btn btn-ghost" onClick={load}>
              <RefreshCw size={16} />
            </button>
            <button id="add-slot-btn" className="btn btn-primary" onClick={() => setShowForm(v => !v)}>
              <Plus size={16} />
              Add Slot
            </button>
          </div>
        </div>

        {/* Add Slot Form */}
        {showForm && (
          <div className="card" style={{ marginBottom: 28, padding: 28 }}>
            <h3 style={{ fontWeight: 700, marginBottom: 20 }}>Add New Slot</h3>
            <form onSubmit={handleAdd} style={{ display: 'flex', gap: 16, alignItems: 'flex-end', flexWrap: 'wrap' }}>
              <div className="form-group" style={{ flex: '1 1 180px' }}>
                <label className="form-label">Slot Number</label>
                <input
                  id="new-slot-number"
                  type="text"
                  className="form-input"
                  placeholder="e.g. A101"
                  value={form.slotNumber}
                  onChange={e => setForm({ ...form, slotNumber: e.target.value })}
                  required
                  style={{ textTransform: 'uppercase' }}
                />
              </div>
              <div className="form-group" style={{ flex: '0 0 120px' }}>
                <label className="form-label">Floor</label>
                <input
                  id="new-slot-floor"
                  type="number"
                  className="form-input"
                  min={1} max={10}
                  value={form.floor}
                  onChange={e => setForm({ ...form, floor: e.target.value })}
                  required
                />
              </div>
              <button
                id="submit-add-slot-btn"
                type="submit"
                className="btn btn-primary"
                disabled={adding}
                style={{ marginBottom: 0 }}
              >
                {adding ? 'Adding…' : 'Add Slot'}
              </button>
              <button type="button" className="btn btn-ghost" onClick={() => setShowForm(false)}>
                Cancel
              </button>
            </form>
          </div>
        )}

        {/* Slots Grid */}
        {loading ? (
          <div className="loading-center"><div className="spinner" /></div>
        ) : (
          <div className="grid-auto">
            {slots.map(slot => (
              <div key={slot.id} className={`slot-card ${slot.status.toLowerCase()}`} style={{ cursor: 'default' }}>
                <div className="slot-number">{slot.slotNumber}</div>
                <div className="slot-floor">Floor {slot.floor ?? 1}</div>
                <span className={`badge badge-${slot.status.toLowerCase()}`} style={{ marginBottom: 12 }}>
                  {slot.status}
                </span>
                {slot.vehicleNumber && (
                  <div className="slot-vehicle">🚗 {slot.vehicleNumber}</div>
                )}

                {/* Status Change */}
                <select
                  id={`status-select-${slot.id}`}
                  className="form-input"
                  value={slot.status}
                  onChange={e => handleStatusChange(slot.id, e.target.value)}
                  style={{ marginTop: 12, fontSize: '0.78rem', padding: '6px 10px' }}
                >
                  <option value="AVAILABLE">AVAILABLE</option>
                  <option value="OCCUPIED">OCCUPIED</option>
                  <option value="RESERVED">RESERVED</option>
                </select>

                <button
                  id={`delete-slot-${slot.id}`}
                  className="btn btn-danger btn-sm"
                  style={{ width: '100%', marginTop: 8 }}
                  onClick={() => handleDelete(slot.id, slot.slotNumber)}
                >
                  <Trash2 size={13} />
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
