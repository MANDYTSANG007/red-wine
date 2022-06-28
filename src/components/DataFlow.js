//Take care of all the data flow, this component should have all the data and can pass it to <ExcelF> and to <Header>
//When the user changes the data in the table, ExcelF notifies the parent DataFlow via the onDataChange prop. When the 
//user adds a new record using the Dialog in DataFlow, then the updated data is passed to Excel due to the onAction cb. 
//ANtoher information to be passed around by DataFlow is the search(filter) string typed in the header's search box. DataFlow
//takes it form the Header's onSearch cb and passes it to ExcelF as the filter property. DataFlow is also responsible
//for updating the localStorage, which should always have the latest data.


import {useState, useReducer, useRef} from 'react';
// import PropTypes from 'prop-types';

import Header from './Header';
import Body from './Body';
// import Dialog from './Dialog';
import ExcelF from './ExcelF';
import Form from './Form';
import clone from '../modules/clone';

import schema from '../config/schema';
import DataContext from '../contexts/DataContext';

let initialData = JSON.parse(localStorage.getItem('data'));

if (!initialData) {
    initialData = [{}];
    Object.keys(schema).forEach(
        (key) => (initialData[0][key] = schema[key].samples[0]),
    );
}

//use local storage in case the user closes the browser tab
function commitToStorage(data) {
    localStorage.setItem('data', JSON.stringify(data));
}

//keep the data in the state
function DataFlow() {
    const [data, setData] = useState(initialData);
    const [filter, setFilter] = useState(null);

    //update the data- this parent DataFlow receives the new data and updates the state
    // with setData(), and this causes React to rerender. It takes 3 steps: 1)clone the data so it's always immutable 
    //2)save it to localStorage for the next time
    //the app is loaded. 3) update the state
    function updateData(newData) {
        newData = clone(newData);
        commitToStorage(newData);
        setData(newData);
    }

     //onSearch() takes the search string from the header and updates the filter state, which (by way
    //of rerendering) is passed to ExcelF, where it's used to show only matching data records.
    function onSearch(e) {
        const s = e.target.value;
        setFilter(s);
    }

    //combine all the main components
    return (
        <div className='DataFlow'>
            <DataContext.Provider value={{data, updateData}}>
                <Header onSearch={onSearch} />
                <Body>
                    <ExcelF filter={filter} />
                </Body>
            </DataContext.Provider>
        </div>
        );
}

export default DataFlow;