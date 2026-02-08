import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  Button,
  Alert,
  CircularProgress,
} from '@mui/material';
import api from '../../api/axios';
import PageHeader from '../../components/common/PageHeader';
import { MODULES } from '../../config/permissions';

const REPORT_MODULES = ['inventory_report', 'stock_report', 'order_report', 'returns_report'];
const VIEW_ONLY_MODULES = ['dashboard'];
const READ_ONLY_MODULES = ['activity_logs'];

export default function RolePermissions() {
  const [roles, setRoles] = useState([]);
  const [selectedRoleId, setSelectedRoleId] = useState('');
  const [permissions, setPermissions] = useState({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchRoles = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/roles/get-roles');
      if (data.success) {
        setRoles(data.data);
        if (data.data.length && !selectedRoleId) setSelectedRoleId(data.data[0]._id);
      }
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to load roles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  useEffect(() => {
    if (!selectedRoleId) return;
    const role = roles.find((r) => r._id === selectedRoleId);
    if (role?.permissions && typeof role.permissions === 'object' && !Array.isArray(role.permissions)) {
      setPermissions(JSON.parse(JSON.stringify(role.permissions)));
    } else {
      const defaultPerms = {};
      Object.keys(MODULES).forEach((mod) => {
        defaultPerms[mod] = {};
        MODULES[mod].actions.forEach((action) => {
          defaultPerms[mod][action] = action === 'view' || action === 'read';
        });
      });
      setPermissions(defaultPerms);
    }
  }, [selectedRoleId, roles]);

  const handlePermissionChange = (module, action, value) => {
    setPermissions((prev) => ({
      ...prev,
      [module]: {
        ...(prev[module] || {}),
        [action]: value,
      },
    }));
  };

  const handleSave = async () => {
    if (!selectedRoleId) return;
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      await api.put('/roles/update-role-permissions', { roleId: selectedRoleId, permissions });
      setSuccess('Permissions saved.');
      fetchRoles();
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  if (loading && roles.length === 0) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <PageHeader title="Role Permission Matrix" />
      {error && <Alert severity="error" onClose={() => setError('')} sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" onClose={() => setSuccess('')} sx={{ mb: 2 }}>{success}</Alert>}
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
        <FormControl size="small" sx={{ minWidth: 220 }}>
          <InputLabel>Role</InputLabel>
          <Select
            value={selectedRoleId}
            label="Role"
            onChange={(e) => setSelectedRoleId(e.target.value)}
          >
            {roles.map((r) => (
              <MenuItem key={r._id} value={r._id}>{r.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button variant="contained" onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : 'Save Permissions'}
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: 'primary.main' }}>
              <TableCell sx={{ color: 'primary.contrastText', fontWeight: 600 }}>Feature</TableCell>
              <TableCell align="center" sx={{ color: 'primary.contrastText', fontWeight: 600 }}>View Only</TableCell>
              <TableCell align="center" sx={{ color: 'primary.contrastText', fontWeight: 600 }}>View & Download</TableCell>
              <TableCell align="center" sx={{ color: 'primary.contrastText', fontWeight: 600 }}>Read Only</TableCell>
              <TableCell align="center" sx={{ color: 'primary.contrastText', fontWeight: 600 }}>Read & Write</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.entries(MODULES).map(([moduleKey, config]) => {
              const isReport = REPORT_MODULES.includes(moduleKey) || VIEW_ONLY_MODULES.includes(moduleKey);
              const isViewDownload = REPORT_MODULES.includes(moduleKey);
              const isReadWrite = config.actions.includes('read') && config.actions.includes('write');
              const isReadOnly = READ_ONLY_MODULES.includes(moduleKey);
              const actions = config.actions;
              const perms = permissions[moduleKey] || {};
              return (
                <TableRow key={moduleKey} hover>
                  <TableCell>{config.label}</TableCell>
                  {isReport ? (
                    <>
                      <TableCell align="center">
                        {actions.includes('view') && (
                          <Checkbox
                            checked={!!perms.view && !perms.download}
                            onChange={(e) => {
                              handlePermissionChange(moduleKey, 'view', true);
                              if (isViewDownload) handlePermissionChange(moduleKey, 'download', false);
                            }}
                          />
                        )}
                      </TableCell>
                      <TableCell align="center">
                        {isViewDownload && (
                          <Checkbox
                            checked={!!perms.view && !!perms.download}
                            onChange={(e) => {
                              const v = e.target.checked;
                              handlePermissionChange(moduleKey, 'view', v);
                              handlePermissionChange(moduleKey, 'download', v);
                            }}
                          />
                        )}
                      </TableCell>
                      <TableCell align="center">
                        {actions.includes('read') && (
                          <Checkbox
                            checked={!!perms.read && !perms.write}
                            disabled={isReadOnly}
                            onChange={(e) => {
                              handlePermissionChange(moduleKey, 'read', true);
                              if (!isReadOnly) handlePermissionChange(moduleKey, 'write', false);
                            }}
                          />
                        )}
                      </TableCell>
                      <TableCell align="center">
                        {isReadWrite && (
                          <Checkbox
                            checked={!!perms.read && !!perms.write}
                            onChange={(e) => {
                              const v = e.target.checked;
                              handlePermissionChange(moduleKey, 'read', v);
                              handlePermissionChange(moduleKey, 'write', v);
                            }}
                          />
                        )}
                      </TableCell>
                    </>
                  ) : (
                    <>
                      <TableCell align="center">—</TableCell>
                      <TableCell align="center">—</TableCell>
                      <TableCell align="center">
                        {actions.includes('read') && (
                          <Checkbox
                            checked={!!perms.read && !perms.write}
                            disabled={isReadOnly}
                            onChange={(e) => {
                              handlePermissionChange(moduleKey, 'read', true);
                              if (!isReadOnly) handlePermissionChange(moduleKey, 'write', false);
                            }}
                          />
                        )}
                      </TableCell>
                      <TableCell align="center">
                        {isReadWrite && (
                          <Checkbox
                            checked={!!perms.read && !!perms.write}
                            onChange={(e) => {
                              const v = e.target.checked;
                              handlePermissionChange(moduleKey, 'read', v);
                              handlePermissionChange(moduleKey, 'write', v);
                            }}
                          />
                        )}
                      </TableCell>
                    </>
                  )}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
