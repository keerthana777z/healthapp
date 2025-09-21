import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { RiskCard } from '@/components/dashboard/RiskCard';
import { TrustScoreBadge } from '@/components/dashboard/TrustScoreBadge';
import { ShapExplanation } from '@/components/dashboard/ShapExplanation';
import { MicroGoalsPanel } from '@/components/dashboard/MicroGoalsPanel';
import { GamificationPanel } from '@/components/gamification/GamificationPanel';
import { VoiceAssistant } from '@/components/voice/VoiceAssistant';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { LogOut, User, Brain, Activity } from 'lucide-react';

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const [aiRecommendations] = useState("Based on your health data, I recommend increasing your daily steps to 10,000, maintaining consistent sleep of 7-8 hours, and monitoring your blood glucose levels more regularly. Consider reducing stress through meditation or light exercise.");
  
  const sampleRiskDrivers = [
    { factor: 'BMI', impact: 25, value: '28.5 kg/m²' },
    { factor: 'HbA1c', impact: 20, value: '7.2%' },
    { factor: 'Blood Pressure', impact: 15, value: '140/90 mmHg' }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Activity className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                AI Health Coach
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span className="text-sm">{user?.email}</span>
              </div>
              <Button onClick={signOut} variant="outline" size="sm">
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Risk Cards & Trust Score */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Health Overview</h2>
              <TrustScoreBadge score={85} />
            </div>
            
            <RiskCard
              title="Type 2 Diabetes"
              percentage={32}
              level="medium"
              icon="activity"
            />
            
            <RiskCard
              title="Hypertension"
              percentage={68}
              level="high"
              icon="heart"
            />

            <ShapExplanation drivers={sampleRiskDrivers} />
          </div>

          {/* Middle Column - Micro Goals & AI Recommendations */}
          <div className="space-y-6">
            <MicroGoalsPanel 
              patientId={user?.id || ''} 
              initialGoals={{}}
            />
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Brain className="h-5 w-5 text-purple-500" />
                  <span>AI Recommendations</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {aiRecommendations}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Badge variant="outline">Personalized</Badge>
                  <Badge variant="outline">Evidence-based</Badge>
                  <Badge variant="outline">Updated daily</Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Gamification */}
          <div className="space-y-6">
            <GamificationPanel patientId={user?.id || ''} />
          </div>
        </div>
      </div>

      {/* Voice Assistant */}
      <VoiceAssistant aiRecommendations={aiRecommendations} />
    </div>
  );
};

export default Dashboard;