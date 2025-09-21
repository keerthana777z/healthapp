import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { Search, Filter, AlertTriangle, User } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  conditions: string[];
  email: string;
  riskLevel?: 'low' | 'medium' | 'high';
  lastUpdate?: string;
}

interface PatientListProps {
  onPatientSelect: (patient: Patient) => void;
}

export const PatientList = ({ onPatientSelect }: PatientListProps) => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState<string>('all');
  const [conditionFilter, setConditionFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPatients();
  }, []);

  useEffect(() => {
    filterPatients();
  }, [patients, searchTerm, riskFilter, conditionFilter]);

  const loadPatients = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*');

      if (error) throw error;

      // Transform data and add risk levels based on conditions
      const patientsWithRisk = data.map(patient => ({
        ...patient,
        riskLevel: calculateRiskLevel(patient.conditions || []),
        lastUpdate: new Date(patient.created_at || '').toLocaleDateString()
      }));

      setPatients(patientsWithRisk);
    } catch (error) {
      console.error('Error loading patients:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateRiskLevel = (conditions: string[]): 'low' | 'medium' | 'high' => {
    const highRiskConditions = ['diabetes', 'hypertension', 'heart disease', 'obesity'];
    const mediumRiskConditions = ['pre-diabetes', 'high cholesterol', 'sleep apnea'];

    const hasHighRisk = conditions.some(condition => 
      highRiskConditions.some(risk => condition.toLowerCase().includes(risk))
    );
    const hasMediumRisk = conditions.some(condition => 
      mediumRiskConditions.some(risk => condition.toLowerCase().includes(risk))
    );

    if (hasHighRisk) return 'high';
    if (hasMediumRisk) return 'medium';
    return 'low';
  };

  const filterPatients = () => {
    let filtered = patients;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(patient =>
        patient.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Risk level filter
    if (riskFilter !== 'all') {
      filtered = filtered.filter(patient => patient.riskLevel === riskFilter);
    }

    // Condition filter
    if (conditionFilter !== 'all') {
      filtered = filtered.filter(patient =>
        patient.conditions?.some(condition =>
          condition.toLowerCase().includes(conditionFilter.toLowerCase())
        )
      );
    }

    setFilteredPatients(filtered);
  };

  const getRiskBadgeClass = (riskLevel: string) => {
    switch (riskLevel) {
      case 'high':
        return 'bg-risk-high text-white';
      case 'medium':
        return 'bg-risk-medium text-risk-medium-foreground';
      case 'low':
        return 'bg-risk-low text-white';
      default:
        return 'bg-muted';
    }
  };

  const getUniqueConditions = () => {
    const allConditions = patients.flatMap(p => p.conditions || []);
    return [...new Set(allConditions)];
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="h-12 w-12 bg-muted rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-1/3"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <User className="h-5 w-5" />
          <span>Patient List ({filteredPatients.length})</span>
        </CardTitle>
        
        {/* Search and Filters */}
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search patients by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex space-x-4">
            <Select value={riskFilter} onValueChange={setRiskFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Risk Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Risk Levels</SelectItem>
                <SelectItem value="high">High Risk</SelectItem>
                <SelectItem value="medium">Medium Risk</SelectItem>
                <SelectItem value="low">Low Risk</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={conditionFilter} onValueChange={setConditionFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Condition" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Conditions</SelectItem>
                {getUniqueConditions().map(condition => (
                  <SelectItem key={condition} value={condition}>
                    {condition}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="max-h-96 overflow-y-auto">
          {filteredPatients.length === 0 ? (
            <div className="p-6 text-center text-muted-foreground">
              No patients found matching your criteria
            </div>
          ) : (
            <div className="space-y-1">
              {filteredPatients.map((patient) => (
                <div
                  key={patient.id}
                  onClick={() => onPatientSelect(patient)}
                  className="flex items-center justify-between p-4 hover:bg-muted/50 cursor-pointer border-b last:border-b-0 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{patient.name || 'Unknown'}</span>
                        <span className="text-sm text-muted-foreground">
                          ({patient.age} yrs, {patient.gender})
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-muted-foreground">{patient.email}</span>
                        {patient.riskLevel === 'high' && (
                          <AlertTriangle className="h-4 w-4 text-destructive" />
                        )}
                      </div>
                      
                      {patient.conditions && patient.conditions.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {patient.conditions.slice(0, 3).map((condition, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="text-xs"
                            >
                              {condition}
                            </Badge>
                          ))}
                          {patient.conditions.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{patient.conditions.length - 3} more
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end space-y-2">
                    <Badge className={getRiskBadgeClass(patient.riskLevel || 'low')}>
                      {patient.riskLevel?.toUpperCase()} RISK
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      Last update: {patient.lastUpdate}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};