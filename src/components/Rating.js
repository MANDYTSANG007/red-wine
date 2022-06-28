import classNames from 'classnames';
import {useState} from 'react';
import PropTypes from 'prop-types';
import './Rating.css';

function Rating({ id, defaultValue = 0, max = 5, readonly = false}) {
    const [rating, setRating] = useState(defaultValue);     //set initial state
    const [tempRating, setTempRating] = useState(defaultValue); //set current value of stars

    //set up a loop to make stars between 1 and props.max. When the RatingOn style is not applied, the 
    // rating emoji become grey with the help fo a CSS filter.
    //when the user moves the mouse over the component, the tempRating state is getting updated, which 
    //changes the RatingOn class name. 
    //when the user clicks the real ratign state is getting updated,
    //which also updates the hidden input. Leaving teh component (on mouse out) abandons the tempRating,
    //making it the same as the rating.
    const stars = [];
    for (let i = 1; i<= max; i++) {
        stars.push(
            <span
                className={i <= tempRating ? 'RatingOn' : null}
                key={i}
                onClick={() => (readonly ? null : setRating(i))}
                onMouseOver={() => (readonly ? null : setTempRating(i))}>
                &#128516;
            </span>
        )
    }
    return (
        <span
            className={classNames({
                Rating: true,
                RatingReadonly: readonly,
            })}
            onMouseOut={() => setTempRating(rating)}>
                {stars}
                <input id={id} type="hidden" value={rating} />
            </span>
    )
};

Rating.propTypes ={
    defaultValue: PropTypes.number,
    readonly: PropTypes.bool,   //readonly makes the widget read-only.
    max: PropTypes.number,      //max. number of stars
};

export default Rating;