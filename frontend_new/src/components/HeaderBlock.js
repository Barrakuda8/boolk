import {NavLink} from 'react-router-dom';

const HeaderBlock = ({isAuthenticated, logout}) => {
    // Блок хэдера
    return (
        <div className='header'>
            <div className='header-content container'>
                <NavLink to='/'>
                    <img src='/logo.png' alt='boolk' className='logo'/>
                </NavLink>
                <div className='header-menu'>
                    <NavLink to='/apartments' className='header-menu-link'>Каталог квартир</NavLink>
                    {isAuthenticated ? <NavLink to='/reservations' className='header-menu-link'>Ваши брони</NavLink> : ''}
                </div>
                {isAuthenticated ? <span onClick={logout} className='header-login'>Выйти</span> : <NavLink to='/login' className='header-login'>Войти</NavLink>}
            </div>
        </div>
    )
}

export default HeaderBlock;