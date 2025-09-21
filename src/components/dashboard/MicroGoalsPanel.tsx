import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Footprints, 
  Moon, 
  Utensils, 
  Droplets, 
  Brain,
  Edit3,
  Check,
  X
} from 'lucide-react';

interface MicroGoal {
  id: string;
  label: string;
  current: number;
  target: number;
  unit: string;
  icon: React.ReactNode;
  color: string;
}

interface MicroGoalsPanelProps {
  patientId: string;
  initialGoals: any;
  onUpdate?: (goals: any) => void;
}

export const MicroGoalsPanel = ({ patientId, initialGoals, onUpdate }: MicroGoalsPanelProps) => {
  const [goals, setGoals] = useState<MicroGoal[]>([
    {
      id: 'steps',
      label: 'Steps',
      current: initialGoals?.steps || 0,
      target: initialGoals?.stepsTarget || 10000,
      unit: 'steps',
      icon: <Footprints className="h-4 w-4" />,
      color: 'bg-blue-500'
    },
    {
      id: 'sleep',
      label: 'Sleep',
      current: initialGoals?.sleep || 0,
      target: initialGoals?.sleepTarget || 8,
      unit: 'hours',
      icon: <Moon className="h-4 w-4" />,
      color: 'bg-purple-500'
    },
    {
      id: 'calories',
      label: 'Calories',
      current: initialGoals?.calories || 0,
      target: initialGoals?.caloriesTarget || 2000,
      unit: 'kcal',
      icon: <Utensils className="h-4 w-4" />,
      color: 'bg-orange-500'
    },
    {
      id: 'hydration',
      label: 'Water',
      current: initialGoals?.hydration || 0,
      target: initialGoals?.hydrationTarget || 8,
      unit: 'glasses',
      icon: <Droplets className="h-4 w-4" />,
      color: 'bg-cyan-500'
    },
    {
      id: 'stress',
      label: 'Stress Level',
      current: initialGoals?.stress || 5,
      target: 3, // Lower is better for stress
      unit: '/10',
      icon: <Brain className="h-4 w-4" />,
      color: 'bg-red-500'
    }
  ]);

  const [editingGoal, setEditingGoal] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [updating, setUpdating] = useState(false);
  const { toast } = useToast();

  const handleEdit = (goalId: string, currentValue: number) => {
    setEditingGoal(goalId);
    setEditValue(currentValue.toString());
  };

  const handleSave = async (goalId: string) => {
    setUpdating(true);
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

      toast({
        title: "Goal updated successfully!",
        description: `${goals.find(g => g.id === goalId)?.label} has been updated.`
      });

      onUpdate?.(goalsData);
      
    } catch (error: any) {
      toast({
        title: "Error updating goal",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setUpdating(false);
      setEditingGoal(null);
    }
  };

  const handleCancel = () => {
    setEditingGoal(null);
    setEditValue('');
  };

  const getProgress = (goal: MicroGoal) => {
    if (goal.id === 'stress') {
      // For stress, lower is better, so invert the calculation
      return Math.max(0, ((10 - goal.current) / (10 - goal.target)) * 100);
    }
    return Math.min(100, (goal.current / goal.target) * 100);
  };

  const getProgressColor = (goal: MicroGoal, progress: number) => {
    if (goal.id === 'stress') {
      if (goal.current <= goal.target) return 'bg-success';
      if (goal.current <= 5) return 'bg-warning';
      return 'bg-destructive';
    }
    
    if (progress >= 100) return 'bg-success';
    if (progress >= 70) return 'bg-warning';
    return 'bg-primary';
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">Daily Micro-Goals</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {goals.map((goal) => {
          const progress = getProgress(goal);
          const isEditing = editingGoal === goal.id;
          
          return (
            <div key={goal.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className={`p-1.5 rounded-full ${goal.color} text-white`}>
                    {goal.icon}
                  </div>
                  <span className="font-medium text-sm">{goal.label}</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  {isEditing ? (
                    <div className="flex items-center space-x-1">
                      <Input
                        type="number"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="w-16 h-6 text-xs"
                        step={goal.id === 'sleep' || goal.id === 'stress' ? '0.1' : '1'}
                      />
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleSave(goal.id)}
                        disabled={updating}
                        className="h-6 w-6 p-0"
                      >
                        <Check className="h-3 w-3 text-success" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={handleCancel}
                        className="h-6 w-6 p-0"
                      >
                        <X className="h-3 w-3 text-destructive" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-1">
                      <span className="text-sm font-mono">
                        {goal.current}/{goal.target} {goal.unit}
                      </span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEdit(goal.id, goal.current)}
                        className="h-6 w-6 p-0"
                      >
                        <Edit3 className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="relative">
                <Progress value={progress} className="h-2" />
                <div 
                  className={`absolute inset-0 h-2 rounded-full ${getProgressColor(goal, progress)}`}
                  style={{ width: `${Math.min(100, progress)}%` }}
                />
              </div>
            </div>
          );
        })}
        
        <div className="pt-2 border-t text-xs text-muted-foreground">
          Click the edit icon to update your progress
        </div>
      </CardContent>
    </Card>
  );
};