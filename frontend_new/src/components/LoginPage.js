import React from 'react';
import { NavLink } from 'react-router-dom';

class LoginPage extends React.Component {
    // Блок страницы авторизации

    constructor(props) {
        super(props)
        this.state = {'login': '', 'password': ''}
    }

    // Функция обработчик ввода данных в поле формы
    handleChange = (event) => {
        this.setState({[event.target.name]: event.target.value});
    }

    // Функция обработчик отправки формы
    handleSubmit = (event) => {
        this.props.login(this.state.login, this.state.password);
        event.preventDefault();
    }

    render() {
        return (
            <div className='form-content'>
                <div className='form-title'>Авторизация</div>
                <form onSubmit={(event)=> this.handleSubmit(event)} className='form-block'>
                    <div className='form-fields'>
                        <div className='form-field-block'>
                            <span className='form-label'>Адрес электронной почты *</span>
                            <input type='text' name='login' value={this.state.login} onChange={(event)=>this.handleChange(event)} className='form-input' />
                        </div>
                        <div className='form-field-block'>
                            <span className='form-label'>Пароль *</span>
                            <input type='password' name='password' value={this.state.password} onChange={(event)=>this.handleChange(event)} className='form-input' />
                        </div>
                    </div>
                    <input type='submit' value='Войти' className='form-button' />
                </form>
                <NavLink to='/registration' className='form-link'>Зарегистрироваться</NavLink>
            </div>
        )
    }
}

export default LoginPage;