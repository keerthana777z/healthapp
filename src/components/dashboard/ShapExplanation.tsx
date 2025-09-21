import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface ShapDriver {
  factor: string;
  impact: number; // -100 to 100, negative means reduces risk, positive increases risk
  value: string;
}

interface ShapExplanationProps {
  drivers: ShapDriver[];
  title?: string;
}

export const ShapExplanation = ({ drivers, title = "Top Risk Drivers" }: ShapExplanationProps) => {
  // Sort by absolute impact value to show most influential factors first
  const sortedDrivers = [...drivers].sort((a, b) => Math.abs(b.impact) - Math.abs(a.impact));
  const topDrivers = sortedDrivers.slice(0, 3);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {topDrivers.map((driver, index) => (
          <div key={index} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {driver.impact > 0 ? (
                  <TrendingUp className="h-4 w-4 text-destructive" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-success" />
                )}
                <span className="font-medium text-sm">{driver.factor}</span>
              </div>
              <div className="text-right">
                <span className="text-xs text-muted-foreground">{driver.value}</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="flex-1 relative">
                <div className="h-2 bg-muted rounded-full">
                  <div 
                    className={`h-2 rounded-full ${
                      driver.impact > 0 ? 'bg-destructive' : 'bg-success'
                    }`}
                    style={{ width: `${Math.abs(driver.impact)}%` }}
                  />
                </div>
              </div>
              <span className={`text-xs font-mono min-w-[40px] text-right ${
                driver.impact > 0 ? 'text-destructive' : 'text-success'
              }`}>
                {driver.impact > 0 ? '+' : ''}{driver.impact}%
              </span>
            </div>
          </div>
        ))}
        
        <div className="pt-2 border-t text-xs text-muted-foreground">
          SHAP values show how each factor contributes to your risk score
        </div>
      </CardContent>
    </Card>
  );
};