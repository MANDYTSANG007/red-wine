import React from 'react';
import PropTypes from 'prop-types';
import { useState, useReducer, useRef } from 'react';
import clone from '../modules/clone';
// import classNames from 'classnames';
import './ExcelF.css';
import Actions from './Actions';
import Dialog from './Dialog';
import Form from './Form';
import Rating from './Rating';
import classNames from 'classnames';

//The reducer is called with the current data and some payload describing what happened and what it does on that info.
//the delete action is the only one doing the cloning of the original array. 
function reducer(data, action) {
    if (action.type === 'sort') {
        const { column, descending } = action.payload;
        return data.sort((a, b) => {
            if (a[column] === b[column]) {
                return 0;
            }
            return descending
                ? a[column] < b[column]
                    ? 1
                    : -1
                : a[column] > b[column]
                    ? 1
                    : -1;
        });
    }
    if (action.type === 'save') {
        const { int, edit } = action.payload;
        data[edit.row][edit.column] = int
            ? parseInt(action.payload.value, 10)
            : action.payload.value;
    }
    if (action.type === 'delete') {
        data = clone(data);
        data.splice(action.payload.rowidx, 1);
    }
    if (action.type === 'saveForm') {
        Array.from(action.payload.form.current).forEach(
            (input) => (data[action.payload.rowidx][input.id] = input.value),
        )
    }
    //here uses a reducer() for various data manipulations. Here invokes the onDataChange cb passed to the component.
    //That's how parents of ExcelF can be notified about data changes. Payload is the key value pairs in your actions and passed
    //around between reducers in your app.
    setTimeout(() => action.payload.onDataChange(data)); // this is a workaround and will fix this later
    return data;
}

