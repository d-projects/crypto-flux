import React, { useState, useEffect } from 'react';
import Title from "./Title";
import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Text,
    Flex,
    Spinner,
    Select,
    Checkbox,
    Button
  } from "@chakra-ui/react";
import getCoinDisplayName from '../utils/getCoinDisplayName';
import defaultAssets from "../../../background/assets";
import defaultCurrencies from "../../../background/currencies";
import { getLocalStorageSync, setLocalStorageSync } from '../../../common/localStorageSync';
import { priceDataInterface, currencyDataInterface } from '../../../common/types';
import { MAX_DECIMAL_PLACES } from '../../../common/constants';
import { SettingsIcon } from '@chakra-ui/icons';
import styled from "styled-components";
import _ from "lodash";

const HoverIcon = styled.a`
    text-decoration: none;
    margin-left: 10px;
    :hover {
        color: orange;
        cursor: pointer;
    }
`;


const Prices = () => {

    const [priceData, setPriceData] = useState<priceDataInterface>();
    const [currencyData, setCurrencyData] = useState<currencyDataInterface>();
    const [tableCurrency, setTableCurrency] = useState<string>();
    const [showCryptoChoices, setShowCryptoChoices] = useState(false);
    const [displayedCoins, setDisplayedCoins] = useState<Array<string>>();
    const [tempDisplayedCoins, setTempDisplayedCoins] = useState<Array<string>>();

    const getData = async () => {
        setPriceData(await getLocalStorageSync("priceData") ?? defaultAssets);
        setCurrencyData(await getLocalStorageSync("currencies") ?? defaultCurrencies);
        setDisplayedCoins(await getLocalStorageSync("displayedCoins") ?? getDefaultDisplayedCoins());
        const tableCurrency = await getLocalStorageSync("tableCurrency") ?? "USD";
        setTableCurrency(tableCurrency);
    }

    useEffect(() => {
        getData();
        chrome.runtime.onMessage.addListener((message) => {
            if (message === 'prices-updated') {
                getData();
            }
        });
    }, []);

    const getDefaultDisplayedCoins = () => {
        return Object.values(defaultAssets).map(coin => coin.id);
    }

    const onCurrencyChange = (event: any) => {
        const currency = event.target.value;
        setTableCurrency(currency);
        setLocalStorageSync("tableCurrency", currency);
    }

    const convertCurrency = (fromCurr: string, toCurr: string, price: number) => {
        let decimalPlaces;
        if (price.toString().split(".").length == 1) {
            decimalPlaces = 2
        } else {
            decimalPlaces = Math.min(price.toString().split(".")[1].length, MAX_DECIMAL_PLACES);
        }
        // @ts-ignore
        return ((currencyData[toCurr] / currencyData[fromCurr]) * price).toFixed(decimalPlaces);
    }

    const onSettingsClick = () => {
        setTempDisplayedCoins(_.cloneDeep(displayedCoins));
        setShowCryptoChoices(true);
    }

    const onCheckClick = (coinId: string) => {
        if (!tempDisplayedCoins) return;

        if (tempDisplayedCoins.indexOf(coinId) !== -1) {
            setTempDisplayedCoins(tempDisplayedCoins.filter(c => c !== coinId));
        } else {
            setTempDisplayedCoins([...tempDisplayedCoins, coinId]);
        }
    }

    const onCryptoChoiceSave = async () => {
        await setLocalStorageSync("displayedCoins", tempDisplayedCoins);
        setDisplayedCoins(tempDisplayedCoins);
        setShowCryptoChoices(false);
    }

    const onCryptoChoiceCancel = async () => {
        setShowCryptoChoices(false);
    }

    return (
        <>
        <Title size={25} text="Crypto Prices"/>
    
        <Flex
            width={"100%"}
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
        >

            {!priceData || !currencyData || !tableCurrency || !displayedCoins || Object.values(priceData).some((coin: any) => coin.price === 0) ? 
            
            <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="blue.500"
            size="xl"
          /> 
          :

            <>
            <Flex
                width={"90%"}
                my="10px"
                justifyContent="space-between"
            >
                <Select value={tableCurrency} onChange={onCurrencyChange} width={"40%"} size="sm">
                    {Object.keys(currencyData).map(curr => {
                        return (
                            <option value={curr}> {curr} </option>
                        )
                    })}
                </Select>

                
                {!showCryptoChoices &&
                <HoverIcon>
                    <SettingsIcon w={6} h={6} onClick={onSettingsClick}/>
                </HoverIcon>}

                {showCryptoChoices &&
                    <Flex mt="-1">
                        <Button colorScheme="blue" border="1px" mr="2" onClick={onCryptoChoiceSave}>Save</Button> 
                        <Button colorScheme="orange" border="1px" onClick={onCryptoChoiceCancel}>Cancel</Button>     
                    </Flex>        
                }
            </Flex>

            <Table variant="striped" colorScheme="blue" size="sm" width={"90%"}>
                <Thead>
                    <Tr>
                    <Th color="blue.500"> <Text fontSize="lg" >Crypto </Text> </Th>
                    <Th isNumeric color="blue.500"> <Text fontSize="lg" > Price </Text> </Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {Object.values(priceData).map((data: any) => {
                        return (
                            <>
                                {showCryptoChoices && tempDisplayedCoins &&
                                    <Tr>
                                    <Td> 
                                        {/* @ts-ignore*/}
                                        <Checkbox isChecked={tempDisplayedCoins.indexOf(data.id) !== -1} onChange={() => onCheckClick(data.id)}> <Text fontSize="md"> {getCoinDisplayName(data.id, data.symbol)} </Text> </Checkbox> 
                                    </Td>
                                    <Td isNumeric > <Text fontSize="md"> {convertCurrency("USD", tableCurrency, data.price)} {tableCurrency} </Text> </Td>
                                    </Tr>
                                }
                                {!showCryptoChoices && displayedCoins.indexOf(data.id) !== -1 &&
                                <Tr>
                                    <Td> <Text fontSize="md"> {getCoinDisplayName(data.id, data.symbol)} </Text> </Td>
                                    <Td isNumeric > <Text fontSize="md"> {convertCurrency("USD", tableCurrency, data.price)} {tableCurrency} </Text> </Td>
                                </Tr>}
                            </>
                        )
                    })}
                </Tbody>
            </Table>
            
            </>}

            <Flex
                width={"90%"}
                my="10px"
            >
                {priceData && Object.values(priceData).some((coin: any) => coin.price === 0) && 
                <Text fontSize="md"> 
                    Please wait while <b> initial </b> prices are fetched. This usually takes a few seconds but
                    could take up to 10 minutes. Feel free to add alerts in the meantime!
                </Text>}
            </Flex>

        </Flex>
        </>
    )
}

export default Prices;
