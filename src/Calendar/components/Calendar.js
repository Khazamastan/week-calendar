import React from 'react';
import PropTypes from 'prop-types';
import { AppointmentCell, Row, Cell, HeaderCell, TimeCell } from './Cells';
import moment from 'moment'
import Modal from "./Modal"
/* Helpers */
const padLeft = (number, padding) => (
  padding.substring(number.toString().length) + number
);

const toTimeString = (hours, minutes) => (
  `${padLeft(hours, '00')}:${padLeft(minutes, '00')}`
);

const startOfWeek = (date) => {
  const clone = new Date(date.valueOf());
  debugger;
  const day = date.getDay();
  const diff = (date.getDate() - day) + (day === 0 ? -6 : 1);
  clone.setDate(diff);
  return clone;
};

const addDays = (date, days) => {
  const clone = new Date(date);
  clone.setDate(clone.getDate() + days);
  return clone;
};

/* PropTypes */
const appointmentPropType = PropTypes.shape({
  event: PropTypes.string.isRequired,
  reservationStart: PropTypes.string.isRequired,
  reservationEnd: PropTypes.string.isRequired,
  blockSpan: PropTypes.number
});

const appointmentsPropType = PropTypes.arrayOf(appointmentPropType);

class Calendar extends React.Component {
  state = {};
  constructor(props) {
    super(props);
    this.state = {
      currentDate : moment("2018-5-10"),
      showModal : false,
      event : { 
        event: 'Reservation', 
        reservationStart: '00:00',
        reservationEnd: '00:00'
      },
      timeBlocks : {}
    }
    this.showModal = this.showModal.bind(this)
  }
  gotToNextWeek = () => {
    this.setState({
      currentDate : moment(this.state.currentDate).add(7, 'days')
    }, () => {
      this.normalizeTimeBlocks(this.props.appointments);
    })
  }
  gotToPrevWeek = () => {
    this.setState({
      currentDate : moment(this.state.currentDate).subtract(7, 'days')
    }, () =>{
      this.normalizeTimeBlocks(this.props.appointments);
  })
  }
  componentWillReceiveProps(nextProps) {
      this.normalizeTimeBlocks(nextProps.appointments);
  }
  componentDidMount(){
    this.normalizeTimeBlocks(this.props.appointments);
  }
  normalizeTimeBlocks = (appointments) => {
    const blockSize = 30;
    const timeBlocks = {};
    const eventBlocks = {};
    const startDate = this.state.currentDate;
    const dates = [0,1,2,3,4,5,6].map((e,i) => moment(startDate).add(e, 'days'))
    const weekdays = [
      "sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"
    ]
    console.log("====== =========");
    dates.map((day) => {
      const dayTime = day.valueOf();
      console.log(dayTime)
      appointments[dayTime] && appointments[dayTime].forEach((appointment) => {
        const startTime = appointment.reservationStart;
        const endTime = appointment.reservationEnd;
        let blockSpan = 0;

        if (startTime === '00:00' && endTime === '00:00') {
          blockSpan = Math.ceil((24 * 60) / blockSize);
        } else {
          const startSplit = startTime.split(':');
          let hour = parseInt(startSplit[0], 10);
          let minutes = parseInt(startSplit[1], 10);
          let timeString = appointment.startTime;

          while (timeString !== appointment.reservationEnd) {
            blockSpan += 1;
            minutes += blockSize;

            if (minutes >= 60) {
              minutes = 0;
              hour += 1;
            }

            timeString = toTimeString(hour, minutes);
          }
        }

        eventBlocks[startTime] = eventBlocks[startTime] || {};
        eventBlocks[startTime][dayTime] = Object.assign({}, appointment, {
          blockSpan
        });
      })
    });

    for (let hour = 0; hour < 24; hour += 1) {
      for (let minutes = 0; minutes < 60; minutes += blockSize) {
        const timeString = toTimeString(hour, minutes);

        timeBlocks[timeString] = eventBlocks[timeString] || {};
      }
    }

    this.setState({timeBlocks})
  };
  hideModal = function(){
    this.setState({showModal : false});
  }
  showModal(startTime, date){
    var endTime = startTime.split(':');
    const hours = endTime[0];
    var addedHours = (parseInt(hours)+1) > 23 ? 23 : (parseInt(hours)+1);
    var formattedNumber = ("0" + addedHours).slice(-2);
    endTime = startTime.replace((hours + ":" ), ( formattedNumber+ ":"));
    this.setState({
      showModal : true,
      event : { 
        event: 'Reservation', 
        date : date,
        reservationStart: startTime,
        reservationEnd: endTime
      }
      
    })
  }
  addAppointment = (event) => {
    this.props.addAppointment(event)
  }
  render() {
    const rows = [];
    const startDate = this.state.currentDate;
    const dates = [0,1,2,3,4,5,6].map((e,i) => moment(startDate).add(e, 'days'))

    Object.keys(this.state.timeBlocks).map((time) => {
      const block = this.state.timeBlocks[time];

      return rows.push(
        <Row key={time}>
          <TimeCell className="calendar__cell--time-col">{time}</TimeCell>
          <AppointmentCell className="calendar__cell--time-spacing" />
          {
            dates.map((date) => {
              const dayTime = date.valueOf();
              return (
              <AppointmentCell
                date={dayTime}
                deleteAppointment={this.props.deleteAppointment}
                showModal={this.showModal}
                key={dayTime}
                time={time}
                appointment={block[dayTime]} 
              />
            )
            })
          }
        </Row>
      );
    });

    const weekStart = startOfWeek(new Date(startDate.valueOf()));

    return (
      <div className="calendar">
        <a className="nav-arrow" onClick={this.gotToPrevWeek}>{"Prev Week"}</a>
        <a className="nav-arrow" onClick={this.gotToNextWeek}>{"Next Week"}</a>
        <span className="pull-right month-year">{moment(weekStart).format('MMM YYYY')}</span>
        <Row>
          <HeaderCell className="calendar__cell--time-col" />
          <Cell className="calendar__cell--time-spacing" />
          <HeaderCell day={weekStart} />
          <HeaderCell day={addDays(weekStart, 1)} />
          <HeaderCell day={addDays(weekStart, 2)} />
          <HeaderCell day={addDays(weekStart, 3)} />
          <HeaderCell day={addDays(weekStart, 4)} />
          <HeaderCell day={addDays(weekStart, 5)} />
          <HeaderCell day={addDays(weekStart, 6)} />
        </Row>

        <div className="calendar__body">
          {rows}
          <Row className="calendar__row--deco-last-row">
            <TimeCell className="calendar__cell--time-col">00:00</TimeCell>
            <AppointmentCell />
          </Row>

        </div>
        <Modal
         modalIsOpen={this.state.showModal}
         hideModal={this.hideModal.bind(this)}
         event={this.state.event}
         addAppointment={this.addAppointment}
        />
      </div>
    );
  }
}

export default Calendar;
