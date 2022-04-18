import { React, useState, useEffect } from "react";
import {
  Text,
  TextInput,
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { API_URL } from "../constants/Info";
import NewChatResultBox from "../components/NewChatResultBox";
import SearchResultBox from "../components/SearchResultBox";
import { useIsFocused } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

// COMPONENT BODY
export default function NewChatScreen({ route, navigation }) {
  const { userID, accessToken, refreshToken } = route.params;
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);

  const isFocused = useIsFocused();
  useEffect(() => {}, [isFocused]);

  //Gets user data from api
  function getResults(input) {
    if (input == "") {
      setResults([]);
      setSearching(false);
      return;
    }
    if (isFocused) setLoading(true);
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userID: userID, username: input }),
    };
    fetch(`${API_URL}/api/user/searchByUsername`, requestOptions)
      .then((response) => response.json())
      .then((response) => {
        if (response.ok) {
          if (isFocused) {
            setSearching(true);
            setResults(response.user.slice(0, 5));
          }
        } else {
          if (isFocused) {
            console.log(response.error);
            setSearching(false);
            setResults([]);
          }
        }
        if (isFocused) setLoading(false);
      });
  }

  const [followings, setFollowings] = useState([]);
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userID: userID,
      targetID: userID,
    }),
  };
  // Fetch the following list of this user
  useEffect(async () => {
    let response = await fetch(
      `${API_URL}/api/user/showFollowings`,
      requestOptions
    );
    if (!response.ok) {
      console.log(response.error);
      return;
    } else {
      let data = await response.json();
      setFollowings(data.following);
    }
  }, [isFocused]);

  return (
    // Main container
    <View style={styles.container}>
      <View
        style={{
          backgroundColor: "#12081A",
          width: "100%",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        {/* back button */}
        <TouchableOpacity onPress={() => navigation.navigate("Notification")}>
          <View style={{ margin: 15, width: 25, height: 25 }}>
            <Ionicons
              style={{ color: "white", marginRight: 5 }}
              name="chevron-back-outline"
              size={25}
            />
          </View>
        </TouchableOpacity>
        {/* name on top */}
        <Text style={{ color: "white", alignSelf: "center", fontSize: 15 }}>
          NEW CHAT
        </Text>
        {/*Spacer*/}
        <View style={{ margin: 15, width: 25, height: 25 }} />
      </View>

      {/* Search field */}
      <View style={!searching ? styles.inputView : styles.inputViewSearching}>
        <TextInput
          style={styles.textInput}
          placeholder="Search users"
          placeholderTextColor="white"
          clearButtonMode="while-editing"
          selectionColor={"#573C6B"}
          onChangeText={(text) => getResults(text)}
        />
        {loading ? (
          <ActivityIndicator
            size="small"
            color="#573C6B"
            style={{ marginRight: 20 }}
          />
        ) : (
          <></>
        )}
      </View>
      <View style={styles.searchResultsContainer}>
        <FlatList
          data={results}
          renderItem={({ item }) => (
            <NewChatResultBox
              username={item.username}
              image={item.profileImageUrl}
              userID={item._id}
              myUserID={userID}
              accessToken={accessToken}
              refreshToken={refreshToken}
              navigation={navigation}
            />
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
      {/*List of following*/}
      {searching ? (
        <></>
      ) : (
        <View style={{ marginTop: 50 }}>
          <Text
            style={{
              color: "white",
              fontSize: 18,
              alignSelf: "center",
              marginBottom: 10,
            }}
          >
            Users you've followed:
          </Text>
          <FlatList
            data={followings}
            renderItem={({ item }) => (
              <SearchResultBox
                username={item.username}
                image={item.profileImageUrl}
                userID={item.userID}
                myUserID={userID}
                isFollowed={item.currentUserFollows}
                accessToken={accessToken}
                refreshToken={refreshToken}
                navigation={navigation}
              />
            )}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      )}
    </View>
  );
}

// COMPONENT STYLES
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#23192B",
  },

  searchResultsContainer: {
    marginHorizontal: 30,
    flexDirection: "row",
    justifyContent: "center",
    alignContent: "space-around",
    backgroundColor: "#23192B",
    width: "85%",
  },

  inputView: {
    borderWidth: 1,
    borderRadius: 30,
    borderColor: "#573C6B",
    backgroundColor: "black",
    width: "85%",
    height: 45,
    marginTop: 40,
    flexDirection: "row",
    alignItems: "center",
  },

  inputViewSearching: {
    borderWidth: 1,
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    borderColor: "#573C6B",
    backgroundColor: "black",
    width: "85%",
    height: 45,
    marginTop: 40,
    flexDirection: "row",
  },

  textInput: {
    height: 50,
    flex: 1,
    padding: 10,
    marginLeft: 20,
    color: "white",
  },
});
