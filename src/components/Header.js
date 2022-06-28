import Logo from './Logo';
import './Header.css';
import Button from './Button';
import FormInput from './FormInput';

// the header doesn't do any searching or adding to the data, but it offers callbacks for its
//parent to do the data management
function Header({ onSearch, onAdd, count = 0 }) {
    const placeholder = count > 1 ? `Search ${count} items` : 'Search';
    return (
        <div className='Header'>
            <Logo />
            <div>
                <FormInput placeholder={placeholder} id="search" onChange={onSearch} />
            </div>
            <div>
                <Button onClick={onAdd}> <b>&#65291;</b> Add wine </Button>
            </div>
        </div>
    )
};

export default Header;