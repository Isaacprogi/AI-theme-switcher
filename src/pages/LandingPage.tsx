import React from 'react';
import { Trophy, Dumbbell, Target, Users } from 'lucide-react';
import { ThemeSwitcher } from '../components/ThemeSwitcher';

export const LandingPage: React.FC = () => {
  const features = [
    {
      icon: <Trophy className="w-8 h-8" />,
      title: "Champion Performance",
      description: "Push your limits and achieve peak performance with cutting-edge training insights."
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Teamwork & Strategy",
      description: "Build stronger teams with data-driven collaboration and smart coaching tools."
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Focused Goals",
      description: "Set precise targets and track your progress across every match and training session."
    },
    {
      icon: <Dumbbell className="w-8 h-8" />,
      title: "Train Smarter",
      description: "Access AI-powered analytics to optimize your workouts and recovery schedules."
    }
  ];

  return (
    <div className="min-h-screen bg-background text-text transition-colors duration-300">
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold">
                SP
              </div>
              <span className="text-xl font-bold text-text">
                SportSync
              </span>
            </div>

            <nav className="hidden md:flex items-center gap-8">
              <a href="#features" className="font-medium text-text hover:opacity-80 transition-opacity">
                Features
              </a>
              <a href="#about" className="font-medium text-text hover:opacity-80 transition-opacity">
                About
              </a>
              <a href="#contact" className="font-medium text-text hover:opacity-80 transition-opacity">
                Contact
              </a>
            </nav>

            <ThemeSwitcher />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight text-text">
            Elevate Your
            <span className="block bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Sports Experience
            </span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-text opacity-80">
            Track performance, boost teamwork, and reach your full athletic potential with SportSync —
            your all-in-one sports performance platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-primary text-white font-semibold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:bg-secondary">
              Get Started Free
            </button>
            <button className="px-8 py-4 border-2 border-primary text-primary font-semibold text-lg rounded-xl hover:shadow-lg transition-all duration-300 hover:bg-primary hover:text-white">
              Watch Demo
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-text">
              Game-Changing Features
            </h2>
            <p className="text-xl text-text opacity-80 max-w-2xl mx-auto">
              Everything you need to train harder, play smarter, and dominate every game.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="p-6 rounded-2xl border border-gray-200 bg-background hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group"
              >
                <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 text-white">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2 text-text">{feature.title}</h3>
                <p className="text-text opacity-80 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6 text-center">
          <div className="rounded-3xl p-12 shadow-2xl max-w-4xl mx-auto bg-gradient-to-r from-primary to-accent">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Level Up Your Game?
            </h2>
            <p className="text-xl text-white opacity-90 mb-8 max-w-2xl mx-auto">
              Join thousands of athletes and teams using SportSync to train smarter and play better.
            </p>
            <button className="px-8 py-4 bg-white text-primary font-semibold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:bg-gray-50">
              Join Now
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8 bg-background">
        <div className="container mx-auto px-6 text-center">
          <p className="text-text opacity-80">
            &copy; 2024 SportSync. Built with React, TypeScript, Tailwind CSS, and AI Analytics.
          </p>
        </div>
      </footer>
    </div>
  );
};
