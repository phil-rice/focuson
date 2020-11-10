import React from 'react';
import {Rest} from "../reactrest/reactRest";

class Board extends React.Component {
    constructor(props) {
        super(props);
        console.log("board/props", props)
        this.state = {squares: props.squares, xIsNext: true}
    }

    renderSquare(i) {
        let squareJson = {
            index: i,
            value: this.state.squares[i],
            onClick: () => this.handleClick(i),
            _render: {_self: this.props._render.square} // bit of a pain... would be nice to make cleaner
        }
        return (<Rest json={squareJson}></Rest>)
    }

    next() {
        return this.state.xIsNext ? 'X' : 'O'
    }

    handleClick(i) {
        const squares = this.state.squares.slice();
        squares[i] = this.next()
        this.setState({squares: squares, xIsNext: !this.state.xIsNext});
    }

    render() {
        const status = 'Next player: ' + this.next();
        return (<div>
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
    }
}

Board

