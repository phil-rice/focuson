import React from 'react';
import {Rest} from "../reactrest/reactRest";

class Game extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (<div className='game'>
            <div className='game-board'>
                <Rest json={this.props._embedded.board}/>
            </div>
            <br/>
            <ul className='game-buttons'>
                <li>
                    <button onClick={() => "notyet"}>Restart1</button>
                </li>
                <li>
                    <button onClick={() => "notyet"}>Restart2</button>
                </li>
            </ul>
        </div>)
    }
}

Game
