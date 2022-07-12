// import React from 'react';
// import PropTypes from 'prop-types';
// import { useState, useRef, useContext, useEffect, useCallback } from 'react';
// import clone from '../modules/clone';
// import './ExcelF.css';
// import Actions from './Actions';
// import Dialog from './Dialog';
// import Form from './Form';
// import Rating from './Rating';
// import classNames from 'classnames';

// //dataMangler is a help functin replacing reducer
// function dataMangler(data, action, payload) {
//     if (action === 'sort') {
//         const { column, descending } = payload;
//         return data.sort((a, b) => {
//             if (a[column] === b[column]) {
//                 return 0;
//             }
//             return descending
//                 ? a[column] < b[column]
//                     ? 1
//                     : -1
//                 : a[column] > b[column]
//                     ? 1
//                     : -1;
//         });
//     }
//     if (action === 'save') {
//         const { int, edit } = payload;
//         data[edit.row][edit.column] = int
//             ? parseInt(payload.value, 10)
//             : payload.value;
//     }
//     if (action === 'delete') {
//         data = clone(data);
//         data.splice(payload.rowidx, 1);
//     }
//     if (action === 'saveForm') {
//         Array.from(action.payload.form.current).forEach(
//             (input) => (data[payload.rowidx][input.id] = input.value),
//         )
//     };
//     return data;
// }

// function ExcelF({ filter }) {
//     const [data, updateData] = useContext(DataContext);
//     const [sorting, setSorting] = useState({
//         column: '',
//         descending: false,
//     });
//     const [edit, setEdit] = useState(null);
//     const [dialog, setDialog] = useState(null);
//     const form = useRef(null);

//     function sort(e) {
//         const column = e.target.dataset.id;
//         if (!column) {
//             return;
//         }
//         const descending = sorting.column === column && !sorting.descending;
//         setSorting({ column, descending });  //call setSorting() to update the state provided by useState() to draw the sorting arrows
//         const newData = dataMangler(data, 'sort', { column, descending }); //call the dataMangler() and then pass its return value to updateData()
//         updateData(newData);
//     }
//     //showEditor is called when the user double-clicks a cell and changes the state so an inline input field is shown.
//     //B/C this function is called for all clicks anywhere in the table (<tbody onDoubleClick={showEditor}>), you need
//     //to filter out cases where no inline form is desirable, namely, the rating and anywere in the action column. 
//     //showEditor is called when the user double-clicks a cell and changes the state so an inline input field is shown.
//     //Action columns don't have associated schema configuration, so !config takes care of this case.
//     //For all other cells, setEdit() is called, which updates the state identifying which cell is to be edited.
//     //since this is a rendering-only change, the reducer doesn't get involved and so no dispatch() is neccessary.
//     function showEditor(e) {
//         const config = e.target.dataset.schema;
//         if (!config || config === 'rating') {
//             return;
//         }
//         setEdit({
//             row: parseInt(e.target.parentNode.dataset.row, 10), //syntax parseInt(string, radix)
//             column: config,
//         });
//     }
//     //Save() is invoked when the user is done with inline editing and submits the inline form by hitting Enter(<form onSubmit={save}>)
//     //similarly to sort(), save() needs to know what happened(what was submitted) and then update the state(setEdit()) and dispatch() an event
//     //for the reducer to update the data.
//     function save(e) {
//         e.preventDefault();
//         setEdit(null);
//         const value = e.target.firstChild.value;
//         const valueType = schema[e.target.parentNode.dataset.schema].type;
//         updateData(
//             dataMangler(data, 'save', {
//                 edit,
//                 value,
//                 updateData,
//                 int: valueType === 'year' || valueType === 'rating',
//             }),
//         )
//     }


