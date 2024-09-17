import React, { useState } from 'react';
import {
    Button,
    Heading,
    useToast,
    VStack
} from "@chakra-ui/react";
import Box100 from "./Box100";
import FormInput from "./FormInput";
import { TransactionFormProps, TonJettonTxData } from "./types";
import SignedOutput from "./SignedOutput";
import FormCheckbox from "./FormCheckbox";
import { errorToast, successToast } from "./toast";


const TonSignJettonTx: React.FC<TransactionFormProps> = (props) => {
    const toast = useToast()
    const [txData, setTxData] = useState<TonJettonTxData>({
        type: "jettonTransfer", // Jetton TOKEN 转账类型
        fromJettonAccount: "kQDL9sseMzrh4vewfQgZKJzVwDFbDTpbs2f8BY6iCMgRTyOG", // 发起者的 Jetton 钱包地址
        to: "UQDXgyxgYKNSdTiJBqmNNfbD7xuRMl6skrBmsEtyXslFm5an", // 接收者地址
        seqno: 15, // 发起者地址的 nonce 或序列号
        toIsInit: false, // 接收地址是否已初始化
        memo: "jetton test", // 交易备注
        decimal: 2, // TON 区块链上的 Jetton TOKEN 小数位
        amount: "100", // TOKEN 的小数位为 2，因此这里的真实值为 1
        messageAttachedTons: "50000000", // 消息费，默认为 0.05，这里为 0.05 * 10^9
        invokeNotificationFee: "1", // 通知费，官方推荐 0.000000001，这里为 0.000000001 * 10^9
        /**
         * export enum SendMode {
         *     CARRY_ALL_REMAINING_BALANCE = 128,
         *     CARRY_ALL_REMAINING_INCOMING_VALUE = 64,
         *     DESTROY_ACCOUNT_IF_ZERO = 32,
         *     PAY_GAS_SEPARATELY = 1,
         *     IGNORE_ERRORS = 2,
         *     NONE = 0
         * }
         */
        sendMode: 1,
        queryId: "18446744073709551615" // uint64 数字的字符串，例如 18446744073709551615 = 2^64 - 1
    });
    const [tx, setTx] = useState('')

    const [scroll, setScroll] = useState(false);
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        props.wallet.signTransaction({ privateKey: props.privateKey, data: txData })
            .then((data: any) => {
                setTx(data.boc)
                setScroll(true);
                successToast(toast, "签名交易成功")
            })
            .catch((e: any) => {
                setTx('')
                errorToast(toast, e)
            })
    };
    return (
        <Box100 scroll={scroll} setScroll={setScroll}>
            <Heading marginBottom="5">签名 Jetton 交易</Heading>
            <VStack spacing={2} align="stretch" w={"100%"}>
                <FormInput name={"接收者地址"} data={txData} setData={setTxData} />
                <FormInput name={"数量"} data={txData} setData={setTxData} />
                <FormInput name={"序列号"} data={txData} setData={setTxData} />
                <FormInput name={"小数位"} data={txData} setData={setTxData} />
                <FormInput name={"备注"} data={txData} setData={setTxData} />
                <FormCheckbox name={"接收地址已初始化"} data={txData} setData={setTxData} />
                <FormInput name={"消息费"} data={txData} setData={setTxData} />
                <FormInput name={"通知费"} data={txData} setData={setTxData} />
                <FormInput name={"查询 ID"} data={txData} setData={setTxData} />
                <FormInput name={"公钥"} data={txData} setData={setTxData} />
                <Button onClick={handleSubmit} type="submit" colorScheme="blue" width="full">
                    签名交易
                </Button>
                <SignedOutput name="签名交易结果" output={tx} />
            </VStack>
        </Box100>
    );
};

export default TonSignJettonTx;
