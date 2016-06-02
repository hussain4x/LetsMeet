/* vendor dependencies */
import React from 'react';
import update from 'react-addons-update';
import fetch from 'isomorphic-fetch';
import cssModules from 'react-css-modules';
import Masonry from 'react-masonry-component';
import autobind from 'autobind-decorator';

/* external components */
import EventCard from '../components/EventCard';

/* styles */
import styles from '../styles/dashboard.css';

/* utilities */
import { checkStatus, parseJSON } from '../util/fetch.util';

class Dashboard extends React.Component {
  constructor() {
    super();
    this.state = {
      events: [],
      user: {},
    };
  }

  componentDidMount() {
    $(document).ready(() => {
      $('.modal-trigger').leanModal();
    });

    fetch('/api/users/current/events', { credentials: 'same-origin' })
      .then(checkStatus)
      .then(parseJSON)
      .then(events => this.setState({ events }));

    fetch('/api/auth/current', { credentials: 'same-origin' })
      .then(checkStatus)
      .then(parseJSON)
      .then(user => { if (user === '') window.location.href = '/'; });
  }

  @autobind
  removeEventFromDashboard(eventId) {
    this.setState({
      events: this.state.events.filter(event => event._id !== eventId),
    });
  }

  render() {
    return (
      <div styleName="wrapper">
        { /* New Event Icon */ }
        <div className="fixed-action-btn" styleName="new-event-icon">
          <a className="btn-floating btn-large red" href="/event/new">
            <i className="large material-icons">add</i>
          </a>
        </div>
        { /* Card Template */ }
        <Masonry>
          {this.state.events.map(event => (
            <EventCard
              key={event._id}
              event={event}
              removeEventFromDashboard={this.removeEventFromDashboard}
            />
          ))}
        </Masonry>
      </div>
    );
  }
}

export default cssModules(Dashboard, styles);
