import { NavLink } from 'react-router-dom';

const ReservationBlock = ({reservation}) => {
    // Блок одного бронирования

    return (
        <div className='reservations-reservation'>
            <span className='reservations-address'>{reservation.apartment.building.residential_complex.name}, 
                {reservation.apartment.building.address}, {reservation.apartment.number}</span>
            <div className='reservations-dates'>
                {reservation.apartment.rooms} комнаты, {reservation.start_date} - {reservation.end_date}
            </div>
        </div>
    )
}

const ReservationsPage = ({reservations}) => {
    // Блок страницы бронирований
    console.log(reservations)
    if(reservations.length > 0) {
        return (
            <div>
                <div>
                    {reservations.map((reservation) => <ReservationBlock reservation={reservation} key={reservation.id} />)}
                </div>
            </div>
        )
    } else {
        return (
            <span className='reservations-nothing'>У вас нет предстоящих бронирований.</span>
        )
    }
}

export default ReservationsPage;