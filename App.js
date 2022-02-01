import { StatusBar } from "expo-status-bar";
import {
  Button,
  StyleSheet,
  Text,
  View,
  TextInput,
  FlatList,
} from "react-native";
import React, { useEffect, useState } from "react";
import axios from "axios";
import * as SQLite from "expo-sqlite";

function openDatabase() {
  if (Platform.OS === "web") {
    return {
      transaction: () => {
        return {
          executeSql: () => {},
        };
      },
    };
  }

  const db = SQLite.openDatabase("db.db");
  return db;
}

const db = openDatabase();
export default function App() {
  const [DataRes, setRes] = useState([]);
  const [level, setlevel] = useState("");
  // const [items, setItems] = useState([]);

  const getACType = async () => {
    const severityResp = await axios.get(
      "https://apisafety.piac.com.pk/index.php/api/severity_levels"
    );
    console.log(severityResp.data.data);
    setRes(severityResp.data.data);
    console.log("DataFromAPI-------------->", DataRes);
  };

  //
  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        "create table if not exists items11 (id integer primary key not null, done int,level text );"
        // "drop table if exists items11"
        // [],
        // (tx, results) => {
        //   console.log("Table items11 dropped", results);
        // }
      );
    });
    getACType();
  }, []);
  //

  useEffect(() => {}, []);
  useEffect(() => {
    const addDataInTable = () => {
      if (level) {
        return false;
      } else {
        DataRes.map((val) => {
          db.transaction(
            (tx) => {
              tx.executeSql("insert into items11(done, level) values (0, ?)", [
                val.level_name,
              ]);
              tx.executeSql("select * from items11", [], (_, { rows }) => {
                setlevel(JSON.stringify(rows));
                console.log(JSON.stringify(rows));
              });
            },
            null
            // forceUpdate
          );
        });
      }
    };

    addDataInTable();
  });

  return (
    <View style={styles.container}>
      {Platform.OS === "web" ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text style={styles.heading}>
            Expo SQlite is not supported on web!
          </Text>
        </View>
      ) : (
        <View>
          {/* {DataRes.map((item) => {
            setlevel(item);
            add(level);
          })} */}
          {/* <TextInput
            onChangeText={(text) => setlevel(text)}
            placeholder="title"
            value={level}
          /> */}
          {/* {level.map((val) => {
            return <Text>{val.level}</Text>;
          })} */}
          {/* {items.map((val, index) => {
            return <Text key={index}>{val}</Text>;
          })} */}
        </View>
      )}

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
