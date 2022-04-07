import {Modal, Button, InputGroup, FormControl} from "react-bootstrap";
import { useState, useContext, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../../context";
import Accordion from 'react-bootstrap/Accordion'
import ModInfo from "../../ModInfo/ModInfo";

interface ModalProps {
    text: string;
    variant: "primary" | "secondary" | "danger";
    isSignupFlow: boolean;
    pId: string;
}

interface Patient {
  _id: string;
  lastName: string;
  firstName: string;
  middleName: string;
  email: string;
  birthdate: Date;
  nationality: string;
  race: string;
  gender: string;
  maritalStatus: string;
}

const ErrorMessage = styled.p`
color: red;
`;

const PersonalInfo = ({ text, variant, isSignupFlow, pId }: ModalProps) => {
//const PersonalInfo = ({ text, variant, isSignupFlow }: ModalProps) => {
    const [show, setShow] = useState(false)

    const [patientId, setPatientId] = useState("");
    
    //const [patientInfo, setPatientInfo] = useState<Patient[]>([]);
    const [patientInfo, setPatientInfo] = useState<Patient>();

    const [lastName, setLastName] = useState("");
    const [firstName, setFirstName] = useState("");
    const [middleName, setMiddleName] = useState("");
    
    const [birthdate, setBirthDate] = useState("");
    const [nationality, setNationality] = useState("");
    const [race, setRace] = useState("");
    const [gender, setGender] = useState("");
    const [maritalStatus, setMaritalStatus] = useState("");

    const [errorMsg, setErrorMsg] = useState("");
  
    const handleClose = () => setShow(false);
    const handleShow = () =>{
      
      if (patientInfo){
        console.log("setting props...")
        setLastName(patientInfo.lastName)
        setFirstName(patientInfo.firstName)
        setMiddleName(patientInfo.middleName)
        setNationality(patientInfo.nationality)
        setRace(patientInfo.race)
        setGender(patientInfo.gender)
        setMaritalStatus(patientInfo.maritalStatus)
      }
      setShow(true);
    } 

    const navigate = useNavigate();
  
    //const [state, setState] = useContext(UserContext);
    
    useEffect(() => {
      fetchPatientInfo();
    }, []);  

    const fetchPatientInfo = async () => {  
      //"https://berg-consult.herokuapp.com/test/patientInfoB",
      //"http://localhost:8080/isotest/patientInfoB",
      const { data: response } = await axios.post(
        "https://berg-consult.herokuapp.com/test/patientInfoB",
        { "id": pId } 
      );
      setPatientInfo(response);
      console.log("start")
      console.log(patientInfo)
      console.log("end")
    };
    

    const handleClick = async () => {
        let response;
        //"https://berg-consult.herokuapp.com/test/upatient",
        //"http://localhost:8080/test/upatient",
        const { data: signUpData } = await axios.put(
          "https://berg-consult.herokuapp.com/test/upatient",
          {
            "_id": pId,
            lastName,
            firstName,
            middleName,
            birthdate,
            nationality,
            race,
            gender,
            maritalStatus,
          }
        );
        response = signUpData;
    
        if (response.errors.length) {
          return setErrorMsg(response.errors[0].msg);
        }

        //only redirect if needed
        //navigate("/articles");
        //instead close modal
        //setPatientId(response.data.user.id)//sets the patient ID for possible update/delete
        //handleClose()//when setPatientId above is added, close is not triggered
        setShow(false);
    };

    const handleDelete = async () => {
      alert("delete " + pId);
      //axios.delete(`http://localhost:8080/test/dpatient/${pId}`);
      let response;
      //`https://berg-consult.herokuapp.com/test/dpatient/${pId}`
      //"http://localhost:8080/test/dpatient/${pId}}",    
      const { data: signUpData } = await axios.delete(
        `https://berg-consult.herokuapp.com/test/dpatient/${pId}}`,
      );
      response = signUpData;
  
      if (response.errors.length) {
        return setErrorMsg(response.errors[0].msg);
      }
      console.log(response)      
      setShow(false);
  };


    const updatePatient = (id:string) => {
      //  axios.put(
      //   "http://localhost:8080/test/upatient",
      //   { id,
      //     lastName,
      //     firstName,
      //     middleName,
      //     birthdate,
      //     nationality,
      //     race,
      //     gender,
      //     maritalStatus
      //   }
      // );
    };
  


    return (
    <> 
      
      {patientInfo ? (

      <Accordion defaultActiveKey="0">
      <Accordion.Item eventKey="0">
        <Accordion.Header>PERSONAL INFORMATION</Accordion.Header>
        <Accordion.Body>
          <div>Last Name: {patientInfo.lastName}</div>
          <div>First Name: {patientInfo.firstName}</div>
          <div>Middle Name: {patientInfo.middleName}</div>
          <div>Birthdate: somedateval</div>
          <div>Age: computed val</div>
          <div>Nationality: {patientInfo.nationality}</div>
          <div>Race: {patientInfo.race}</div>
          <div>Gender: {patientInfo.gender}</div>
          <div>Status: {patientInfo.maritalStatus}</div>
          <div>Patient ID:</div>
          <div>P ID: {pId}</div>
          <Button onClick={handleShow}>Edit Personal Info</Button>
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="1">
        <Accordion.Header>CONTACT DETAILS</Accordion.Header>
        <Accordion.Body>
          <div>Address1: street</div>
          <div>Address2: street</div>
          <div>City: Manila</div>
          <div>Province: Metro Manila</div>
          <div>Country: Philippines</div>
          <div>Postal Code: zip</div>
          <div>Email: email</div>
          <div>Phone: number</div>
          <div>Mobile: cellphone</div>
        <Button onClick={handleShow}>Edit Contact Details</Button>
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="2">
        <Accordion.Header>HEALTH INFO/VITALS</Accordion.Header>
        <Accordion.Body>   
          <div>Info will come from previous session but can be replaced by current session</div>
          <div>Height: feet inches | cm-metric</div>
          <div>Weight: lbs | kg-metric</div>
          <div>Pulse: rate</div>
          <div>Temperature: F | C (auto convert)</div>
          <Button onClick={handleShow}>New Session/Checkup</Button>
        </Accordion.Body>
      </Accordion.Item>
      </Accordion>  
      ) : (
        <div>
        <span>You don't have access yet</span>
        </div>
      )}

      {/* <ModInfo mprops={patientInfo} /> */}
      
      <Modal show={show} onHide={handleClose}>
      <Modal.Header>
        <Modal.Title>PATIENT PERSONAL INFO</Modal.Title>
      </Modal.Header>

      {patientInfo ? (
      <Modal.Body>
        <InputGroup className="mb-3">
          <InputGroup.Text>Last Name</InputGroup.Text>
          <FormControl
            type="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </InputGroup>
        <InputGroup className="mb-3">
          <InputGroup.Text>First Name</InputGroup.Text>
          <FormControl
            type="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </InputGroup>
        <InputGroup className="mb-3">
          <InputGroup.Text>Middle Name</InputGroup.Text>
          <FormControl
            type="middleName"
            value={middleName}
            onChange={(e) => setMiddleName(e.target.value)}
          />
        </InputGroup>
        <InputGroup className="mb-3">
            <InputGroup.Text>Nationality</InputGroup.Text>
            <FormControl 
              type="nationality"
              value={nationality} 
              onChange={(e) => setNationality(e.target.value)}
              />        
        </InputGroup>
        <InputGroup className="mb-3">
            <InputGroup.Text>Race</InputGroup.Text>
            <FormControl 
              type="race"
              value={race} 
              onChange={(e) => setRace(e.target.value)}
              />        
        </InputGroup>
        <InputGroup className="mb-3">
            <InputGroup.Text>Gender</InputGroup.Text>
            <FormControl 
              type="gender"
              value={gender} 
              onChange={(e) => setGender(e.target.value)}
              />        
        </InputGroup>
        <InputGroup className="mb-3">
            <InputGroup.Text>Marital Status</InputGroup.Text>
            <FormControl 
              type="maritalStatus"
              value={maritalStatus} 
              onChange={(e) => setMaritalStatus(e.target.value)}
              />
        </InputGroup>
        {errorMsg && <ErrorMessage>{errorMsg}</ErrorMessage>}
      </Modal.Body>
      ) : (
        <Modal.Body>
        <InputGroup className="mb-3">
          <InputGroup.Text>Last Name</InputGroup.Text>
          <FormControl
            type="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </InputGroup>
        <InputGroup className="mb-3">
          <InputGroup.Text>First Name</InputGroup.Text>
          <FormControl
            type="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </InputGroup>
        </Modal.Body>
      )}

      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleClick}>
          Save Patient
        </Button>
        <Button variant="primary" onClick={handleDelete}>
          Delete Patient
        </Button>
      </Modal.Footer>
      </Modal> 

    </>
    )
}

export default PersonalInfo