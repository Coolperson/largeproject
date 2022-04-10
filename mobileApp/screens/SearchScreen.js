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
import SearchResultBox from "../components/SearchResultBox";
import { useIsFocused } from "@react-navigation/native";

// COMPONENT BODY
export default function SearchScreen({ route, navigation }) {
  const { userID, accessToken, refreshToken } = route.params;
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);

  const isFocused = useIsFocused();
  useEffect(() => {}, [isFocused]);

  //Gets user data from api
  function getResults(input) {
    if(input == "") return;
    if (isFocused) setLoading(true);
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userID: userID, username: input }),
    };
    fetch(`${API_URL}/api/user/searchByUsername`, requestOptions)
      
      .then((response) => response.json())
      .then((response) => {
        console.log(response)
        if (response.ok) {
          if (isFocused) {
            setSearching(true);
            setResults(response.user.slice(0, 5));
          }
        } else {
          if (isFocused) {
            console.log(response.error)
            setSearching(false);
            setResults([]);
          }
        }
        if (isFocused) setLoading(false);
      });
  }
  return (
    // Main container
    <View style={styles.container}>
      {/* Search field */}
      <View style={!searching ? styles.inputView : styles.inputViewSearching}>
        <TextInput
          style={styles.textInput}
          placeholder="Search posts"
          placeholderTextColor="#573C6B"
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
            <SearchResultBox
              username={item.username}
              isFollowed={item.currentUserFollows}
              followers={item.followers}
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
    backgroundColor: "white",
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
    backgroundColor: "white",
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
    color: "black",
  },
});
