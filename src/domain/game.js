import React from 'react';
import {Rest, RestContext} from "../reactrest/reactRest";

class Game extends React.Component {
    constructor(props) {
        super(props);
        console.log("Game", props)
        console.log("Game/context-create", this.context)
    }


    render() {
        return (<RestContext.Consumer>{context => {
            console.log("Game/render/context", context)
            console.log("game/setJson", context.setJson)
            console.log("game/json", this.props)
            return <div className='game'>
                <div className='game-board'>
                    <Rest json={this.props._embedded.board}/>
                </div>
                <br/>
                <ul className='game-buttons'>
                    <li>
                        <button onClick={() => {
                            console.log("in button1", this.props)
                            console.log("in button1", this.props._links.game1.href)
                            context.setJson(this.props._links.game1.href)
                        }}>Restart1
                        </button>
                    </li>
                    <li>
                        <button onClick={() => "notyet"}>Restart2</button>
                    </li>
                </ul>
            </div>
        }}</RestContext.Consumer>)
    }
}

Game
