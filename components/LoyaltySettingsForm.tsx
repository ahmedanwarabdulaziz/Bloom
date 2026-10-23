'use client';

import { useState } from 'react';
import { Typography, Box, Button, Paper, Divider, TextField, Switch, FormControlLabel, Alert } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import FileUpload from './FileUpload';
import { getLoyaltySettings, saveLoyaltySettings, LoyaltySettings } from '../app/admin/settings/actions';

export default function LoyaltySettingsForm({ initial }: { initial: LoyaltySettings }) {
    const [settings, setSettings] = useState<LoyaltySettings>(initial);
    const [popupEnabled, setPopupEnabled] = useState(initial.popupEnabled);
    const [pointsButtonEnabled, setPointsButtonEnabled] = useState(initial.pointsButtonEnabled);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setSaved(false);
        const formData = new FormData(e.target as HTMLFormElement);
        formData.set('popupEnabled', String(popupEnabled));
        formData.set('pointsButtonEnabled', String(pointsButtonEnabled));
        formData.append('existingLoyaltyImage', settings.image || '');

        await saveLoyaltySettings(formData);

        setSettings(await getLoyaltySettings());
        setSaving(false);
        setSaved(true);
    };

    return (
        <Paper sx={{ p: 4, mt: 4 }}>
            <form onSubmit={handleSubmit}>
                <Typography variant="h6" gutterBottom>Square Loyalty</Typography>
                <Typography color="text.secondary" variant="body2" mb={3}>
                    Show a sign-up popup when customers open the menu, and a button to check their points.
                    The popup shows at most once per day per phone, and never again after the customer taps Join.
                </Typography>

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 3 }}>
                    <FormControlLabel
                        control={<Switch checked={popupEnabled} onChange={(e) => setPopupEnabled(e.target.checked)} />}
                        label="Show sign-up popup on menu"
                    />
                    <FormControlLabel
                        control={<Switch checked={pointsButtonEnabled} onChange={(e) => setPointsButtonEnabled(e.target.checked)} />}
                        label='Show "My Points" button on menu'
                    />
                </Box>

                <Divider sx={{ mb: 3 }} />

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                    <Box sx={{ flex: '1 1 300px' }}>
                        <FileUpload
                            label="Popup Image (optional)"
                            name="loyaltyImageFile"
                            currentImage={settings.image}
                            isUploading={saving}
                        />
                    </Box>
                    <Box sx={{ flex: '2 1 300px', display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField fullWidth label="Square Loyalty Link" name="squareLink" defaultValue={settings.squareLink} />
                        <TextField fullWidth label="Popup Title" name="title" defaultValue={settings.title} />
                        <TextField fullWidth multiline rows={3} label="Popup Description / Offer" name="description" defaultValue={settings.description} />
                        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                            <TextField sx={{ flex: '1 1 150px' }} label="Join Button Text" name="joinButtonText" defaultValue={settings.joinButtonText} />
                            <TextField sx={{ flex: '1 1 150px' }} label="Skip Button Text" name="skipButtonText" defaultValue={settings.skipButtonText} />
                            <TextField sx={{ flex: '1 1 150px' }} label="Points Button Text" name="pointsButtonText" defaultValue={settings.pointsButtonText} />
                        </Box>
                    </Box>
                </Box>

                <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 2 }}>
                    {saved && <Alert severity="success" sx={{ py: 0 }}>Saved</Alert>}
                    <Button type="submit" variant="contained" size="large" startIcon={<SaveIcon />} disabled={saving}>
                        {saving ? 'Saving...' : 'Save Loyalty Settings'}
                    </Button>
                </Box>
            </form>
        </Paper>
    );
}
