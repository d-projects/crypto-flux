import React from 'react';
import { Button, ButtonGroup } from "@chakra-ui/react";
import {Link} from "react-router-dom";
import { ALERTS_PAGE, ADD_ALERT_PAGE, PRICES_PAGE} from '../../../common/constants';

const NavButtons = () => {
    return (
        <ButtonGroup>
            <Link to={ALERTS_PAGE}>
                <Button colorScheme="blue" border="1px">YOUR ALERTS</Button>
            </Link>
            <Link to={ADD_ALERT_PAGE}>
                <Button colorScheme="blue" border="1px">ADD ALERT</Button>
            </Link>
            <Link to={PRICES_PAGE}>
                <Button colorScheme="blue" border="1px">CRYPTO PRICES</Button>
            </Link>
        </ButtonGroup>
    );
}

export default NavButtons;
