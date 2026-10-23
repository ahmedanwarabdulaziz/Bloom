'use client';

import { useState, useEffect } from 'react';
import {
    Typography, Box, Paper, CircularProgress, ToggleButton, ToggleButtonGroup,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
} from '@mui/material';
import { getLoyaltyStats, DailyStats } from './actions';

const RANGES = [
    { label: 'Today', days: 1 },
    { label: '7 days', days: 7 },
    { label: '30 days', days: 30 },
];

const pct = (part: number, whole: number) => (whole > 0 ? `${Math.round((part / whole) * 100)}%` : '–');

function StatCard({ label, value, sub }: { label: string; value: number | string; sub?: string }) {
    return (
        <Paper sx={{ p: 2.5, flex: '1 1 160px' }}>
            <Typography variant="body2" color="text.secondary">{label}</Typography>
            <Typography variant="h4" sx={{ fontWeight: 700, mt: 0.5 }}>{value}</Typography>
            {sub && <Typography variant="caption" color="text.secondary">{sub}</Typography>}
        </Paper>
    );
}

export default function AdminDashboard() {
    const [days, setDays] = useState(7);
    const [stats, setStats] = useState<DailyStats[] | null>(null);

    useEffect(() => {
        setStats(null);
        getLoyaltyStats(days).then(setStats);
    }, [days]);

    const total = (key: keyof Omit<DailyStats, 'date'>) =>
        (stats || []).reduce((sum, d) => sum + d[key], 0);

    const shown = total('popup_shown');
    const joined = total('popup_join');
    const skipped = total('popup_skip');

    return (
        <Box sx={{ maxWidth: 1100 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2, mb: 4 }}>
                <Typography variant="h4">Dashboard</Typography>
                <ToggleButtonGroup
                    size="small"
                    exclusive
                    value={days}
                    onChange={(_, v) => v && setDays(v)}
                >
                    {RANGES.map(r => <ToggleButton key={r.days} value={r.days}>{r.label}</ToggleButton>)}
                </ToggleButtonGroup>
            </Box>

            {!stats ? (
                <CircularProgress />
            ) : (
                <>
                    <Typography variant="h6" gutterBottom>Menu & Loyalty</Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 4 }}>
                        <StatCard label="Menu opens" value={total('menu_open')} sub={`${total('menu_open_unique')} unique phones (per day)`} />
                        <StatCard label="Popup shown" value={shown} />
                        <StatCard label="Tapped Join" value={joined} sub={`${pct(joined, shown)} of popups shown`} />
                        <StatCard label="Skipped" value={skipped} sub={`${pct(skipped, shown)} of popups shown`} />
                        <StatCard label="My Points taps" value={total('points_click')} />
                    </Box>

                    <Typography variant="body2" color="text.secondary" mb={2}>
                        &quot;Tapped Join&quot; counts customers who opened the Square sign-up page. Square does not tell us
                        whether they finished signing up. Popups that were closed by leaving the page count as neither joined nor skipped.
                    </Typography>

                    {days > 1 && (
                        <TableContainer component={Paper}>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Date</TableCell>
                                        <TableCell align="right">Menu opens</TableCell>
                                        <TableCell align="right">Unique</TableCell>
                                        <TableCell align="right">Popup shown</TableCell>
                                        <TableCell align="right">Joined</TableCell>
                                        <TableCell align="right">Skipped</TableCell>
                                        <TableCell align="right">Join rate</TableCell>
                                        <TableCell align="right">My Points</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {stats.map(d => (
                                        <TableRow key={d.date}>
                                            <TableCell>{d.date}</TableCell>
                                            <TableCell align="right">{d.menu_open}</TableCell>
                                            <TableCell align="right">{d.menu_open_unique}</TableCell>
                                            <TableCell align="right">{d.popup_shown}</TableCell>
                                            <TableCell align="right">{d.popup_join}</TableCell>
                                            <TableCell align="right">{d.popup_skip}</TableCell>
                                            <TableCell align="right">{pct(d.popup_join, d.popup_shown)}</TableCell>
                                            <TableCell align="right">{d.points_click}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </>
            )}
        </Box>
    );
}
