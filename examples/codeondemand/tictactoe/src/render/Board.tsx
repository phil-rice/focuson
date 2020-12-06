import {Lens} from "@phil-rice/lens";
import {ChildFromServer} from "@phil-rice/codeondemand";
import {BoardData, GameProps} from "../GameDomain";

let lensBuilder: Lens<BoardData, BoardData> = Lens.build('board');

export function Board<Main>({context}: GameProps<Main, BoardData>) {
    const sq = (n: number) => (<ChildFromServer render='square' context={context} lens={lensBuilder.then('squares').andThen(Lens.nth(n))}/>)
    return (
        <div>
            <div className="board-row">{sq(0)} {sq(1)} {sq(2)}</div>
            <div className="board-row">{sq(3)} {sq(4)} {sq(5)}</div>
            <div className="board-row">{sq(6)} {sq(7)} {sq(8)}</div>
        </div>)
}
