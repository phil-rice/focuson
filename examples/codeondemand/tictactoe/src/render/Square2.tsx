//Copyright (c)2020-2021 Philip Rice. <br />Permission is hereby granted, free of charge, to any person obtaining a copyof this software and associated documentation files (the Software), to dealin the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:  <br />The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED AS
import {GameContext, GameProps, NoughtOrCross} from "../GameDomain";
import {useContext} from "react";

/** IF you are wondering why we have SimpleGame.square, and square and square2, it is so that we can demonstrate loading difference versions of essentially the same thing */
function Square<Main>({context}: GameProps<NoughtOrCross>) {
    const {onClickSquare} = useContext(GameContext);
    return (<button className='square' onClick={() => onClickSquare(context)}>{context.json() + "."}</button>)
}



