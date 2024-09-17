import React, { useState } from 'react';
import {
    Button,
    Heading,
    useToast,
    VStack
} from "@chakra-ui/react";
import Box100 from "./Box100";
import FormInput from "./FormInput";
import { TransactionFormProps, TonTxData } from "./types";
import SignedOutput from "./SignedOutput";
import FormCheckbox from "./FormCheckbox";
import { errorToast, successToast } from "./toast";


const TonSignTx: React.FC<TransactionFormProps> = (props) => {
    const toast = useToast()
    const [txData, setTxData] = useState<TonTxData>({
        type: "transfer", // TON 转账类型
        to: "EQA3_JIJKDC0qauDUEQe2KjQj1iLwQRtrEREzmfDxbCKw9Kr", // 接收地址
        decimal: 9, // TON 区块链上的小数位
        amount: "10000000", // TON 的小数位为 9，因此这里的真实值为 0.01
        seqno: 14, // 发起者地址的 nonce 或序列号
        toIsInit: true, // 接收地址是否已初始化
        memo: "ton test", // 交易备注
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
            <Heading marginBottom="5">签名交易</Heading>
            <VStack spacing={2} align="stretch" w={"100%"}>
                <FormInput name={"接收地址"} data={txData} setData={setTxData} />
                <FormInput name={"数量"} data={txData} setData={setTxData} />
                <FormInput name={"序列号"} data={txData} setData={setTxData} />
                <FormInput name={"小数位"} data={txData} setData={setTxData} />
                <FormInput name={"备注"} data={txData} setData={setTxData} />
                <FormCheckbox name={"接收地址已初始化"} data={txData} setData={setTxData} />
                <Button onClick={handleSubmit} type="submit" colorScheme="blue" width="full">
                    签名交易
                </Button>
                <SignedOutput name="签名交易结果" output={tx} />
            </VStack>
        </Box100>
    );
};

export default TonSignTx;
