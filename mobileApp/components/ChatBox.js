import { NavigationContainer } from "@react-navigation/native";
import React from "react";
import { Text, View, StyleSheet, Image, TouchableOpacity } from "react-native";

export default function ChatBox(props) {
    return (
        <View style={props.sentByMe ? (styles.rightMessage) : (styles.leftMessage)}>
            <Text style={styles.MainText}>{props.message + " " + props.timeStamp}</Text>
        </View>

    )
}
const styles = StyleSheet.create({
    MainText: {
        color: "white",
        // flex: 1,
    },

    rightMessage: {
        backgroundColor: "#573C6B",
        flexDirection: "row",
        alignSelf: "flex-end",
        marginStart: 10,
        marginEnd: 10,
        marginTop: 15,
        borderBottomLeftRadius: 25,
        width: 20,
        height: 25,
        // borderWidth: 100,
        borderColor: "transparent",
        // right: -100,
    },

    leftMessage: {
        backgroundColor: "gray",
        flexDirection: "row",
        alignSelf: "flex-start",
        marginStart: 10,
        marginEnd: 10,
        marginTop: 15,
        borderBottomRightRadius: 25,
        width: 20,
        height: 25,
        // borderWidth: 100,
        borderColor: "transparent",
    },

})