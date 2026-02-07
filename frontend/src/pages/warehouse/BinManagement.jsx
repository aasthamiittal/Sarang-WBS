import React, { useState, useEffect } from 'react';
import { Grid, MenuItem, TextField, IconButton, Alert } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import api from '../../api/axios';
import DataTable from '../../components/common/DataTable';
import PageHeader from '../../components/common/PageHeader';
import FormModal from '../../components/common/FormModal';
import ConfirmDialog from '../../components/common/ConfirmDialog';

export default function BinManagement() {
  const [data, setData] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [warehouseFilter, setWarehouseFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [formData, setFormData] = useState({ code: '', warehouse: '', zone: '', aisle: '', rack: '', level: '' });

  const fetch = async () => {
    setLoading(true);
    try {
      const params = warehouseFilter ? { warehouse: warehouseFilter } : {};
      const { data: res } = await api.get('/warehouses/get-bins', { params });
      if (res.success) setData(res.data.map((r) => ({ ...r, id: r._id })));
    } catch (e) {
      setError(e.response?.data?.message || 'Failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, [warehouseFilter]);
  useEffect(() => { api.get('/warehouses/get-warehouses').then((r) => r.data.success && setWarehouses(r.data.data)); }, []);

  const handleAdd = () => {
    setSelected(null);
    setFormData({ code: '', warehouse: '', zone: '', aisle: '', rack: '', level: '' });
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    try {
      await api.post('/warehouses/add-bin', formData);
      setModalOpen(false);
      fetch();
    } catch (e) {
      throw e;
    }
  };

  const handleDelete = (row) => {
    setSelected(row);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selected) return;
    try {
      await api.delete(`/warehouses/delete-bin/${selected._id}`);
      fetch();
    } catch (e) {
      setError(e.response?.data?.message || 'Delete failed');
    }
  };

  const columns = [
    { id: 'code', label: 'Code' },
    { id: 'warehouse', label: 'Warehouse', render: (_, r) => r.warehouse?.name || '-' },
    { id: 'zone', label: 'Zone' },
    { id: 'aisle', label: 'Aisle' },
    { id: 'rack', label: 'Rack' },
    { id: 'level', label: 'Level' },
    { id: 'actions', label: 'Actions', render: (_, row) => <IconButton size="small" color="error" onClick={() => handleDelete(row)}><DeleteIcon /></IconButton> },
  ];

  return (
    <>
      <PageHeader title="Bin / Location Management" actionLabel="Add Bin" onAction={handleAdd} />
      {error && <Alert severity="error" onClose={() => setError('')} sx={{ mb: 2 }}>{error}</Alert>}
      <TextField select size="small" label="Warehouse" value={warehouseFilter} onChange={(e) => setWarehouseFilter(e.target.value)} sx={{ minWidth: 200, mb: 2 }}>
        <MenuItem value="">All</MenuItem>
        {warehouses.map((w) => <MenuItem key={w._id} value={w._id}>{w.name}</MenuItem>)}
      </TextField>
      <DataTable columns={columns} rows={data} loading={loading} emptyMessage="No bins" />
      <FormModal open={modalOpen} onClose={() => setModalOpen(false)} title="Add Bin" onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}><TextField fullWidth label="Code" value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value })} required /></Grid>
          <Grid item xs={12} sm={6}>
            <TextField select fullWidth label="Warehouse" value={formData.warehouse} onChange={(e) => setFormData({ ...formData, warehouse: e.target.value })} required>
              <MenuItem value="">Select</MenuItem>
              {warehouses.map((w) => <MenuItem key={w._id} value={w._id}>{w.name}</MenuItem>)}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={4}><TextField fullWidth label="Zone" value={formData.zone} onChange={(e) => setFormData({ ...formData, zone: e.target.value })} /></Grid>
          <Grid item xs={12} sm={4}><TextField fullWidth label="Aisle" value={formData.aisle} onChange={(e) => setFormData({ ...formData, aisle: e.target.value })} /></Grid>
          <Grid item xs={12} sm={4}><TextField fullWidth label="Rack" value={formData.rack} onChange={(e) => setFormData({ ...formData, rack: e.target.value })} /></Grid>
          <Grid item xs={12}><TextField fullWidth label="Level" value={formData.level} onChange={(e) => setFormData({ ...formData, level: e.target.value })} /></Grid>
        </Grid>
      </FormModal>
      <ConfirmDialog open={confirmOpen} onClose={() => setConfirmOpen(false)} title="Delete Bin" message="Delete this bin?" onConfirm={handleConfirmDelete} confirmLabel="Delete" danger />
    </>
  );
}
