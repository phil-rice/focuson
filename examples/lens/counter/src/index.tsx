import * as React from 'react'
import ReactDOM from 'react-dom';

import {getElement, LensContext} from "@phil-rice/lens";
import {CounterData, CounterDomain, TwoCounterData} from "./domain";
import {Counter, TwoCounter} from "./Counter";


let domain = new CounterDomain() // Domains are to allow us to dependancy inject things. We don't need it with this simple example

let rootElement = getElement("root");


let setJson1 = LensContext.setJsonForReact<CounterDomain, CounterData>(domain, 'counter',
    c => (ReactDOM.render(<Counter context={c}/>, rootElement)))


let setJson2 = LensContext.setJsonForReact<CounterDomain, TwoCounterData>(domain, 'twoCounter',
    c => (ReactDOM.render(<TwoCounter context={c}/>, rootElement)))

setJson1({value: 0})
// setJson2({counterOne: {value: 0}, counterTwo: {value: 0}})


