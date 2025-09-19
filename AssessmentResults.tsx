import { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "./ui/tabs";
import { useTheme } from "./ThemeProvider";
import { NeerSanchayLogo } from "./NeerSanchayLogo";
import {
  Droplets,
  LogOut,
  Download,
  Share,
  BarChart3,
  Sun,
  Moon,
} from "lucide-react";

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

interface AssessmentResultsProps {
  data: AssessmentData | null;
  user: User | null;
  onNavigate: (
    page:
      | "landing"
      | "signin"
      | "signup"
      | "dashboard"
      | "results",
  ) => void;
  onSignOut: () => void;
}

export function AssessmentResults({
  data,
  user,
  onNavigate,
  onSignOut,
}: AssessmentResultsProps) {
  const { theme, toggleTheme } = useTheme();
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<any>(null);
  const [chartType, setChartType] = useState<"bar" | "line">(
    "bar",
  );

  if (!data) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center transition-colors duration-300">
        <p>No assessment data available</p>
      </div>
    );
  }

  // Mock calculations based on input data
  const base = 40000;
  const area = data.rooftopArea;
  const rain = data.rainfall;
  const est = Math.round(area * rain * 0.8); // litres approx
  const annualHarvest = Math.max(15000, Math.min(120000, est));

  const monthly = Math.round(annualHarvest / 12);
  const tankLitres =
    Math.round((monthly * 0.6) / 500) * 500 || 5000;
  const suggestedTank = tankLitres.toLocaleString() + " L";

  const rechargeStructure = (() => {
    const soil = data.soilType.toLowerCase();
    if (soil.includes("sandy"))
      return "Recharge Trench (0.6×0.6×5 m)";
    if (soil.includes("clay"))
      return "Recharge Pit (2×2×2 m) with filter media";
    return "Recharge Well (1 m dia × 6 m)";
  })();

  const costEstimate =
    "₹" +
    (
      Math.round((tankLitres * 1.8 + 8000) / 500) * 500
    ).toLocaleString();
  const sustainabilityScore =
    annualHarvest > 60000
      ? "Green"
      : annualHarvest > 30000
        ? "Amber"
        : "Red";

  const results = {
    annualHarvest,
    suggestedTank,
    rechargeStructure,
    costEstimate,
    sustainabilityScore,
  };

  // Chart data
  const weights = [
    0.03, 0.04, 0.05, 0.08, 0.12, 0.18, 0.2, 0.14, 0.08, 0.04,
    0.03, 0.01,
  ];
  const monthlyData = weights.map((w) =>
    Math.round(annualHarvest * w),
  );
  const labels = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  useEffect(() => {
    if (chartRef.current) {
      // Dynamically import Chart.js
      import("chart.js/auto").then(({ default: Chart }) => {
        const ctx = chartRef.current;
        if (!ctx) return;

        // Destroy existing chart
        if (chartInstance.current) {
          chartInstance.current.destroy();
        }

        const isDark = theme === "dark";
        const gridColor = isDark
          ? "rgba(148,163,184,0.12)"
          : "rgba(148,163,184,0.3)";
        const textColor = isDark ? "#cbd5e1" : "#475569";

        chartInstance.current = new Chart(ctx, {
          type: chartType,
          data: {
            labels,
            datasets: [
              {
                label: "Available (L)",
                data: monthlyData,
                borderColor: "rgb(34,197,94)",
                backgroundColor: "rgba(34,197,94,0.25)",
                tension: 0.35,
                borderWidth: 2,
                hoverBackgroundColor: "rgba(34,197,94,0.35)",
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              x: {
                grid: { color: gridColor },
                ticks: { color: textColor },
              },
              y: {
                grid: { color: gridColor },
                ticks: { color: textColor },
              },
            },
            plugins: {
              legend: { labels: { color: textColor } },
              tooltip: {
                callbacks: {
                  label: (ctx: any) =>
                    ctx.parsed.y.toLocaleString() + " L",
                },
              },
            },
          },
        });
      });
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [chartType, monthlyData, labels, theme]);

  const toggleChartType = () => {
    setChartType((prev) => (prev === "bar" ? "line" : "bar"));
  };

  const getSustainabilityColor = () => {
    switch (sustainabilityScore) {
      case "Green":
        return "bg-emerald-500 ring-emerald-500";
      case "Amber":
        return "bg-amber-500 ring-amber-500";
      default:
        return "bg-rose-500 ring-rose-500";
    }
  };

  const getSustainabilityBadgeColor = () => {
    switch (sustainabilityScore) {
      case "Green":
        return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
      case "Amber":
        return "bg-amber-500/10 text-amber-600 border-amber-500/20";
      default:
        return "bg-rose-500/10 text-rose-600 border-rose-500/20";
    }
  };

  const demandPeople =
    data.householdDemand <= 12 ? data.householdDemand : null;
  const demandLitres =
    data.householdDemand > 12
      ? data.householdDemand
      : Math.round(data.householdDemand * 135);

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-2">
              <NeerSanchayLogo size="md" showText={false} />
              <div>
                <p className="text-lg font-extrabold tracking-tight leading-none bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
                  NeerSanchay
                </p>
                <p className="text-xs text-muted-foreground -mt-0.5">
                  Assessment Results
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
                className="text-muted-foreground hover:text-foreground"
              >
                {theme === "dark" ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </Button>
              {user ? (
                <>
                  <div className="text-right">
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onSignOut}
                    className="border-border text-muted-foreground hover:text-foreground hover:bg-muted"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onNavigate("signin")}
                  className="border-border text-muted-foreground hover:text-foreground hover:bg-muted"
                >
                  Sign In
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-extrabold">
              Results Dashboard
            </h2>
            <p className="text-muted-foreground mt-1">
              Based on your inputs and our analysis for{" "}
              <span className="font-semibold text-foreground">
                {data.name}
              </span>
              .
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => onNavigate("dashboard")}
              className="border-border text-muted-foreground hover:text-foreground hover:bg-muted"
            >
              Edit Inputs
            </Button>
            <Button className="bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-200">
              <Download className="h-4 w-4 mr-2" />
              Download Report
            </Button>
          </div>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 mb-8">
          <div className="rounded-2xl bg-card ring-1 ring-border p-5 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-blue-500">💧</span>
              <span className="text-sm text-muted-foreground">
                Annual Harvest
              </span>
            </div>
            <p className="text-3xl font-extrabold tracking-tight text-blue-600">
              {annualHarvest.toLocaleString()} L
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Estimated litres per year
            </p>
          </div>

          <div className="rounded-2xl bg-card ring-1 ring-border p-5 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-amber-500">🛢</span>
              <span className="text-sm text-muted-foreground">
                Suggested Tank
              </span>
            </div>
            <p className="text-2xl font-bold text-amber-600">
              {suggestedTank}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Optimal storage size
            </p>
          </div>

          <div className="rounded-2xl bg-card ring-1 ring-border p-5 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-purple-500">🕳</span>
              <span className="text-sm text-muted-foreground">
                Recharge Structure
              </span>
            </div>
            <p className="text-lg font-semibold text-purple-600">
              {rechargeStructure}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Recommended structure
            </p>
          </div>

          <div className="rounded-2xl bg-card ring-1 ring-border p-5 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-rose-500">💰</span>
              <span className="text-sm text-muted-foreground">
                Cost Estimate
              </span>
            </div>
            <p className="text-2xl font-bold text-rose-600">
              {costEstimate}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Approximate setup cost
            </p>
          </div>

          <div className="rounded-2xl bg-card ring-1 ring-border p-5 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-emerald-500">🌱</span>
                <span className="text-sm text-muted-foreground">
                  Sustainability
                </span>
              </div>
              <span
                className={`h-2.5 w-2.5 rounded-full ring-2 ring-offset-2 ring-offset-card ${getSustainabilityColor()}`}
              ></span>
            </div>
            <Badge
              className={`text-lg font-extrabold ${getSustainabilityBadgeColor()}`}
            >
              {sustainabilityScore}
            </Badge>
            <p className="text-xs text-muted-foreground mt-1">
              Environmental rating
            </p>
          </div>
        </div>

        {/* Chart */}
        <div className="rounded-2xl bg-card ring-1 ring-border p-6 mb-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">
              Monthly Water Availability
            </h3>
            <Button
              onClick={toggleChartType}
              variant="outline"
              size="sm"
              className="border-border text-muted-foreground hover:text-foreground hover:bg-muted"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Toggle {chartType === "bar" ? "Line" : "Bar"}
            </Button>
          </div>
          <p className="text-muted-foreground text-sm mb-4">
            Derived from annual estimate and rainfall
            distribution patterns.
          </p>
          <div className="h-64">
            <canvas ref={chartRef} />
          </div>
        </div>

        {/* Details Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-muted">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="calculations">
              Calculations
            </TabsTrigger>
            <TabsTrigger value="recommendations">
              Recommendations
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="rounded-2xl bg-card ring-1 ring-border p-6 shadow-lg">
                <h4 className="font-semibold mb-4 text-blue-600">
                  Input Assumptions
                </h4>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>
                    •{" "}
                    <span className="font-medium text-foreground">
                      Location:
                    </span>{" "}
                    {data.location}
                  </li>
                  <li>
                    •{" "}
                    <span className="font-medium text-foreground">
                      Roof area:
                    </span>{" "}
                    {data.rooftopArea} m² ({data.roofMaterial})
                  </li>
                  <li>
                    •{" "}
                    <span className="font-medium text-foreground">
                      Rainfall:
                    </span>{" "}
                    {data.rainfall} mm/year
                  </li>
                  <li>
                    •{" "}
                    <span className="font-medium text-foreground">
                      Soil type:
                    </span>{" "}
                    {data.soilType}
                  </li>
                  <li>
                    •{" "}
                    <span className="font-medium text-foreground">
                      Demand:
                    </span>{" "}
                    {demandPeople
                      ? `${demandPeople} people (~${demandPeople * 135} L/day)`
                      : `${demandLitres} L/day`}
                  </li>
                  <li>
                    •{" "}
                    <span className="font-medium text-foreground">
                      Efficiency:
                    </span>{" "}
                    80% capture rate assumed
                  </li>
                </ul>
              </div>

              <div className="rounded-2xl bg-card ring-1 ring-border p-6 lg:col-span-2 shadow-lg">
                <h4 className="font-semibold mb-4 text-emerald-600">
                  Optimization Tips
                </h4>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>
                    •{" "}
                    <span className="font-medium text-foreground">
                      Maintenance:
                    </span>{" "}
                    Keep gutters and downpipes clean to improve
                    capture efficiency
                  </li>
                  <li>
                    •{" "}
                    <span className="font-medium text-foreground">
                      Water Quality:
                    </span>{" "}
                    Use a first-flush diverter to maintain water
                    quality
                  </li>
                  <li>
                    •{" "}
                    <span className="font-medium text-foreground">
                      Site Selection:
                    </span>{" "}
                    Choose recharge structures suitable for your
                    soil type
                  </li>
                  <li>
                    •{" "}
                    <span className="font-medium text-foreground">
                      Regular Care:
                    </span>{" "}
                    Schedule annual maintenance for optimal
                    performance
                  </li>
                  <li>
                    •{" "}
                    <span className="font-medium text-foreground">
                      Collection:
                    </span>{" "}
                    Connect multiple downpipes for better water
                    collection
                  </li>
                </ul>
              </div>
            </div>
          </TabsContent>

          <TabsContent
            value="calculations"
            className="space-y-6"
          >
            <div className="rounded-2xl bg-card ring-1 ring-border p-6 shadow-lg">
              <h4 className="font-semibold mb-4">
                Technical Calculations
              </h4>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h5 className="font-medium text-blue-600">
                    💧 Harvest Potential
                  </h5>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between p-2 rounded bg-muted/50">
                      <span>Roof Area:</span>
                      <span className="font-medium">
                        {data.rooftopArea} sq.m
                      </span>
                    </div>
                    <div className="flex justify-between p-2 rounded bg-muted/50">
                      <span>Annual Rainfall:</span>
                      <span className="font-medium">
                        {data.rainfall} mm
                      </span>
                    </div>
                    <div className="flex justify-between p-2 rounded bg-muted/50">
                      <span>Runoff Coefficient:</span>
                      <span className="font-medium">
                        0.8 (80%)
                      </span>
                    </div>
                    <div className="border-t border-border pt-2 mt-2">
                      <div className="flex justify-between font-semibold p-2 rounded bg-blue-500/10 text-blue-600">
                        <span>Annual Harvest:</span>
                        <span>
                          {annualHarvest.toLocaleString()}{" "}
                          litres
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h5 className="font-medium text-emerald-600">
                    🏗️ Storage & Investment
                  </h5>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between p-2 rounded bg-muted/50">
                      <span>Monthly Average:</span>
                      <span className="font-medium">
                        {monthly.toLocaleString()} L
                      </span>
                    </div>
                    <div className="flex justify-between p-2 rounded bg-muted/50">
                      <span>Tank Size (60%):</span>
                      <span className="font-medium">
                        {tankLitres.toLocaleString()} L
                      </span>
                    </div>
                    <div className="flex justify-between p-2 rounded bg-muted/50">
                      <span>Setup Cost:</span>
                      <span className="font-medium">
                        {costEstimate}
                      </span>
                    </div>
                    <div className="border-t border-border pt-2 mt-2">
                      <div
                        className={`flex justify-between font-semibold p-2 rounded ${getSustainabilityBadgeColor()}`}
                      >
                        <span>Sustainability:</span>
                        <span>{sustainabilityScore}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent
            value="recommendations"
            className="space-y-6"
          >
            <div className="rounded-2xl bg-card ring-1 ring-border p-6 shadow-lg">
              <h4 className="font-semibold mb-4">
                Implementation Roadmap
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="p-4 rounded-xl bg-gradient-to-br from-purple-500/10 to-purple-600/10 border border-purple-500/20">
                  <p className="font-semibold text-purple-600">
                    Suggested Structure
                  </p>
                  <p className="text-muted-foreground mt-1">
                    {rechargeStructure}
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-gradient-to-br from-rose-500/10 to-rose-600/10 border border-rose-500/20">
                  <p className="font-semibold text-rose-600">
                    Investment Range
                  </p>
                  <p className="text-muted-foreground mt-1">
                    {costEstimate} (approx)
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-500/10 to-emerald-600/10 border border-emerald-500/20">
                  <p className="font-semibold text-emerald-600">
                    Water Savings
                  </p>
                  <p className="text-muted-foreground mt-1">
                    {monthly.toLocaleString()} L/month potential
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {[
                  {
                    step: "1",
                    title: "Site Assessment & Planning",
                    description:
                      "Conduct detailed soil permeability tests and finalize locations for recharge structures. Obtain necessary permits.",
                    color: "bg-blue-500/20 text-blue-600",
                  },
                  {
                    step: "2",
                    title: "Infrastructure Installation",
                    description:
                      "Install gutters, first-flush diverters, filtration systems, and storage/recharge infrastructure.",
                    color: "bg-emerald-500/20 text-emerald-600",
                  },
                  {
                    step: "3",
                    title: "System Testing & Calibration",
                    description:
                      "Test the complete system during initial rains and make necessary adjustments for optimal performance.",
                    color: "bg-amber-500/20 text-amber-600",
                  },
                  {
                    step: "4",
                    title: "Maintenance & Monitoring",
                    description:
                      "Establish regular cleaning schedules and monitoring protocols to ensure long-term system efficiency.",
                    color: "bg-purple-500/20 text-purple-600",
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex gap-4 p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    <div
                      className={`w-10 h-10 ${item.color} rounded-full flex items-center justify-center font-bold text-sm`}
                    >
                      {item.step}
                    </div>
                    <div className="flex-1">
                      <h5 className="font-semibold mb-1">
                        {item.title}
                      </h5>
                      <p className="text-sm text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold text-amber-600">
                    💡 Expert Consultation:
                  </span>{" "}
                  We recommend consulting with local water
                  harvesting experts to finalize dimensions and
                  specifications based on your specific site
                  conditions and local regulations.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4 mt-8">
          <Button
            variant="outline"
            onClick={() => onNavigate("dashboard")}
            className="border-border text-muted-foreground hover:text-foreground hover:bg-muted"
          >
            New Assessment
          </Button>
          <Button
            onClick={() => window.print()}
            className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white hover:from-emerald-700 hover:to-emerald-800 shadow-lg hover:shadow-xl transition-all duration-200"
          >
            Print Report
          </Button>
        </div>
      </div>
    </div>
  );
}