import { View, TextInput, Button, StyleSheet, Modal, Text, Slider } from "react-native";
import React, { useState, createRef, useRef } from "react";

function RideFilters(props) {

    function handleModalClose() {
        props.onClose();
    }

    return (
        <Modal onRequestClose={handleModalClose}>
            <View>
            <Text>Filters</Text>

            {/* Slider Filter */}
            <Text>Filter Value:</Text>
            <Slider
                minimumValue={0}
                maximumValue={10}
                value={5}
            />

            {/* Find Rides Button */}
            <Button title="Find Rides"/>
            </View>
        </Modal>
    )
}

export default RideFilters;