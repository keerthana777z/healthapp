import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function AIRecommendations({ recommendations }) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="bulb" size={24} color="#8b5cf6" />
        <Text style={styles.title}>AI Recommendations</Text>
      </View>
      
      <Text style={styles.content}>{recommendations}</Text>
      
      <View style={styles.badges}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Personalized</Text>
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Evidence-based</Text>
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Updated daily</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginLeft: 8,
  },
  content: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
    marginBottom: 16,
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  badge: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  badgeText: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
  },
});