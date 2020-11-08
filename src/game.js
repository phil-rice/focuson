class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = props.data._embedded.board
        console.log("creating game", this.state)
        this.reactRest = this.props.reactRest
    }

    render() {
        console.log("rendering game0", this.state)
        const e = React.createElement;
        let board = this.reactRest.renderSelf(this.state)
        console.log("in rendering game", board)
        return (
            e("div", {className: "game"}, e("div", {className: "game-board"}, board),
                e("div", {className: "game-info"},
                    e("div", null),
                    e("ol", null)))
        )
    }
}

Game
