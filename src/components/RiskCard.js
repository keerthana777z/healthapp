import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function RiskCard({ title, percentage, level, description }) {
  const getRiskColor = (level) => {
    switch (level) {
      case 'low':
        return '#22c55e';
      case 'medium':
        return '#f59e0b';
      case 'high':
        return '#ef4444';
      default:
        return '#64748b';
    }
  };

  const getRiskIcon = (level) => {
    switch (level) {
      case 'low':
        return 'checkmark-circle';
      case 'medium':
        return 'warning';
      case 'high':
        return 'alert-circle';
      default:
        return 'information-circle';
    }
  };

  const riskColor = getRiskColor(level);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: `${riskColor}20` }]}>
          <Ionicons name={getRiskIcon(level)} size={24} color={riskColor} />
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
        </View>
        <View style={[styles.badge, { backgroundColor: riskColor }]}>
          <Text style={styles.badgeText}>{level.toUpperCase()}</Text>
        </View>
      </View>
      
      <View style={styles.progressContainer}>
        <Text style={styles.percentage}>{percentage}%</Text>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { width: `${percentage}%`, backgroundColor: riskColor }
            ]} 
          />
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
    marginBottom: 12,
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
    marginBottom: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  description: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 2,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  percentage: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    marginRight: 16,
    minWidth: 60,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#f1f5f9',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
});