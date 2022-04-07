import styled from "styled-components";
import { createContext, useEffect, useState, useRef } from "react";
import axios from "axios";
import { Container, InputGroup,  FormControl, Button} from "react-bootstrap";
import Table from 'react-bootstrap/Table'
import Calendar from 'react-calendar';
import { useNavigate, Link } from "react-router-dom";
import Appointment from "../../Appointment/Appointment";

import { PersonPlus } from 'react-bootstrap-icons';
import ModInfo from "../../ModInfo/ModInfo";

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

interface Session {
    _id: string;
    title:string;
    startDateTime: Date;
    endDateTime: Date;
    patientName: string;
    therapistName: string;
    notes: string;
    createdDateTime: Date;
    createdBy: string;
    modifiedDateTime: Date;
    modifiedBy: string;
  }
  
const CardsContainer = styled.div`
padding: 4rem 0;
display: flex;
`;

//width: 33%;
const Card = styled.div`
height: 25rem;
box-shadow: 0.1rem 0.1rem 1rem rgba(0, 0, 0, 0.2);
padding: 2rem;
border-radius: 2rem;
margin-right: 2rem;
`;


const Dashboard = () => {
  
  const navigate = useNavigate();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [appointments, setAppointments] = useState<Session[]>([]);

  const [search, setSearch] = useState("");
  const [searchEvent, setSearchEvent] = useState("");
  
  const [filterPatients, setFilterPatients] = useState<Patient[]>([]);
  const [filterAppointments, setFilterAppointments] = useState<Session[]>([]);
  
  const [value, setCalVal] = useState(new Date());
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    fetchPatients();
  }, []);

  useEffect(() => {
    fetchAppointments();
  }, [date]);
  
  const getFilterEvents =  (searchValue) => {
    setSearchEvent(searchValue)
    if (searchEvent !== '') {
        const filteredData = appointments.filter((item) => {
            return Object.values(item).join('').toLowerCase().includes(searchEvent.toLowerCase())
        })
        setFilterAppointments(filteredData)
    }
    else{
      setFilterAppointments(appointments)
    }
  };

  const getEventsOn =  (searchValue) => {
    setSearchEvent(searchValue)
    if (searchEvent !== '') {
        const filteredData = appointments.filter((item) => {
            return Object.values(item).join('').toLowerCase().includes(searchEvent.toLowerCase())
        })
        setFilterAppointments(filteredData)
    }
    else{
      setFilterAppointments(appointments)
    }
  };
  
  const getFilterPatients =  (searchValue) => {
    setSearch(searchValue)
    if (search !== '') {
        const filteredData = patients.filter((item) => {
            return Object.values(item).join('').toLowerCase().includes(search.toLowerCase())
        })
        setFilterPatients(filteredData)
    }
    else{
        setFilterPatients(patients)
    }
  };

  //"https://berg-consult.herokuapp.com/test/patient"
  //"http://localhost:8080/test/patient"
  const fetchPatients = async () => {
    const { data: response } = await axios.get(
      "https://berg-consult.herokuapp.com/test/patient"
    );
    setPatients(response);
    setFilterPatients(response)
  };


  const fetchAppointments = async () => {
    console.log("fetchAppointments : " + date)
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1)//ex.Mar 01
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 1)//ex.Apr 01
    //"https://berg-consult.herokuapp.com/session/schedule",
    //"http://localhost:8080/session/schedule",
    const { data: response } = await axios.post(
      "https://berg-consult.herokuapp.com/session/schedule",
      { "startDateTime": firstDay ,
      "endDateTime": lastDay } 
    );
    setAppointments(response);
    setFilterAppointments(response)
    //console.log("appointments - fetchAppointments")
    //console.log(response)
  };


  const setClass = (date) => {
    //console.log(date)
    const dateobj =
    appointments.find((x) => {
        return (
          date.getDay() === new Date(x.startDateTime).getDay() &&
          date.getMonth() === new Date(x.startDateTime).getMonth() &&
          date.getDate() === new Date(x.startDateTime).getDate()
        );
      });
    
    //dateobj ?  console.log("MATCH " + dateobj.colorName) : console.log("unmatch") ;
    //return dateobj ? dateobj.colorName : "";
    return dateobj ? "react-calendar__tile--hasActive" : "";
  }
  
  const convertDate = (str) => {
    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join("-");
  }

  const getDayEvent = (pdate) => {
    //alert('Clicked day: ' + pdate + " old date " + date)
    //TODO:filter top 5 events list from the selected date 
    if (date.getMonth() === pdate.getMonth())
    {
      console.log("same month")
      //setDate(pdate)
      setCalVal(pdate)
      getEventsOn(convertDate(pdate))//not exactly filtering out on first click
      //fetchAppointments()
    }else{
      console.log("diff month")
      setDate(pdate)
      getEventsOn('')
      //setCalVal(pdate)
      //fetchAppointments()//does not trigger events auto refresh
      //filterAppointments()
      //getFilterEvents(pdate)
      //getEventsOn(convertDate(pdate))//not exactly filtering out on first click
    }
    //console.log("filter events list date : " + date)
  }

  
