import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {Spinner, Jumbotron, Button} from 'react-bootstrap';
import { withRouter } from 'react-router-dom';

function ShowCourse(props) {
  console.log('props.match.params',props.match.params.id)
  const [screen, setScreen] = useState('auth');
  const [data, setData] = useState({});
  const [showLoading, setShowLoading] = useState(true);
  const apiUrl = "http://localhost:3000/api/courses/" + props.match.params.id;

  //check if the user already logged-in
  const readCookie = async () => {
    axios.get('/read_cookie')
      .then(result => {
        //check if the user has logged in
        if(result.data.screen !== 'auth')
        {
          setScreen(result.data.screen);
        }
      }).catch((error) => {
        console.log(error);
        setScreen('auth');
      });
  };

  useEffect(() => {
    setShowLoading(false);
    const fetchData = async () => {
      const result = await axios(apiUrl);
      console.log('results from courses',result.data);

      setData(result.data);
      setShowLoading(false);
    };

    fetchData();
    readCookie();
  }, [apiUrl]);

  const editCourse = (id) => {
    props.history.push({
      pathname: '/editcourse/' + id
    });
  };

  const deleteCourse = (id) => {
    setShowLoading(true);
    const course = { courseCode: data.courseCode, courseName: data.courseName, section: data.section, semester: data.semester };
    //
    axios.delete(apiUrl, course)
      .then((result) => {
        setShowLoading(false);
        props.history.push('/listcourses')
      }).catch((error) => setShowLoading(false));
  };

  const addCourse = (id) => {
    setShowLoading(true);

    const student = { studentNumber: screen };
    const course = { _id: id, courseCode: data.courseCode, courseName: data.courseName, section: data.section, semester: data.semester };

    axios.put('/api/addcourse', {course: course, student: student})
      .then((result) => {
        setShowLoading(true);
        props.history.push('/courses');
      }).catch((err) => {
        setShowLoading(false);
      });
  }

  return (
    <div>
      {showLoading && <Spinner animation="border" role="status">
        <span className="sr-only">Loading...</span>
      </Spinner> }    
      <Jumbotron>
        <h1>Course Name: {data.courseName}</h1>
        <p>Section: {data.section}</p>

        <p>
          <Button type="button" variant="primary" onClick={() => { editCourse(data._id) }}>Edit</Button>&nbsp;
          {screen !== 'auth'
            ?
            <Button type="button" variant="primary" onClick={() => { addCourse(data._id) }}>Enroll</Button>
            :
            <Button disabled type="button" variant="primary" onClick={() => { addCourse(data._id) }}>Enroll</Button>
          }&nbsp;
          <Button type="button" variant="danger" onClick={() => { deleteCourse(data._id) }}>Delete</Button>
        </p>
        
      </Jumbotron>
    </div>
  );
}

export default withRouter(ShowCourse);
