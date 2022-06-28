import classNames from 'classnames';    //use classnames module
import PropTypes from 'prop-types';
import './Button.css';

const Button = (props) =>       //use a function express syntax  
    props.href ? (
        <a {...props} className={classNames('Button', props.className)}>
            {props.children}
        </a>
    ) : (
        <button {...props} className={classNames('Button', props.className)} />
    ); //...props uses here: whatever properties were passed to Button, carry them over to the underlying HTML element

Button.propTypes = {
    href: PropTypes.string,
};

export default Button;

//use classnames module helps with the common task of having your component use its own classes
//but is also flexible enough to allow customiztion via class names passed by the parents. 