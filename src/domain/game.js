import React from 'react';
import {RestChild} from "../reactrest/RestChild";

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.data=props.data
        this.state = props.data._embedded.board
        this.reactRest = this.props.reactRest
    }

    render() {
        // let Board = this.reactRest.renderSelf(this.state)
        return (<div className='game'>
            <div className='game-board'>
                <RestChild path='_embedded.board'/>
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
