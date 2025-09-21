import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../config/supabase';
import RiskCard from '../../components/RiskCard';
import MicroGoalsPanel from '../../components/MicroGoalsPanel';
import ShapExplanation from '../../components/ShapExplanation';
import AIRecommendations from '../../components/AIRecommendations';

export default function DashboardScreen() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [patientData, setPatientData] = useState(null);

  const sampleRiskDrivers = [
    { factor: 'BMI', impact: 25, value: '28.5 kg/m²' },
    { factor: 'HbA1c', impact: 20, value: '7.2%' },
    { factor: 'Blood Pressure', impact: 15, value: '140/90 mmHg' }
  ];

  const aiRecommendations = "Based on your health data, I recommend increasing your daily steps to 10,000, maintaining consistent sleep of 7-8 hours, and monitoring your blood glucose levels more regularly. Consider reducing stress through meditation or light exercise.";

  useEffect(() => {
    loadPatientData();
  }, [user]);

  const loadPatientData = async () => {
    try {
      const { data, error } = await supabase
        .from('patient_logs')
        .select('*')
        .eq('patient_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) throw error;

      if (data && data[0]) {
        setPatientData(data[0]);
      }
    } catch (error) {
      console.error('Error loading patient data:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadPatientData();
    setRefreshing(false);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2DD4BF" />
        <Text style={styles.loadingText}>Loading your health data...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.content}>
        <Text style={styles.welcomeText}>Welcome back!</Text>
        <Text style={styles.subtitleText}>Here's your health overview</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Risk Assessment</Text>
          <RiskCard
            title="Type 2 Diabetes"
            percentage={32}
            level="medium"
            description="Based on your current health metrics"
          />
          <RiskCard
            title="Hypertension"
            percentage={68}
            level="high"
            description="Monitor blood pressure regularly"
          />
        </View>

        <View style={styles.section}>
          <MicroGoalsPanel 
            patientId={user?.id || ''} 
            initialGoals={patientData?.micro_goals || {}}
            onUpdate={loadPatientData}
          />
        </View>

        <View style={styles.section}>
          <ShapExplanation drivers={sampleRiskDrivers} />
        </View>

        <View style={styles.section}>
          <AIRecommendations recommendations={aiRecommendations} />
        </View>
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
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  subtitleText: {
    fontSize: 16,
    color: '#64748b',
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 12,
  },
});