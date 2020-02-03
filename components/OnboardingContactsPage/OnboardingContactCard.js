import React, {Component} from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import addContact from '../../api/redux/actions/addContact';
import removeContact from '../../api/redux/actions/removeContact';
import setContactPriority from '../../api/redux/actions/setContactPriority';

import BucketSelector from './BucketSelector';
import ContactCard from '../generic/ContactCard';
import ContactManager, {
  Contact,
  ContactPriority,
  ContactFrequency,
} from '../../api/models/contactManager';
import Theme from '../Theme';

class OnboardingContactCard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      expanded: false,
    };

    this.expand = this.expand.bind(this);
    this.setPriority = this.setPriority.bind(this);
  }

  expand() {
    this.setState({expanded: !this.state.expanded});
  }

  _getInitialContactTime(priority) {
    let freq = ContactFreqs[priority];
    let start = Math.floor(freq / 2);

    let rand = Math.floor(Math.random() * freq) - start;
    let days = start + rand + 1;

    let today = Math.round(new Date().getTime());
    let toc = today + days * 24 * 60 * 60 * 1000;
    return new Date(toc);
  }

  setPriority(priority) {
    if (priority === ContactPriority.Remove.rawValue) return;
    // selecting the same priority removes the contact
    if (priority === this.props.contact.priority) {
      Contact.setPriority(this.props.contact, ContactPriority.Remove.rawValue);
      this.props.removeContact(this.props.contact);
      return;
    }

    // add contact
    if (this.props.contact.priority === ContactPriority.Remove.rawValue) {
      Contact.setPriority(this.props.contact, priority);
      this.props.addContact(this.props.contact);
    } else {
      Contact.setPriority(this.props.contact, priority);
      this.props.setContactPriority(this.props.contact, priority);
    }
  }

  getBorderStyle() {
    let style = {
      borderColor: '',
      borderWidth: 4,
      shadowColor: '',
      shadowOpacity: 0.3,
    };

    if (this.props.contact.priority >= ContactPriority.Remove.rawValue)
      style.shadowOpacity = 0.8;

    if (this.props.contact.priority === ContactPriority.Friend.rawValue) {
      style.borderColor = Theme.Green;
      style.shadowColor = Theme.Green;
    } else if (
      this.props.contact.priority === ContactPriority.Acquaintance.rawValue
    ) {
      style.borderColor = Theme.Blue;
      style.shadowColor = Theme.Blue;
    } else if (
      this.props.contact.priority === ContactPriority.TouchPoint.rawValue
    ) {
      style.borderColor = Theme.Purple;
      style.shadowColor = Theme.Purple;
    }

    return style;
  }

  render() {
    let name = `${this.props.contact.firstName} ${this.props.contact.lastName}`.trim();
    let phoneNumber = this.props.contact.phoneNumber;

    let cardStyle = [styles.card];
    if (this.props.contact.priority > ContactPriority.Remove.rawValue)
      cardStyle.push(this.getBorderStyle());

    let selector = null;
    if (this.state.expanded)
      selector = (
        <BucketSelector
          style={cardStyle}
          priority={this.props.contact.priority}
          expand={this.expand}
          setPriority={priority => {
            this.setPriority(priority);
          }}
        />
      );

    return (
      <TouchableOpacity style={styles.container} onPress={this.expand}>
        <ContactCard style={cardStyle} contact={this.props.contact}>
          {selector}
        </ContactCard>
      </TouchableOpacity>
    );
  }
}

OnboardingContactCard.propTypes = {
  contact: PropTypes.objectOf(Contact),
  // Redux actions
  addContact: PropTypes.func.isRequired,
  removeContact: PropTypes.func.isRequired,
  setContactPriority: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 10,
    marginBottom: 10,
  },
  card: {
    margin: 0,
    padding: 0,
  },
});

const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch => ({
  addContact: c => dispatch(addContact(c)),
  removeContact: c => dispatch(removeContact(c)),
  setContactPriority: (c, p) => dispatch(setContactPriority(c, p)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(OnboardingContactCard);
