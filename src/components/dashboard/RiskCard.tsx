import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, Heart, Activity } from 'lucide-react';

interface RiskCardProps {
  title: string;
  percentage: number;
  level: 'low' | 'medium' | 'high';
  icon?: 'heart' | 'activity' | 'alert';
}

export const RiskCard = ({ title, percentage, level, icon = 'alert' }: RiskCardProps) => {
  const getIcon = () => {
    switch (icon) {
      case 'heart':
        return <Heart className="h-5 w-5" />;
      case 'activity':
        return <Activity className="h-5 w-5" />;
      default:
        return <AlertTriangle className="h-5 w-5" />;
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'low':
        return 'bg-risk-low text-white';
      case 'medium':
        return 'bg-risk-medium text-risk-medium-foreground';
      case 'high':
        return 'bg-risk-high text-white';
      default:
        return 'bg-muted';
    }
  };

  const getProgressColor = (level: string) => {
    switch (level) {
      case 'low':
        return 'bg-risk-low';
      case 'medium':
        return 'bg-risk-medium';
      case 'high':
        return 'bg-risk-high';
      default:
        return 'bg-primary';
    }
  };

  return (
    <Card className="relative overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className={`p-2 rounded-full ${getLevelColor(level)}`}>
              {getIcon()}
            </div>
            <CardTitle className="text-base font-medium">{title}</CardTitle>
          </div>
          <Badge 
            className={`${getLevelColor(level)} capitalize`}
          >
            {level} Risk
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold">{percentage}%</span>
            <span className="text-sm text-muted-foreground">Risk Score</span>
          </div>
          <div className="relative">
            <Progress value={percentage} className="h-2" />
            <div 
              className={`absolute inset-0 h-2 rounded-full ${getProgressColor(level)}`}
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};