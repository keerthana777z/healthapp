import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../config/supabase';

export default function MicroGoalsPanel({ patientId, initialGoals, onUpdate }) {
  const [goals, setGoals] = useState([
    {
      id: 'steps',
      label: 'Steps',
      current: initialGoals?.steps || 0,
      target: initialGoals?.stepsTarget || 10000,
      unit: 'steps',
      icon: 'walk',
      color: '#3b82f6'
    },
    {
      id: 'sleep',
      label: 'Sleep',
      current: initialGoals?.sleep || 0,
      target: initialGoals?.sleepTarget || 8,
      unit: 'hours',
      icon: 'moon',
      color: '#8b5cf6'
    },
    {
      id: 'water',
      label: 'Water',
      current: initialGoals?.water || 0,
      target: initialGoals?.waterTarget || 8,
      unit: 'glasses',
      icon: 'water',
      color: '#06b6d4'
    },
  ]);

  const [editingGoal, setEditingGoal] = useState(null);
  const [editValue, setEditValue] = useState('');

  const handleEdit = (goalId, currentValue) => {
    setEditingGoal(goalId);
    setEditValue(currentValue.toString());
  };

  const handleSave = async (goalId) => {
    const newValue = parseFloat(editValue);
    
    try {
      const updatedGoals = goals.map(goal => 
        goal.id === goalId ? { ...goal, current: newValue } : goal
      );
      
      setGoals(updatedGoals);
      
      // Convert goals array to object for database storage
      const goalsData = updatedGoals.reduce((acc, goal) => ({
        ...acc,
        [goal.id]: goal.current,
        [`${goal.id}Target`]: goal.target
      }), {});

      // Update in Supabase
      const { error } = await supabase
        .from('patient_logs')
        .upsert({
          patient_id: patientId,
          micro_goals: goalsData,
          created_at: new Date().toISOString()
        });

      if (error) throw error;

      Alert.alert('Success', 'Goal updated successfully!');
      onUpdate?.();
      
    } catch (error) {
      Alert.alert('Error', 'Failed to update goal');
      console.error('Error updating goal:', error);
    } finally {
      setEditingGoal(null);
    }
  };

  const handleCancel = () => {
    setEditingGoal(null);
    setEditValue('');
  };

  const getProgress = (goal) => {
    return Math.min(100, (goal.current / goal.target) * 100);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Daily Micro-Goals</Text>
      
      {goals.map((goal) => {
        const progress = getProgress(goal);
        const isEditing = editingGoal === goal.id;
        
        return (
          <View key={goal.id} style={styles.goalItem}>
            <View style={styles.goalHeader}>
              <View style={styles.goalInfo}>
                <View style={[styles.iconContainer, { backgroundColor: `${goal.color}20` }]}>
                  <Ionicons name={goal.icon} size={20} color={goal.color} />
                </View>
                <Text style={styles.goalLabel}>{goal.label}</Text>
              </View>
              
              <View style={styles.goalValue}>
                {isEditing ? (
                  <View style={styles.editContainer}>
                    <TextInput
                      style={styles.editInput}
                      value={editValue}
                      onChangeText={setEditValue}
                      keyboardType="numeric"
                      autoFocus
                    />
                    <TouchableOpacity
                      style={styles.saveButton}
                      onPress={() => handleSave(goal.id)}
                    >
                      <Ionicons name="checkmark" size={16} color="#22c55e" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.cancelButton}
                      onPress={handleCancel}
                    >
                      <Ionicons name="close" size={16} color="#ef4444" />
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View style={styles.valueContainer}>
                    <Text style={styles.valueText}>
                      {goal.current}/{goal.target} {goal.unit}
                    </Text>
                    <TouchableOpacity
                      style={styles.editButton}
                      onPress={() => handleEdit(goal.id, goal.current)}
                    >
                      <Ionicons name="pencil" size={16} color="#64748b" />
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
            
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill, 
                    { width: `${progress}%`, backgroundColor: goal.color }
                  ]} 
                />
              </View>
              <Text style={styles.progressText}>{Math.round(progress)}%</Text>
            </View>
          </View>
        );
      })}
      
      <Text style={styles.helpText}>Tap the edit icon to update your progress</Text>
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
  goalItem: {
    marginBottom: 16,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  goalInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  goalLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1e293b',
  },
  goalValue: {
    alignItems: 'flex-end',
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  valueText: {
    fontSize: 14,
    color: '#64748b',
    marginRight: 8,
  },
  editButton: {
    padding: 4,
  },
  editContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 4,
    padding: 4,
    width: 60,
    textAlign: 'center',
    fontSize: 14,
  },
  saveButton: {
    marginLeft: 8,
    padding: 4,
  },
  cancelButton: {
    marginLeft: 4,
    padding: 4,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#f1f5f9',
    borderRadius: 3,
    overflow: 'hidden',
    marginRight: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: '#64748b',
    minWidth: 35,
    textAlign: 'right',
  },
  helpText: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'center',
    marginTop: 8,
  },
});