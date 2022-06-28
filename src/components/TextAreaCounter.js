import React from 'react';

class TextAreaCounter extends React.Component {
    constructor() {
        super();
        this.state = {};
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
TextAreaCounter.defaultProps = {
    text: 'Count me as I type',
}

export default TextAreaCounter;