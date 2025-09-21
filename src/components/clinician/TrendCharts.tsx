import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, Activity, Heart, Droplets, Footprints } from 'lucide-react';

interface VitalData {
  date: string;
  glucose: number;
  systolic: number;
  diastolic: number;
  heartRate: number;
  steps: number;
}

interface TrendChartsProps {
  patientName: string;
  data: VitalData[];
}

export const TrendCharts = ({ patientName, data }: TrendChartsProps) => {
  // Sample data if none provided
  const sampleData: VitalData[] = [
    { date: '2024-01-01', glucose: 95, systolic: 120, diastolic: 80, heartRate: 72, steps: 8500 },
    { date: '2024-01-02', glucose: 102, systolic: 125, diastolic: 82, heartRate: 75, steps: 9200 },
    { date: '2024-01-03', glucose: 98, systolic: 118, diastolic: 78, heartRate: 70, steps: 7800 },
    { date: '2024-01-04', glucose: 105, systolic: 128, diastolic: 85, heartRate: 78, steps: 10200 },
    { date: '2024-01-05', glucose: 92, systolic: 115, diastolic: 75, heartRate: 68, steps: 11500 },
    { date: '2024-01-06', glucose: 108, systolic: 132, diastolic: 88, heartRate: 82, steps: 9800 },
    { date: '2024-01-07', glucose: 96, systolic: 122, diastolic: 81, heartRate: 74, steps: 8900 }
  ];

  const chartData = data.length > 0 ? data : sampleData;

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const calculateTrend = (data: number[]) => {
    if (data.length < 2) return 0;
    const recent = data.slice(-3).reduce((a, b) => a + b, 0) / 3;
    const previous = data.slice(-6, -3).reduce((a, b) => a + b, 0) / 3;
    return ((recent - previous) / previous) * 100;
  };

  const glucoseTrend = calculateTrend(chartData.map(d => d.glucose));
  const bpTrend = calculateTrend(chartData.map(d => d.systolic));
  const hrTrend = calculateTrend(chartData.map(d => d.heartRate));
  const stepsTrend = calculateTrend(chartData.map(d => d.steps));

  const TrendIndicator = ({ trend, label }: { trend: number; label: string }) => (
    <div className="flex items-center space-x-2">
      {trend > 0 ? (
        <TrendingUp className="h-4 w-4 text-red-500" />
      ) : (
        <TrendingDown className="h-4 w-4 text-green-500" />
      )}
      <span className="text-sm font-medium">{label}</span>
      <span className={`text-sm ${trend > 0 ? 'text-red-500' : 'text-green-500'}`}>
        {trend > 0 ? '+' : ''}{trend.toFixed(1)}%
      </span>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Vital Trends - {patientName}</h3>
        <div className="text-sm text-muted-foreground">
          Last {chartData.length} days
        </div>
      </div>

      {/* Trend Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Droplets className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium">Glucose</span>
            </div>
            <TrendIndicator trend={glucoseTrend} label="7-day trend" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Heart className="h-4 w-4 text-red-500" />
              <span className="text-sm font-medium">Blood Pressure</span>
            </div>
            <TrendIndicator trend={bpTrend} label="7-day trend" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Activity className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium">Heart Rate</span>
            </div>
            <TrendIndicator trend={hrTrend} label="7-day trend" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Footprints className="h-4 w-4 text-purple-500" />
              <span className="text-sm font-medium">Steps</span>
            </div>
            <TrendIndicator trend={stepsTrend} label="7-day trend" />
          </CardContent>
        </Card>
      </div>

      {/* Glucose Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Droplets className="h-5 w-5 text-blue-500" />
            <span>Blood Glucose Levels</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tickFormatter={formatDate} />
              <YAxis domain={[80, 140]} />
              <Tooltip 
                labelFormatter={(label) => `Date: ${formatDate(label)}`}
                formatter={(value) => [`${value} mg/dL`, 'Glucose']}
              />
              <Line 
                type="monotone" 
                dataKey="glucose" 
                stroke="#3b82f6" 
                strokeWidth={2}
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Blood Pressure Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Heart className="h-5 w-5 text-red-500" />
            <span>Blood Pressure</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tickFormatter={formatDate} />
              <YAxis domain={[60, 150]} />
              <Tooltip 
                labelFormatter={(label) => `Date: ${formatDate(label)}`}
                formatter={(value, name) => [`${value} mmHg`, name === 'systolic' ? 'Systolic' : 'Diastolic']}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="systolic" 
                stroke="#ef4444" 
                strokeWidth={2}
                dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
                name="Systolic"
              />
              <Line 
                type="monotone" 
                dataKey="diastolic" 
                stroke="#f97316" 
                strokeWidth={2}
                dot={{ fill: '#f97316', strokeWidth: 2, r: 4 }}
                name="Diastolic"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Heart Rate & Steps Chart */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-green-500" />
              <span>Heart Rate</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tickFormatter={formatDate} />
                <YAxis domain={[60, 100]} />
                <Tooltip 
                  labelFormatter={(label) => `Date: ${formatDate(label)}`}
                  formatter={(value) => [`${value} bpm`, 'Heart Rate']}
                />
                <Line 
                  type="monotone" 
                  dataKey="heartRate" 
                  stroke="#22c55e" 
                  strokeWidth={2}
                  dot={{ fill: '#22c55e', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Footprints className="h-5 w-5 text-purple-500" />
              <span>Daily Steps</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tickFormatter={formatDate} />
                <YAxis domain={[5000, 15000]} />
                <Tooltip 
                  labelFormatter={(label) => `Date: ${formatDate(label)}`}
                  formatter={(value) => [`${value.toLocaleString()}`, 'Steps']}
                />
                <Line 
                  type="monotone" 
                  dataKey="steps" 
                  stroke="#a855f7" 
                  strokeWidth={2}
                  dot={{ fill: '#a855f7', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};