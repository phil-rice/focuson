class Game extends React.Component {
    constructor(props) {
        super(props);
        this.reactRest = this.props.reactRest
        this.boardData = props.data._embedded.board
    }

    render() {
        console.log("game0")
        const e = React.createElement;
        let board = this.reactRest.renderSelf(this.boardData)
        return (
            e("div", {className: "game"}, e("div", {className: "game-board"}, board),
                e("div", {className: "game-info"},
                    e("div", null),
                    e("ol", null)))
        )
    }
}

Game
