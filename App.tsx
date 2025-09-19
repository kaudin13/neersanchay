import { useState } from 'react';
import { ThemeProvider } from './components/ThemeProvider';
import { LandingPage } from './components/LandingPage';
import { SignInPage } from './components/SignInPage';
import { Dashboard } from './components/Dashboard';
import { AssessmentResults } from './components/AssessmentResults';

type Page = 'landing' | 'signin' | 'signup' | 'dashboard' | 'results';

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

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const [user, setUser] = useState<User | null>(null);
  const [assessmentData, setAssessmentData] = useState<AssessmentData | null>(null);

  const navigate = (page: Page) => {
    console.log('Navigating to:', page);
    setCurrentPage(page);
  };

  const handleSignIn = (userData: User) => {
    setUser(userData);
    navigate('dashboard');
  };

  const handleSignOut = () => {
    setUser(null);
    setAssessmentData(null);
    navigate('landing');
  };

  const handleAssessmentComplete = (data: AssessmentData) => {
    setAssessmentData(data);
    navigate('results');
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'landing':
        return <LandingPage onNavigate={navigate} />;
      case 'signin':
      case 'signup':
        return <SignInPage mode={currentPage} onSignIn={handleSignIn} onNavigate={navigate} />;
      case 'dashboard':
        return <Dashboard user={user} onSignOut={handleSignOut} onAssessmentComplete={handleAssessmentComplete} onNavigate={navigate} />;
      case 'results':
        return <AssessmentResults data={assessmentData} user={user} onNavigate={navigate} onSignOut={handleSignOut} />;
      default:
        return <LandingPage onNavigate={navigate} />;
    }
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
        {renderCurrentPage()}
      </div>
    </ThemeProvider>
  );
}