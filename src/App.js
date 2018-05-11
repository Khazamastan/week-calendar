import React, { Component } from 'react';
import Calendar from './Calendar/components/CalendarView';

import './App.css';

class App extends Component {
  render() {
    return (
      <div id="calendar">
        <Calendar />
      </div>
    );
  }
}

export default App;
