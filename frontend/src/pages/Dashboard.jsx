import React, { useState, useEffect } from 'react';
import { Grid, Card, CardContent, Typography, Box, Alert, CircularProgress } from '@mui/material';
import Inventory2 from '@mui/icons-material/Inventory2';
import ShoppingCart from '@mui/icons-material/ShoppingCart';
import Warning from '@mui/icons-material/Warning';
import Category from '@mui/icons-material/Category';
import api from '../api/axios';
import PageHeader from '../components/common/PageHeader';

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [snapshot, setSnapshot] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetch = async () => {
      try {
        const [s, snap, a] = await Promise.all([
          api.get('/dashboard/get-daily-summary'),
          api.get('/dashboard/get-stock-snapshot'),
          api.get('/dashboard/get-alerts'),
        ]);
        if (s.data.success) setSummary(s.data.data);
        if (snap.data.success) setSnapshot(snap.data.data);
        if (a.data.success) setAlerts(a.data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={400}>
        <CircularProgress />
      </Box>
    );
  }

  const cards = [
    { title: 'Orders Today', value: summary?.ordersToday ?? 0, icon: <ShoppingCart />, color: '#6BAED6' },
    { title: 'Pending Orders', value: summary?.ordersPending ?? 0, icon: <ShoppingCart />, color: '#6BAED6' },
    { title: 'Low Stock SKUs', value: summary?.lowStockCount ?? 0, icon: <Warning />, color: '#e74c3c' },
    { title: 'Total Products', value: summary?.totalProducts ?? 0, icon: <Category />, color: '#6BAED6' },
  ];

  return (
    <>
      <PageHeader title="Dashboard" />
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <Grid container spacing={3}>
        {cards.map((c) => (
          <Grid item xs={12} sm={6} md={3} key={c.title}>
            <Card sx={{ bgcolor: 'background.paper' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography color="text.secondary">{c.title}</Typography>
                  <Box sx={{ color: c.color }}>{c.icon}</Box>
                </Box>
                <Typography variant="h4" sx={{ mt: 1 }}>
                  {c.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Grid container spacing={3} sx={{ mt: 1 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Current Stock
              </Typography>
              {snapshot.length === 0 ? (
                <Typography color="text.secondary">No warehouse data</Typography>
              ) : (
                <Box component="ul" sx={{ m: 0, pl: 2 }}>
                  {snapshot.map((s, i) => (
                    <li key={i}>
                      {s.warehouse?.name || 'Warehouse'}: {s.totalQty} units, {s.skuCount} SKUs
                    </li>
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Low Stock Alerts
              </Typography>
              {alerts.length === 0 ? (
                <Typography color="text.secondary">No low stock alerts</Typography>
              ) : (
                <Box component="ul" sx={{ m: 0, pl: 2 }}>
                  {alerts.slice(0, 5).map((a, i) => (
                    <li key={i}>
                      {a.product?.sku} - {a.product?.name} (Qty: {a.quantity}, Reorder: {a.product?.reorderLevel ?? 0})
                    </li>
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  );
}
