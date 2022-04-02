import {React, useState, useEffect} from "react";
import { Text, View, StyleSheet, Image, TouchableOpacity, } from "react-native";
import { API_URL } from "../constants/Info";

// COMPONENT BODY
export default function CommentBox(props) {
  const [username, setUsername] = useState("");

  useEffect(() => {
    getUsername()
  })

  function getUsername()
  {
    const requestOptions = {
    method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({userID: props.userID})
    };
    fetch(`${API_URL}/api/user/searchUser`, requestOptions)
    .then((response) => response.json())
    .then((response) => {
      if(!response.ok)
      {
        console.log(response.error)
        return
      }
      setUsername(response.user.username)
    })
  }
  //get time since posted
  function getTimeSince()
  {
    let ms = new Date().getTime() - new Date(props.timeStamp).getTime();
    let days = Math.floor(ms / (1000 * 60 * 60 * 24));
    if(days > 1)
      return days + " days ago"
    let hours = Math.floor(days * 24);
    if(hours > 1)
      return hours + " hours ago"
    let minutes = Math.floor(hours * 60);
    if(minutes > 1)
      return minutes + " minutes ago"
    return "A few moments ago"
  }
  return (
    <View style={styles.MessageContainer}>        
      <View style={{flexDirection: 'row'}}>
        {/* profile pic */}
        <Image
          source={require('../assets/images/defaultSmile.png')}
          style={styles.ProfilePic}
        />
        <View style={{flexDirection: 'column', marginStart: 5, marginTop: 10, }}>
          {/* name */}
          <Text style={{color: 'white', fontWeight: 'bold', fontSize: 12, textDecorationLine: "underline"}}>{username}</Text>
          {/* Comment */}
          <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 5}}>
            <Text style={styles.MainText}>{props.comment}</Text>
          </View>
        </View>
      </View>
      {/* Timestamp */}
      <Text style={{color: 'white', textAlign: "right", marginTop: 10, marginRight: 20, fontSize: 11}}>{getTimeSince()}</Text>
    </View>
)}

const styles = StyleSheet.create({
  MainText: {
    color: "white",
    fontSize: 11
  },
  MessageContainer: {
        
    backgroundColor: "#573C6B",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    marginHorizontal: 10,
    borderRadius: 25,
  },
  ProfilePic: {
    width: 50,
    height: 50,
    borderRadius: 70,
    marginVertical: 10,
    marginHorizontal: 10
  },
})