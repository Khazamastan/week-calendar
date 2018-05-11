import React from 'react';
import ReactDOM from 'react-dom';
import Modal from 'react-modal';

const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    padding               : '0px',
    zIndex                 : 99999,
    transform             : 'translate(-50%, -50%)'
  }
};

Modal.setAppElement('body')

export default class ModalComponent extends React.Component {
  constructor(props) {
    super();
    
    this.state = {
      modalIsOpen: props.modalIsOpen,
      event : props.event
    };

    this.afterOpenModal = this.afterOpenModal.bind(this);
  }

  openModal = (event) => {
    this.setState({modalIsOpen: true, event});
  }

  afterOpenModal = () => {
    // references are now sync'd and can be accessed.
    // this.subtitle.style.color = '#f00';
  }

  closeModal = () => {
    // this.props.closeModal();
    this.setState({modalIsOpen: false});
  }
  componentWillReceiveProps(nextProps){
    this.state.event= nextProps.event
    if(typeof nextProps.modalIsOpen != 'undefined')
        this.setState({modalIsOpen: nextProps.modalIsOpen, event: nextProps.event});
  }
  addAppointment = () => {
    this.props.addAppointment(this.props.event)
    this.props.hideModal();
  }
  onChangeName = (e) => {
    const value = e.target.value;
    var {event} = this.state;
    event.event = value;
    this.setState({event});
  }
  onChangeStart = (e) => {
    const value = e.target.value;
    var {event} = this.state;
    event.reservationStart = value;
    this.setState({event});
  }
  onChangeEnd = (e) => {
    const value = e.target.value;
    var {event} = this.state;
    event.reservationEnd = value;
    this.setState({event});
  }
  render() {
    return (
      <div>
        <Modal
          isOpen={this.state.modalIsOpen}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.closeModal}
          style={customStyles}
          contentLabel="Example Modal"
        >
        <div className="modal-content">
        <a onClick={this.closeModal}>&#10006;</a>
        <h1>Add Event ({this.state.event.reservationStart} - {this.state.event.reservationEnd}) </h1>
          <p className="item">
            <label>Name : </label>
            <input
              value={this.state.event.event}
              onChange={this.onChangeName} 
            />
            </p>
          <p className="item">
            <label>Start Time :  </label>
            <input  
              value={this.state.event.reservationStart}  
              onChange={this.onChangeStart} 
              type="time"
            />
          </p>
          <p className="item">
            <label>End Time : </label>
            <input
              value={this.state.event.reservationEnd}
              onChange={this.onChangeEnd}
              type="time"
            />
            </p>
          <p className="footer">
            <button onClick={this.addAppointment}>Save</button>
          </p>
          </div>
        </Modal>
      </div>
    );
  }
}
