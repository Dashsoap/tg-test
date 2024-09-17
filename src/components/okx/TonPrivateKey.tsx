import React, {ChangeEvent, useEffect, useState} from 'react';
import {
    Alert,
    AlertIcon,
    Button,
    Flex,
    Heading,
    IconButton,
    Input,
    InputGroup,
    InputLeftAddon,
    InputRightElement,
    Select,
    useClipboard,
    useToast,
    VStack,
} from "@chakra-ui/react";
import {TonWallet} from "@okxweb3/coin-ton";
import AddressOutput from "./AddressOutput";
import Box100 from './Box100';
import {errorToast, successToast} from "./toast";
const BOUNCEABLE = 'bounceable';
const UNBOUNCEABLE = 'unbounceable';

interface GeneratePrivateKeyProps {
    wallet: TonWallet;
    privateKey: string;
    setPrivateKey: React.Dispatch<React.SetStateAction<any>>;
}

const TonPrivateKey: React.FC<GeneratePrivateKeyProps> = (props) => {
    const toast = useToast();

    const [address, setAddress] = useState('');
    const [network, setNetwork] = useState('mainnet');
    const [addressBounceable, setAddressBounceable] = useState(UNBOUNCEABLE);

    const {hasCopied: hasCopiedPrivKey, onCopy: onCopyPrivKey} = useClipboard(props.privateKey);

    const updateAddress = async () => {
        const privateKey = props.privateKey;
        getAddress(privateKey)
            .then((addr) => {
                setAddress(addr);
                successToast(toast, "地址更新成功");
            })
            .catch((e) => {
                errorToast(toast, e.toString());
            });
    };

    const getAddress = async (privateKey: string) => {
        const {address: a} = await props.wallet.getNewAddress({privateKey});
        const {address: addr} = await props.wallet.parseAddress({address: a});
        return addr.toString({
            urlSafe: true,
            bounceable: addressBounceable === BOUNCEABLE,
            testOnly: network === 'testnet',
        });
    };

    const handleSelectAddressBounceable = (event: ChangeEvent<HTMLSelectElement>) => {
        setAddressBounceable(event.target.value);
    };

    const handleSelectNetworkChange = (event: ChangeEvent<HTMLSelectElement>) => {
        setNetwork(event.target.value);
    };

    const handleUpdateAddress = async (e: React.FormEvent) => {
        e.preventDefault();
        const privateKey = props.privateKey;
        const addr = await getAddress(privateKey);
        setAddress(addr);
    };

    const handlePrivKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        const {value} = e.target;
        props.setPrivateKey(value);
    };

    const handleGenPrivKey = async (e: React.FormEvent) => {
        e.preventDefault();
        const privateKey = await props.wallet.getRandomPrivateKey();
        props.setPrivateKey(privateKey);

        const addr = await getAddress(privateKey);
        setAddress(addr);
    };

    useEffect(() => {
        updateAddress();
    }, [addressBounceable, network]);

    return (
        <Box100>
            <VStack spacing={4} align="stretch" w="100%">
                <Heading size="md">生成私钥</Heading>

                <Select value={network} onChange={handleSelectNetworkChange} size="sm">
                    <option value="mainnet">主网</option>
                    <option value="testnet">测试网3</option>
                </Select>
                <InputGroup size="sm">
                    <InputLeftAddon>私钥</InputLeftAddon>
                    <Input
                        type="text"
                        value={props.privateKey}
                        onChange={handlePrivKeyChange}
                        placeholder="输入私钥"
                    />
                    <InputRightElement>
                        <IconButton
                            onClick={onCopyPrivKey}
                            size="sm"
                            variant="ghost"
                            icon={hasCopiedPrivKey ? '粘贴' : '复制'}
                            aria-label={hasCopiedPrivKey ? '已复制' : '复制'}
                        />
                    </InputRightElement>
                </InputGroup>

                <Select value={addressBounceable} onChange={handleSelectAddressBounceable} size="sm">
                    <option value={BOUNCEABLE}>可跳转地址</option>
                    <option value={UNBOUNCEABLE}>不可跳转地址</option>
                </Select>

                <Flex gap={2} direction="column">
                    <Button onClick={handleGenPrivKey} size="sm" colorScheme="blue" width="100%">
                        生成随机私钥
                    </Button>
                    <Button onClick={handleUpdateAddress} size="sm" colorScheme="blue" width="100%">
                        更新地址
                    </Button>
                </Flex>

                <AddressOutput address={address}/>
            </VStack>
        </Box100>
    );
};

export default TonPrivateKey;
