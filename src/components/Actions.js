import PropTypes from 'prop-types';
import './Actions.css';
import deleteImage from './../images/closed.png';
import editImage from './../images/edit.png';
import Button from './Button';

//The actions are implemented as buttons. The component takes a callback function as its onAction prop. When
//the user clicks a button, the callback is invoked, passing a string identifying which button was clicked:
//'info', 'edit', or 'delete'. This is a simple pattern for a child to inform its parent of a change within the
//component.
const Actions = ({onAction = () => {}}) => ( 
    <span className='Actions'>               
        <Button 
            className='ActionsInfo'
            title='More info'
            onClick={() => onAction('info')}>
                View Details
        </Button>
        <Button
            title='Edit'
            onClick={() => onAction('edit')}>
                <img src={editImage} alt='Edit' />
        </Button>
        <Button
            tabIndex='0'
            title='Delete'
            onClick={onAction.bind(null, 'delete')}>
                <img src={deleteImage} alt='Delete' />
        </Button>
    </span>
);

Actions.propTypes = {
    onAction: PropTypes.func,
};

export default Actions;