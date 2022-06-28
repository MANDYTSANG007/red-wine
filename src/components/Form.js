import { forwardRef } from 'react';
import PropTypes from 'prop-types';
import Rating from './Rating';
import FormInput from './FormInput';
import './Form.css';

const Form = forwardRef(({ fields, initialData = {}, readonly = false }, ref) => { //Ref(short for reference) allows you to 
    return (    //access the underlying DOM element from React. It's not recommended to overuse this where you can rely on React.
        //but in this case we want to allow code outside the form to do a generic loop over form inputs and collect the form data.and there's a bit of chain(or parents/children) to get there.
        <form className='Form' ref={ref}>
            {Object.keys(fields).map((id) => {
                const prefilled = initialData[id];
                const { label, type, options } = fields[id];
                if (readonly) {
                    if (!prefilled) {
                        return null;
                    }
                    return (
                        <div className='FormRow' key={id}>
                            <span className='FormLabel'>{label}</span>
                            {type === 'rating' ? (
                                <Rating
                                    readonly={true}
                                    defaultValue={parseInt(prefilled, 10)}
                                />
                            ) : (
                                <div> {prefilled}</div>
                            )}
                        </div>
                    )
                };
                return (
                    <div className='FormRow' key={id}>
                        <label className='FormLabel' htmlFor={id}>
                            {label}
                        </label>
                        <FormInput
                            id={id}
                            type={type}
                            options={options}
                            defaultValue={prefilled}
                        />
                    </div>
                )
            })}
        </form>
    )
});

Form.propTypes = {
    fields: PropTypes.objectOf( //objectOf refers to the component expects a fields prop that is an object. And for every key-value pair in fields, the value is expected to be another object that has label, type and options properties.
        PropTypes.shape({       //PropTypes.shape in the prop types lets you be specific in what you expect in a map/object.
            label: PropTypes.string.isRequired,
            type: PropTypes.oneOf(['textarea', 'input', 'year', 'suggest', 'rating']),
            options: PropTypes.arrayOf(PropTypes.string),   //arrayOf lets you define that you expect an array containing certain types of data.
        }),
    ).isRequired,
    initialData: PropTypes.object,
    readonly: PropTypes.bool,
};

export default Form;