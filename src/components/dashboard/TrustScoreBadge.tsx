import { Badge } from '@/components/ui/badge';
import { Shield, ShieldAlert, ShieldCheck } from 'lucide-react';

interface TrustScoreBadgeProps {
  score: number; // 0-100
  className?: string;
}

export const TrustScoreBadge = ({ score, className = '' }: TrustScoreBadgeProps) => {
  const getTrustLevel = (score: number) => {
    if (score >= 80) return 'green';
    if (score >= 60) return 'amber';
    return 'red';
  };

  const getTrustLabel = (score: number) => {
    if (score >= 80) return 'High Trust';
    if (score >= 60) return 'Medium Trust';
    return 'Low Trust';
  };

  const getIcon = (level: string) => {
    switch (level) {
      case 'green':
        return <ShieldCheck className="h-4 w-4" />;
      case 'amber':
        return <ShieldAlert className="h-4 w-4" />;
      case 'red':
        return <Shield className="h-4 w-4" />;
      default:
        return <Shield className="h-4 w-4" />;
    }
  };

  const getBadgeClass = (level: string) => {
    switch (level) {
      case 'green':
        return 'bg-trust-green text-white hover:bg-trust-green/90';
      case 'amber':
        return 'bg-trust-amber text-trust-amber-foreground hover:bg-trust-amber/90';
      case 'red':
        return 'bg-trust-red text-white hover:bg-trust-red/90';
      default:
        return 'bg-muted';
    }
  };

  const level = getTrustLevel(score);

  return (
    <Badge 
      className={`${getBadgeClass(level)} ${className} flex items-center space-x-1 px-3 py-1`}
    >
      {getIcon(level)}
      <span>{getTrustLabel(score)}</span>
      <span className="ml-1 font-mono">({score}%)</span>
    </Badge>
  );
};