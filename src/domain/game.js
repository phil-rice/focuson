import React from 'react';

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = props.data._embedded.board
        this.reactRest = this.props.reactRest
    }

    render() {
        let Board = this.reactRest.renderSelf(this.state)
        return (<div className='game'>
            <div className='game-board'>
                {Board}
            </div>
            <br/>
            <ul className='game-buttons'>
                <li>
                    <button onClick={() => changeGameRendering(gameJson)}>Restart1</button>
                </li>
                <li>
                    <button onClick={() => changeGameRendering(game2Json)}>Restart2</button>
                </li>
            </ul>
        </div>)
    }
}

Game
