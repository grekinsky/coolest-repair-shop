import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firebaseConnect } from 'react-redux-firebase';
import JSONPretty from 'react-json-pretty';
import classNames from 'classnames/bind';
import styles from './Tests.css';
import { userRole, userIsAuthenticated } from '../../Services/User';
import RepairsApi from '../../Services/Api';
import { stringSample } from '../../util';

const cx = classNames.bind(styles);

class Tests extends Component {
  constructor() {
    super();
    this.api = new RepairsApi();
    this.state = {
      current: 0,
      res: '{}',
      lastCreated: '',
    };
    this.updateResult = this.updateResult.bind(this);
  }
  updateResult(res) {
    this.setState({
      res: res ? JSON.stringify(res) : '{}',
    });
  }
  render() {
    const tests = [
      {
        name: 'Get All Repairs',
        func: this.api.getRepairs,
        cond: el => el,
      },
      {
        name: 'Get All Users',
        func: this.api.getUsers,
        cond: el => el,
      },
      {
        name: 'Add a Repair',
        func: this.api.addRepair,
        data: {
          description: stringSample(10),
        },
        callback: (res) => {
          this.setState({
            lastCreated: res.name,
          });
        },
        cond: el => (!this.state.lastCreated ? el : null),
      },
      {
        name: 'Modify a Repair',
        func: this.api.modifyRepair,
        data: {
          id: this.state.lastCreated,
          description: stringSample(10),
        },
        cond: el => (this.state.lastCreated ? el : null),
      },
      {
        name: 'Delete a Repair',
        func: this.api.deleteRepair,
        data: {
          id: this.state.lastCreated,
        },
        callback: () => {
          this.setState({
            lastCreated: '',
          });
        },
        cond: el => (this.state.lastCreated ? el : null),
      },
    ];
    return (
      <div className={cx('Tests')}>
        <h1>Functional Tests</h1>
        <nav className="Tests-list">
          {tests.map(test => test.cond(
            <a
              role="menuitem"
              className="Test-item"
              tabIndex={0}
              key={test.name}
              onClick={async () => {
                const res = await test.func(test.data);
                this.updateResult(res);
                if (test.callback) {
                  test.callback.call(this, res);
                }
              }}
            >{test.name}</a>,
          ))}
        </nav>
        <JSONPretty id="json-pretty" json={this.state.res} />
      </div>
    );
  }
}

export default compose(
  userIsAuthenticated,
  userRole('admin'),
  firebaseConnect(),
  connect(),
)(Tests);
