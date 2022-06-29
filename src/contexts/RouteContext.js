import React from 'react';

// here is a familiar pattern: the context consists of a piece of data(route) and a way to update it( updateRoute )
const RouteContext = React.createContext({
    route: {
        add: false,  // route: /add
        edit: null, // route: /edit/1
        info: null, // route: /info/1
        filter: null, // route: /filter/merlot
    },
    updateRoute: () => {},
});

export default RouteContext;