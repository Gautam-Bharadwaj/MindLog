import React, { useContext, useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    FlatList,
    TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { JournalContext } from "../context/JournalContext";
import dayjs from "dayjs";

export default function EntriesScreen({ navigation }) {
    const { entries, toggleFavorite, deleteEntry } = useContext(JournalContext);
    const [searchQuery, setSearchQuery] = useState("");

    const filteredEntries = entries.filter((entry) => {
        const textMatch = entry.text?.toLowerCase().includes(searchQuery.toLowerCase());
        const moodMatch = entry.mood?.toLowerCase().includes(searchQuery.toLowerCase());
        return textMatch || moodMatch;
    });

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>All Entries</Text>
                <View style={{ width: 24 }} />
            </View>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color="#888" style={{ marginRight: 8 }} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search entries..."
                    placeholderTextColor="#888"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            </View>

            {/* Entries List */}
            <FlatList
                data={filteredEntries}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ paddingBottom: 20 }}
                ListEmptyComponent={
                    <View style={styles.empty}>
                        <Text style={styles.emptyText}>No entries found.</Text>
                    </View>
                }
                renderItem={({ item }) => (
                    <View style={styles.entryCard}>
                        {/* Top row */}
                        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                            <Text style={{ color: "#fff", fontWeight: "600" }}>{item.mood ?? "—"}</Text>
                            <Text style={{ color: "#aaa" }}>{dayjs(item.date).format("DD MMM YYYY")}</Text>
                        </View>

                        {/* text */}
                        {item.text ? (
                            <Text style={{ color: "#ddd", marginTop: 6 }}>
                                {item.text}
                            </Text>
                        ) : null}

                        {/* Sleep/Social tags */}
                        {item.sleep || item.social ? (
                            <View style={{ flexDirection: "row", marginTop: 8, gap: 12 }}>
                                {item.sleep ? <Text style={styles.tag}>{item.sleep}</Text> : null}
                                {item.social ? <Text style={styles.tag}>{item.social}</Text> : null}
                            </View>
                        ) : null}

                        {/* Favorite + Delete buttons */}
                        <View style={{ flexDirection: "row", justifyContent: "flex-end", marginTop: 12, gap: 20 }}>
                            <TouchableOpacity onPress={() => toggleFavorite(item.id)}>
                                <Ionicons
                                    name={item.favorite ? "star" : "star-outline"}
                                    size={24}
                                    color="#FFD600"
                                />
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => deleteEntry(item.id)}>
                                <Ionicons name="trash-outline" size={24} color="#FF5252" />
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#000", paddingTop: 50 },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    headerTitle: { color: "white", fontSize: 20, fontWeight: "bold" },
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#1F1F1F",
        marginHorizontal: 20,
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 12,
        marginBottom: 20,
    },
    searchInput: { flex: 1, color: "white", fontSize: 16 },
    entryCard: {
        backgroundColor: "#111",
        padding: 14,
        marginHorizontal: 20,
        marginBottom: 12,
        borderRadius: 12,
    },
    tag: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        backgroundColor: "#333",
        color: "#ddd",
        borderRadius: 6,
        fontSize: 12,
    },
    empty: { alignItems: "center", marginTop: 50 },
    emptyText: { color: "#666", fontSize: 16 },
});
