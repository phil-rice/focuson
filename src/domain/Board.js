import React from 'react';
import {Rest} from "../reactrest/ReactRestElements";
import {RestContext} from "../reactrest/LoadAndCompileCache"

class Board extends React.Component {
    constructor(props) {
        super(props);
        this.getter = props.getter
        console.log("board/props", props)
        console.log("board/context", this.context)
    }

    renderSquare(i) {
        return (<Rest getter={j => {
            let json = this.getter(j)
            console.log("Board/renderSquare", json)
            let squareJson = {
                index: i,
                value: json.squares[i],
                onClick: () => this.handleClick(i),
                _render: {_self: json._render.square} // bit of a pain... would be nice to make cleaner
            }
            console.log("squareJson", squareJson)
            return squareJson
        }}></Rest>)
    }

    next() {
        return this.state.xIsNext ? 'X' : 'O'
    }

    handleClick(i) {
        console.log("in handle click", this.state)
        const squares = this.state.squares.slice();
        console.log("squares were", squares)
        squares[i] = this.next()
        console.log("squares now", squares)
        this.setState({squares: squares, xIsNext: !this.state.xIsNext});
        console.log("leaving handle click", this.state)
    }

    render() {
        return (<RestContext.Consumer>{context => {
            console.log("board/render/context", context)
            let rawJson = context.json
            console.log("board/render/rawJson", rawJson)
            let json = this.getter(rawJson)
            console.log("board/render/json", json)

            this.state = {squares: json.squares, xIsNext: true}
            const status = 'Next player: ' + this.next();
            return (
                <div>
                    <div className="status">{status}</div>
                    <div className="board-row">
                        {this.renderSquare(0)}
                        {this.renderSquare(1)}
                        {this.renderSquare(2)}
                    </div>
                    <div className="board-row">
                        {this.renderSquare(3)}
                        {this.renderSquare(4)}
                        {this.renderSquare(5)}
                    </div>
                    <div className="board-row">
                        {this.renderSquare(6)}
                        {this.renderSquare(7)}
                        {this.renderSquare(8)}
                    </div>
                </div>)
        }}</RestContext.Consumer>)
    }
}



