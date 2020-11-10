import React from 'react';

/** This is the component that the client should directly use.
 *
 * It renders itself from the react-rest media type compliant json that it is given
 *
 * */

export class RestChild extends React.Component {
    constructor(props) {
        super(props);
        this.path = props.path
        console.log("RestChild/path", this.path)
        this.data = this.path.split('.').reduce((o, i) => o[i], props.data)
        console.log("RestChild/data", this.data)
        this.restReact = props.restReact
    }

    render() {
        return this.restReact.renderSelf(this.data)
    }

}
