const e = React.createElement;

class Board extends React.Component {
    constructor(props) {
        super(props);
        console.log("Board.props", props)
        this.state = {squares: props.data.squares, xIsNext: true, reactRest: props.reactRest}
        console.log("creating board with", this.state)
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
        console.log("rnedering board", this.state)

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
