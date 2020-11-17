import React from 'react';
import {Rest} from "../reactrest/ReactRestElements";
import {RestContext} from "../reactrest/LoadAndCompileCache"

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.getter = props.getter
        console.log("Game", props)
        console.log("Game/context-create", this.context)
    }

    render() {
        return (<RestContext.Consumer>{context => {
            return <div className='game'>
                <div className='game-board'>
                    <Rest getter={j => j._embedded.board}/>
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


