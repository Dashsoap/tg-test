'use client';
import {VStack} from "@chakra-ui/react";
import {useState} from "react";
import TonPrivateKey from "../../components/okx/TonPrivateKey";
import {TonWallet} from "@okxweb3/coin-ton";
import TonSignTx from "../../components/okx/TonSignTx";
import TonSignJettonTx from "../../components/okx/TonSignJettonTx";
import {Section, Cell, Image, List} from '@telegram-apps/telegram-ui';

import {Link} from '@/components/Link/Link';

import tonSvg from './_assets/ton.svg';

export default function Home() {

    const [privateKey, setPrivateKey] =
        useState("49c0722d56d6bac802bdf5c480a17c870d1d18bc4355d8344aa05390eb778280")
    const wallet = new TonWallet()
    return (
        <List>
            <Section>
                <TonPrivateKey wallet={wallet} privateKey={privateKey} setPrivateKey={setPrivateKey}/>
                <TonSignTx wallet={wallet} privateKey={privateKey}/>
                <TonSignJettonTx wallet={wallet} privateKey={privateKey}/>
            </Section>
        </List>
    );
}
