import React from "react";
import PropTypes from 'prop-types';

//data
const headers = ['Book', 'Author', 'Language', 'Published', 'Sales'];


const data = [
    [
        'A Tale of Two Cities', 'Charles Dickens', 'English', '1859', '200 million',
    ],
    [
        'Le Petit Prince (The Little Price)', 'Antoine de Saint-Exupery', 'French', '1943', '150 million',
    ],
    [
        "Harry Potter and the Philosopher's Stone", 'J. K. Rowling', 'English', '1997', '120 million'
    ],
    [
        'The Hobbit', 'J.R.R. Tolkien', 'English', '1937', '100 million',
    ],
];


class Excel extends React.Component {
    constructor(props) {
        super(props);
        // this.state = {data: props.initialData};
        this.state = {headers}
    }

    
    render() {
        return (
            <table>
                <thead>
                    <tr>
                        {this.props.headers.map((message) => (
                            <th key={message} message={message}/>
                        ))}
                    </tr>
                </thead>
                {/* <tbody>
                    {this.state.data.map((row, idx) => (
                        <tr key={idx}>
                            {row.map((cell, idx) => (
                                <td key={idx}>{cell}</td>
                            ))}
                        </tr>
                    ))}
                </tbody> */}
            </table>
        );
    }
}

// Use propTypes to make sure the data type. Avoiding error.
// 
Excel.propTypes = {
    headers: PropTypes.arrayOf(PropTypes.string),           //the headers props is expected to be an array of strings and
    // initialData: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)), //initialData is expected to be an array where each element is another array of string elements. 
};




export default Excel;