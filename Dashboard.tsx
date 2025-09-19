import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useTheme } from './ThemeProvider';
import { NeerSanchayLogo } from './NeerSanchayLogo';
import { Droplets, LogOut, MapPin, Sun, Moon } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AssessmentData {
  name: string;
  location: string;
  rooftopArea: number;
  roofMaterial: string;
  rainfall: number;
  soilType: string;
  householdDemand: number;
}

interface DashboardProps {
  user: User | null;
  onSignOut: () => void;
  onAssessmentComplete: (data: AssessmentData) => void;
  onNavigate: (page: 'landing' | 'signin' | 'signup' | 'dashboard' | 'results') => void;
}

export function Dashboard({ user, onSignOut, onAssessmentComplete, onNavigate }: DashboardProps) {
  const { theme, toggleTheme } = useTheme();
  const [formData, setFormData] = useState<AssessmentData>({
    name: user?.name || '',
    location: '',
    rooftopArea: 0,
    roofMaterial: '',
    rainfall: 0,
    soilType: '',
    householdDemand: 0
  });
  const [status, setStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: keyof AssessmentData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleGPS = () => {
    if (!navigator.geolocation) {
      alert('Geolocation not supported by your browser.');
      return;
    }
    
    setStatus('Getting location...');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        handleInputChange('location', `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`);
        setStatus('Location acquired!');
        setTimeout(() => setStatus(''), 2000);
      },
      (error) => {
        setStatus('Could not get location.');
        setTimeout(() => setStatus(''), 2000);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.location || !formData.rooftopArea || !formData.roofMaterial || 
        !formData.rainfall || !formData.soilType || !formData.householdDemand) {
      setStatus('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    setStatus('Calculating potential...');
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setStatus('Done! Redirecting to results...');
    onAssessmentComplete(formData);
    
    setTimeout(() => {
      setStatus('');
      setIsSubmitting(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-2">
              <NeerSanchayLogo size="md" showText={false} />
              <div>
                <p className="text-lg font-extrabold tracking-tight leading-none bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">NeerSanchay</p>
                <p className="text-xs text-muted-foreground -mt-0.5">Assessment Dashboard</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
                className="text-muted-foreground hover:text-foreground"
              >
                {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
              {user ? (
                <>
                  <div className="text-right">
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={onSignOut} className="border-border text-muted-foreground hover:text-foreground hover:bg-muted">
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <Button variant="outline" size="sm" onClick={() => onNavigate('signin')} className="border-border text-muted-foreground hover:text-foreground hover:bg-muted">
                  Sign In
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 mb-8">
          <div>
            <h2 className="text-3xl font-extrabold">Assessment Form</h2>
            <p className="text-muted-foreground mt-1">Provide basic details to estimate your rainwater harvesting potential.</p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => onNavigate('landing')}
            className="border-border text-muted-foreground hover:text-foreground hover:bg-muted"
          >
            ← Back to Home
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 rounded-2xl bg-card ring-1 ring-border p-6 shadow-2xl">
          {/* Name */}
          <div className="col-span-1 md:col-span-2">
            <Label className="block text-sm font-medium mb-2">Your Name</Label>
            <Input
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Enter your full name"
              className="bg-background border-border focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          {/* Location */}
          <div className="col-span-1 md:col-span-2">
            <Label className="block text-sm font-medium mb-2">Location</Label>
            <div className="flex gap-2">
              <Input
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="City, Area or Coordinates"
                className="bg-background border-border focus:border-blue-500 focus:ring-blue-500"
                required
              />
              <Button 
                type="button" 
                onClick={handleGPS}
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-md"
              >
                <MapPin className="w-4 h-4 mr-2" />
                Use GPS
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-1">GPS uses your browser's location if allowed.</p>
          </div>

          {/* Rooftop area */}
          <div>
            <Label className="block text-sm font-medium mb-2">Rooftop area (sq.m.)</Label>
            <Input
              type="number"
              min="10"
              step="0.1"
              value={formData.rooftopArea || ''}
              onChange={(e) => handleInputChange('rooftopArea', parseFloat(e.target.value) || 0)}
              placeholder="e.g., 120"
              className="bg-background border-border focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          {/* Roof material */}
          <div>
            <Label className="block text-sm font-medium mb-2">Roof material</Label>
            <Select value={formData.roofMaterial} onValueChange={(value) => handleInputChange('roofMaterial', value)}>
              <SelectTrigger className="bg-background border-border focus:border-blue-500 focus:ring-blue-500">
                <SelectValue placeholder="Select material" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                <SelectItem value="RCC">RCC</SelectItem>
                <SelectItem value="Tiles">Tiles</SelectItem>
                <SelectItem value="Metal Sheet">Metal Sheet</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Rainfall */}
          <div>
            <Label className="block text-sm font-medium mb-2">Rainfall (mm/year)</Label>
            <Input
              type="number"
              min="100"
              value={formData.rainfall || ''}
              onChange={(e) => handleInputChange('rainfall', parseInt(e.target.value) || 0)}
              placeholder="e.g., 800"
              className="bg-background border-border focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          {/* Soil type */}
          <div>
            <Label className="block text-sm font-medium mb-2">Soil type</Label>
            <Select value={formData.soilType} onValueChange={(value) => handleInputChange('soilType', value)}>
              <SelectTrigger className="bg-background border-border focus:border-blue-500 focus:ring-blue-500">
                <SelectValue placeholder="Select soil" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                <SelectItem value="Clay">Clay</SelectItem>
                <SelectItem value="Sandy">Sandy</SelectItem>
                <SelectItem value="Loamy">Loamy</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Household demand */}
          <div className="col-span-1 md:col-span-2">
            <Label className="block text-sm font-medium mb-2">Household demand (people or L/day)</Label>
            <Input
              type="number"
              min="1"
              value={formData.householdDemand || ''}
              onChange={(e) => handleInputChange('householdDemand', parseInt(e.target.value) || 0)}
              placeholder="e.g., 4 (people) or 500 (L/day)"
              className="bg-background border-border focus:border-blue-500 focus:ring-blue-500"
              required
            />
            <p className="text-xs text-muted-foreground mt-1">
              We accept a number. If it's small (like 3–12), we'll treat it as people; if larger (like 200–1000), as L/day.
            </p>
          </div>

          <div className="col-span-1 md:col-span-2 flex items-center gap-3">
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white hover:from-emerald-700 hover:to-emerald-800 disabled:opacity-50 shadow-lg hover:shadow-xl transition-all duration-200"
            >
              {isSubmitting ? 'Calculating...' : 'Calculate Potential'}
              <svg className="ml-2 w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M13 5l7 7-7 7M20 12H4"/>
              </svg>
            </Button>
            {status && <span className="text-sm text-muted-foreground">{status}</span>}
          </div>
        </form>
      </div>
    </div>
  );
}