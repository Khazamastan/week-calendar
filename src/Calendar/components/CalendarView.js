import React from 'react';
import Calendar from './Calendar';

const defaultAppointments = {
  // 1525890600000: [
  //   { event: 'Reservation', date :1525890600000,  id : 1525890600000, reservationStart: '08:00', reservationEnd: '09:00' },
  //   { event: 'Reservation', date :1525890600000,  id : 1525890600001, reservationStart: '08:30', reservationEnd: '11:00' },
  //   { event: 'Reservation', date :1525890600000,  id : 1525890600002, reservationStart: '18:00', reservationEnd: '18:30' }
  // ],
  // 1525977000000: [],
  // 1526063400000: [
  //   { event: 'Reservation', date : 1526063400000,  id : 1526063400000, reservationStart: '11:30', reservationEnd: '14:00' }
  // ],
  // 1526149800000: [
  //   { event: 'Reservation', date :1526149800000,  id : 1526149800000, reservationStart: '00:00', reservationEnd: '00:00' }
  // ],
  // 1526236200000: [],
  // 1526322600000: [],
  // 1526409000000: []
};
class CaldarView extends React.Component{
  constructor(props){
    super();
    const appointments = JSON.parse(localStorage.getItem('appointments'));
    this.state = {
      appointments : appointments || defaultAppointments,
    };
  }
  deleteAppointment(date, id){
    var appointments = this.state.appointments;
    var dayAppointments = appointments[date];
    dayAppointments = (dayAppointments || []).filter(function(obj) {
      return id  != obj.id;
    });
    appointments[date] = dayAppointments;
    this.setState({appointments}, function(){
      this.storeAppointments(this.state.appointments);
    });
  }
  addAppointment(event){
      event.id = new Date().getTime();
      var appointments = this.state.appointments;
      const { date } = event;
      const current = appointments[date]
      if(current){
        current.push(event);
      }else{
        appointments[date] = [];
        appointments[date].push(event);
      }
      this.setState({appointments}, function(){
        this.storeAppointments(this.state.appointments);
      })
  }
  storeAppointments(appointments){
    localStorage.setItem('appointments', JSON.stringify(appointments));
  }
  render(){
    return (
      <div style={{ width: '75%', margin: '0 auto' }}>
        <Calendar appointments={this.state.appointments} deleteAppointment={this.deleteAppointment.bind(this)} addAppointment={this.addAppointment.bind(this)} />
      </div>
    )
  }
}

export default CaldarView;
