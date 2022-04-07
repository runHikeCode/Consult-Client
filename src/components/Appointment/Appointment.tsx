import {Modal, Button, InputGroup, FormControl} from "react-bootstrap";
import { useState } from "react";
import axios from "axios";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context";
import DateTimePicker from 'react-datetime-picker'
import { CalendarPlus } from 'react-bootstrap-icons';

interface ModalProps {
    text: string;
    variant: "primary" | "secondary" | "danger";
    isSignupFlow: boolean;
}

const ErrorMessage = styled.p`
color: red;
`;

const Appointment = ({ text, variant, isSignupFlow }: ModalProps) => {
  
    const [show, setShow] = useState(false)
    
    const [patient, setPatient] = useState("");  
    const [startDateValue, onChangeStart] = useState(new Date());
    const [endDateValue, onChangeEnd] = useState(new Date());
    const [therapist, setTherapist] = useState("");
    const [note, setNote] = useState("");

    const [errorMsg, setErrorMsg] = useState("");
    
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const navigate = useNavigate();
  

    const handleClick = async () => {
        let response;
        //"https://berg-consult.herokuapp.com/session/cschedule",
        //"http://localhost:8080/session/cschedule",
        if (isSignupFlow) {
          const { data: signUpData } = await axios.post(
            "https://berg-consult.herokuapp.com/session/cschedule",
            {
              "title" : patient,
              "startDateTime" : startDateValue,
              "endDateTime" : endDateValue,
              "patientName" : patient,
              "therapistName" : therapist,
              "notes" : note,
              "createdBy" : "test",
              "modifiedBy" : "test",
            }
          );
          response = signUpData;
        } else {
          //"https://berg-consult.herokuapp.com/session/cschedule",
          //"http://localhost:8080/session/cschedule",
          const { data: loginData } = await axios.post(
            "https://berg-consult.herokuapp.com/session/cschedule",
            {
              "title" : patient,
              "startDateTime" : startDateValue,
              "endDateTime" : endDateValue,
              "patientName" : patient,
              "therapistName" : therapist,
              "notes" : note,
              "createdBy" : "test",
              "modifiedBy" : "test",
            }
          );
          response = loginData;
        }
    
        if (response.errors.length) {
          return setErrorMsg(response.errors[0].msg);
        }

        //localStorage.setItem("token", response.data.token);
        //axios.defaults.headers.common["authorization"] = `Bearer ${response.data.token}`;

        //TODO:close the modal
        //handleClose();
        //setShow(false)
        
        alert("appointment saved successfully")
    };

    return (
    <> 
        {/* <Button onClick={handleShow}>{text}</Button> */}
        <Button title="Add Appointment" onClick={handleShow}>
          <CalendarPlus/>
        </Button>
        
        <Modal show={show} onHide={handleClose}>
        <Modal.Header>
          <Modal.Title>{text}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <InputGroup className="mb-3">
            <InputGroup.Text>Patient Name</InputGroup.Text>
            <FormControl
              type="patient"
              value={patient}
              onChange={(e) => setPatient(e.target.value)}
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text>Start Date Time</InputGroup.Text>
            {/* <DateTimePicker value={startDate} onChange={(e) => setStartDate(e.target.value)} ></DateTimePicker> */}
            {/* <DateTimePicker></DateTimePicker> */}
            <DateTimePicker value={startDateValue} onChange={onChangeStart} ></DateTimePicker>
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text>End Date Time</InputGroup.Text>
            <DateTimePicker value={endDateValue} onChange={onChangeEnd} ></DateTimePicker> 
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text>Therapist</InputGroup.Text>
            <FormControl
              type="therapist"
              value={therapist}
              onChange={(e) => setTherapist(e.target.value)}
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text>Note</InputGroup.Text>
            <FormControl
              type="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </InputGroup>
          {errorMsg && <ErrorMessage>{errorMsg}</ErrorMessage>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClick}>
            {text}
          </Button>
        </Modal.Footer>
        </Modal>
    </>
    )
}

export default Appointment