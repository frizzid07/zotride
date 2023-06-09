import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import RideDetails from './RideDetails';

const AccordionItem = ({ rideDetails, driverDetails, passengerDetails, edit }) => {
  const [expanded, setExpanded] = useState(false);
  const from = rideDetails.startLocation.description.substring(0,12);
  const to = rideDetails.endLocation.description.substring(0,12);

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  return (
    <TouchableOpacity onPress={toggleExpanded}>
      <View style={styles.listItemContainer}>
        <Text style={styles.listItemHeading}>{from}...</Text>
        <Icon name="arrow-right" size={20} color="black" />
        <Text style={styles.listItemHeading}>{to}...</Text>
        <TouchableOpacity onPress={toggleExpanded}>
          <Text style={styles.dropdownButton}>{expanded ? '-' : '+'}</Text>
        </TouchableOpacity>
      </View>
      {expanded && 
      <RideDetails rideDetails={rideDetails} driverDetails={driverDetails} passengerDetails={passengerDetails} edit={edit}></RideDetails>}
      </TouchableOpacity>
  );
};

const Accordion = ({ data, edit }) => {
  return (
    <View>
      {edit !== undefined ? (
      <>{data.map((item, index) => (
            <AccordionItem key={index} rideDetails={item.rideDetails} driverDetails={item.driverDetails} passengerDetails={item.passengerDetails} edit={edit} />
      ))}</>) : (
        <>{data.map((item, index) => (
              <AccordionItem key={index} rideDetails={item.rideDetails} driverDetails={item.driverDetails} passengerDetails={item.passengerDetails}/>
        ))}</>)}
    </View>
  );
};

export default Accordion;

const styles = {
  listItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  listItemHeading: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  dropdownButton: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  details: {
    marginLeft: 16,
    marginTop: 8,
  },
};