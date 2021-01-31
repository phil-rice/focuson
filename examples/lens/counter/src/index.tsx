//Copyright (c)2020-2021 Philip Rice. <br />Permission is hereby granted, free of charge, to any person obtaining a copyof this software and associated documentation files (the Software), to dealin the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:  <br />The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED AS
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


