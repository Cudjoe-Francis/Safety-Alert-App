import { MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const faqs = [
  {
    question: "How do I add emergency contacts?",
    answer:
      "Go to the Emergency Contacts section and tap 'Add Contact'. Fill in the details and save.",
  },
  {
    question: "How does the SOS button work?",
    answer:
      "Pressing the SOS button opens your phone's SMS app with a pre-filled message to all your emergency contacts.",
  },
  {
    question: "Is my data secure?",
    answer: "Yes, your data is securely stored and only accessible to you.",
  },
  {
    question: "Can I customize the SOS message?",
    answer: "Yes, you can customize the SOS message in the settings.",
  },
];

const FAQsScreen = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <View style={styles.headerRow}>
            <MaterialIcons name="help-outline" size={28} color="#ff5330" />
            <Text style={styles.title}>Frequently Asked Questions</Text>
          </View>
          {faqs.map((faq, idx) => (
            <View key={idx} style={styles.faqItem}>
              <TouchableOpacity
                style={styles.questionRow}
                onPress={() => setOpenIndex(openIndex === idx ? null : idx)}
                activeOpacity={0.7}
              >
                <Text style={styles.question}>{faq.question}</Text>
                <MaterialIcons
                  name={openIndex === idx ? "expand-less" : "expand-more"}
                  size={24}
                  color="#ff5330"
                />
              </TouchableOpacity>
              {openIndex === idx && (
                <Text style={styles.answer}>{faq.answer}</Text>
              )}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default FAQsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6f7fb",
    // justifyContent: "center",
    // alignItems: "center",
  },
  content: {
    padding: 24,
    alignItems: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 28,
    width: "100%",
    maxWidth: 400,
    elevation: 6,
    shadowColor: "#ff5330",
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#222",
    marginLeft: 10,
  },
  faqItem: {
    marginBottom: 16,
    borderBottomWidth: 1,
    borderColor: "#eee",
    paddingBottom: 8,
  },
  questionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  question: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ff5330",
    flex: 1,
    marginRight: 8,
  },
  answer: {
    fontSize: 15,
    color: "#333",
    marginTop: 8,
    lineHeight: 22,
  },
});
