import React from 'react';
class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = props.data._embedded.board
        console.log("creating game", this.state)
        this.reactRest = this.props.reactRest
    }

    render() {
        console.log("rendering game0", this.state)
        let board = this.reactRest.renderSelf(this.state)
        console.log("in rendering game", board)
        return (<div className='game'>
            <div className='game-board'>
                <board/>
            </div>
            <div className='game-info'></div>
        </div>)
    }
}

Game
