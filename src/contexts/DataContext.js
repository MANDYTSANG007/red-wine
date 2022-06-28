//context provides a way to pass data through the ocmponent tree w/o having to pass props down manually at every level.
//https://reactjs.org/docs/context.html
import React from 'react';

//takes in a default value -can have any value stored in a context, but a common pattern is to have an obj w/ two 
//properties: 1) a piece of data 2)a function that can update the data.
const DataContext = React.createContext({
    data: [],
    updateData: () => {},
});

export default DataContext;
