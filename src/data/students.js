import React from 'react'
import axios from 'axios'

class Student {
  constructor (props) {
    for (const key in props) {
      this[key] = props[key];
    }
  }

  static async loadAll () {
    return axios.get('http://localhost:3000/students')
      .then(res => res.data)
      .then(students => students.map(s => new Student(s)));
  }

  get githubUserName () {
    const accountUrlParts = this.githubAccountUrl.split('/');
    return accountUrlParts[accountUrlParts.length - 1];
  }

  get avatarUrl () {
    return `https://github.com/${this.githubUserName}.png`;
  }

  get fullName () {
    return `${this.firstName} ${this.lastName}`;
  }
}

export const withStudents = WrappedComponent => {
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        loadingStudents: false,
        studentList: [],
        fetchStudentsError: null
      };
    }

    componentDidMount() {
      this.fetchStudentList()
    }

    fetchStudentList = () => {
      this.setState({ loadingStudents: true, fetchStudentsError: null });
      Student.loadAll()
        .then(studentList => {
          this.setState({ studentList, loadingStudents: false, fetchStudentsError: null});
        }).catch(error => {
          console.error(error);
          this.setState({
            loadingStudents: false,
            fetchStudentsError: 'Une erreur est survenue lors du chargement de la liste des élèves'
          });
      });
    }

    render () {
      return (
        <WrappedComponent {...{...this.state, ...this.props}} />
      )
    }
  }
}

export default Student;
