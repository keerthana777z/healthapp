import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ShapExplanation({ drivers }) {
  const sortedDrivers = [...drivers].sort((a, b) => Math.abs(b.impact) - Math.abs(a.impact));
  const topDrivers = sortedDrivers.slice(0, 3);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Top Risk Drivers</Text>
      
      {topDrivers.map((driver, index) => (
        <View key={index} style={styles.driverItem}>
          <View style={styles.driverHeader}>
            <View style={styles.driverInfo}>
              <Ionicons 
                name={driver.impact > 0 ? 'trending-up' : 'trending-down'} 
                size={20} 
                color={driver.impact > 0 ? '#ef4444' : '#22c55e'} 
              />
              <Text style={styles.driverName}>{driver.factor}</Text>
            </View>
            <Text style={styles.driverValue}>{driver.value}</Text>
          </View>
          
          <View style={styles.impactContainer}>
            <View style={styles.impactBar}>
              <View 
                style={[
                  styles.impactFill, 
                  { 
                    width: `${Math.abs(driver.impact)}%`,
                    backgroundColor: driver.impact > 0 ? '#ef4444' : '#22c55e'
                  }
                ]} 
              />
            </View>
            <Text style={[
              styles.impactText,
              { color: driver.impact > 0 ? '#ef4444' : '#22c55e' }
            ]}>
              {driver.impact > 0 ? '+' : ''}{driver.impact}%
            </Text>
          </View>
        </View>
      ))}
      
      <Text style={styles.helpText}>
        SHAP values show how each factor contributes to your risk score
      </Text>
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
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 16,
  },
  driverItem: {
    marginBottom: 16,
  },
  driverHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  driverInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  driverName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1e293b',
    marginLeft: 8,
  },
  driverValue: {
    fontSize: 14,
    color: '#64748b',
  },
  impactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  impactBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#f1f5f9',
    borderRadius: 3,
    overflow: 'hidden',
    marginRight: 12,
  },
  impactFill: {
    height: '100%',
    borderRadius: 3,
  },
  impactText: {
    fontSize: 14,
    fontWeight: '600',
    minWidth: 50,
    textAlign: 'right',
  },
  helpText: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'center',
    marginTop: 8,
  },
});