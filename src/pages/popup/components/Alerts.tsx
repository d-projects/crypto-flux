import React, { useEffect, useState } from 'react';
import Title from "./Title";
import {
    Button,
    Flex,
    Spinner,
    Text,
} from "@chakra-ui/react";
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faRedo } from "@fortawesome/free-solid-svg-icons";
import getCoinDisplayName from '../utils/getCoinDisplayName';
import { Tooltip } from '@chakra-ui/tooltip';
import { getLocalStorageSync, setLocalStorageSync } from '../../../common/localStorageSync';
import { alertInterface } from '../../../common/types';

const HoverIcon = styled.a`
    text-decoration: none;
    margin-left: 10px;
    :hover {
        color: #8B0000;
        cursor: pointer;
    }
`;

const Alerts = () => {
    const [alerts, setAlerts] = useState<alertInterface[]>([]);

    const fetchAlerts = async () => {
        const fetchedAlerts = await getLocalStorageSync("alerts") ?? [];
        setAlerts(fetchedAlerts);
    }

    useEffect(() => {
        fetchAlerts();
        chrome.runtime.onMessage.addListener((message) => {
            if (message === 'prices-updated') {
                fetchAlerts();
            }
        });
    }, []);
    
    const resetAlert = async (alertId: number) => {
        const newAlerts = [];
        for (const alert of alerts) {
            if (alert.numericalId == alertId) alert.met = false;
            newAlerts.push(alert)
        }
        await setLocalStorageSync("alerts", newAlerts);
        setAlerts(newAlerts);
    }

    const deleteAlert = async (alertId: number) => {
        const newAlerts = alerts.filter((alert) => alert.numericalId !== alertId);
        await setLocalStorageSync("alerts", newAlerts);
        setAlerts(newAlerts);
    }

    const removeAllAlerts = async () => {
        if (!alerts.length) return;

        await setLocalStorageSync("alerts", []);
        setAlerts([]);
    }

    return (
        <>
            <Title size={25} text="Your Current Alerts"/>
            {!alerts ? <Spinner/> :
                <>
                { !alerts.length ? <Text fontSize="md"> You currently do not have any alerts set. </Text> :
                <Flex
                    flexDirection="column"
                    alignItems="center"
                    width={"100%"}
                >                        
                    {alerts.map(alert => {
                        const price = alert.price;
                        return (
                            <Flex
                                justifyContent="space-between"
                                alignItems="center"
                                margin="5px 0"
                                padding="10px 10px"
                                width="sm"
                                borderRadius="md"
                                border="1px"
                                borderColor="gray.200"
                                backgroundColor={alert.met ? "gray.200" : "white"}
                            >
                                <Text fontSize="md"> {getCoinDisplayName(alert.id, alert.symbol)} {alert.type.toLowerCase()} {price} {alert.currency} </Text> 
                                <Flex>
                                    {alert.met && 
                                    <Tooltip label="Reset">
                                        <HoverIcon> <FontAwesomeIcon icon={faRedo} size="2x" onClick={() => resetAlert(alert.numericalId)} /> </HoverIcon>
                                    </Tooltip>}

                                    <Tooltip label="Delete">
                                        <HoverIcon className="trash-icon"> <FontAwesomeIcon icon={faTrash} size="2x" onClick={() => deleteAlert(alert.numericalId)} /> </HoverIcon>
                                    </Tooltip>
                                </Flex>
                            </Flex>
                        );
                    })}

                    <Flex
                        justifyContent="flex-start"
                        width="sm"
                        mt={alerts.length === 1 ? "50px" : "5px"}
                    >
                        <Button colorScheme="blue" onClick={removeAllAlerts}>Remove All</Button>
                    </Flex>
                </Flex>}
            
                </>}
        </>
    )
}

export default Alerts;
