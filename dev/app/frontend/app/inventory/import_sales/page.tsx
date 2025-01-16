'use client';

import { useState } from 'react';
import axios from '../../../plugin/axios';
import {
    Alert,
    AlertColor,
    Box,
    Button,
    Snackbar,
    Typography,
} from '@mui/material';
import { MuiFileInput } from 'mui-file-input';

export default function Page() {
    const [open, setOpen] = useState(false);
    const [severity, setSeverity] = useState<AlertColor>('success');
    const [message, setMessage] = useState('');
    const result = (severity: AlertColor, message: string) => {
        setOpen(true);
        setSeverity(severity);
        setMessage(message);
    };

    const [fileSync, setFileSync] = useState()
    const onChangeFileSync = (newFile: any) => {
        setFileSync(newFile)
    }

    const doAddSync = ((e: any) => {
        if (!fileSync) {
            result('error', 'ファイルを選択してください')
            return
        }
        const params = {
            file: fileSync
        }
        axios.post(`/api/inventory/sync`, params, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
            .then(function (response) {
                console.log(response)
                result('success', '同期ファイルが登録されました')
            })
            .catch(function (error) {
                console.log(error)
                result('error', '同期ファイルの登録に失敗しました')
            })
    })
    const handleClose = (event: any, reason: any) => {
        setOpen(false);
    };

    return (
        <Box>
            <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
                <Alert severity={severity}>{message}</Alert>
            </Snackbar>
            <Typography variant='h5'>売上一括登録</Typography>
            <Box m={2}>
                <Typography variant="subtitle1">同期でファイル取込</Typography>
                <MuiFileInput value={fileSync} onChange={onChangeFileSync} />
                <Button variant="contained" onClick={doAddSync}>登録</Button>
            </Box>
        </Box>
    )
}