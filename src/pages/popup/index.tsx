import React from 'react'
import { render } from 'react-dom'
import App from './App'
import { ChakraProvider } from "@chakra-ui/react";
import {BrowserRouter as Router} from "react-router-dom";

console.log('popup script')

const root = document.querySelector('#root')

render(<ChakraProvider><Router><App /></Router></ChakraProvider>, root)
