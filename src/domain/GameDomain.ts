import React from "react";
import {Lens} from "../optics/optics";
import {LoadAndCompileCache} from "../reactrest/LoadAndCompileCache";
import {MakeComponentFromServer} from "../reactrest/ComponentFromServer";
import {LensContext, LensProps} from "../optics/LensContext";

export type GameProperties<Main, T> = LensProps<GameDomain<Main>, React.ReactElement, Main, T>


export interface Link {
    href: string
}
export interface SelfLink {
    _links: { _self: Link }
}
export type NoughtOrCross = "O" | "X" | ""

export interface GameData extends SelfLink {
    state: NoughtOrCross
    _embedded: { board: BoardData }
    _render: { _self: string }
    _links: { _self: Link, game1: Link, game2: Link }
}

export interface BoardData extends SelfLink {
    squares: SquareData
    _render: { _self: string, square: string }
}
export type SquareData = NoughtOrCross[]

export interface HasStateLens<Main> {
    stateLens: Lens<Main, NoughtOrCross>
}

export class GameDomain<Main> {
    componentCache: LoadAndCompileCache<MakeComponentFromServer<React.ReactElement>>
    stateLens: Lens<Main, NoughtOrCross>
    nextState: NoughtOrCross = "X"
    toggleNextState() {return this.nextState = (this.nextState === "X") ? "O" : "X"}
    getAndToggleNextState(): NoughtOrCross {
        let result = this.nextState;
        this.toggleNextState();
        return result;
    }

    constructor(componentCache: LoadAndCompileCache<MakeComponentFromServer<React.ReactElement>>, stateLens: Lens<Main, NoughtOrCross>) {
        this.componentCache = componentCache
        this.stateLens = stateLens
    }

    invert(s: NoughtOrCross): NoughtOrCross {return (s === 'X' ? 'O' : 'X')}

    setSquareAndToggleState = (context: LensContext<GameDomain<Main>, React.ReactElement, Main, NoughtOrCross>) =>
        Lens.transform2(context.lens, this.stateLens)((sq, state) =>
            sq === '' ? {one: state, two: this.invert(state)} : {one: sq, two: state})(context.main)


}

