import { useState } from 'react';
import { NavLink } from 'react-router-dom';

const ResidentialComplexLine = ({residential_complex}) => {
    return (
        <option value={residential_complex.id}>{residential_complex.name}</option>
    )
}

const ApartmentBlock = ({apartment}) => {
    // Блок одной квартиры
    let image = apartment.images.length > 0 ? apartment.images.sort((a, b) => b.main - a.main)[0]['image'] : '/no-image.jpg';

    return (
        <NavLink to={'/apartments/' + apartment.id} className='apartments-apartment'>
            <div className='apartments-image' style={{ backgroundImage: `url(${image})` }}></div>
            <span className='apartments-apartment-complex'>{apartment.building.residential_complex.name}</span>
            <span className='apartments-apartment-address'>{apartment.building.address}</span>
            <span className='apartments-apartment-rooms'>{apartment.rooms} комнаты</span>
            <span className='apartments-apartment-price'>{apartment.price} лей <span>за сутки</span></span>
        </NavLink>
    )
}

const ApartmentsPage = ({apartments, residential_complex, filterApartments, currentComplex, currentRooms}) => {
    // Блок страницы списка квартир

    let [complexFilter, setComplexFilter] = useState(currentComplex);
    let [roomsFilter, setRoomsFilter] = useState(currentRooms);

    const onChangeComplex = (e) => {
        setComplexFilter(e.target.value);
        filterApartments(e.target.value, roomsFilter);
    }

    const onChangeRooms = (e) => {
        let newRooms = e.target.value;
        if(newRooms <= 0) {
            newRooms = '';
            e.target.value = '';
        }
        setRoomsFilter(newRooms);
        filterApartments(complexFilter, newRooms);
    }

    return (
        <div>
            <div className='apartments-filters'>
                <div className='apartments-filter'>
                    <span className='apartments-filter-label'>Жилой Комплекс</span>
                    <select className='apartments-select' onChange={onChangeComplex} defaultValue={currentComplex}>
                        <option value='all'>Все</option>
                        {residential_complex.map((complex) => <ResidentialComplexLine residential_complex={complex} key={complex.id} />)}
                    </select>
                </div>
                <div className='apartments-filter'>
                    <span className='apartments-filter-label'>Количество комнат</span>
                    <input type='number' className='apartment-input' onChange={onChangeRooms} value={currentRooms} />
                </div>
            </div>
            <div className='apartments-apartments'>
                {apartments.map((apartment) => <ApartmentBlock apartment={apartment} key={apartment.id} />)}
            </div>
        </div>
    )
}

export default ApartmentsPage;