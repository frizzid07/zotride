import { View, TextInput, Button, StyleSheet, Modal, Text, Image } from "react-native";
import Slider from '@react-native-community/slider';
import React, { useState, createRef, useRef } from "react";
import background from "../../assets/background.jpg";
import { BlurView } from 'expo-blur';

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
        <>
            <BlurView intensity={100} tint='dark' style={styles.absoluteFill} />
            <Modal onRequestClose={() => props.onClose()} animationType='slide' transparent={true}>
                <Image style={styles.bg} source={background}></Image>
                <View style={styles.modalContent}>

                    <View style={styles.inputContainer}>
                        <Text style={styles.inputText}>Start Radius</Text>
                        <View style={styles.sliderElement}>
                            <View style={styles.sliderContainer}>
                                <Text style={styles.sliderText}>{startRadius} miles</Text>
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
                        </View>
                    </View>
                    <View style={styles.inputContainer}>
                        <Text style={styles.inputText}>End Radius</Text>
                        <View style={styles.sliderElement}>
                            <View style={styles.sliderContainer}>
                                <Text style={styles.sliderText}>{endRadius} miles</Text>
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
                        </View>
                    </View>
                    <View style={styles.inputContainer}>
                        <Text style={styles.inputText}>Maximum capacity</Text>
                        <View style={styles.sliderElement}>
                            <View style={styles.sliderContainer}>
                                <Text style={styles.sliderText}>{maxCapacity} persons</Text>
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
                        </View>
                    </View>
                    <View style={styles.inputContainer}>
                        <Text style={styles.inputText}>Time Window</Text>
                        <View style={styles.textBox}>
                            <TextInput
                                placeholder="Enter Value in Minutes"
                                onChangeText={(value) => setTimeWindow(parseInt(value)) }
                            />
                        </View>
                    </View>
                    <View style={styles.inputContainer}>
                    <Text style={styles.inputText}>Maximum cost</Text>
                        <View style={styles.textBox}>
                            <TextInput
                                placeholder="Maximum ride cost"
                                onChangeText={(value) => setMaxRideCost(parseInt(value))}
                            />
                        </View>
                    </View>

                    <Button title="Filter Rides" onPress={filterRides}/>
                </View>
            </Modal>
        </>
    )
}

export default RideFilters;

const styles = StyleSheet.create({
    modalContent: {
        flex: 1,
        padding: 16,
        marginTop: '5%',
      },
    inputContainer: {
        marginBottom: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    sliderElement: {
        width:'100%'
    },
    sliderContainer: {
        marginLeft:'10%',
        marginRight:'25%'
    },
    sliderText: {
        textAlign:'center',
        marginBottom:'2%',
    },
    inputText: {
        minWidth: '27%',
        maxWidth: '27%'
    },
    textBox: {
        borderWidth: 2,
        borderColor: 'black',
        borderRadius: 8,
        padding: '2%',
        width:'60%',
        marginRight:'2%'
      },
      bg: {
        position: "absolute",
        top: 0,
        width: "100%",
        height: "100%",
        zIndex: -1,
      },
      absoluteFill: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      },
  });