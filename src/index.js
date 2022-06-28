import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
// import TextAreaCounter from './components/TextAreaCounter';
// import TextAreaLog from './components/LifeCycleLog';
// import Excel2 from './components/Excel2';
// import books from './books';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* <TextAreaCounter text="Mandy"/> */}
    {/* <TextAreaLog text="Mandy"/> */}
    {/* <Excel headers={headers}/> */}
    {/* <Excel2 books={books} /> */}
    <App />
  </React.StrictMode>
);