//     //HandleAction method deal with three types of actions: delete, edit, and view info.
//     //call the dataMangler() and then pass its return value to updateData().
//     function handleAction = useCallback(
//         (rowidx, type) => {
//             if (type === 'delete') {
//                 setDialog(
//                     <Dialog
//                         modal
//                         header="Confirm deletion"
//                         confirmLabel='Delete'
//                         onAction={(action) => {
//                             setDialog(null);
//                             if (action === 'confirm') {
//                                 updateData(
//                                     dataMangler(data, 'delete', {
//                                         rowidx,
//                                         updateData,
//                                     }),
//                                 );
//                             }
//                         }}>
//                         {`Are you sure you want to delete "${data[rowidx].name}"?`}
//                     </Dialog>,
//                 );
//             };

//             const isEdit = type === 'edit';
//             if (type === 'info' || isEdit) {
//                 const formPrefill = data[rowidx];
//                 setDialog(
//                     <Dialog
//                         modal
//                         extendedDismiss={!isEdit}
//                         header={isEdit ? 'Edit item' : 'Item details'}
//                         confirmLabel={isEdit ? 'Save' : 'ok'}
//                         hasCancel={isEdit}
//                         onAction={(action) => {
//                             setDialog(null);
//                             if (isEdit && action === 'confirm') {
//                                 updateData(
//                                     dataMangler(data, 'saveForm', {
//                                         rowidx,
//                                         form,
//                                         updateData,
//                                     })
//                                 );
//                             }
//                         }}>
//                         <Form
//                             ref={form}
//                             fields={schema}
//                             initialData={formPrefill}
//                             readonly={!isEdit}
//                         />
//                     </Dialog>,
//                 );
//             }
//         },
//         [data, updateData],
//     );

//     // useEffect(() => {
//     //     if (route.edit !== null && route.edit < data.length) {
//     //         handleAction(route.edit, 'edit');
//     //     } else if (route.info !== null && route.info < data.length) {
//     //         handleAction(route.info, 'info');
//     //     }
//     // }, [route, handleAction, data]);

//     return (
//         <div className='ExcelF'> {
//             <table>
//                 <thead onClick={sort}>
//                     <tr>
//                         {Object.keys(schema).map((key) => {
//                             let { label, show } = schema[key];
//                             if (!show) {
//                                 return null;
//                             }
//                             if (sorting.column === key) {
//                                 label += sorting.descending ? '\u2191' : ' \u2193';
//                             }
//                             return (
//                                 <th key={key} data-id={key}>
//                                     {label}
//                                 </th>
//                             )
//                         })}
//                         <th className='ExcelNotSortable'>Actions</th>
//                     </tr>
//                 </thead>
//                 <tbody onDoubleClick={showEditor}>
//                     {data.map((row, rowidx) => {
//                         if (filter) {
//                             const needle = filter.toLowerCase();
//                             let match = false;
//                             const fields = Object.keys(schema);
//                             for (let f = 0; f < fields.length; f++) {
//                                 if (row[fields[f]].toString().toLowerCase().includes(needle)) {
//                                     match = true;
//                                 }
//                             }
//                             if (!match) {
//                                 return null;
//                             }
//                         }

//                         return (
//                             <tr key={rowidx} data-row={rowidx}>
//                                 {Object.keys(row).map((cell, columnidx) => {
//                                     const config = schema[cell];
//                                     if (!config.show) {      //here is the tweaking of content: you have a boolean show config coming from the schema. It's helpful when you have too many columns to show in a single table.
//                                         return null;    //the comments for each item in the table may be too long and make the table hard to parse by the user. So it's not shown in the table, though
//                                     }           //it is still available in the View Details action and editable via the Edit action. 
//                                     let content = row[cell];
//                                     //here is the filtering of the data as a result of the user's search string.Going through each column in a row and attempting to match with the search string passed as a filter prop.
//                                     if (edit && edit.row === rowidx && edit.column === cell) {  //if no match is found, the whole row is removed from the table. 
//                                         content = (
//                                             <form onSumit={save}>
//                                                 <input type="text" defaultValue={content} />
//                                             </form>
//                                         )
//                                     } else if (config.type === 'rating') {
//                                         content = (
//                                             <Rating
//                                                 id={cell}
//                                                 readonly
//                                                 key={content}
//                                                 defaultValue={Number(content)}
//                                             />
//                                         )
//                                     };

