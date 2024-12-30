import './App.css';
import React from 'react';
import {BrowserRouter, Navigate, Route, Routes} from 'react-router-dom';
import axios from 'axios';
import Cookies from 'universal-cookie';
import HeaderBlock from './components/HeaderBlock';
import FooterBlock from './components/FooterBlock';
import ApartmentsPage from './components/ApartmentsPage';
import ApartmentPage from './components/ApartmentPage';
import ReservationsPage from './components/ReservationsPage';
import LoginPage from './components/LoginPage';
import RegistrationPage from './components/RegistrationPage';
import NotFound404 from './components/NotFound404';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      'apartments': [],
      'reservations': [],
      'residential_complex': [],
      'currentComplex': 'all',
      'currentRooms': '',
      'name': '',
      'token': ''
    }
  }

  getHostAddress = () => {
    // Функция, возвращающая адреса хоста в зависимости от того, разработка это или продакшн
    let hostAddress;

    if (window.location.origin === "http://localhost:4000") {
        hostAddress = "http://127.0.0.1:8000";
    } else {
        hostAddress = window.location.origin + ':8443';
    }
    return hostAddress
  }

  setToken = (token) => {
    // Функция, устанавливающая/меняющаяя в куки токен для повторной авторизации 
    const cookies = new Cookies();
    cookies.set('token', token);
    this.setState({'token': token});
  }

  isAuthenticated = () => {
    // Функция, возвращающая авторизован ли пользователь
    return this.state.token != '';
  }

  logout = () => {
    // Функция для выхода пользователя из системы
    this.setToken('');
  }

  getTokenFromStorage = () => {
    // Функция, получающая из куки токен для входа
    const cookies = new Cookies();
    const token = cookies.get('token');
    if(token != undefined) {
      this.setState({'token': token}, () => {
        this.loadData('reservations');
      });
    }
    this.loadData('residential_complex');
    this.loadData('apartments');
  }

  getHeaders = () => {
    let headers = {
        'Content-Type': 'application/json'
    }
    if (this.isAuthenticated()) {
        headers['Authorization'] = 'Token ' + this.state.token;
    }
    return headers;
}

  login = (username, password) => {
    // Функция, выполняющая вход в систему путём обращения к бэкенду
    axios.post(this.getHostAddress() + '/api-token-auth/', {username: username, password: password})
    .then((response) => {
      this.setToken(response.data['token'])})
    .catch(error => alert('Неверный логин или пароль'));
  }

  register = (params) => {
    // Функция, выполняющая регистрацию пользователя в системе путём обращения к бэкенду

    let user = {
      'first_name': params['firstName'],
      'last_name': params['lastName'],
      'username': params['email'],
      'email': params['email'],
      'password': params['password'],
      'phone_number': params['phoneNumber'],
    }
 
    axios.post(this.getHostAddress() + '/api/users/', user, {
      'Content-Type': 'application/json'
    })
    .then((response) => {
      document.getElementsByClassName('header-login')[0].click();
    })
    .catch(error => alert('Этот адрес электронной почты уже занят'));
  }

  loadData = (type) => {
    // Функция, загружающая из бэкенда информация о переданном типе сущностей
    let headers = this.getHeaders();
    let hostAddress = this.getHostAddress();
    axios.get(hostAddress + `/api/${type}/`, {headers})
    .then(response => {
        let obj = {};
        obj[type] = response.data;
        this.setState(obj);
    }).catch(error => console.log(error));
  }

  componentDidMount() {
    // Функция, срабатывающая при загрузке страницы. Загружает данные о необходимых сущностях и устанавливает куки для корзины, если их нет
    this.getTokenFromStorage();
  }

  createReservation = (apartment, dates, offset) => {
    const headers = this.getHeaders();

    const data = {apartment: apartment, dates: dates, offset: offset}
    let hostAddress = this.getHostAddress();
    axios.post(hostAddress + '/api/reservations/', data, {headers})
    .then(response => {
        this.loadData('apartments');
        this.loadData('reservations');
        window.location.replace(window.location.origin + '/reservations');
    }).catch((error) => {
        console.log(error)
        this.setState({"reservations": []})
    })
  }

  filterApartments = (complex, rooms) => {
    const headers = this.getHeaders();
    let hostAddress = this.getHostAddress();
    let filtersArr = [];
    this.setState({
      'currentComplex': complex,
      'currentRooms': rooms
    })
    if(complex != 'all') {
      filtersArr.push(`residential_complex=${complex}`);
    }
    if(rooms != '') {
      filtersArr.push(`rooms=${rooms}`);
    }
    let filters = filtersArr.length > 0 ? `?${filtersArr.join('&')}` : '';
    axios.get(hostAddress + `/api/apartments/${filters}`, {headers})
    .then(response => {
        this.setState({'apartments': response.data});
    }).catch(error => console.log(error));
  }

  render () {
    return (
        <BrowserRouter>
            <div className='wrapper'>
              <div className='header-and-content'>
                <HeaderBlock isAuthenticated={this.isAuthenticated()} logout={this.logout} />
                <div className='container'>
                  <Routes>
                      <Route exact path={'/'} element={<Navigate to='/apartments' />} />
                      <Route path={'/apartments'}>
                        <Route index element={<ApartmentsPage apartments={this.state.apartments} residential_complex={this.state.residential_complex} 
                        filterApartments={(complex, rooms) => this.filterApartments(complex, rooms)} currentComplex={this.state.currentComplex} 
                        currentRooms={this.state.currentRooms} />} />
                        <Route path={':id'} element={<ApartmentPage apartments={this.state.apartments} isAuthenticated={this.isAuthenticated()} 
                        createReservation={(apartment, date, offset) => this.createReservation(apartment, date, offset)} />} />
                      </Route>
                      <Route exact path={'/reservations'} element={<ReservationsPage reservations={this.state.reservations}/>} />
                      <Route exact path={'/login'} element={this.isAuthenticated() ? 
                                                            <Navigate to='/apartments' /> : 
                                                            <LoginPage login={(username, password) => this.login(username, password)} />} />
                      <Route exact path={'/registration'} element={<RegistrationPage register={(params) => this.register(params)}/>} />
                      <Route path={'*'} element={<NotFound404 />} />
                  </Routes>
                </div>
              </div>
              <FooterBlock/>
            </div>
        </BrowserRouter>
    )
}
}

export default App;
