//create a schema object to add a description of the type of data we want to deal with in the app

import classification from './classification';

const schema = {
    name: {
        label: 'Name',
        show: true,
        samples: ['Riesling', 'Pinot Grigio', 'Pinot Noir'],
        align: 'left',
    },
    year: {
        label: 'Year',
        type: 'year',
        show: true,
        samples: [2015, 2013, 2021],
    },
    grape: {
        label: 'Grape',
        type: 'suggest',
        options: classification.grapes,
        show: true,
        samples: ['Merlot', 'Bordeaux Blend', 'Zinfandel'],
        align: 'left',
    },
    rating: {
        label: 'Rating',
        type: 'rating',
        show: true,
        samples: [3,1,5],
    },
    comments: {
        label: 'Comments',
        type: 'textarea',
        samples: ['Nice for the price', 'Great wine!', 'Will try this again.'],
    },
};

export default schema;