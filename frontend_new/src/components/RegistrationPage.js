import React from 'react';
import { NavLink } from 'react-router-dom';

class RegistrationPage extends React.Component {
    // Страница регистрации пользователя

    constructor(props) {
        super(props)
        this.state = {
            'email': '', 
            'password': '', 
            'password2': '', 
            'firstName': '', 
            'lastName': '', 
            'phoneNumber': ''
        }
    }

    // Функция валидации адреса электронной почты
    validateEmail = (email) => {
        return /^[a-zA-Z0-9-_\.]+@[a-zA-Z0-9-_]+\.[a-zA-Z0-9-_]+$/.test(email);
    }

    // Функция валидации пароля
    validatePassword = (password) => {
        return password.search(/^\d+$/) == -1 && password.length >= 8;
    }

    // Функция валидации подтверждения пароля
    validatePassword2 = (password) => {
        return password == this.state.password && this.validatePassword(password);
    }

    // Функция валидации номера телефона
    validatePhoneNumber = (number) => {
        return /^[0-9\+]+$/.test(number);
    }

    // Функция разрешающая вводить в поле номера телефона только цифры и +
    keyDownPhoneNumber = (e) => {
        let symbol = String.fromCharCode(e.keyCode);
        let regEx = /[0-9]/
        if(!regEx.test(symbol) && ![8, 9, 13, 27].includes(e.keyCode) && !(e.keyCode == 187 && e.shiftKey)) {
            e.preventDefault();
        }
    }

    // Функция валидации любого поля ввода
    validateInput = (name, value) => {
        let validators = {
            'email': this.validateEmail,
            'password': this.validatePassword,
            'password2': this.validatePassword2,
            'phoneNumber': this.validatePhoneNumber
        }

        let el = document.getElementsByName(name)[0];
        if((Object.keys(validators).includes(name) && !validators[name](value)) || (!Object.keys(validators).includes(name) && value == '')) {
            el.classList.add('wrong');
            return false;
        } else {
            el.classList.remove('wrong');
            return true;
        }
    }

    // Функция обработчик ввода данных в поле
    handleChange = (event) => {
        this.validateInput(event.target.name, event.target.value);
        this.setState({[event.target.name]: event.target.value});
    }

    // Функция обработчик отправки формы
    handleSubmit = (event) => {

        event.preventDefault();
        let validated = true;

        for(let field of Object.keys(this.state)) {
            if(!this.validateInput(field, this.state[field])) {
                validated = false;
            }
        }

        if(validated) {
            this.props.register(this.state);
        }
    }

    render() {
        return (
            <div className='form-content'>
                <div className='form-title'>Регистрация</div>
                <form onSubmit={(event)=> this.handleSubmit(event)} className='form-block'>
                    <div className='form-fields'>
                        <div className='form-field-block'>
                            <span className='form-label'>Имя *</span>
                            <input type='text' name='firstName' value={this.state.firstName} onChange={(event)=>this.handleChange(event)} className='form-input' />
                        </div>
                        <div className='form-field-block'>
                            <span className='form-label'>Фамилия *</span>
                            <input type='text' name='lastName' value={this.state.lastName} onChange={(event)=>this.handleChange(event)} className='form-input' />
                        </div>
                    </div>
                    <div className='form-fields'>
                        <div className='form-field-block'>
                            <span className='form-label'>Номер телефона *</span>
                            <input type='text' name='phoneNumber' value={this.state.phoneNumber} onKeyDown={(event) => this.keyDownPhoneNumber(event)} onInput={(event)=>this.handleChange(event)} className='form-input' />
                        </div>
                        <div className='form-field-block'>
                            <span className='form-label'>Адрес электронной почты *</span>
                            <input type='text' name='email' value={this.state.email} onChange={(event)=>this.handleChange(event)} className='form-input' />
                        </div>
                    </div>
                    <div className='form-fields'>
                        <div className='form-field-block'>
                            <span className='form-label'>Пароль *</span>
                            <input type='password' name='password' value={this.state.password} onChange={(event)=>this.handleChange(event)} className='form-input' />
                        </div>
                        <div className='form-field-block'>
                            <span className='form-label'>Подтверждение пароля *</span>
                            <input type='password' name='password2' value={this.state.password2} onChange={(event)=>this.handleChange(event)} className='form-input' />
                        </div>
                    </div>
                    <div className='form-field-block' style={{paddingTop: '20px'}}>
                        <input type='submit' value='Зарегистрироваться' className='form-button' />
                        <NavLink to='/login' className='form-link'>Войти</NavLink>
                    </div>
                </form>
            </div>
        )
    }
}

export default RegistrationPage;