import React, { Component, useEffect, useState } from 'react'
import {
    StyleSheet,
    Text,
    View,
    Image,
    Button,
    Pressable,
    Alert,
    TextInput,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    Linking
  } from "react-native";
import WebView from 'react-native-webview';
import axios from 'axios'
import { NGROK_TUNNEL, PAYPAL_TOKEN } from "@env";

// Images
import background from '../../assets/background.jpg';
import logo from '../../assets/logo.png';

// Common
import {submit} from '../common/button';

export default class Paypal extends Component {

    constructor(props) {
        super(props);

        this.state = {
            accessToken: null,
            approvalUrl: null,
            paymentId: null,
            PayerID: null,
            ride: this.props.route?.params.ride,
            options: { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' }
        }
    }

    componentDidMount() {
        console.log(this.state.ride);
        const create_payment_json = {
            intent: "sale",
            payer: {
                payment_method: "paypal"
            },
            redirect_urls: {
                return_url: 'https://example.com',
                cancel_url: 'https://example.com'
            },
            transactions: [
                {
                    amount: {
                        currency: "USD",
                        total: `${this.state.ride.rideCost}`,
                    },
                    description: `Payment for ride from ${this.state.ride.startLocation.description} to ${this.state.ride.endLocation.description} scheduled at ${new Date(this.state.ride.startTime).toLocaleString('en-US', this.state.options)}`
                }
            ]
        };

        axios.post('https://api.sandbox.paypal.com/v1/oauth2/token', { grant_type: 'client_credentials' },
        {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Basic ${PAYPAL_TOKEN}` // Your authorization value
            }
        }
    )
        .then(response => {
            this.setState({
                accessToken: response.data.access_token
            })

            axios.post('https://api.sandbox.paypal.com/v1/payments/payment', create_payment_json,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${this.state.accessToken}`
                    }
                }
            )
                .then(response => {

                    const { id, links } = response.data
                    const approvalUrl = links.find(data => data.rel == "approval_url")

                    this.setState({
                        paymentId: id,
                        approvalUrl: approvalUrl.href
                    })
                }).catch(err => {
                    console.log({ ...err })
                })
        }).catch(err => {
            console.log({ ...err })
        })

}

_onNavigationStateChange = (webViewState) => {

    if (webViewState.url.includes('https://example.com/')) {

        this.setState({
            approvalUrl: null
        })

        console.log('In Nav State Change');

        var regexp = /[?&]([^=#]+)=([^&#]*)/g,params = {},check;
        while (check = regexp.exec(webViewState.url)) {
            params[check[1]] = check[2];
        }

        console.log(`Payer ID: ${params.PayerID}`);
        console.log(`Payment ID: ${params.paymentId}`);

        if(params.PayerID === undefined || params.paymentId === undefined) {
            this.props.navigation.navigate("CancelPayment", {response: response});
        }

        this.setState({PayerID: params.PayerID});

        axios.post(`https://api.sandbox.paypal.com/v1/payments/payment/${params.paymentId}/execute`, { payer_id: params.PayerID },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.state.accessToken}`
                }
            }
        )
            .then(response => {
                if (response.status == 200) {
                    this.props.navigation.navigate("SuccessPayment", {data: response.data, ride: this.state.ride});
                } else {
                    this.props.navigation.navigate("CancelPayment", {data: response.data});
                }

            }).catch(err => {
                console.log({ ...err })
            })

    }
}

    render() {

        const { approvalUrl } = this.state

        return (
            <View style = {styles.container}>
                <ScrollView contentContainerStyle={{flexGrow:1}}>
                    <View style = {{ flex: 1 }}>
                        {
                            approvalUrl ? <WebView
                                style={{ height: '100%', width: '100%', marginTop: 40}}
                                source={{ uri: approvalUrl }}
                                onNavigationStateChange={this._onNavigationStateChange}
                                javaScriptEnabled={true}
                                domStorageEnabled={true}
                                startInLoadingState={false}
                            /> : 
                            <View style={{ flex: 1, justifyContent: 'center' }}>
                                <Text style={[styles.text, { color: '#004aac', alignSelf: 'center'}]}>
                                    Do not go back or refresh
                                </Text>
                                <ActivityIndicator color={'#ebd25f'} size={'large'} style={{ alignSelf: 'center', marginTop: 25 }}/>
                            </View>
                        }
                    </View>
                </ScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%'
    },
    textContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%'
    },
    bg: {
        position: 'absolute',
        top: 0,
        width: '100%',
        height: '100%',
        zIndex: -1
    },
    text: {
        fontSize: 25,
        color: '#000'
    },
    logo: {
        width: '30%',
        height: undefined,
        borderWidth: 2,
        borderColor: '#ffde59',
        borderRadius: 5,
        aspectRatio: 1,
        marginBottom: 100,
        marginTop: 70
    }
});