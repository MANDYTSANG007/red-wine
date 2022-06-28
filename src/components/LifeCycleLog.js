import React from 'react';

class TextAreaLog extends React.Component {
    constructor() {
        super();
        this.state = {};
    }

    componentDidMount() {
        console.log('componentDidMount')
    }

    componentWillUnmount() {
        console.log('componentWillMount')
    }

    componentDidUpdate(prevProps, prevState, snapshot){
        console.log('componentDidUpdate', prevProps, prevState, snapshot)
    }
    getSnapshotBeforeUpdate(prevProps, prevState) {
        console.log('getSnapshotBeforeUpdate', prevProps, prevState);
        return 'hello';
    }
    // shouldComponentUpdate(newProps, newState) {
    //     console.log('shouldComponentUpdate', newProps, newState);
    //     return true;
    // }

    //This line will prevent user to input more than the assigned lenght.
    shouldComponentUpdate(_, newState) {
        return newState.text.length > 8 ? false : true;
    }

    //helper method use here to update the state
    onTextChange(event){            // onTextChange() is an event handler that takes an event object and reaches into it to get teh contents of the textarea input.
        this.setState ({            // always update the state with this.setState(), which takes an object and merges it with the already existing data in this.state.
            text: event.target.value, // target Event Property returns the element that triggered the event
        });
    }

    render() {
        const text = 'text' in this.state ? this.state.text : this.props.text;
        return (
            <div>
                <textarea 
                //defaultValue = {text} (this is the way inputs work in HTML where their state is maintained by the browser)
                //this onChange event fires when the user types, as opposed to after they've finished typing and have navigated away from the field.
                value ={text}
                onChange={event => this.onTextChange(event)}/>  
                <h3>{text.length}</h3>
            </div>
        )
    }
}
TextAreaLog.defaultProps = {
    text: 'Count me as I type',
}

export default TextAreaLog;