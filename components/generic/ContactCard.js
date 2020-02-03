import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import PropTypes from 'prop-types';

import Card from './Card';
import Theme from '../Theme';
import {getColor} from '../ContactUtils';
import {Contact} from '../../api/models/contactManager';

function getImageBorder(priority) {
  return {
    borderColor: getColor(priority),
    borderWidth: 3,
  };
}

const ContactCard = props => {
  let contactImg = {uri: props.contact.thumbnail};
  if (!props.contact.thumbnail)
    contactImg = require('../../assets/contact.png');

  let imageStyle = [styles.image];
  if (props.contact.priority >= 0)
    imageStyle.push(getImageBorder(props.contact.priority));

  return (
    <Card style={props.style}>
      <View style={styles.container}>
        <Image source={contactImg} style={imageStyle} />
        <View style={styles.info}>
          <Text style={styles.name}>{Contact.fullName(props.contact)}</Text>
          <Text style={styles.phone}>{props.contact.phoneNumber}</Text>
        </View>
      </View>
      {props.children}
    </Card>
  );
};

ContactCard.propTypes = {
  children: PropTypes.object,
  style: PropTypes.array,
  contact: PropTypes.objectOf(Contact),
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  image: {
    resizeMode: 'contain',
    width: 58,
    height: 58,
    borderRadius: 29,
    marginTop: 15,
    marginBottom: 15,
    marginLeft: 20,
    marginRight: 20,
    backgroundColor: Theme.FadedBlueContact,
  },
  info: {
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  name: {
    fontSize: 22,
    fontWeight: '500',
    color: Theme.DarkBlue,
  },
  phone: {
    fontSize: 14,
    fontWeight: '300',
    color: Theme.DarkBlue,
  },
});

export default ContactCard;
