'use client'
import React, { useEffect, useState } from 'react';
import { 
  Calendar, 
  Clock, 
  Target, 
  TrendingUp, 
  Moon, 
  Sun, 
  Play, 
  CheckCircle,
  Star,
  Smartphone,
  Zap,
  Trophy,
  Flame,
  ArrowRight,
  Download,
  Users,
  BarChart3,
  Bell,
  Shield,
  Quote
} from 'lucide-react';

const NextHabitLanding = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isVisible, setIsVisible] = useState({});

  // Intersection Observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible(prev => ({
            ...prev,
            [entry.target.id]: entry.isIntersecting
          }));
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('[id]').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial(prev => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: <Target className="w-8 h-8" />,
      title: "Smart Goal Setting",
      description: "Set meaningful habits with our AI-powered suggestions and personalized recommendations.",
      color: "purple"
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Beautiful Analytics",
      description: "Track your progress with stunning visualizations and detailed insights into your habit patterns.",
      color: "blue"
    },
    {
      icon: <Bell className="w-8 h-8" />,
      title: "Smart Reminders",
      description: "Never miss a habit with intelligent notifications that adapt to your schedule and preferences.",
      color: "green"
    },
    {
      icon: <Trophy className="w-8 h-8" />,
      title: "Achievement System",
      description: "Stay motivated with streaks, badges, and rewards that celebrate your consistency and growth.",
      color: "yellow"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Community Support",
      description: "Join thousands of users on similar journeys. Share progress and get inspired by others.",
      color: "pink"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Privacy First",
      description: "Your data stays yours. We use end-to-end encryption to keep your personal information secure.",
      color: "indigo"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Product Designer",
      content: "Next Habit transformed my morning routine. The beautiful interface makes tracking habits actually enjoyable!",
      rating: 5,
      avatar: "👩‍💼"
    },
    {
      name: "Marcus Johnson",
      role: "Fitness Coach",
      content: "I've tried dozens of habit apps. Next Habit's analytics and motivation system are in a league of their own.",
      rating: 5,
      avatar: "🏃‍♂️"
    },
    {
      name: "Emily Rodriguez",
      role: "Student",
      content: "Finally hit my reading goal thanks to Next Habit. The streak system is incredibly motivating!",
      rating: 5,
      avatar: "👩‍🎓"
    }
  ];

  const stats = [
    { number: "50K+", label: "Active Users" },
    { number: "2M+", label: "Habits Completed" },
    { number: "4.9", label: "App Store Rating" },
    { number: "89%", label: "Success Rate" }
  ];

  const FeatureCard = ({ feature, index, delay = 0 }) => (
    <div 
      id={`feature-${index}`}
      className={`${darkMode ? 'bg-gray-800/50 hover:bg-gray-800/70' : 'bg-white/70 hover:bg-white/90'} 
        backdrop-blur-sm rounded-3xl p-8 transition-all duration-500 hover:scale-105 group
        ${darkMode ? 'shadow-2xl shadow-gray-900/20' : 'shadow-xl shadow-gray-200/30'}
        ${isVisible[`feature-${index}`] ? 'animate-slide-up opacity-100' : 'opacity-0'}
        border ${darkMode ? 'border-gray-700/50' : 'border-gray-200/50'}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className={`w-16 h-16 rounded-2xl mb-6 flex items-center justify-center transition-all duration-300 group-hover:scale-110
        ${feature.color === 'purple' ? 'bg-purple-500/20 text-purple-500' :
          feature.color === 'blue' ? 'bg-blue-500/20 text-blue-500' :
          feature.color === 'green' ? 'bg-green-500/20 text-green-500' :
          feature.color === 'yellow' ? 'bg-yellow-500/20 text-yellow-500' :
          feature.color === 'pink' ? 'bg-pink-500/20 text-pink-500' :
          'bg-indigo-500/20 text-indigo-500'}`}>
        {feature.icon}
      </div>
      <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        {feature.title}
      </h3>
      <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} leading-relaxed`}>
        {feature.description}
      </p>
    </div>
  );

  return (
    <div className={`min-h-screen transition-all duration-500 ${
      darkMode 
        ? 'bg-gradient-to-br from-gray-900 via-gray-900 to-purple-900/20 text-white' 
        : 'bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 text-gray-900'
    }`}>
      <style jsx>{`
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }

        
        .animate-slide-up {
          animation: slide-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animate-glow {
          animation: glow 2s ease-in-out infinite;
        }
      `}</style>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-md bg-opacity-80 border-b border-gray-200/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Zap size={20} className="text-white" />
              </div>
              <span className="text-xl font-bold">Next Habit</span>
            </div>
            
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className={`hover:text-purple-500 transition-colors ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Features</a>
              <a href="#testimonials" className={`hover:text-purple-500 transition-colors ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Reviews</a>
              <a href="#pricing" className={`hover:text-purple-500 transition-colors ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Pricing</a>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-xl transition-colors ${
                  darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-100'
                } shadow-lg`}
              >
                {darkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 text-purple-500 text-sm font-medium mb-6 animate-float">
              <Flame size={16} />
              Join 50,000+ habit builders
            </span>
          </div>
          
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight">
            Build
            <span className="bg-gradient-to-r from-purple-500 via-blue-500 to-green-500 bg-clip-text text-transparent animate-glow">
              {" "}Better{" "}
            </span>
            Habits
          </h1>
          
          <p className={`text-xl md:text-2xl mb-12 max-w-3xl mx-auto leading-relaxed ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Transform your life one habit at a time with the most beautiful and intuitive habit tracker ever created.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <button className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 hover:scale-105 shadow-2xl flex items-center gap-2 animate-glow">
              <Download size={20} />
              Download Free
            </button>
            <button className={`${darkMode ? 'bg-gray-800 hover:bg-gray-700 text-white' : 'bg-white hover:bg-gray-50 text-gray-900'} px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 hover:scale-105 shadow-xl flex items-center gap-2`}>
              <Play size={20} />
              Watch Demo
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="text-3xl md:text-4xl font-bold text-purple-500 mb-2">{stat.number}</div>
                <div className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* App Preview */}
      <section className="py-20 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto text-center">
          <div className={`inline-flex items-center justify-center w-80 h-96 rounded-3xl ${
            darkMode ? 'bg-gray-800' : 'bg-white'
          } shadow-2xl mb-12 animate-float relative`}>
            <div className="absolute inset-4 rounded-2xl bg-gradient-to-br from-purple-500/20 via-blue-500/20 to-green-500/20 flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Target size={32} className="text-white" />
                </div>
                <h3 className="font-bold text-lg mb-2">Your Habits</h3>
                <div className="space-y-3">
                  <div className={`h-3 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} relative overflow-hidden`}>
                    <div className="h-full w-4/5 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full"></div>
                  </div>
                  <div className={`h-3 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} relative overflow-hidden`}>
                    <div className="h-full w-3/5 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"></div>
                  </div>
                  <div className={`h-3 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} relative overflow-hidden`}>
                    <div className="h-full w-5/6 bg-gradient-to-r from-green-500 to-green-600 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Everything you need to
              <span className="bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent"> succeed</span>
            </h2>
            <p className={`text-xl max-w-3xl mx-auto ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Powerful features designed to help you build lasting habits and achieve your goals.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <FeatureCard 
                key={index} 
                feature={feature} 
                index={index} 
                delay={index * 100} 
              />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-16">
            Loved by
            <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent"> thousands</span>
          </h2>
          
          <div className={`${darkMode ? 'bg-gray-800/50' : 'bg-white/70'} backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-2xl border ${darkMode ? 'border-gray-700/50' : 'border-gray-200/50'}`}>
            <Quote size={48} className={`mx-auto mb-6 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} />
            <p className="text-xl md:text-2xl mb-8 leading-relaxed">
              "{testimonials[currentTestimonial].content}"
            </p>
            
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="text-4xl">{testimonials[currentTestimonial].avatar}</div>
              <div>
                <div className="font-bold text-lg">{testimonials[currentTestimonial].name}</div>
                <div className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {testimonials[currentTestimonial].role}
                </div>
              </div>
            </div>
            
            <div className="flex justify-center gap-1 mb-6">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={20} className="fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            
            <div className="flex justify-center gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentTestimonial 
                      ? 'bg-purple-500' 
                      : darkMode ? 'bg-gray-600' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className={`max-w-4xl mx-auto text-center ${darkMode ? 'bg-gray-800/50' : 'bg-white/70'} backdrop-blur-sm rounded-3xl p-12 shadow-2xl border ${darkMode ? 'border-gray-700/50' : 'border-gray-200/50'}`}>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to transform
            <span className="bg-gradient-to-r from-purple-500 to-green-500 bg-clip-text text-transparent"> your life?</span>
          </h2>
          <p className={`text-xl mb-8 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Join thousands of people who are already building better habits with Next Habit.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 hover:scale-105 shadow-2xl flex items-center gap-2 justify-center animate-glow">
              <Download size={20} />
              Start Free Today
              <ArrowRight size={20} />
            </button>
          </div>
          
          <p className={`text-sm mt-4 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            No credit card required • 7-day free trial • Cancel anytime
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className={`py-12 px-6 border-t ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Zap size={20} className="text-white" />
            </div>
            <span className="text-xl font-bold">Next Habit</span>
          </div>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Build better habits. Build a better you.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default NextHabitLanding;