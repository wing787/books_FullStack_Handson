'use client'

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
import productsData from "../sample/dummy_products.json";
import inventoriesData from "../sample/dummy_inventories.json";

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
    type: string;
    date: string;
    unit: number;
    quantity: number;
    price: number;
    inventory: number;
};

export default function Page({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params); // paramsのPromiseを解決

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    // 状態管理
    const [product, setProduct] = useState<ProductData>({ id: 0, name: "", price: 0, description: "" });
    const [data, setData] = useState<Array<InventoryData>>(inventoriesData);
    const [action, setAction] = useState<string>("");
    const [open, setOpen] = useState(false);
    const [severity, setSeverity] = useState<AlertColor>('success');
    const [message, setMessage] = useState('');

    const result = (severity: AlertColor, message: string) => {
        setOpen(true);
        setSeverity(severity);
        setMessage(message);
    };

    const handleClose = () => {
        setOpen(false);
    };

    useEffect(() => {
        const selectedProduct: ProductData = productsData.find(
            (v) => v.id === parseInt(resolvedParams.id)
        ) ?? { id: 0, name: "", price: 0, description: "" };

        setProduct(selectedProduct);
    }, [resolvedParams]);

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

    const handlePurchase = (data: FormData) => {
        result('success', '商品を仕入れました');
    };

    const handleSell = (data: FormData) => {
        result('success', '商品を卸しました');
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