function ExcelF({ schema, initialData, onDataChange, filter }) {
    const [data, dispatch] = useReducer(reducer, initialData);
    const [sorting, setSorting] = useState({
        column: '',
        descending: false,
    });
    const [edit, setEdit] = useState(null);
    const [dialog, setDialog] = useState(null);
    const form = useRef(null);

    function sort(e) {
        const column = e.target.dataset.id;
        if (!column) {
            return;
        }
        const descending = sorting.column === column && !sorting.descending;
        setSorting({ column, descending });  //call setSorting() to update the state provided by useState() to draw the sorting arrows
        dispatch({ type: 'sort', payload: { column, descending } });//and then dispatch() an event to be handled by the reducer. The reducer's task is to do the actual sorting.
    }
    //showEditor is called when the user double-clicks a cell and changes the state so an inline input field is shown.
    //B/C this function is called for all clicks anywhere in the table (<tbody onDoubleClick={showEditor}>), you need
    //to filter out cases where no inline form is desirable, namely, the rating and anywere in the action column. 
    //showEditor is called when the user double-clicks a cell and changes the state so an inline input field is shown.
    //Action columns don't have associated schema configuration, so !config takes care of this case.
    //For all other cells, setEdit() is called, which updates the state identifying which cell is to be edited.
    //since this is a rendering-only change, the reducer doesn't get involved and so no dispatch() is neccessary.
    function showEditor(e) {
        const config = e.target.dataset.schema;
        if (!config || config === 'rating') {
            return;
        }
        setEdit({
            row: parseInt(e.target.parentNode.dataset.row, 10), //syntax parseInt(string, radix)
            column: config,
        });
    }
    //Save() is invoked when the user is done with inline editing and submits the inline form by hitting Enter(<form onSubmit={save}>)
    //similarly to sort(), save() needs to know what happened(what was submitted) and then update the state(setEdit()) and dispatch() an event
    //for the reducer to update the data.
    function save(e) {
        e.preventDefault();
        const value = e.target.firstChild.value;
        const valueType = schema[e.target.parentNode.dataset.schema].type;
        dispatch({
            type: 'save',
            payload: {
                edit,
                value,
                onDataChange,
                int: valueType === 'year' || valueType === 'rating',
            },
        });
        setEdit(null);
    }

    //HandleAction method deal with three types of actions: delete, edit, and view info.
    function handleAction(rowidx, type) {
        if (type === 'delete') {
            setDialog(
                <Dialog
                    modal
                    header="Confirm deletion"
                    confirmLabel='Delete'
                    onAction={(action) => {
                        setDialog(null);
                        if (action === 'confirm') {
                            dispatch({
                                type: 'delete',
                                payload: {
                                    rowidx,
                                    onDataChange,
                                },
                            });
                        }
                    }}>
                    {`Are you sure you want to delete "${data[rowidx].name}"?`}
                </Dialog>
            )
        };

        const isEdit = type === 'edit';
        if (type === 'info' || isEdit) {
            const formPrefill = data[rowidx];
            setDialog(
                <Dialog
                    modal
                    extendedDismiss={!isEdit}
                    header={isEdit ? 'Edit item' : 'Item details'}
                    confirmLabel={isEdit ? 'Save' : 'ok'}
                    hasCancel={isEdit}
                    onAction={(action) => {
                        setDialog(null);
                        if (isEdit && action === 'confirm') {
                            dispatch({
                                type: 'saveForm',
                                payload: {
                                    rowidx,
                                    onDataChange,
                                    form,
                                }
                            });
                        }
                    }}>
                    <Form
                        ref={form}
                        fields={schema}
                        initialData={formPrefill}
                        readonly={!isEdit}
                    />
                </Dialog>
            );
        }
    }

    return (
        <div className='ExcelF'> {
            <table>
                <thead onClick={sort}>
                    <tr>
                        {Object.keys(schema).map((key) => {
                            let { label, show } = schema[key];
                            if (!show) {
                                return null;
                            }
                            if (sorting.column === key) {
                                label += sorting.descending ? '\u2191' : ' \u2193';
                            }
                            return (
                                <th key={key} data-id={key}>
                                    {label}
                                </th>
                            )
                        })}
                        <th className='ExcelNotSortable'>Actions</th>
                    </tr>
                </thead>
                <tbody onDoubleClick={showEditor}>
                    {data.map((row, rowidx) => {
                        if (filter) {
                            const needle = filter.toLowerCase();
                            let match = false;
                            const fields = Object.keys(schema);
                            for (let f = 0; f < fields.length; f++) {
                                if (row[fields[f]].toString().toLowerCase().includes(needle)) {
                                    match = true;
                                }
                            }
                            if (!match) {
                                return null;
                            }
                        }

                        return (
                            <tr key={rowidx} data-row={rowidx}>
                                {Object.keys(row).map((cell, columnidx) => {
                                    const config = schema[cell];
                                    if (!config.show) {      //here is the tweaking of content: you have a boolean show config coming from the schema. It's helpful when you have too many columns to show in a single table.
                                        return null;    //the comments for each item in the table may be too long and make the table hard to parse by the user. So it's not shown in the table, though
                                    }           //it is still available in the View Details action and editable via the Edit action. 
                                    let content = row[cell];
                                                //here is the filtering of the data as a result of the user's search string.Going through each column in a row and attempting to match with the search string passed as a filter prop.
                                    if (edit && edit.row === rowidx && edit.column === cell) {  //if no match is found, the whole row is removed from the table. 
                                        content = (
                                            <form onSumit={save}>
                                                <input type="text" defaultValue={content} />
                                            </form>
                                        )
                                    } else if (config.type === 'rating') {
                                        content = (
                                            <Rating
                                                id={cell}
                                                readonly
                                                key={content}
                                                defaultValue={Number(content)}
                                            />
                                        )
                                    };

                                    return (
                                        <td
                                            key={columnidx}
                                            data-schema={cell}
                                            className={classNames({
                                                [`schema-${cell}`]: true,
                                                ExcelEditable: config.type !== 'rating',
                                                ExcelDataLeft: config.align === 'left',
                                                ExcelDataRight: config.align === 'right',
                                                ExcelDataCenter: config.align !== 'left' && config.align !== 'right',
                                            })}>
                                            {content}
                                        </td>
                                    )
                                })}
                                <td>
                                    <Actions onAction={handleAction.bind(null, rowidx)} />
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        }{dialog}
        </div>
    )
}

ExcelF.propTypes = {
    schema: PropTypes.object,
    initialData: PropTypes.arrayOf(PropTypes.object),
    onDataChange: PropTypes.func,
    filter: PropTypes.string,
};


export default ExcelF;