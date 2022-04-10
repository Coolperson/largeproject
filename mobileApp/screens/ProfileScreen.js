import { React, useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  Dimensions,
  Image,
  TouchableOpacity,
} from "react-native";
import ProfileBox from "../components/ProfileBox";
import RowBox from "../components/RowBox";
import { API_URL } from "../constants/Info";
import { useIsFocused } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { ScreenStackHeaderBackButtonImage } from "react-native-screens";

// COMPONENT BODY
export default function ProfileScreen({ route, navigation }) {
  const userID = route.params.userID;

  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [hasProfileImage, setHasProfileImage] = useState(false);
  const [image, setImage] = useState("");

  const [postCount, setPostCount] = useState([0]);
  const [likedPostCount, setLikedPostCount] = useState([0]);
  const [followingCount, setFollowingCount] = useState([0]);
  const [followerCount, setFollowerCount] = useState([0]);
  const [postGridComplete, setPostGridComplete] = useState([]);
  const [likedPostGridComplete, setLikedPostGridComplete] = useState([]);
  const [postsOrLikes, setPostsOrLikes] = useState("posts");

  const isFocused = useIsFocused();
  useEffect(() => {
    getUserData();
    getPosts();
    getLikedPosts();
  }, [isFocused]);

  //Gets user data from api
  function getUserData() {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userID: userID }),
    };
    fetch(`${API_URL}/api/user/searchUser`, requestOptions)
      .then((response) => response.json())
      .then((response) => {
        if (!response.ok) {
          console.log(response.error);
          return;
        }
        setUsername(response.user.username);
        
        if(response.user.spotify.connected && response.user.profileImageUrl != undefined)
        {
          setHasProfileImage(true)
          setImage(response.user.profileImageUrl)
        }
        else
        {
          setHasProfileImage(false)
        }
        setBio(response.user.biography);
        
        if (response.user.followers != null)
          setFollowerCount(response.user.followers.length);
        if (response.user.following != null)
          setFollowingCount(response.user.following.length);
      });
  }
  //Gets user posts from api
  function getPosts() {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userID: userID , currentIndex: 0, numberOfPosts: 12}),
    };
    fetch(`${API_URL}/api/post/getAllUsersPost`, requestOptions)
      .then((response) => response.json())
      .then((response) => {
        if (!response.ok) {
          console.log(response.error);
          return;
        }
        dividePostsIntoRows(response.posts, "Posts");
        setPostCount(response.posts.length);
      });
  }

  //Gets user liked posts from api
  function getLikedPosts() {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userID: userID , currentIndex: 0, numberOfPosts: 12}),
    };
    fetch(`${API_URL}/api/post/userLikedPosts`, requestOptions)
      .then((response) => response.json())
      .then((response) => {
        if (!response.ok) {
          console.log(response.error);
          return;
        }
        dividePostsIntoRows(response.posts, "LikedPosts");
        setLikedPostCount(response.posts.length);
      });
  }

  function dividePostsIntoRows(posts, type) {
    var count = 0;
    var rowNum = 0;
    var postGrid = [];
    var postRow = [];
    if (posts.length == 0) {
      setPostGridComplete([]);
      return;
    }
    //Fills grid with post ids in retrieved posts
    for (var i = 0; i < posts.length; i++) {
      //new row if row has three items
      if (count == 3) {
        count = 0;
        postGrid[rowNum] = {
          key: rowNum,
          row: [postRow[0], postRow[1], postRow[2]],
        };
        rowNum++;
      }
      //add item to current row
      postRow[count] = { key: count, postID: posts[i]._id , image: posts[i].image};
      count++;
    }
    // Finishes row with empty
    while (count != 3) {
      postRow[count] = { postID: 0 }; //Spot is empty
      count++;
    }
    postGrid[rowNum] = { key: rowNum, row: postRow };
    
    if(type === "Posts")
    {
      setPostGridComplete(postGrid);
    }
    else
    {
      setLikedPostGridComplete(postGrid);
    }
  }

  const Tab = createMaterialTopTabNavigator();

  return (
    <View style={styles.MainContainer}>
      {/*Profile Info */}
      <ProfileBox
        username={username}
        bio={bio}
        image={image}
        hasProfileImage={hasProfileImage}
        postCount={postCount}
        followerCount={followerCount}
        followingCount={followingCount}
        navigation={navigation}
      />
      {/* Container for navigation between posts and likes */}
      <View style={styles.NavContainer}>
        {/* Posts and likes filter buttons */}
        <TouchableOpacity
          hitSlop={{ top: 40, bottom: 40, left: 100, right: 100 }}
          onPress={() => setPostsOrLikes("posts")}
        >
          {postsOrLikes === "posts" ? (
            <Ionicons name="grid" size={20} color="#573C6B" />
          ) : (
            <Ionicons name="grid" size={20} color="white" />
          )}
        </TouchableOpacity>
        <TouchableOpacity
          hitSlop={{ top: 40, bottom: 40, left: 100, right: 100 }}
          onPress={() => setPostsOrLikes("likes")}
        >
          {postsOrLikes === "likes" ? (
            <Ionicons name="heart" size={20} color="#573C6B" />
          ) : (
            <Ionicons name="heart" size={20} color="white" />
          )}
        </TouchableOpacity>
      </View>
      {/* Grid container */}
      <View>
        {postsOrLikes === "posts" ? (
          // Posts container
          <View style={styles.GridColumnContainer}>
            {postCount == 0 ? (
              <Text style={{ color: "white" }}>This user has no posts</Text>
            ) : (
              <FlatList
                data={postGridComplete}
                renderItem={({ item }) => <RowBox row={item.row} />}
              />
            )}
          </View>
        ) : (
          // Likes container
          <View style={styles.GridColumnContainer}>
            {likedPostCount == 0 ? (
              <Text style={{ color: "white" }}>This user has no liked posts</Text>
            ) : (
              <FlatList
                data={likedPostGridComplete}
                renderItem={({ item }) => <RowBox row={item.row} />}
              />
            )}
          </View>
        )}
      </View>
    </View>
  );
}

// COMPONENT STYLES
const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "black",
  },
  NavContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    alignSelf: "stretch",
    marginTop: 10,
  },
  GridColumnContainer: {
    marginTop: 40,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-around",
    alignSelf: "stretch",
  },
});