//events

const [modalIsOpen, setIsOpen] = useState(true);
const handleClick = async () => {
  //setIsOpen(true)
};
const childFunc = useRef(null)


    return (
      <CardsContainer className="row">
        
        <Card key="cPat" className="col-sm">
          {/* <ModInfo variant="create" IsModalOpened={modalIsOpen} ></ModInfo> */}
          <div>
            <InputGroup className="mb-3">
              {/* <Button title="Add Patient" onClick={() => childFunc.current()}> */}
              {/* <Button title="Add Patient" onClick={handleClick}>
                <PersonPlus/>
              </Button> */}
              <ModInfo variant="create" ></ModInfo>
              <FormControl
                type="search"
                value={search}
                placeholder="Search patient"
                onChange={(e) => getFilterPatients(e.target.value)}
              />
            </InputGroup>
          </div>
          <Table striped bordered hover>
            <thead>
              <tr>
                {/* <th>#</th> */}
                <th>First Name</th>
                <th>Middle Name</th>
                <th>Last Name</th>
              </tr>
            </thead>
            <tbody>
              {filterPatients.map((patient) => (
              <tr key={patient._id}>
                {/* <td>
                  <Link to={`/patient/${patient._id}`}>
                  {patient._id}
                  </Link>
                </td> */}
                <td>
                <Link to={`/patient/${patient._id}`}>
                  {patient.firstName}
                  </Link>
                </td>
                <td>{patient.middleName}</td>
                <td>{patient.lastName}</td>
              </tr>
              ))}
            </tbody>
          </Table>
        </Card>

        <Card key="cApp" className="col-sm">
          {/* check how to call component as modal from here */}
          <div className="ms-auto">
            <InputGroup className="mb-3">
              <Appointment text="Add Appointment" variant="danger" isSignupFlow={false} />
          
              <FormControl
                type="searchEvent"
                value={searchEvent}
                placeholder="Search appointment"
                onChange={(e) => getFilterEvents(e.target.value)}
              />
            </InputGroup>            
          </div>
          <ul>
          {filterAppointments.map((appointment) => (
          <li key={appointment._id}> {appointment.title} - {convertDate(appointment.startDateTime)}
          </li>
          ))}
          </ul>
          
        </Card>

        <Card key="cCal" className="col-sm">
        <Calendar 
          showNeighboringMonth={false}
          onChange={setCalVal} value={value}             
          onClickDay={(value) => getDayEvent(value)}
          tileClassName={({ activeStartDate, date, view }) => setClass(date)}	
          />
        </Card>

      </CardsContainer>
    )
    ;
};

export default Dashboard;