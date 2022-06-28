import Logo from './Logo';
import './Header.css';
import {useContext, useState, useRef} from 'react';

import Button from './Button';
import FormInput from './FormInput';
import Dialog from './Dialog';
import Form from './Form';
import schema from '../config/schema';

import DataContext from '../contexts/DataContext';

// this header is responsible for the UI, the Form in a Dialog to add new records. That's why the list of imports is 
//a little longer. The pieces of data needed to render the header are:  1) data coming from the context
//2) addNew flag whether or not the Add dialog is shown(when the user clicks the Add button)
//we use useContext() hook to get access to the value prop passed by the <DataContext.Provider>. It's an object
//that has a data property and a functin updateData().
//the header can access all of the data and get the count from (data.length). 
//The helper functions here: onAdd() and saveNew(). The job of saveNew() is to gather the new record from the
//form and add it to data. 
// 
function Header({ onSearch }) {
    const {data, updateData} = useContext(DataContext);
    const count = data.length;

    const [addNew, setAddNew] = useState(false);

    const form = useRef(null);

    function saveNew(action) {
        setAddNew(false);
        if (action === 'dismiss') {
            return;
        }

        const formData = {};
        Array.from(form.current).forEach(
            (input) => (formData[input.id] = input.value),
        );
        data.unshift(formData);
        updateData(data);
    }
    
    function onAdd() {
        setAddNew(true);
    }

    const placeholder = count > 1 ? `Search ${count} items` : 'Search';
    return (
        <div>
            <div className='Header'>
                <Logo />
                <div>
                    <FormInput placeholder={placeholder} id="search" onChange={onSearch} />
                </div>
                <div>
                    <Button onClick={onAdd}> <b>&#65291;</b> Add wine </Button>
                </div>
            </div>
            {addNew ? (
                <Dialog
                    modal={true}
                    header="Add new item"
                    confirmLabel="Add"
                    onAction={( action ) => saveNew(action)}>
                        <Form ref={form} fields={schema} />
                </Dialog>
            ) : null }
        </div>
    )
}

export default Header;