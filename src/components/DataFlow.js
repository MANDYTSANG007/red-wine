//Take care of all the data flow, this component should have all the data and can pass it to <ExcelF> and to <Header>
//When the user changes the data in the table, ExcelF notifies the parent DataFlow via the onDataChange prop. When the 
//user adds a new record using the Dialog in DataFlow, then the updated data is passed to Excel due to the onAction cb. 
//ANtoher information to be passed around by DataFlow is the search(filter) string typed in the header's search box. DataFlow
//takes it form the Header's onSearch cb and passes it to ExcelF as the filter property. DataFlow is also responsible
//for updating the localStorage, which should always have the latest data.


import {useState} from 'react';

import Header from './Header';
import Body from './Body';
import ExcelF from './ExcelF';
import clone from '../modules/clone';

import schema from '../config/schema';
import DataContext from '../contexts/DataContext';
import RouteContext from '../contexts/RouteContext';

let initialData = JSON.parse(localStorage.getItem('data'));

if (!initialData) {
    initialData = [{}];
    Object.keys(schema).forEach(
        (key) => (initialData[0][key] = schema[key].samples[0]),
    );
}

//read state from the URL routes
const route = {};
function resetRoute() {
    route.add = false;
    route.edit = null;
    route.info = null;
    route.filter = null;
}
resetRoute();
const path = window.location.pathname.replace(/\//, '');
if (path) {
    const [action, id] = path.split('/');
    if (action === 'add') {
        route.add = true;
    } else if (action === 'edit' && id !== undefined) {
        route.edit = parseInt(id, 10);
    } else if (action === 'info' && id !== undefined) {
        route.info = parseInt(id, 10);
    } else if (action === 'filter' && id !== undefined) {
        route.filter = id;
    }
}

//use local storage in case the user closes the browser tab
function commitToStorage(data) {
    localStorage.setItem('data', JSON.stringify(data));
}

//keep the data in the state
//Prefill the search box and do the searching when the app is loaded, we modify to useState(route.filter). Now whenever
//DataFlow renders, it's passing <Excel filter={filter}> where the filter value comes from the route. And as a result,
//Excel shows only the matching rows. If there's no filter in the route object then the filter prop is null and Excel
//shows everything. Later, we wrap the header in a route context provider in the rendering.
function DataFlow() {
    const [data, setData] = useState(initialData);
    const [filter, setFilter] = useState(route.filter);

    //update the data- this parent DataFlow receives the new data and updates the state
    // with setData(), and this causes React to rerender. It takes 3 steps: 1)clone the data so it's always immutable 
    //2)save it to localStorage for the next time
    //the app is loaded. 3) update the state
    function updateData(newData) {
        newData = clone(newData);
        commitToStorage(newData);
        setData(newData);
    }

    function updateRoute(action = '', id = '') {
        resetRoute();
        if (action) {
            route[action] = action === 'add' ? true : id;
        }
        id = id !== '' ? '/' + id : '';
        window.history.replaceState(null, null, `/${action}${id}`);
    }

     //onSearch() takes the search string from the header and updates the filter state, which (by way
    //of rerendering) is passed to ExcelF, where it's used to show only matching data records.
    //wrap any consumers of the new context in a provider component(<RouteContext.Provider>). To use the new routing
    //functionality, change the onSearch cb, which is invoked whenever the user types in the search box. When the user
    //types 'm' in the search box, the URL changes to /filter/m.When the user deletes the search string, the URL
    //goes back to /. This is to update the URL.
    function onSearch(e) {
        const s = e.target.value;
        setFilter(s);
        if (s) {
            updateRoute('filter', s);
        } else {
            updateRoute();
        }
    }

    //combine all the main components
    return (
        <div className='DataFlow'>
            <DataContext.Provider value={{data, updateData}}>
                <RouteContext.Provider value={{route, updateRoute}}>
                <Header onSearch={onSearch} />
                <Body>
                    <ExcelF filter={filter} />
                </Body>
                </RouteContext.Provider>
            </DataContext.Provider>
        </div>
        );
}

export default DataFlow;