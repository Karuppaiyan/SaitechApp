import React, { useState } from "react";
import { View, Text, Button, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import axios from "axios";

const AddAdditionalHoursScreen = ({ route, navigation }) => {
  const { recordId, workorder: initialWorkorder, actualhours:initialDuration, } = route.params || {};
  const [workorder, setWorkorder] = useState(initialWorkorder || "");
  const [actualhours, setActualHours] = useState(initialDuration || "");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [totalhours, setTotalHours] = useState("");


  const handleStart = () => {
    const now = new Date();
    setStartTime(now);
    setEndTime(null);
    setTotalHours(null);
    
  };

  
  const handleEnd = () => {
    const now = new Date();
    setEndTime(now);

    if (startTime) {
      const minutes = (now - startTime) / (1000 * 60);
      setTotalHours(Math.round(minutes));
      setActualHours(Math.round(minutes + Number(initialDuration)));
    }
    // const base = Number(initialDuration) || 0; setActualHours((minutes + base).toFixed(2)); // keep consistent formatting
  };

  // const handleEnd = () => {
  //   const now = new Date();
  //   setEndTime(now);

  //   const diffMs = now - startTime;
  //   const minutes = Math.floor(diffMs / (1000 * 60));
  //   const hours = Math.floor(minutes / 60);
  //   const remainingMinutes = minutes % 60;

  //   setTotalHours(`${hours}:${remainingMinutes}`);
  // };

  const formatDateTime = (date) => {
    if (!date) return null;
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }


 const handleSave = async () => {
  if (!recordId || !workorder) {
    Alert.alert("Error", "Record ID or Workorder missing");
    return;
  }
  if (!startTime || !endTime) {
    Alert.alert("⚠️ Warning", "Please select start and end times.");
    return;
  }
  if (endTime <= startTime) {
    Alert.alert("⚠️ Warning", "End time must be after start time.");
    return;
  }

  try {
    
    const response = await axios.post(
      "HOSTING_API_URL" + "addAdditionalHours.php",
      {
        recordId: recordId,
        workorder: workorder,
        starttime: formatDateTime(startTime),
        endtime: formatDateTime(endTime),
        totalhours: Number(`${totalhours}`),   // send numeric hours
        actualhours: Number(`${actualhours}`) // ensure numeric
      },
      { headers: { "Content-Type": "application/json" } }
    );

    if (response.data.success) {
      Alert.alert("✅ Success", "Additional hours added!", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } else {
      Alert.alert("❌ Failed", response.data.message || "Update failed.");
    }
  } catch (error) {
    console.error("Error adding hours:", error.response?.data || error.message);
    Alert.alert("Error", "Failed to add hours. Please try again.");
  }
};


  return (
    <View style={styles.container}>
  <Text style={styles.header}>➕ Add Additional Hours</Text>

  <Text style={styles.label}>ActualHours:</Text>
  <TextInput
    style={styles.input}
    value={`${actualhours}`}
    onChangeText={setActualHours}
    editable={false}
    placeholder="ActualHours"
  />

  <Text style={styles.label}>Workorder:</Text>
  <TextInput
    style={styles.input}
    value={workorder}
    onChangeText={setWorkorder}
    editable={false}
    placeholder="Workorder ID"
  />

  {/* Start Time */}
  <Text style={styles.label}>Start Time:</Text>
  <TextInput
    style={styles.input}
    value={startTime ? startTime.toLocaleTimeString() : ""}
    editable={false}
    placeholder="Press button to set"
  />
  <Button title="Set Start Time" onPress={handleStart} />

  {/* End Time */}
  <Text style={styles.label}>End Time:</Text>
  <TextInput
    style={styles.input}
    value={endTime ? endTime.toLocaleTimeString() : ""}
    editable={false}
    placeholder="Press button to set"
  />
  <Button title="Set End Time" onPress={handleEnd} />

  

  {/* Total Hours */}
  <Text style={styles.label}>Total Hours:</Text>
  <TextInput
    style={styles.input}
    value={`${totalhours}`}
    editable={true}
    placeholder="Calculated automatically"
  />


  {/* Save */}
  <TouchableOpacity 
    style={[styles.button, (!startTime || !endTime) && { backgroundColor: "#ccc" }]} 
    onPress={handleSave}
    disabled={!startTime || !endTime}
  >
    <Text style={styles.buttonText}>💾 Save Hours</Text>
  </TouchableOpacity>
</View>

  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  header: { fontSize: 22, fontWeight: "bold", marginBottom: 20, textAlign: "center", color: "#075e54" },
  label: { fontSize: 16, marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderColor: "#aaa",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    marginBottom: 20,
    backgroundColor: "#f9f9f9",
  },
  button: {
    backgroundColor: "#00BCD4",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});

export default AddAdditionalHoursScreen;
