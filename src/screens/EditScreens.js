import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import axios from "axios";

const EditScreen = ({ route, navigation }) => {
  const {record, INPUT_ID, INPUT_REG_DATE, INPUT_MACHINEE, INPUT_CUSTOMER, INPUT_WORKORDER, INPUT_JOBDESCRIPTION, INPUT_STARTTIME, INPUT_EMDTIME, INPUT_TOTALHOURS, INPUT_ACTUALHOURS} = route.params || {};

  // Handle both navigation sources (from SearchPayment or DetailsScreen)
  const [id, setId] = useState(record?.id || INPUT_ID || "");
  const [regDate, setRegDate] = useState(record?.reg_date || INPUT_REG_DATE || "");
  const [machine, setMachine] = useState(record?.machine || INPUT_MACHINEE || "");
  const [customer, setCustomer] = useState(record?.customer || INPUT_CUSTOMER || "");
  const [workorder, setWorkorder] = useState(record?.workorder || INPUT_WORKORDER || "");
  const [jobdescription, setJobDescription] = useState(record?.jobdescription || INPUT_JOBDESCRIPTION || "");
  const [startTime, setStartTime] = useState(record?.starttime ? new Date(record.starttime) : INPUT_STARTTIME || "");
  const [endTime, setEndTime] = useState(record?.endtime ? new Date(record.endtime) : INPUT_EMDTIME || "");
  const [totalhours, setTotalhours] = useState(record?.totalhours || INPUT_TOTALHOURS || "");
  const [actualhours, setActualHours] = useState(record?.actualhours || INPUT_ACTUALHOURS || "");
  const [endButton, setEndButton] = useState(true);
  const [startButton, setStartButton] = useState(true);
  const [additionalButton, setAdditionalButton] = useState(false);
  const [addAdditionalHours, setAddAdditionalHours] = useState(true)

  const handleStart = () => {
    const now = new Date();
    setStartTime(now);
    setEndTime(null);
    setTotalhours(null);
    setActualHours(null);
    setStartButton(false);
  };

  const handleEnd = () => {
    const now = new Date();
    setEndTime(now);
    setEndButton(false)
    setAddAdditionalHours(false)

    if (startTime) {
      const minutes = (now - startTime) / (1000 * 60);
      setTotalhours(minutes);
      setActualHours(minutes);
    }
  };

  
  const handleUpdate = async () => {

    const formatDateTime = (date) => {
    if (!date) return null;
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

    if (!customer || !workorder) {
      Alert.alert("Warning", "Please fill in all required fields.");
      return;
    }

    try {
      const response = await axios.post(
        "HOSTING_API_URL" + "updateData.php",
        {
          id, 
          reg_date: regDate, 
          machine, 
          customer, 
          workorder, 
          jobdescription, 
          starttimeValue: formatDateTime(startTime), 
          endtimeValue: formatDateTime(endTime), 
          totalhours: Number(totalhours), 
          actualhours: Number(actualhours)
        }
      );

      if (response.data.success) {
        Alert.alert("✅ Success", "Record updated successfully!", [
          { text: "OK", onPress: () => navigation.goBack() },
        ]);
      } else {
        Alert.alert("❌ Failed", response.data.message || "Update failed.");
      }
    } catch (error) {
      console.error("Error updating record:", error);
      Alert.alert("Error", "Failed to update record. Please try again.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>✏️ Edit Workorder Details</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Registration Date</Text>
        <TextInput
          style={styles.input}
          value={regDate}
          onChangeText={setRegDate}
          placeholder="YYYY-MM-DD"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Machine</Text>
        <TextInput
          style={styles.input}
          value={machine}
          onChangeText={setMachine}
          placeholder="Enter machine name"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Customer</Text>
        <TextInput
          style={styles.input}
          value={customer}
          onChangeText={setCustomer}
          placeholder="Enter customer name"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Workorder</Text>
        <TextInput
          style={styles.input}
          value={workorder}
          onChangeText={setWorkorder}
          placeholder="Enter workorder"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Job Description</Text>
        <TextInput
          style={[styles.input, { height: 80, textAlignVertical: "top" }]}
          value={jobdescription}
          onChangeText={setJobDescription}
          multiline
          placeholder="Enter job description"
        />
      </View>
      <View >
        <Text style={styles.label}>Start Time: </Text>
        <TextInput
          style={[styles.input]}
          value={startTime ? startTime.toLocaleTimeString() : ""}
          placeholder="Start Time:"
        />
        
      </View>
      
      <View>
        <Text style={styles.label}>End Time: </Text>
        <TextInput
          style={[styles.input]}
          value={endTime ? endTime.toLocaleTimeString() : ""}
          placeholder="End Time:"
        />
      </View>
      <View>
        <Text style={styles.label}>Total Hours: </Text>
        <TextInput
          style={[styles.input]}
          value={`${totalhours ? `${totalhours.toFixed(2)}` : "—"}`}
          onChangeText={setTotalhours}
          placeholder="Total Hours:"
        />
      </View>

      <View>
        <Text style={styles.label}>Actual Hours: </Text>
        <TextInput
          style={[styles.input]}
          value={`${actualhours ? `${actualhours.toFixed(2)}` : "—"}`}
          onChangeText={setActualHours}
          placeholder="Actual Hours:"
        />
      </View>

           
      <View style={{marginTop:20}}>
        {totalhours == "" && INPUT_TOTALHOURS != "" && (          
        <Button style={styles.button} title="Start" onPress={handleStart} />        
        )}
        {startButton == false && endButton == true &&(
          <Button style={styles.button} title="End" onPress={()=> { handleEnd(); setAdditionalButton(true)}} />
        )}
        {(record?.actualhours ? <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("AdditionalHoursScreen", { recordId: id, workorder, actualhours })}>
          <Text style={styles.buttonText}>➕ Add Additional Hours</Text>
        </TouchableOpacity> : ""
        )}
      </View>
             
      <TouchableOpacity style={styles.button} onPress={()=>{handleUpdate(); setAddAdditionalHours(false);}}>
        <Text style={styles.buttonText}>💾 Update Record</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#075e54",
    marginBottom: 20,
    textAlign: "center",
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#aaa",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  button: {
    backgroundColor: "#00BCD4",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop:20,
    marginBottom:20,
    padding:20
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    padding:10
  },
});

export default EditScreen;
