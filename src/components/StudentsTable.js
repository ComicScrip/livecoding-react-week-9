import React from 'react';
import { Link } from 'react-router-dom';
import { sortBy } from 'lodash';

const LinkTd = ({ to, children }) => <td><Link to={to}>{children}</Link></td>;

const StudentsTableRow = ({ firstName, lastName, p1bisPresented, githubUserName }) => {
  const studentDetailsPageLink = '/students/' + githubUserName;
  return (
    <tr key={githubUserName}>
      <LinkTd to={studentDetailsPageLink}>{firstName}</LinkTd>
      <LinkTd to={studentDetailsPageLink}>{lastName.toUpperCase()}</LinkTd>
      <td>{p1bisPresented ? 'Oui' : 'Pas encore'}</td>
    </tr>
  );
};

const SortButton = ({ fieldToSortBy, sortOrder, activeSort, onClick }) => {
  const fieldToSortByWithOrder = fieldToSortBy + ' ' + sortOrder;
  return (
    <span
      className={'sort-button' + (activeSort === fieldToSortByWithOrder ? ' active' : '')}
      onClick={() => { onClick(fieldToSortByWithOrder); }}
    >
      <i className={'fas fa-arrow-' + (sortOrder === 'DESC' ? 'up' : 'down')} />
    </span>
  );
};

class StudentsTable extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      activeSort: null,
      sortedStudents: props.students
    };
    this.handleSortButtonClicked = this.handleSortButtonClicked.bind(this);
  }

  handleSortButtonClicked (fieldToSortByWithOrder) {
    if (this.state.activeSort === fieldToSortByWithOrder) {
      this.setState({ sortedStudents: this.props.students, activeSort: null });
    } else {
      const [fieldToSortBy, sortOrder] = fieldToSortByWithOrder.split(' ');
      let sortedStudents = sortBy(this.props.students, fieldToSortBy);
      if (sortOrder === 'DESC') {
        sortedStudents = sortedStudents.reverse();
      }
      this.setState({ sortedStudents, activeSort: fieldToSortByWithOrder });
    }
  }

  static getDerivedPropsFromState(props, state) {
    return {
      ...state,
      sortedStudents: props.students
    }
  }

  render () {
    const { sortedStudents, activeSort } = this.state;

    return (
      <table>
        <thead>
        <tr>
          <td>Prénom
            <span className='col-sort-buttons-container'>
                <SortButton fieldToSortBy='firstName' sortOrder='ASC' onClick={this.handleSortButtonClicked} activeSort={activeSort} />
                <SortButton fieldToSortBy='firstName' sortOrder='DESC' onClick={this.handleSortButtonClicked} activeSort={activeSort} />
              </span>
          </td>
          <td>Nom
            <span className='col-sort-buttons-container'>
                <SortButton fieldToSortBy='lastName' sortOrder='ASC' onClick={this.handleSortButtonClicked} activeSort={activeSort} />
                <SortButton fieldToSortBy='lastName' sortOrder='DESC' onClick={this.handleSortButtonClicked} activeSort={activeSort} />
              </span>
          </td>
          <td>P1bis présenté</td>
        </tr>
        </thead>
        <tbody>
        {sortedStudents.map(StudentsTableRow)}
        </tbody>
      </table>
    );
  }
}

export default StudentsTable;