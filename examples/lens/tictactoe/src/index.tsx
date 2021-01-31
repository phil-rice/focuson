//Copyright (c)2020-2021 Philip Rice. <br />Permission is hereby granted, free of charge, to any person obtaining a copyof this software and associated documentation files (the Software), to dealin the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:  <br />The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED AS
import {getElement, LensContext} from "@phil-rice/lens";
import * as React from 'react'
import ReactDOM from 'react-dom';
import {GameData, GameDomain, SimpleGame, nextStateLens, emptyGame} from "./game";


let domain = new GameDomain(nextStateLens)
let rootElement = getElement("root");

let setJson = LensContext.setJsonForReact<GameDomain, GameData>(domain, 'game',
    c => (ReactDOM.render(<SimpleGame context={c}/>, rootElement)))

setJson(emptyGame)

