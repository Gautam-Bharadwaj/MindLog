import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@journal_entries';

// Load all entries
export const getEntries = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error("Error reading entries:", e);
    return [];
  }
};

// Save the entire list of entries
export const saveEntries = async (entries) => {
  try {
    const jsonValue = JSON.stringify(entries);
    await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
  } catch (e) {
    console.error("Error saving entries:", e);
  }
};