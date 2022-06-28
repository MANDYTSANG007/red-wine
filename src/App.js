
import './App.css';
// import TextAreaCounter from './components/TextAreaCounter';
// import TextAreaLog from './components/TextAreaCounter';
// import Excel2 from './components/Excel2';
// import books from './books';
// import Excel4 from './components/Excel4';
// import Excel3 from './components/Excel3';
// import ExcelC from './components/ExcelC';
import Discovery from './components/Discovery';
// import React, {useState} from 'react';
import DataFlow from './components/DataFlow'; //add
import schema from './config/schema'; //add

const isDiscovery = window.location.pathname.replace(/\//g, '') === 'discovery';

let data = JSON.parse(localStorage.getItem('data')); //add

//read from the schema
if (!data) {
  data = [{}];
  Object.keys(schema).forEach((key) => (data[0][key] = schema[key].samples[0]));
}

function App() {
  // const headers = localStorage.getItem('headers');
  // const data = localStorage.getItem('data');
  // if(!headers) {
  //   headers = ['Title', 'Year', 'Rating', 'Comments'];
  //   data = [['Red wine', '2021', '3', 'meh']];
  // }
  // const [headers, initialData] = useState(); //added
  if (isDiscovery) {
    return <Discovery />;
    }
  return <DataFlow schema={schema} initialData={data} />
  // )
  //   <div>
  //     <h1>Mandy Excel</h1> 
  //     <ExcelC headers={headers} initialData={initialData}/> 
  //     <TextAreaCounter /> 
  //     <TextAreaLog />
  //     <Excel headers={headers}/>
  //     <Excel2 books={books}/>
  //     <Excel headers={headers} />
  //     <Excel4 headers={header} initialData={initialData} />,
  //     <Excel3  />
  //     <ExcelC
  //       headers={['Name', 'Year']}
  //       initialData={[
  //         ['Charles', '1859'],
  //         ['Antonie', '1943'],
  //       ]}
  //       />
  //   </div>
  // );
}

export default App;
