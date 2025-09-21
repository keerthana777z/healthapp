import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Trophy, 
  Star, 
  Flame, 
  Target, 
  Award,
  Medal,
  Zap
} from 'lucide-react';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  unlocked: boolean;
  progress?: number;
  maxProgress?: number;
}

interface GamificationData {
  points: number;
  level: number;
  streak: number;
  achievements: Achievement[];
  weeklyGoals: number;
  weeklyGoalsCompleted: number;
}

interface GamificationPanelProps {
  patientId: string;
  onUpdate?: (data: GamificationData) => void;
}

export const GamificationPanel = ({ patientId, onUpdate }: GamificationPanelProps) => {
  const [gamificationData, setGamificationData] = useState<GamificationData>({
    points: 0,
    level: 1,
    streak: 0,
    achievements: [
      {
        id: 'first-goal',
        name: 'First Steps',
        description: 'Complete your first daily goal',
        icon: <Target className="h-4 w-4" />,
        unlocked: false
      },
      {
        id: 'week-streak',
        name: 'Week Warrior',
        description: 'Maintain a 7-day streak',
        icon: <Flame className="h-4 w-4" />,
        unlocked: false,
        progress: 0,
        maxProgress: 7
      },
      {
        id: 'points-master',
        name: 'Points Master',
        description: 'Earn 1000 points',
        icon: <Star className="h-4 w-4" />,
        unlocked: false,
        progress: 0,
        maxProgress: 1000
      },
      {
        id: 'goal-crusher',
        name: 'Goal Crusher',
        description: 'Complete 50 daily goals',
        icon: <Trophy className="h-4 w-4" />,
        unlocked: false,
        progress: 0,
        maxProgress: 50
      }
    ],
    weeklyGoals: 7,
    weeklyGoalsCompleted: 0
  });
  
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadGamificationData();
  }, [patientId]);

  const loadGamificationData = async () => {
    try {
      const { data, error } = await supabase
        .from('patient_logs')
        .select('*')
        .eq('patient_id', patientId)
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) throw error;

      if (data && data[0]) {
        const log = data[0];
        // Parse gamification data from patient logs
        const savedData = log.micro_goals as any;
        
        if (savedData?.gamification) {
          setGamificationData(prev => ({
            ...prev,
            ...savedData.gamification
          }));
        }
      }
    } catch (error: any) {
      console.error('Error loading gamification data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateGamificationData = async (newData: Partial<GamificationData>) => {
    try {
      const updatedData = { ...gamificationData, ...newData };
      setGamificationData(updatedData);

      // Save to Supabase
      const { error } = await supabase
        .from('patient_logs')
        .upsert({
          patient_id: patientId,
          micro_goals: JSON.parse(JSON.stringify({
            gamification: updatedData
          })),
          created_at: new Date().toISOString()
        });

      if (error) throw error;

      onUpdate?.(updatedData);
      
    } catch (error: any) {
      toast({
        title: "Error updating gamification data",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const addPoints = (points: number) => {
    const newPoints = gamificationData.points + points;
    const newLevel = Math.floor(newPoints / 500) + 1; // Level up every 500 points
    
    updateGamificationData({
      points: newPoints,
      level: newLevel
    });

    if (newLevel > gamificationData.level) {
      toast({
        title: "Level Up! 🎉",
        description: `You've reached level ${newLevel}!`
      });
    }
  };

  const incrementStreak = () => {
    const newStreak = gamificationData.streak + 1;
    updateGamificationData({
      streak: newStreak
    });

    // Check for streak achievements
    if (newStreak === 7) {
      unlockAchievement('week-streak');
    }
  };

  const unlockAchievement = (achievementId: string) => {
    const updatedAchievements = gamificationData.achievements.map(achievement =>
      achievement.id === achievementId
        ? { ...achievement, unlocked: true }
        : achievement
    );

    updateGamificationData({
      achievements: updatedAchievements
    });

    const achievement = updatedAchievements.find(a => a.id === achievementId);
    if (achievement) {
      toast({
        title: "Achievement Unlocked! 🏆",
        description: `${achievement.name}: ${achievement.description}`
      });
    }
  };

  const getLevelProgress = () => {
    const pointsInCurrentLevel = gamificationData.points % 500;
    return (pointsInCurrentLevel / 500) * 100;
  };

  const getStreakColor = (streak: number) => {
    if (streak >= 30) return 'text-purple-600';
    if (streak >= 14) return 'text-blue-600';
    if (streak >= 7) return 'text-green-600';
    if (streak >= 3) return 'text-yellow-600';
    return 'text-gray-600';
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-1/2"></div>
            <div className="h-8 bg-muted rounded"></div>
            <div className="h-4 bg-muted rounded w-3/4"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Points & Level Card */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold flex items-center space-x-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            <span>Your Progress</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{gamificationData.points}</div>
                <div className="text-xs text-muted-foreground">Points</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">Level {gamificationData.level}</div>
                <div className="text-xs text-muted-foreground">Current Level</div>
              </div>
              <div className="text-center">
                <div className={`text-2xl font-bold ${getStreakColor(gamificationData.streak)}`}>
                  <Flame className="inline h-5 w-5 mr-1" />
                  {gamificationData.streak}
                </div>
                <div className="text-xs text-muted-foreground">Day Streak</div>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Level Progress</span>
              <span>{gamificationData.points % 500}/500</span>
            </div>
            <Progress value={getLevelProgress()} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Achievements Card */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold flex items-center space-x-2">
            <Award className="h-5 w-5 text-purple-500" />
            <span>Achievements</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {gamificationData.achievements.map((achievement) => (
            <div key={achievement.id} className="flex items-center space-x-3 p-2 rounded-lg border">
              <div className={`p-2 rounded-full ${
                achievement.unlocked 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted text-muted-foreground'
              }`}>
                {achievement.unlocked ? <Medal className="h-4 w-4" /> : achievement.icon}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className={`font-medium ${
                    achievement.unlocked ? 'text-foreground' : 'text-muted-foreground'
                  }`}>
                    {achievement.name}
                  </span>
                  {achievement.unlocked && (
                    <Badge variant="secondary" className="text-xs">
                      <Zap className="h-3 w-3 mr-1" />
                      Unlocked
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">{achievement.description}</p>
                
                {achievement.progress !== undefined && achievement.maxProgress && !achievement.unlocked && (
                  <div className="mt-2 space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>Progress</span>
                      <span>{achievement.progress}/{achievement.maxProgress}</span>
                    </div>
                    <Progress 
                      value={(achievement.progress / achievement.maxProgress) * 100} 
                      className="h-1" 
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Weekly Goals Card */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold flex items-center space-x-2">
            <Target className="h-5 w-5 text-green-500" />
            <span>Weekly Challenge</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Complete {gamificationData.weeklyGoals} daily goals</span>
              <Badge variant={gamificationData.weeklyGoalsCompleted >= gamificationData.weeklyGoals ? "default" : "secondary"}>
                {gamificationData.weeklyGoalsCompleted}/{gamificationData.weeklyGoals}
              </Badge>
            </div>
            <Progress 
              value={(gamificationData.weeklyGoalsCompleted / gamificationData.weeklyGoals) * 100} 
              className="h-2" 
            />
            {gamificationData.weeklyGoalsCompleted >= gamificationData.weeklyGoals && (
              <div className="text-sm text-success font-medium">
                🎉 Weekly challenge completed! Great job!
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};