//                                     return (
//                                         <td
//                                             key={columnidx}
//                                             data-schema={cell}
//                                             className={classNames({
//                                                 [`schema-${cell}`]: true,
//                                                 ExcelEditable: config.type !== 'rating',
//                                                 ExcelDataLeft: config.align === 'left',
//                                                 ExcelDataRight: config.align === 'right',
//                                                 ExcelDataCenter: config.align !== 'left' && config.align !== 'right',
//                                             })}>
//                                             {content}
//                                         </td>
//                                     );
//                                 })}
//                                 <td>
//                                     <Actions onAction={handleAction.bind(null, rowidx)} />
//                                 </td>
//                             </tr>
//                         );
//                     })}
//                 </tbody>
//             </table>
//             {dialog}
//         </div>
//     )
// };

// ExcelF.propTypes = {
//     filter: PropTypes.string,
// };


// export default ExcelF;

import {useState, useRef, useContext, useEffect, useCallback} from 'react';

import PropTypes from 'prop-types';
import classNames from 'classnames';
import clone from '../modules/clone';
import schema from '../config/schema';
import DataContext from '../contexts/DataContext';
import RouteContext from '../contexts/RouteContext';

import './ExcelF.css';
import Actions from './Actions';
import Dialog from './Dialog';
import Form from './Form';
import Rating from './Rating';

