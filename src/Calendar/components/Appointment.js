import React from 'react';
import PropTypes from 'prop-types';

const Appointment = (props) => {
  const { appointment } = props;
  const wholeDay = appointment.reservationStart === '00:00' &&
  appointment.reservationEnd === '00:00';
  const deleteAppointment = (e) =>{
    e.preventDefault();
    e.stopPropagation();
    props.deleteAppointment(props.appointment.date, props.appointment.id);
  }
  const time = wholeDay ?
  'All Day' : `${appointment.reservationStart} - ${appointment.reservationEnd}`;

  return (
    <div {...props} className="calendar__appointment">
      <a onClick={deleteAppointment}>✖</a>
      <div className="calendar__appointment__time">
        {time}
      </div>
      <div className="calendar__appointment__name">
        {appointment.event}
      </div>
    </div>
  );
};

/* PropTypes */
const appointmentPropType = PropTypes.shape({
  event: PropTypes.string.isRequired,
  reservationStart: PropTypes.string.isRequired,
  reservationEnd: PropTypes.string.isRequired,
  blockSpan: PropTypes.number
});

Appointment.propTypes = {
  appointment: appointmentPropType
};

Appointment.defaultProps = {
  appointment: {}
};

export default Appointment;
