import { useState } from 'react';
import {NavLink, useParams} from 'react-router-dom';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const ImageBlock = ({src}) => {
    // Блок миниатюрного изображения под главным

    // Функция, делающее изображение главным при нажатии
    const onClick = () => {
        document.getElementsByClassName('apartment-img')[0].src = src;
    }

    return (
        <img src={src} alt='image' className='apartment-mini-img' onClick={onClick}/>
    )
}

const AmenityBlock = ({amenity}) => {
    // Блок удобства

    return (
        <div className='apartment-amenity'>
            <img src={amenity.icon}/>
            <span>{amenity.name}</span>
        </div>
    )
}

const ApartmentBlock = ({apartment, isAuthenticated, createReservation}) => {
    // Блок страницы квартиры

    let reservations = apartment.reservations.map((x) => new Date(x['date']));

    let [startDate, setStartDate] = useState(new Date());
    let [endDate, setEndDate] = useState(new Date());

    const onChange = (dates) => {
        const [start, end] = dates;
        setStartDate(start);
        setEndDate(end);
        let diff = (end - start) / (1000 * 3600 * 24);
        let blocked = false;
        for(let i = 0; i <= diff; i++) {
            let date = new Date(start);
            date.setDate(date.getDate() + i);
            for(let reservation of reservations) {
                if(reservation.getDate() == date.getDate()) {
                   blocked = true;
                   break;
                }
            }
        }
        let button = document.getElementsByClassName('apartment-reserve');
        if(button.length > 0) {
            if(blocked) {
                button[0].classList.add('blocked');
            } else {
                button[0].classList.remove('blocked');
            }
        }
    }

    const onMonthChange = (current) => {
        if(current == undefined) {
            current = startDate;
        }
        for(let reservation of reservations) {
            if(reservation.getMonth() == current.getMonth()) {
                let date = reservation.getDate();
                document.getElementsByClassName(`react-datepicker__day--0${date < 10 ? '0' + date : date}`)[0].classList.add('reserved');
            }
        }
    }

    const reserve = () => {
        if(startDate && endDate) {
            createReservation(apartment.id, [startDate, endDate], startDate.getTimezoneOffset());
        }
    }

    let image = apartment.images.length > 0 ? apartment.images.sort((a, b) => b.main - a.main)[0]['image'] : '/no-image.jpg';
    let amenities = apartment.amenities.length > 0 ? 'apartment-amenities' : 'apartment-amenities-none';
    return (
        <div className='apartment-block'>
            <div className='apartment-left'>
                <div className='apartment-img-block'>
                    <img src={image} alt='image' className='apartment-img'/>
                </div>
                <div className='apartment-mini-imgs'>
                    {apartment.images.sort((a, b) => b.main - a.main).map((image, i) => <ImageBlock src={image.image} key={i} />)}
                </div>
            </div>
            <div className='apartment-right'>
            <span className='apartment-address'>{apartment.building.residential_complex.name}, {apartment.building.address}, {apartment.number}</span>
                <div className='apartment-characteristics'>
                    <span className='apartment-characteristic'>{apartment.rooms} комнаты</span>
                    <div className='footer-point'></div>
                    <span className='apartment-characteristic'>{apartment.area} м²</span>
                </div>
                <div className={amenities}>
                    {apartment.amenities.map((amenity, i) => <AmenityBlock amenity={amenity} key={i} />)}
                </div>
                <div className='apartment-reservation-block'>
                    <span className='apartment-price'>{apartment.price} лей <span>за сутки</span></span>
                    <DatePicker 
                    selected={startDate} 
                    minDate={new Date()}
                    onChange={onChange} 
                    selectsRange 
                    startDate={startDate} 
                    endDate={endDate} 
                    dateFormat={"dd.MM.YYYY"}
                    onMonthChange={onMonthChange}
                    onCalendarOpen={onMonthChange} />
                    {isAuthenticated ? <span className='apartment-reserve' onClick={(e) => reserve(e)}>Забронировать</span> : <NavLink className='apartment-login' to='/login'>Пожалуйста, войдите, чтобы забронировать</NavLink>}
                </div>
            </div>
        </div>
    )
} 

const ApartmentPage = ({apartments, isAuthenticated, createReservation}) => {
    let {id} = useParams();
    id = parseInt(id);
    let apartment = undefined;
    for(let i of apartments) {
        if(i.id == id) {
            apartment = {...i};
        }
    }

    let block = apartment != undefined ? <ApartmentBlock apartment={apartment} isAuthenticated={isAuthenticated} createReservation={createReservation}/> : <div>Такой квартиры не существует :с</div>
    
    return (
        <div>{block}</div>
    )
}

export default ApartmentPage;