function dataMangler(data, action, payload) {
  if (action === 'sort') {
    const {column, descending} = payload;
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
  if (action === 'save') {
    const {int, edit} = payload;
    data[edit.row][edit.column] = int
      ? parseInt(payload.value, 10)
      : payload.value;
  }
  if (action === 'delete') {
    data = clone(data);
    data.splice(payload.rowidx, 1);
  }
  if (action === 'saveForm') {
    Array.from(payload.form.current).forEach(
      (input) => (data[payload.rowidx][input.id] = input.value),
    );
  }
  return data;
}

function ExcelF({filter}) {
  const {data, updateData} = useContext(DataContext); //when Excel tries to use the context, it gets the default data and updateData() as defined in createContext();
  const {route, updateRoute} = useContext(RouteContext);
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
    setSorting({column, descending});
    const newData = dataMangler(data, 'sort', {column, descending});
    updateData(newData);
  }

  function showEditor(e) {
    const config = e.target.dataset.schema;
    if (!config || config === 'rating') {
      return;
    }
    setEdit({
      row: parseInt(e.target.parentNode.dataset.row, 10),
      column: config,
    });
  }

  function save(e) {
    e.preventDefault();
    setEdit(null);
    const value = e.target.firstChild.value;
    const valueType = schema[e.target.parentNode.dataset.schema].type;
    updateData(
      dataMangler(data, 'save', {
        edit,
        value,
        updateData,
        int: valueType === 'year' || valueType === 'rating',
      }),
    );
  }
  // this handleAction() helper responsible for opening and closing dialogs as well as for the content of the dialogs.
  //this helper can be used for the purposes of routing as long as it's invoked with the corrent arguments. This is also
  //responsible for reading the routing info and creating the correct dialog. It is also for updating the URL on user actions.
  //do it by adding updateRoute() inside Dialog to clean up the URL.
  //w/ the help of useEffect(), this helper can be called when the data table renders and the result is opening a 
  //dialog whenever the URL is /edit/[ID] or /info/[ID]
  //useCallback: Since handleAction() is an inline function inside ExcelF(), this means every time ExcelF() is invoked
  //to rerender, a new handleAction() is created.The useCallback() hook memorizes a cb function with its dependencies.
  //so if a new handleAction() is created on a rerender of Excel, but its dependencies have not changed, then there's no
  //need for useEffect() to see a new dependency. The old memorized handleAction should do the trick. Wrapping the 
  //handleAction with a useCallback() should look somewhat familiar to useEffect() where the pattern is: first argument
  //is a function, the second is an array of dependencies. const handleAction = useCallback((rowidx, type) => {//...}, [data, updateData, updateRoute],)
  const handleAction = useCallback(       
    (rowidx, type) => {
      if (type === 'delete') {
        setDialog(
          <Dialog
            modal
            header="Confirm deletion"
            confirmLabel="Delete"
            onAction={(action) => {
              setDialog(null);
              if (action === 'confirm') {
                updateData(
                  dataMangler(data, 'delete', {
                    rowidx,
                    updateData,
                  }),
                );
              }
            }}>
            {`Are you sure you want to delete "${data[rowidx].name}"?`}
          </Dialog>,
        );
      }
      const isEdit = type === 'edit';
      if (type === 'info' || isEdit) {
        const formPrefill = data[rowidx];
        updateRoute(type, rowidx); //makes the URL e.g., /edit/3
        setDialog(
          <Dialog
            modal
            extendedDismiss={!isEdit}
            header={isEdit ? 'Edit item' : 'Item details'}
            confirmLabel={isEdit ? 'Save' : 'ok'}
            hasCancel={isEdit}
            onAction={(action) => {
              setDialog(null);
              updateRoute();
              if (isEdit && action === 'confirm') {
                updateData(
                  dataMangler(data, 'saveForm', {
                    rowidx,
                    form,
                    updateData,
                  }),
                );
              }
            }}>
            <Form
              ref={form}
              fields={schema}
              initialData={formPrefill}
              readonly={!isEdit}
            />
          </Dialog>,
        );
      }
    }, [data, updateData, updateRoute],
  );

  //Check for data.length to prevent opening the dialog with IDs that are out of range (e.g., cannot edit ID 5 when
  //only 3 records exist). 
  useEffect(() => {
    if (route.edit !== null && route.edit < data.length) {
      handleAction(route.edit, 'edit');
    } else if (route.info !== null && route.info < data.length) {
      handleAction(route.info, 'info');
    }
  }, [route, handleAction, data]);

  return (
    <div className="ExcelF">
      <table>
        <thead onClick={sort}>
          <tr>
            {Object.keys(schema).map((key) => {
              let {label, show} = schema[key];
              if (!show) {
                return null;
              }
              if (sorting.column === key) {
                label += sorting.descending ? ' \u2191' : ' \u2193';
              }
              return (
                <th key={key} data-id={key}>
                  {label}
                </th>
              );
            })}
            <th className="ExcelNotSortable">Actions</th>
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
                  if (!config.show) {
                    return null;
                  }
                  let content = row[cell];
                  if (edit && edit.row === rowidx && edit.column === cell) {
                    content = (
                      <form onSubmit={save}>
                        <input type="text" defaultValue={content} />
                      </form>
                    );
                  } else if (config.type === 'rating') {
                    content = (
                      <Rating
                        id={cell}
                        readonly
                        key={content}
                        defaultValue={Number(content)}
                      />
                    );
                  }

                  return (
                    <td
                      key={columnidx}
                      data-schema={cell}
                      className={classNames({
                        [`schema-${cell}`]: true,
                        ExcelEditable: config.type !== 'rating',
                        ExcelDataLeft: config.align === 'left',
                        ExcelDataRight: config.align === 'right',
                        ExcelDataCenter:
                          config.align !== 'left' && config.align !== 'right',
                      })}>
                      {content}
                    </td>
                  );
                })}
                <td>
                  <Actions onAction={handleAction.bind(null, rowidx)} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {dialog}
    </div>
  );
}

ExcelF.propTypes = {
  filter: PropTypes.string,
};
export default ExcelF;