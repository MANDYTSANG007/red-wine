import React from 'react';
import PropTypes from 'prop-types';

function Excel3(props) {   // we can use destructuring syntax function here
    const headers = (
        <tr>
            {props.headers.map(({id, title}) =>
            <th key ={id}>
                {title}
            </th>)}
        </tr>
    )
        return (
            <table>
                <thead>
                    {headers}
                </thead>
            </table>
        );
    
}

// function Excel3({headers, initialData}) {   // we can use destructuring syntax function here
//     // const [ data, setData] = React.useState(initialData);
//         return (
//             <table>
//                 <thead>
//                     <tr>
//                         {/* {headers.map((title, idx) => (
//                             <th key={idx}>{headers.title}</th>
//                         ))} */}
//                         {headers.header.map((title) => (
//                             <th key={header.id}></th>
//                         ))}
//                     </tr>
//                 </thead>
//                 {/* <tbody>
//                     {data.map((row, idx) => (
//                         <tr key={idx}>
//                             {row.map((cell, idx) => (
//                                 <td key={idx}>{cell}</td>
//                             ))}
//                         </tr>
//                     ))}
//                 </tbody> */}
//             </table>
//         );
    
// }

Excel3.propTypes = {
    headers: PropTypes.arrayOf(PropTypes.string),
    // initialData: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string))
}

//data
const headers = [{id:1, title:'Book'}, {id:2, title:'Author'}, {id:3, title:'Language'}, {id:4, title:'Published'}, {id:5, title:'Sales'}];


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
export default Excel3;