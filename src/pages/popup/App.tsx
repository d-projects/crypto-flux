import React, { useEffect } from 'react'
import styled from 'styled-components';
import NavButtons from "./components/NavButtons";
import {
  Switch,
  Route,
  useHistory,
} from "react-router-dom";

import Alerts from "./components/Alerts";
import Title from "./components/Title";
import AddAlert from './components/AddAlert';
import Prices from './components/Prices';
import {Image, Flex} from "@chakra-ui/react";
import { ALERTS_PAGE, ADD_ALERT_PAGE, PRICES_PAGE } from '../../common/constants';

const StyledBody = styled.body`
  width: 450px;
  font-family: 'Roboto', sans-serif;
  padding: 0 0 10px 0;
  height: 300px;
`;

const NavWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

const PageWrapper = styled.div`
  padding: 0 0 10px 0;
  margin: 0 12px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const App = (): JSX.Element => {
  const history = useHistory();

  useEffect(() => {
    history.push(PRICES_PAGE);
  }, []);

  return (
      <StyledBody>
        <Flex justifyContent="center">
          <Image mt="20px" mr="10px" display="inline" boxSize="40px" src="../../assets/all_sizes.png"/>
          <Title size={40} text="Crypto Flux"/>
        </Flex>
        <NavWrapper>
          <NavButtons/>
        </NavWrapper>
        <PageWrapper>
          <Switch>
            <Route exact path={ALERTS_PAGE}>
              <Alerts />
            </Route>
            <Route exact path={ADD_ALERT_PAGE}>
              <AddAlert />
            </Route>
            <Route exact path={PRICES_PAGE}>
              <Prices />
            </Route>
          </Switch>
        </PageWrapper>
      </StyledBody>
  )
}

export default App;
