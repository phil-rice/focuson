import {getElement, LensContext} from "@phil-rice/lens";
import * as React from 'react'
import ReactDOM from 'react-dom';
import {GameData, GameDomain, SimpleGame, nextStateLens, emptyGame} from "./game";


let domain = new GameDomain(nextStateLens)
let rootElement = getElement("root");
let setJson = LensContext.setJsonForReact<GameDomain, GameData>(domain, 'game',
    c => (ReactDOM.render(<SimpleGame context={c}/>, rootElement)))

setJson(emptyGame)

