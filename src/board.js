const e = React.createElement;

class Board extends React.Component {
    constructor(props) {
        super(props);
        this.reactRest = this.props.reactRest
        this.state = {squares: this.props.data.squares, xIsNext: true}
    }

    renderSquare(i) {
        return this.reactRest.renderUsing('square', {
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
        return (
            e("div", null, e("div", {className: "status"}, status),
                e("div", {className: "board-row"}, this.renderSquare(0), this.renderSquare(1), this.renderSquare(2)),
                e("div", {className: "board-row"}, this.renderSquare(3), this.renderSquare(4), this.renderSquare(5)),
                e("div", {className: "board-row"}, this.renderSquare(6), this.renderSquare(7), this.renderSquare(8)))
        )
    }
}

Board
