import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
} from "react-native";
import axios from "axios";

const SearchPayment = ({ navigation }) => {
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState([]);

  const searchData = async () => {
    if (keyword.trim() === "") {
      Alert.alert("Warning", "Please enter a search keyword!");
      return;
    }

    try {
      const response = await axios.post(
        "https://toolingsaitech.com/api/search.php",
        { search: keyword } // Send JSON body
      );
      setResults(response.data);
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to fetch data from server");
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate("EditScreen", { record: item })}>
      <Text style={styles.title}>📄 Workorder: {item.workorder}</Text>
      <Text style={styles.sub}>👤 Customer: {item.customer}</Text>
      <Text style={styles.sub}>👤 Actual Hours: {item.actualhours}</Text>
      <Text style={styles.sub}>📅 Date: {item.reg_date}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>🔍 Search Order Details</Text>

      <TextInput
        placeholder="Enter workorder or customer name"
        value={keyword}
        onChangeText={setKeyword}
        style={styles.input}
      />

      <TouchableOpacity style={styles.button} onPress={searchData}>
        <Text style={styles.buttonText}>Search</Text>
      </TouchableOpacity>

      <FlatList
        data={results}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={styles.noData}>No records found</Text>
        }
        style={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    paddingTop: 40,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
  },
  input: {
    width: "90%",
    height: 45,
    borderWidth: 1,
    borderColor: "#075e54",
    borderRadius: 5,
    textAlign: "center",
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#00BCD4",
    width: "90%",
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 15,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  card: {
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    padding: 12,
    marginVertical: 6,
    width: "90%",
    borderWidth: 1,
    borderColor: "#ddd",
    elevation: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#075e54",
  },
  sub: {
    fontSize: 14,
    color: "#555",
  },
  list: {
    width: "100%",
  },
  noData: {
    textAlign: "center",
    color: "#999",
    marginTop: 20,
    fontStyle: "italic",
  },
});

export default SearchPayment;
