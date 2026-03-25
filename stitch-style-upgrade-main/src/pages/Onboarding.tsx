import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Apple, ChevronRight, Leaf, Heart } from "lucide-react";

const steps = ["welcome", "basics", "health", "goals"] as const;
type Step = typeof steps[number];

const Onboarding = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("welcome");
  const [name, setName] = useState("");

  const currentIndex = steps.indexOf(step);
  const progress = ((currentIndex) / (steps.length - 1)) * 100;

  const next = () => {
    const i = steps.indexOf(step);
    if (i < steps.length - 1) setStep(steps[i + 1]);
    else navigate("/");
  };

  return (
    <div className="min-h-screen bg-background relative flex flex-col">
      {/* Background orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-0 w-72 h-72 rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute bottom-32 -left-20 w-56 h-56 rounded-full bg-primary/10 blur-3xl" />
      </div>

      {/* Progress bar */}
      {step !== "welcome" && (
        <div className="safe-top px-6 pt-4 relative z-10">
          <div className="h-1 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Step {currentIndex} of {steps.length - 1}
          </p>
        </div>
      )}

      <div className="flex-1 flex flex-col items-center justify-center px-6 relative z-10">
        {/* WELCOME */}
        {step === "welcome" && (
          <div className="text-center animate-fade-in max-w-sm">
            <div className="w-20 h-20 rounded-3xl bg-primary/15 flex items-center justify-center mx-auto mb-8">
              <Leaf className="w-10 h-10 text-primary" strokeWidth={2} />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-3">Track Bite</h1>
            <p className="text-muted-foreground text-sm leading-relaxed mb-10">
              Your personal nutrition companion. Track meals, hit your macros, and build healthier habits — effortlessly.
            </p>
            <Button
              onClick={next}
              className="w-full h-14 rounded-2xl text-base font-semibold bg-primary text-primary-foreground shadow-lg shadow-primary/25"
            >
              Get Started
              <ChevronRight className="w-5 h-5 ml-1" />
            </Button>
            <p className="text-xs text-muted-foreground mt-4">Takes less than 2 minutes</p>
          </div>
        )}

        {/* BASICS */}
        {step === "basics" && (
          <div className="w-full max-w-sm animate-fade-in">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-foreground">The Basics</h2>
              <p className="text-sm text-muted-foreground mt-1">Tell us a little about yourself</p>
            </div>
            <div className="glass rounded-3xl p-6 space-y-5">
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Your Name</Label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex"
                  className="h-12 rounded-xl bg-secondary/50 border-0 text-foreground placeholder:text-muted-foreground/60"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Age</Label>
                  <Input
                    type="number"
                    placeholder="28"
                    className="h-12 rounded-xl bg-secondary/50 border-0 text-foreground"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Gender</Label>
                  <div className="flex gap-2">
                    <button className="flex-1 h-12 rounded-xl bg-primary/15 text-primary text-sm font-semibold border border-primary/30">M</button>
                    <button className="flex-1 h-12 rounded-xl bg-secondary/50 text-muted-foreground text-sm font-medium border-0">F</button>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Height (cm)</Label>
                  <Input type="number" placeholder="178" className="h-12 rounded-xl bg-secondary/50 border-0 text-foreground" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Weight (kg)</Label>
                  <Input type="number" placeholder="75" className="h-12 rounded-xl bg-secondary/50 border-0 text-foreground" />
                </div>
              </div>
            </div>
            <Button onClick={next} className="w-full h-14 rounded-2xl text-base font-semibold mt-6 bg-primary text-primary-foreground shadow-lg shadow-primary/25">
              Continue <ChevronRight className="w-5 h-5 ml-1" />
            </Button>
          </div>
        )}

        {/* HEALTH */}
        {step === "health" && (
          <div className="w-full max-w-sm animate-fade-in">
            <div className="text-center mb-8">
              <div className="w-12 h-12 rounded-2xl bg-primary/15 flex items-center justify-center mx-auto mb-4">
                <Heart className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">Health Info</h2>
              <p className="text-sm text-muted-foreground mt-1">Any conditions we should know about?</p>
            </div>
            <div className="glass rounded-3xl p-6 space-y-4">
              {["Diabetes", "High Blood Pressure", "Food Allergies", "Lactose Intolerant", "Gluten Free"].map((condition) => (
                <label key={condition} className="flex items-center gap-3 p-3 rounded-xl bg-secondary/30 cursor-pointer hover:bg-secondary/50 transition-colors">
                  <Checkbox className="border-muted-foreground/30 data-[state=checked]:bg-primary data-[state=checked]:border-primary" />
                  <span className="text-sm font-medium text-foreground">{condition}</span>
                </label>
              ))}
            </div>
            <Button onClick={next} className="w-full h-14 rounded-2xl text-base font-semibold mt-6 bg-primary text-primary-foreground shadow-lg shadow-primary/25">
              Continue <ChevronRight className="w-5 h-5 ml-1" />
            </Button>
          </div>
        )}

        {/* GOALS */}
        {step === "goals" && (
          <div className="w-full max-w-sm animate-fade-in">
            <div className="text-center mb-8">
              <div className="w-12 h-12 rounded-2xl bg-primary/15 flex items-center justify-center mx-auto mb-4">
                <Apple className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">Your Goals</h2>
              <p className="text-sm text-muted-foreground mt-1">What are you working towards?</p>
            </div>
            <div className="glass rounded-3xl p-6 space-y-3">
              {[
                { label: "Lose Weight", desc: "Calorie deficit plan" },
                { label: "Maintain Weight", desc: "Balanced nutrition" },
                { label: "Build Muscle", desc: "High protein, surplus calories" },
                { label: "Eat Healthier", desc: "Better food choices" },
              ].map((goal, i) => (
                <button
                  key={goal.label}
                  className={`w-full text-left p-4 rounded-xl transition-colors ${
                    i === 1
                      ? "bg-primary/15 border border-primary/30"
                      : "bg-secondary/30 hover:bg-secondary/50"
                  }`}
                >
                  <p className={`text-sm font-semibold ${i === 1 ? "text-primary" : "text-foreground"}`}>{goal.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{goal.desc}</p>
                </button>
              ))}
            </div>
            <Button onClick={next} className="w-full h-14 rounded-2xl text-base font-semibold mt-6 bg-primary text-primary-foreground shadow-lg shadow-primary/25">
              Let's Go! 🎉
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Onboarding;
