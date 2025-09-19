import { useEffect } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useTheme } from './ThemeProvider';
import { NeerSanchayLogo } from './NeerSanchayLogo';
import { Droplets, CheckCircle, MapPin, Calculator, Users, BarChart3, Shield, Leaf, Sun, Moon } from 'lucide-react';

interface LandingPageProps {
  onNavigate: (page: 'landing' | 'signin' | 'signup' | 'dashboard' | 'results') => void;
}

export function LandingPage({ onNavigate }: LandingPageProps) {
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    // Create animated raindrops
    const createRaindrops = () => {
      const rainContainer = document.getElementById('rain');
      if (!rainContainer) return;
      
      const drops = 40;
      rainContainer.innerHTML = '';
      
      for (let i = 0; i < drops; i++) {
        const drop = document.createElement('div');
        drop.className = 'absolute w-0.5 h-3.5 bg-gradient-to-b from-transparent to-blue-400 rounded-full opacity-25';
        drop.style.left = Math.random() * 100 + '%';
        drop.style.animationDelay = Math.random() * 2 + 's';
        drop.style.animationDuration = (1.8 + Math.random() * 1.8) + 's';
        drop.style.height = (10 + Math.random() * 18) + 'px';
        drop.style.animation = 'fall 2.4s linear infinite';
        rainContainer.appendChild(drop);
      }
    };

    createRaindrops();
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">

      {/* Navigation */}
      <nav className="sticky top-0 z-40 backdrop-blur border-b border-border bg-background/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <NeerSanchayLogo size="md" />
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
                className="text-muted-foreground hover:text-foreground"
              >
                {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
              <Button variant="ghost" onClick={() => onNavigate('signin')} className="text-muted-foreground hover:text-foreground">
                Sign In
              </Button>
              <Button onClick={() => onNavigate('signup')} className="bg-blue-600 text-white hover:bg-blue-700 shadow-lg">
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative">
        <div 
          className="absolute inset-0 overflow-hidden pointer-events-none opacity-25" 
          id="rain" 
          aria-hidden="true"
        />
        <div className="relative bg-gradient-to-br from-background via-muted/50 to-background">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-transparent to-emerald-500/10" />
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="min-h-[70vh] flex flex-col md:flex-row items-center justify-center gap-10 py-12">
              <div className="w-full md:w-1/2">
                <Badge className="mb-5 bg-emerald-500/10 text-emerald-600 border-emerald-500/20 hover:bg-emerald-500/20">
                  <span className="mr-2">New</span>
                  Instant rooftop assessment
                </Badge>
                <div className="mb-4">
                  <NeerSanchayLogo size="lg" showText={true} />
                </div>
                <p className="text-lg md:text-xl text-muted-foreground max-w-xl mb-8">
                  Estimate rooftop rainwater harvesting & recharge potential instantly. Get personalized recommendations for sustainable water management.
                </p>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-8">
                  <Button 
                    size="lg"
                    onClick={() => {
                      console.log('Start Assessment clicked');
                      onNavigate('dashboard');
                    }}
                    className="bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    Start Assessment
                    <svg className="ml-2 w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M13 5l7 7-7 7M20 12H4"/>
                    </svg>
                  </Button>
                  <Button 
                    size="lg"
                    variant="outline"
                    className="border-border hover:bg-muted/50 transition-colors"
                  >
                    Learn More
                    <svg className="ml-2 w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 20h0M12 4v10"/>
                    </svg>
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <span className="text-blue-500">💧</span>
                    <span>Annual harvest estimate</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-500">🌱</span>
                    <span>Sustainability score</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-amber-500">🛢</span>
                    <span>Suggested tank size</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-rose-500">💰</span>
                    <span>Cost estimate</span>
                  </div>
                </div>
              </div>
              <div className="w-full md:w-1/2">
                <div className="rounded-2xl bg-card ring-1 ring-border p-6 shadow-2xl">
                  <h3 className="text-lg font-semibold mb-2">How it works</h3>
                  <ol className="space-y-3 text-muted-foreground">
                    <li className="flex gap-3">
                      <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-blue-500/20 ring-1 ring-blue-400/30 text-blue-600 font-bold text-sm">1</span>
                      Enter location, roof area, rainfall, and more
                    </li>
                    <li className="flex gap-3">
                      <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/20 ring-1 ring-emerald-400/30 text-emerald-600 font-bold text-sm">2</span>
                      We estimate harvest, tank size, and recharge structure
                    </li>
                    <li className="flex gap-3">
                      <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-amber-500/20 ring-1 ring-amber-400/30 text-amber-600 font-bold text-sm">3</span>
                      Download your report and next steps
                    </li>
                  </ol>
                  <Button 
                    onClick={() => {
                      console.log('Start Now clicked');
                      onNavigate('dashboard');
                    }}
                    className="mt-6 w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-md"
                  >
                    Start Now
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">The Challenge</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Groundwater depletion is critical. Despite significant rooftop harvesting potential, accessible assessment tools remain limited.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: BarChart3,
                title: "Depleting Groundwater",
                description: "Rapid urbanization causing unprecedented groundwater depletion across India.",
                color: "text-red-500",
                bgColor: "bg-red-500/10"
              },
              {
                icon: Users,
                title: "Limited Awareness", 
                description: "Public participation remains low due to lack of accessible assessment tools.",
                color: "text-amber-500",
                bgColor: "bg-amber-500/10"
              },
              {
                icon: Droplets,
                title: "Untapped Potential",
                description: "Significant potential exists for harvesting rainwater from individual rooftops.",
                color: "text-blue-500",
                bgColor: "bg-blue-500/10"
              }
            ].map((item, index) => (
              <div key={index} className="rounded-2xl bg-card ring-1 ring-border p-6 text-center hover:shadow-lg transition-shadow">
                <div className={`mx-auto w-12 h-12 ${item.bgColor} rounded-lg flex items-center justify-center mb-4`}>
                  <item.icon className={`h-6 w-6 ${item.color}`} />
                </div>
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Key Features</h2>
            <p className="text-xl text-muted-foreground">
              Comprehensive assessment powered by advanced algorithms
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: CheckCircle,
                title: "Feasibility Assessment",
                description: "Complete feasibility check for rooftop rainwater harvesting based on your location.",
                color: "text-emerald-500",
                bgColor: "bg-emerald-500/10"
              },
              {
                icon: MapPin,
                title: "GIS-Based Analysis", 
                description: "Location-specific analysis including aquifer info and local rainfall data.",
                color: "text-blue-500",
                bgColor: "bg-blue-500/10"
              },
              {
                icon: Calculator,
                title: "Structure Recommendations",
                description: "Personalized recommendations for recharge pit dimensions and specifications.",
                color: "text-purple-500",
                bgColor: "bg-purple-500/10"
              },
              {
                icon: BarChart3,
                title: "Runoff Calculation",
                description: "Accurate calculation based on roof area and local precipitation patterns.",
                color: "text-orange-500",
                bgColor: "bg-orange-500/10"
              },
              {
                icon: Shield,
                title: "Cost Analysis",
                description: "Comprehensive cost estimation and benefit analysis for informed decisions.",
                color: "text-indigo-500",
                bgColor: "bg-indigo-500/10"
              },
              {
                icon: Leaf,
                title: "Environmental Impact",
                description: "Assessment of environmental benefits and sustainability contributions.",
                color: "text-emerald-500",
                bgColor: "bg-emerald-500/10"
              }
            ].map((feature, index) => (
              <div key={index} className="rounded-2xl bg-card ring-1 ring-border p-6 hover:shadow-lg transition-shadow">
                <div className={`w-12 h-12 ${feature.bgColor} rounded-lg flex items-center justify-center mb-4`}>
                  <feature.icon className={`h-6 w-6 ${feature.color}`} />
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-emerald-600">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Assess Your Rainwater Harvesting Potential?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands taking action for sustainable water management. Get your assessment in minutes.
          </p>
          <Button 
            size="lg" 
            onClick={() => {
              console.log('Start Your Assessment Now clicked');
              onNavigate('dashboard');
            }}
            className="bg-white text-blue-600 hover:bg-blue-50 shadow-lg hover:shadow-xl transition-all duration-200"
          >
            Start Your Assessment Now
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted/30 py-12 border-t border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="mb-4">
                <NeerSanchayLogo size="sm" />
              </div>
              <p className="text-muted-foreground text-sm">
                Empowering communities with tools for sustainable water management and groundwater conservation.
              </p>
            </div>
            
            {[
              {
                title: "Quick Links",
                links: ["About CGWB", "Guidelines", "FAQs", "Contact"]
              },
              {
                title: "Resources", 
                links: ["Technical Manuals", "Case Studies", "Best Practices", "Downloads"]
              },
              {
                title: "Support",
                links: ["Help Center", "User Guide", "Technical Support", "Feedback"]
              }
            ].map((section, index) => (
              <div key={index}>
                <h3 className="font-semibold mb-4">{section.title}</h3>
                <ul className="space-y-2 text-muted-foreground text-sm">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <a href="#" className="hover:text-foreground transition-colors">{link}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground text-sm">

          </div>
        </div>
      </footer>
    </div>
  );
}