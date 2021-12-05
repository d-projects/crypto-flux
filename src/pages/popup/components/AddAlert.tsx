import React, {useState, useEffect} from 'react';
import Title from './Title';
import { Formik, Form, Field } from "formik";
import {Text, FormControl, FormLabel, Input, FormErrorMessage, Button, Select} from "@chakra-ui/react";
import styled from 'styled-components';
import _ from "lodash";
import getCoinDisplayName from "../utils/getCoinDisplayName";
import defaultAssets from "../../../background/assets";
import defaultCurrencies from "../../../background/currencies";
import { MAX_ALERTS, MAX_ALERT_PRICE, MAX_DECIMAL_PLACES, ABOVE_ALERT, BELOW_ALERT } from '../../../common/constants';
import { getLocalStorageSync, setLocalStorageSync } from '../../../common/localStorageSync';
import { priceDataInterface, currencyDataInterface, alertInterface } from '../../../common/types';

const FormWrapper = styled.div`
    display: flex;
    justify-content: center;
    width: 100%;
`;

const AddAlert = () => {
    const [priceData, setPriceData] = useState<priceDataInterface>();
    const [currencies, setCurrenices] = useState<currencyDataInterface>();
    const [alerts, setAlerts] = useState<alertInterface[]>();
    const [alertAdded, setAlertAdded] = useState(false);

    const getData = async () => {
        setPriceData(await getLocalStorageSync("priceData") ?? defaultAssets);
        setCurrenices(await getLocalStorageSync("currencies") ?? defaultCurrencies);
        const alerts = await getLocalStorageSync("alerts") ?? [];
        setAlerts(alerts);
    }

    // Just for fun
    // Returns nearest 10000 above current price of bitcoin
    const getPlaceholderPrice = () => {
      // @ts-ignore
      return (Math.floor(priceData["bitcoin"].price / 10000)*10000 + 10000).toFixed(2);
    }

    const validatePrice = (priceString: any) => {
        if (isNaN(priceString)) return "Please enter a valid number";
        else if (priceString.split(".").length > 1 && priceString.split(".")[1].length > MAX_DECIMAL_PLACES) return "Please enter at most " + MAX_DECIMAL_PLACES.toString() + " decimal places";
        
        const price = parseFloat(priceString);
        if (price <= 0) return "Please enter a number greater than 0";
        else if (price > MAX_ALERT_PRICE) return "Please enter a lower number";
        return null;    
    }

    useEffect(() => {
        getData();
    }, []);

    return (
        <>
        <Title size={25} text="Add an Alert"/>

        {alertAdded && <Text color="green" fontSize="lg" display="flex" justifyContent="center" width="sm"> Your alert was set! </Text>}

        {alerts && alerts.length == MAX_ALERTS ?        
        <Text fontSize="md" display="flex" justifyContent="center" width="sm"> 
          You currently have the maximum amount of alerts set. Remove some to set another alert.
        </Text> :

        <FormWrapper>
        
        {priceData && currencies && alerts &&             
        <Formik
          initialValues={{ id: "bitcoin", currency: "USD", price: "", type: "above" }}
          validate={values => {
              setAlertAdded(false);
              const errors : any = {}
              const priceError = validatePrice(values.price);
              if (priceError) {
                  errors.price = priceError;
              } else {
                  const matchingAlert = alerts.some((a: any) => _.isEqual(
                      _.omit(a, ['numericalId', 'met']),
                      _.omit(values)
                  ));
      
                  if (!values.price) errors.price = "Please enter a number";
                  else if (matchingAlert) errors.price = "You already have an identical alert set with this price";
              }

              return errors;
          }}
          onSubmit={(values, actions) => {
              const maxNumericalId = _.maxBy(alerts, (a: alertInterface) => a.numericalId);
              const newNumericalId = maxNumericalId ? maxNumericalId.numericalId + 1 : 1;
              const newAlert = {...values, ["met"]: false, ["numericalId"]: newNumericalId, ["price"]: parseFloat(values.price), ["symbol"]: priceData[values.id]["symbol"]};

              const udpatedAlerts = [...alerts, newAlert];
              // @ts-ignore
              setAlerts(udpatedAlerts);
              setLocalStorageSync("alerts", udpatedAlerts);
  
              actions.setSubmitting(false);
              setAlertAdded(true);
          }}
        >
          {(props) => (
            <Form>
              <Field name="id" validate={() => {}}>
                {({ field, form }: any) => (
                  <FormControl isInvalid={form.errors.id && form.touched.id}>
                    <FormLabel color="blue.500" mb="0" htmlFor="id"> Crypto </FormLabel>
                    <Select {...field} width="sm">
                      {Object.keys(priceData).map( (coinId) => {
                          return (
                              <option value={coinId}> {getCoinDisplayName(coinId, priceData[coinId]["symbol"])} </option>
                          )
                      })}
                  )
                      
                  </Select>                  
                  <FormErrorMessage>{form.errors.id}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>
              <Field name="currency" validate={() => {}}>
                {({ field, form }: any) => (
                  <FormControl isInvalid={form.errors.currency && form.touched.currency}>
                    <FormLabel mt="2" mb="0" color="blue.500" htmlFor="currency">Currency</FormLabel>
                    <Select {...field} width="sm">
                    {Object.keys(currencies).map( (curr) => {
                          return (
                              <option value={curr} selected={curr === "USD" ? true : false}> {curr} </option>
                          )
                      })}
                  </Select>
                    <FormErrorMessage>{form.errors.currency}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>
              <Field name="price">
                {({ field, form }: any) => (
                  <FormControl isInvalid={form.errors.price && form.touched.price}>
                    <FormLabel mt="2" mb="0" color="blue.500" htmlFor="price">Price</FormLabel>
                    <Input {...field} placeholder={getPlaceholderPrice()} width="sm"/>
                    <FormErrorMessage>{form.errors.price}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>

              <Field name="type" validate={() => {}}>
                {({ field, form }: any) => (
                  <FormControl isInvalid={form.errors.type && form.touched.type}>
                    <FormLabel mt="2" mb="0" color="blue.500" htmlFor="type">Type</FormLabel>
                    <Select {...field} width="sm">
                      <option value={ABOVE_ALERT}> Above </option>
                      <option value={BELOW_ALERT}> Below </option>
                  </Select>
                    <FormErrorMessage>{form.errors.type}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>

              <Button
                mt={4}
                colorScheme="blue"
                isLoading={props.isSubmitting}
                type="submit"
              >
                Submit
              </Button>
            </Form>
          )}
        </Formik>}

      </FormWrapper>}

      </>
    )
}

export default AddAlert;
