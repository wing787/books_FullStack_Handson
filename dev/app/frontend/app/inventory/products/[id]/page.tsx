'use client'

import axios from "../../../../plugin/axios";
import {
    Alert,
    AlertColor,
    Box,
    Button,
    Paper,
    Snackbar,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { useState, useEffect, use } from 'react';

type ProductData = {
    id: number;
    name: string;
    price: number;
    description: string;
};

type FormData = {
    id: number;
    quantity: number;
};

type InventoryData = {
    id: number;
    type: number;
    date: string;
    unit: number;
    quantity: number;
    price: number;
    inventory: number;
};

export default function Page({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params); // Promiseを解決

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    // 状態管理
    const [product, setProduct] = useState<ProductData>({ id: 0, name: "", price: 0, description: "" });
    const [data, setData] = useState<Array<InventoryData>>([]);
    const [action, setAction] = useState<string>("");
    const [open, setOpen] = useState(false);
    const [severity, setSeverity] = useState<AlertColor>('success');
    const [message, setMessage] = useState('');

    const result = (severity: AlertColor, message: string) => {
        setOpen(true);
        setSeverity(severity);
        setMessage(message);
    };

    const handleClose = (event: any, reason: any) => {
        setOpen(false);
    };

    useEffect(() => {
        // 商品情報の取得
        axios.get(`/api/inventory/products/${resolvedParams.id}`)
            .then((response) => {
                setProduct(response.data);
            });

        // 在庫履歴の取得
        axios.get(`/api/inventory/inventories/${resolvedParams.id}`)
            .then((response) => {
                const inventoryData: InventoryData[] = [];
                let key: number = 1;
                let inventory: number = 0;

                response.data.forEach((e: InventoryData) => {
                    inventory += e.type === 1 ? e.quantity : e.quantity * -1;
                    const newElement = {
                        id: key++,
                        type: e.type,
                        date: e.date,
                        unit: e.unit,
                        quantity: e.quantity,
                        price: e.unit * e.quantity,
                        inventory: inventory,
                    };
                    inventoryData.unshift(newElement);
                });
                setData(inventoryData);
            });
    }, [open, resolvedParams]);

    const onSubmit = (event: any): void => {
        const formData: FormData = {
            id: parseInt(resolvedParams.id),
            quantity: Number(event.quantity),
        };

        if (action === "purchase") {
            handlePurchase(formData);
        } else if (action === "sell") {
            if (formData.id === 0) return;
            handleSell(formData);
        }
    };

    // 仕入れ・卸し処理
    const handlePurchase = (data: FormData) => {
        const purchase = {
            quantity: data.quantity,
            purchase_date: new Date(),
            product: data.id,
        };
        axios.post('/api/inventory/pruchases', purchase).then((response) => {
            result('success', '商品を仕入れました');  
        });
    };

    const handleSell = (data: FormData) => {
        const sale = {
            quantity: data.quantity,
            sales_date: new Date(),
            product: data.id,
        };
        axios.post('/api/inventory/sales', sale).then((response) => {
            result('success', '商品を卸しました');
        });
    };

    return (
        <>
            <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
                <Alert severity={severity}>{message}</Alert>
            </Snackbar>
            <Typography variant="h5">商品在庫管理</Typography>
            <Typography variant="h6">在庫処理</Typography>
            <Box component="form" onSubmit={handleSubmit(onSubmit)}>
                <Box>
                    <TextField
                        disabled
                        fullWidth
                        id="name"
                        label="商品名"
                        variant="filled"
                        value={product.name}
                    />
                </Box>
                <Box>
                    <TextField
                        type="number"
                        id="quantity"
                        variant="filled"
                        label="数量"
                        {...register("quantity", {
                            required: "必須入力です。",
                            min: { value: 1, message: "1から99999999の数値を入力してください" },
                            max: { value: 99999999, message: "1から99999999の数値を入力してください" },
                        })}
                        error={Boolean(errors.quantity)}
                        helperText={errors.quantity?.message?.toString() || ""}
                    />
                </Box>
                <Button
                    variant="contained"
                    type="submit"
                    onClick={() => setAction("purchase")}
                >
                    商品を仕入れる
                </Button>
                <Button
                    variant="contained"
                    type="submit"
                    onClick={() => setAction("sell")}
                >
                    商品を卸す
                </Button>
            </Box>
            <Typography variant="h6">在庫履歴</Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>処理種別</TableCell>
                            <TableCell>処理日時</TableCell>
                            <TableCell>単価</TableCell>
                            <TableCell>数量</TableCell>
                            <TableCell>価格</TableCell>
                            <TableCell>在庫数</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((entry: InventoryData) => (
                            <TableRow key={entry.id}>
                                <TableCell>{entry.type}</TableCell>
                                <TableCell>{entry.date}</TableCell>
                                <TableCell>{entry.unit}</TableCell>
                                <TableCell>{entry.quantity}</TableCell>
                                <TableCell>{entry.price}</TableCell>
                                <TableCell>{entry.inventory}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
}