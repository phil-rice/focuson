//Copyright (c)2020-2021 Philip Rice. <br />Permission is hereby granted, free of charge, to any person obtaining a copyof this software and associated documentation files (the Software), to dealin the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:  <br />The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED AS
import * as React from 'react'
import ReactDOM from 'react-dom';

import {getElement, setJsonForFlux} from "@focuson/state";
import {Counter, TwoCounter} from "./Counter";
import {CounterData, TwoCounterData} from "./domain";


let oneCounterElement = getElement("oneCounter");
let twoCounterElement = getElement("twoCounter");


let setJson1 = setJsonForFlux<CounterData, void>('counter', s => (ReactDOM.render(<Counter state={s}/>, oneCounterElement)))

let setJson2 = setJsonForFlux<TwoCounterData, void>('twoCounter', s => (ReactDOM.render(<TwoCounter state={s}/>, twoCounterElement)))

setJson1({value: 0})
setJson2({counterOne: {value: 0}, counterTwo: {value: 0}})


