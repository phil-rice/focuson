import './index.css';
import {GameData, GameDomain} from "./domain";
import {SimpleGame} from "./tic_tac_toe";
import React from 'react';
import ReactDOM from 'react-dom';
import {LensReact} from "@phil-rice/reactlens/src/LensReact/LensReact";
import {getElement} from '@phil-rice/lens/src/utils';

let element = getElement("root")
let gameDomain: GameDomain = new GameDomain()
LensReact.setJson<GameDomain, GameData>(gameDomain, element,
    c => {
        let comp = <SimpleGame context={c}/>
        ReactDOM.render(comp, element)
    })


