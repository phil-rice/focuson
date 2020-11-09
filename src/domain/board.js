import React from 'react';

class Board extends React.Component {
    constructor(props) {
        super(props);
        this.state = {squares: props.data.squares, xIsNext: true, reactRest: props.reactRest}
    }

    renderSquare(i) {
        return this.state.reactRest.renderUsing('square', {
            index: i,
            value: this.state.squares[i],
            onClick: () => this.handleClick(i)
        })
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

