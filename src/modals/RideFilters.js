import { View, TextInput, Button, StyleSheet, Modal, Text } from "react-native";
import Slider from '@react-native-community/slider';
import React, { useState, createRef, useRef } from "react";

function RideFilters(props) {

    const [startRadius, setStartRadius] = useState(props.default.startRadius);
    const [endRadius, setEndRadius] = useState(props.default.endRadius);
    const [maxCapacity, setMaxCapacity] = useState(props.default.maxCapacity);
    const [timeWindow, setTimeWindow] = useState(props.default.timeWindow);
    const [maxRideCost, setMaxRideCost] = useState(props.default.maxCost);


    function filterRides () {
        props.handleFilters({
            "startRadius":startRadius,
            "endRadius":endRadius,
            "timeWindow":timeWindow,
            "maxCapacity":maxCapacity,
            "maxCost":maxRideCost
          });

        // close modal
        props.onClose();
    }

    return (
        <Modal onRequestClose={() => props.onClose()}>
            <View>
            <Text>Filters</Text>

            <View>
                <Text>Start Radius</Text>
                <Text>{startRadius}</Text>
                <Slider
                    minimumValue={0}
                    maximumValue={15}
                    minimumTrackTintColor="tomato"
                    maximumTrackTintColor="#000"
                    thumbTintColor="tomato"
                    onValueChange={(value) => setStartRadius(parseInt(value))}
                    value={props.default.startRadius}
                />
            </View>
            <View>
                <Text>End Radius</Text>
                <Text>{endRadius}</Text>
                <Slider
                    minimumValue={0}
                    maximumValue={15}
                    minimumTrackTintColor="tomato"
                    maximumTrackTintColor="#000"
                    thumbTintColor="tomato"
                    onValueChange={(value) => setEndRadius(parseInt(value))}
                    value={props.default.endRadius}
                />
            </View>
            <View>
                <TextInput
                    placeholder="Time Window (in minutes)"
                    onChangeText={(value) => setTimeWindow(parseInt(value)) }
                />
            </View>
            <View>
                <TextInput
                    placeholder="Maximum ride cost"
                    onChangeText={(value) => setMaxRideCost(parseInt(value))}
                />
            </View>
            <View>
                <Text>Maximum capacity</Text>
                <Text>{maxCapacity}</Text>
                <Slider
                    minimumValue={0}
                    maximumValue={15}
                    minimumTrackTintColor="tomato"
                    maximumTrackTintColor="#000"
                    thumbTintColor="tomato"
                    onValueChange={(value) => setMaxCapacity(parseInt(value))}
                    value={props.default.maxCapacity}
                />
            </View>

            <Button title="Find Rides" onPress={filterRides}/>
            </View>
        </Modal>
    )
}

export default RideFilters;