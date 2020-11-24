import {Lens, LensContext, LensProps} from "@phil-rice/lens";
import {LoadAndCompileCache, MakeComponentFromServer} from "@phil-rice/codeondemand";
import React from "react";


export type GameProps<Main, T> = LensProps<GameDomain<Main>, Main, T>

export interface Link {
    href: string
}
export type NoughtOrCross = "O" | "X" | ""

export interface GameData {
    state: NoughtOrCross,
    _embedded: { board: BoardData },
    _render: { _self: string },
    _links: { game1: Link, game2: Link }
}

export interface BoardData {
    squares: SquareData,
    _render: { _self: string, square: string }
}
export type SquareData = NoughtOrCross[]

export interface HasStateLens<Main> {
    stateLens: Lens<Main, NoughtOrCross>
}

export let defaultStateLens = Lens.build<GameData>('game').field('state');

export class GameDomain<Main> {
    loadJson: (url: string) => Promise<void>
    cache: LoadAndCompileCache<MakeComponentFromServer<React.ReactElement>>
    stateLens: Lens<Main, NoughtOrCross>
    nextState: NoughtOrCross = "X"
    toggleNextState() {return this.nextState = (this.nextState === "X") ? "O" : "X"}
    getAndToggleNextState(): NoughtOrCross {
        let result = this.nextState;
        this.toggleNextState();
        return result;
    }

    constructor(componentCache: LoadAndCompileCache<MakeComponentFromServer<React.ReactElement>>,
                stateLens: Lens<Main, NoughtOrCross>, loadJson: (url: string) => Promise<void>) {
        this.cache = componentCache
        this.stateLens = stateLens
        this.loadJson = loadJson
    }

    invert(s: NoughtOrCross): NoughtOrCross {return (s === 'X' ? 'O' : 'X')}

    setSquareAndToggleState = (context: LensContext<GameDomain<Main>, Main, NoughtOrCross>) =>
        Lens.transform2(context.lens, this.stateLens)((sq, state) =>
            sq === '' ? {one: state, two: this.invert(state)} : {one: sq, two: state})(context.main)


}

