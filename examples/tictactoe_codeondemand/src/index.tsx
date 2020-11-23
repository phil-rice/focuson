import './index.css';
import {GameData, GameDomain} from "./domain";

import {SimpleGame} from "./tic_tac_toe";
import React from "react";

let element: HTMLElement = document.getElementById("root")
let gameDomain: GameDomain = new GameDomain()
let setJson = LensReact.setJson<GameDomain, GameData>(gameDomain, element,
    c => (ReactDOM.render(<SimpleGame context={c}/>, element)))

setJson({
        "state"    : "X",
        "_embedded": {
            "board": {
                "squares": ["", "", "", "", "", "", "", "", ""]
            }
        }
    }
)


