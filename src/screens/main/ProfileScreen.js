import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../config/supabase';

export default function ProfileScreen() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: '',
    age: '',
    gender: '',
    conditions: [],
    medications: [],
    allergies: [],
  });

  useEffect(() => {
    loadProfile();
  }, [user]);

  const loadProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error) throw error;

      if (data) {
        setProfile({
          name: data.name || '',
          age: data.age?.toString() || '',
          gender: data.gender || '',
          conditions: data.conditions || [],
          medications: data.medications || [],
          allergies: data.allergies || [],
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveProfile = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('users')
        .update({
          name: profile.name,
          age: parseInt(profile.age) || null,
          gender: profile.gender,
          conditions: profile.conditions,
          medications: profile.medications,
          allergies: profile.allergies,
        })
        .eq('id', user?.id);

      if (error) throw error;

      Alert.alert('Success', 'Profile updated successfully!');
      setEditing(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile');
      console.error('Error saving profile:', error);
    } finally {
      setSaving(false);
    }
  };

  const updateProfile = (field, value) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2DD4BF" />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <Ionicons name="person" size={48} color="#2DD4BF" />
          </View>
          <Text style={styles.email}>{user?.email}</Text>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => setEditing(!editing)}
          >
            <Ionicons 
              name={editing ? 'close' : 'pencil'} 
              size={20} 
              color="#2DD4BF" 
            />
            <Text style={styles.editButtonText}>
              {editing ? 'Cancel' : 'Edit Profile'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={[styles.input, !editing && styles.inputDisabled]}
              value={profile.name}
              onChangeText={(value) => updateProfile('name', value)}
              placeholder="Enter your full name"
              editable={editing}
            />
          </View>

          <View style={styles.row}>
            <View style={styles.halfInput}>
              <Text style={styles.label}>Age</Text>
              <TextInput
                style={[styles.input, !editing && styles.inputDisabled]}
                value={profile.age}
                onChangeText={(value) => updateProfile('age', value)}
                placeholder="Age"
                keyboardType="numeric"
                editable={editing}
              />
            </View>

            <View style={styles.halfInput}>
              <Text style={styles.label}>Gender</Text>
              <TextInput
                style={[styles.input, !editing && styles.inputDisabled]}
                value={profile.gender}
                onChangeText={(value) => updateProfile('gender', value)}
                placeholder="Gender"
                editable={editing}
              />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Health Information</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Medical Conditions</Text>
            <TextInput
              style={[styles.textArea, !editing && styles.inputDisabled]}
              value={profile.conditions.join(', ')}
              onChangeText={(value) => updateProfile('conditions', value.split(', ').filter(Boolean))}
              placeholder="Enter conditions separated by commas"
              multiline
              numberOfLines={3}
              editable={editing}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Current Medications</Text>
            <TextInput
              style={[styles.textArea, !editing && styles.inputDisabled]}
              value={profile.medications.join(', ')}
              onChangeText={(value) => updateProfile('medications', value.split(', ').filter(Boolean))}
              placeholder="Enter medications separated by commas"
              multiline
              numberOfLines={3}
              editable={editing}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Allergies</Text>
            <TextInput
              style={[styles.textArea, !editing && styles.inputDisabled]}
              value={profile.allergies.join(', ')}
              onChangeText={(value) => updateProfile('allergies', value.split(', ').filter(Boolean))}
              placeholder="Enter allergies separated by commas"
              multiline
              numberOfLines={3}
              editable={editing}
            />
          </View>
        </View>

        {editing && (
          <TouchableOpacity
            style={[styles.saveButton, saving && styles.buttonDisabled]}
            onPress={saveProfile}
            disabled={saving}
          >
            <Text style={styles.saveButtonText}>
              {saving ? 'Saving...' : 'Save Changes'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#64748b',
  },
  content: {
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#e0f2fe',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  email: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 16,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#e0f2fe',
  },
  editButtonText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#2DD4BF',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  inputDisabled: {
    backgroundColor: '#f9fafb',
    color: '#6b7280',
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    minHeight: 80,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    flex: 0.48,
  },
  saveButton: {
    backgroundColor: '#2DD4BF',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});