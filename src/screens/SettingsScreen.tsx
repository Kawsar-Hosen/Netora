import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useApp } from "@/context/AppContext";
import { colorsFor, fonts } from "@/theme/theme";
import { Card, Header, Pill, Row, Screen } from "@/components/ui";
export default function SettingsScreen() {
  const { dark, theme, setTheme, unit, setUnit, currentServer } = useApp();
  const C = colorsFor(dark);
  const router = useRouter();
  const serverLocation = currentServer
    ? [currentServer.city, currentServer.country].filter(Boolean).join(", ") ||
      currentServer.colo ||
      "Detecting…"
    : "Auto / Best Server";
  const modes = ["system", "light", "dark"] as const;
  return (
    <Screen>
      <Header title="Settings" subtitle="Make Netora yours" />
      <Card>
        <Text style={[styles.section, { color: C.text }]}>Appearance</Text>
        <View style={styles.segment}>
          {modes.map((mode) => (
            <Pressable
              key={mode}
              onPress={() => setTheme(mode)}
              style={[
                styles.option,
                { backgroundColor: C.line },
                theme === mode && { backgroundColor: C.accent },
              ]}
            >
              <Text
                style={{
                  color: theme === mode ? C.accentText : C.subtext,
                  fontWeight: "600",
                }}
              >
                {mode[0].toUpperCase() + mode.slice(1)}
              </Text>
            </Pressable>
          ))}
        </View>
        <Text style={[styles.section, { color: C.text, marginTop: 22 }]}>
          Speed unit
        </Text>
        <View style={styles.segment}>
          {(["Mbps", "MB/s"] as const).map((item) => (
            <Pressable
              key={item}
              onPress={() => setUnit(item)}
              style={[
                styles.option,
                { backgroundColor: C.line },
                unit === item && { backgroundColor: C.accent },
              ]}
            >
              <Text
                style={{
                  color: unit === item ? C.accentText : C.subtext,
                  fontWeight: "600",
                }}
              >
                {item}
              </Text>
            </Pressable>
          ))}
        </View>
      </Card>
      <Card>
        <Row
          icon="server-outline"
          label="Automatic server selection"
          value="On"
        />
        <Pressable
          onPress={() => router.push("/servers")}
          style={[styles.locationRow, { borderBottomColor: C.line }]}
        >
          <Ionicons name="navigate-outline" size={19} color={C.accent} />
          <View style={{ flex: 1 }}>
            <Text style={[styles.locationLabel, { color: C.subtext }]}>
              Server location
            </Text>
            <Text
              numberOfLines={1}
              style={[styles.locationValue, { color: C.text }]}
            >
              {serverLocation}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={17} color={C.subtext} />
        </Pressable>
        <Row icon="trash-outline" label="Test history" value="Stored locally" />
      </Card>
      <Card>
        <Text style={[styles.section, { color: C.text }]}>
          Privacy & access
        </Text>
        <Text style={[styles.body, { color: C.subtext }]}>
          Netora does not upload your test history. Android may require location
          access before Wi-Fi identifiers can be shown.
        </Text>
        <Row icon="shield-checkmark-outline" label="Privacy Settings" value="Permissions & lookups" onPress={() => router.push('/privacy-settings')} />
        <Row icon="document-text-outline" label="Privacy Policy" value="Read" onPress={() => router.push('/privacy-policy')} />
      </Card>
      <Card>
        <Text style={[styles.section, { color: C.text }]}>About Netora</Text>
        <Text style={[styles.body, { color: C.subtext }]}>
          A lightweight network utility built for clear answers, accurate
          states, and local-first privacy.
        </Text>
        <Pill tone="muted">Version 1.0.0</Pill>
      </Card>
    </Screen>
  );
}
const styles = StyleSheet.create({
  section: { fontWeight: "700", fontSize: 15, marginBottom: 13 },
  segment: { flexDirection: "row", gap: 8 },
  option: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 11,
    borderRadius: 7,
  },
  body: { fontSize: 13, lineHeight: 20, marginBottom: 16 },
  link: { marginBottom: 13 },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 11,
    borderBottomWidth: 1,
    minHeight: 58,
    paddingVertical: 8,
  },
  locationLabel: { fontSize: 12, fontFamily: fonts.medium },
  locationValue: { fontSize: 13, marginTop: 3 },
});
