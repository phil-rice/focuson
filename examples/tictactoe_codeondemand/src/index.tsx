import {LensContext} from "@phil-rice/lens";
import * as React from "react";
import {GameData, GameDomain} from "./domain";
import {SimpleGame} from "./tic_tac_toe";
import ReactDOM from 'react-dom';

let element: HTMLElement = document.getElementById("root")
let gameDomain: GameDomain = new GameDomain()
let setJson = LensContext.setJsonForReact<GameDomain, GameData>(gameDomain, 'game',
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


