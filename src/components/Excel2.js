import React from 'react';
import '../style.css';

export default function Excel2({ books }) {
    return (
        <table>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Author</th>
                    <th>Language</th>
                    <th>Published</th>
                    <th>Sales</th>
                </tr>
            </thead>
            <tbody>
                {books.map((book) => (
                    <tr key={book.id}>
                        <td >{`${book.name} `}</td>
                        <td >{`${book.author} `}</td>
                        <td >{`${book.language} `}</td>
                        <td >{`${book.published} `}</td>
                        <td >{`${book.sales} `}</td>
                    </tr>
                ))}
            </tbody>
        </table>

    )
}














// class Excel2 extends React.Component {
//     constructor(props) {
//         super();
//         this.state = {books: props.initialData};

//     }
//     render() {
//         return (
//             <table>
//                 <thead>
//                     <tr>
//                         {this.props.books.map((title, index) => (
//                         <th key={index}>{title}</th>))}
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {this.state.book.map((row, index) => (
//                         <tr key={index}>
//                             {row.map((cell, index) => (
//                                 <td key={index}>{cell}</td>
//                             ))}
//                         </tr>
//                     ))}
//                 </tbody>
//             </table>
//         )
//     }
// }
// export default Excel2;