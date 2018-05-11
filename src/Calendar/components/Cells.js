import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Appointment from './Appointment';

const DAYS_OF_WEEK = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday',
  'Thursday', 'Friday', 'Saturday'
];

export const Row = (props) => (
  <div {...props} className={cx('calendar__row', props.className && props.className)} />
);

export const Cell = (props) => (
  <div {...props} className={cx('calendar__cell', props.className && props.className)} />
);

export const HeaderCell = (props) => {
  const { day } = props;
  const isToday = day && day.toDateString() === new Date().toDateString();

  return (
    <Cell
      {...props}
      className={cx('calendar__cell--day-of-week', props.className && props.className,
        isToday && 'calendar__cell--day-of-week--today')}
    >
      {day &&
        <div className="calendar__cell--day-of-week__day">
          {DAYS_OF_WEEK[day.getDay()]}
        </div>
      }
      {day &&
        <div className="calendar__cell--day-of-week__date">
          {day.getDate()}
        </div>
      }
    </Cell>
  );
};

export const TimeCell = (props) => (
  <Cell {...props} className={cx('calendar__cell--time', props.className && props.className)} />
);

export const AppointmentCell = (props) => {
  const openModal = () => {
    debugger;
    console.log(props);
    props.showModal(props.time, props.date)
  }
  const { appointment } = props;
  let appointmentComponent = null;

  if (appointment) {
    const { blockSpan } = appointment;
    const height = `${100 * blockSpan}%`;
    const borderPixels = `${blockSpan + 1}px`;
    const cssHeight = `calc(${height} + ${borderPixels})`;

    appointmentComponent = (
      <Appointment style={{ height: cssHeight }} appointment={appointment} deleteAppointment={props.deleteAppointment} />
    );
  }
 
  return (
    <Cell onClick={openModal} {...props} className={cx('calendar__cell--appointment', props.className && props.className)}>
      {appointmentComponent}
    </Cell>
  );
};

/* PropTypes */
const appointmentPropType = PropTypes.shape({
  event: PropTypes.string.isRequired,
  reservationStart: PropTypes.string.isRequired,
  reservationEnd: PropTypes.string.isRequired,
  blockSpan: PropTypes.number
});

AppointmentCell.propTypes = {
  appointment: appointmentPropType,
  className: PropTypes.string
};

AppointmentCell.defaultProps = {
  appointment: null,
  className: ''
};

HeaderCell.propTypes = {
  day: PropTypes.instanceOf(Date),
  className: PropTypes.string
};

HeaderCell.defaultProps = {
  day: null,
  className: ''
};

const propTypes = {
  className: PropTypes.string
};

const defaultProps = {
  className: ''
};

Row.propTypes = propTypes;
Row.defaultProps = defaultProps;
Cell.propTypes = propTypes;
Cell.defaultProps = defaultProps;
TimeCell.propTypes = propTypes;
TimeCell.defaultProps = defaultProps;
