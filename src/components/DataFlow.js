//Take care of all the data flow, this component should have all the data and can pass it to <ExcelF> and to <Header>
//When the user changes the data in the table, ExcelF notifies the parent DataFlow via the onDataChange prop. When the 
//user adds a new record using the Dialog in DataFlow, then the updated data is passed to Excel due to the onAction cb. 
//ANtoher information to be passed around by DataFlow is the search(filter) string typed in the header's search box. DataFlow
//takes it form the Header's onSearch cb and passes it to ExcelF as the filter property. DataFlow is also responsible
//for updating the localStorage, which should always have the latest data.

import {useState, useReducer, useRef} from 'react';
import PropTypes from 'prop-types';

import Header from './Header';
import Body from './Body';
import Dialog from './Dialog';
import ExcelF from './ExcelF';
import Form from './Form';
import clone from '../modules/clone';

//use local storage in case the user closes the browser tab
function commitToStorage(data) {
    localStorage.setItem('data', JSON.stringify(data));
}

//use reducer to in charge of two types of events(actions): save and excelchange
//the potencial benefit of using a reducer is that it's simpler to expand on if future new actions are expected.
function reducer(data, action){
    //save will create a new record in data when the user clicks the +ADD WINE button
    //Why is it necessary to clone the data b/4 adding to it(via array's unshift()? it's b/c the reducer
    // is called twice in development and the same record would be added twice otherwise.)
    if (action.type === 'save') {
        data = clone(data);
        data.unshift(action.payload.formData);
        commitToStorage(data);
        return data;
    }
    //excelchange handles any data change coming from ExcelF. This action doesn't modify the data, just commits 
//it to storage and returns it as-is.
    if (action.type === 'excelchange') {
        commitToStorage(action.payload.updatedData);
        return action.payload.updatedData;
    }
}

//use a reducer for data since it's potentially more involved and for everthing else, stick with state
function DataFlow({ schema, initialData }) {
    const [ data, dispatch ] = useReducer( reducer, initialData );
    const [ addNew, setAddNew ] = useState(false);
    const [ filter, setFilter ] = useState(null);

    const form = useRef(null);

    // saveNew() helper handles dialog actions.It closes the dialog unconditionally (by setting the addNew state)
    // and if the dialog wasn't simply dismissed, it collects the form data from the dialog and dispatches the 
    // appropriate save action for the reducer to handle.
    function saveNew(action) {
        setAddNew(false);
        if (action === 'dismiss') {
            return;
        }

        const formData = {};
        Array.from(form.current).forEach(
            (input) => (formData[input.id] = input.value),
        );

        dispatch({
            type: 'save',
            payload: {formData},
        });
    }

    // onExcelDataChange is a cb that takes any data updates from ExcelF and dispatches an action to be handled
    //by the reducer.
    function onExcelDataChange(updatedData) {
        dispatch({
            type: 'excelchange',
            payload: {updatedData},
        });
    }

    //onSearch() takes the search string from the header and updates the filter state, which (by way
    //of rerendering) is passed to ExcelF, where it's used to show only matching data records.
    function onSearch(e) {
        setFilter(e.target.value);
    }

     //combine all the main components
     return (
        <div className='DataFlow'>
            <Header
                onAdd={() => setAddNew(true)}
                onSearch={onSearch}
                count={data.length}
            />
            <Body>
                <ExcelF
                    schema={schema}
                    initialData={data}
                    key={data}
                    onDataChange={(updatedData) => onExcelDataChange(updatedData)}
                    filter={filter}
                />
                {addNew ? (
                    <Dialog
                        modal={true}
                        header='Add new item'
                        confirmLabel='Add'
                        onAction={(action) => saveNew(action)}>
                            <Form ref={form} fields={schema} />
                    </Dialog>
                ) : null}
            </Body>
        </div>
     );
}

DataFlow.propTypes= {
    schema: PropTypes.object.isRequired,
    initialData: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default DataFlow;