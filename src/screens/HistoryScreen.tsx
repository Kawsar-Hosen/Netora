import React from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { useApp } from "@/context/AppContext";
import { colorsFor } from "@/theme/theme";
import { Card, Header, Metric, Screen } from "@/components/ui";
import { displaySpeed } from "@/data/units";
export default function HistoryScreen() {
  const { dark, history, clearHistory, removeResult, unit } = useApp();
  const C = colorsFor(dark);
  return (
    <Screen>
      <Header
        title="History"
        subtitle="Your tests stay on this device"
        action={
          history.length > 0 ? (
            <Pressable
              onPress={() =>
                Alert.alert(
                  "Clear history?",
                  "This removes every saved result from this device.",
                  [
                    { text: "Cancel" },
                    {
                      text: "Clear",
                      style: "destructive",
                      onPress: clearHistory,
                    },
                  ],
                )
              }
            >
              <Text style={{ color: C.danger, fontWeight: "700" }}>
                Clear all
              </Text>
            </Pressable>
          ) : undefined
        }
      />
      {history.length === 0 ? (
        <Card>
          <Text style={[styles.emptyTitle, { color: C.text }]}>
            No tests yet
          </Text>
          <Text style={[styles.emptyBody, { color: C.subtext }]}>
            Run a speed test on Home and your result will appear here. Nothing
            is uploaded.
          </Text>
        </Card>
      ) : (
        history.map((item) => (
          <Card key={item.id}>
            <View style={styles.itemHead}>
              <View>
                <Text style={[styles.date, { color: C.text }]}>
                  {item.date} · {item.time}
                </Text>
                <Text style={[styles.network, { color: C.subtext }]}>
                  {item.networkName} · {item.networkType}
                </Text>
              </View>
              <Pressable
                accessibilityLabel="Delete result"
                onPress={() => removeResult(item.id)}
              >
                <Text style={{ color: C.danger, fontSize: 12 }}>Delete</Text>
              </Pressable>
            </View>
            <View style={styles.metrics}>
              <Metric label="Download" value={displaySpeed(item.download, unit)} unit={unit} />
              <Metric label="Upload" value={displaySpeed(item.upload, unit)} unit={unit} />
              <Metric label="Ping" value={item.ping} unit="ms" />
            </View>
            <Text style={[styles.server, { color: C.subtext }]}>
              Server · {item.server} · {item.packetLoss}% loss
            </Text>
          </Card>
        ))
      )}
    </Screen>
  );
}
const styles = StyleSheet.create({
  emptyTitle: { fontSize: 17, fontWeight: "700" },
  emptyBody: { fontSize: 13, lineHeight: 20, marginTop: 9 },
  itemHead: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 21,
  },
  date: { fontWeight: "700" },
  network: { fontSize: 12, marginTop: 5 },
  metrics: { flexDirection: "row", gap: 12 },
  server: { fontSize: 12, marginTop: 18 },
});
