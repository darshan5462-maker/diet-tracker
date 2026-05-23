import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Heart, Zap, BarChart3, Droplets, Scale, Users,
  Shield, ClipboardList, Apple, ArrowRight, Check
} from 'lucide-react'

const features = [
  { icon: BarChart3, title: 'Smart Calorie Tracking', desc: 'Track daily intake with detailed macro breakdowns and visual progress charts.', color: 'from-orange-400 to-amber-400' },
  { icon: Apple, title: 'Meal Management', desc: 'Log breakfast, lunch, dinner and snacks with our extensive food database.', color: 'from-primary-500 to-teal-500' },
  { icon: Scale, title: 'BMI Calculator', desc: 'Monitor your weight progress and BMI with trend analysis over time.', color: 'from-blue-500 to-indigo-500' },
  { icon: Droplets, title: 'Water Intake Tracker', desc: 'Stay hydrated with daily water tracking goals and visual progress indicators.', color: 'from-cyan-500 to-blue-500' },
  { icon: ClipboardList, title: 'Doctor Diet Plans', desc: 'Receive personalized diet plans directly from your doctor or nutritionist.', color: 'from-purple-500 to-pink-500' },
  { icon: BarChart3, title: 'Health Analytics', desc: 'Weekly and monthly reports with interactive charts and nutrition trends.', color: 'from-rose-500 to-red-500' },
]

const stats = [
  { value: '50K+', label: 'Active Patients' },
  { value: '2K+', label: 'Doctors & Nutritionists' },
  { value: '1M+', label: 'Meals Tracked' },
  { value: '98%', label: 'Satisfaction Rate' },
]

const plans = [
  { title: 'Patient', price: 'Free', features: ['Daily calorie tracking', 'Meal logging', 'Water tracker', 'BMI calculator', 'Basic reports'], color: 'from-primary-500 to-teal-500' },
  { title: 'Doctor', price: 'Pro', features: ['Patient management', 'Diet plan creator', 'Progress monitoring', 'Nutritional advice tools', 'Advanced analytics'], color: 'from-blue-500 to-indigo-500', popular: true },
]

export default function HomePage() {
  return (
    <div className="overflow-x-hidden">
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-300/20 rounded-full blur-3xl animate-float" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-teal-300/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full text-sm font-semibold mb-6">
                <Heart size={14} className="fill-current" />
                Healthcare Diet Management System
              </span>

              <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white leading-tight mb-6">
                Track Your Diet,{' '}
                <span className="text-gradient">Transform</span>{' '}
                Your Health
              </h1>

              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed max-w-2xl">
                A comprehensive platform for patients to track calories, diet plans, and health progress — while doctors monitor and guide with personalized recommendations.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link to="/register" className="btn-primary flex items-center gap-2 text-base">
                  Start Free Today <ArrowRight size={18} />
                </Link>
                <Link to="/login" className="btn-secondary flex items-center gap-2 text-base">
                  Sign In
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-gradient-to-r from-primary-500 to-teal-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="text-center text-white"
              >
                <p className="font-display text-4xl font-bold">{stat.value}</p>
                <p className="text-white/80 mt-1 text-sm">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
              Powerful features designed for both patients and healthcare providers.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-6 hover:shadow-xl transition-all duration-300 group"
              >
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <f.icon size={22} className="text-white" />
                </div>
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">{f.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Roles */}
      <section className="py-24 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl font-bold text-gray-900 dark:text-white mb-4">Choose Your Role</h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg">Tailored experience for every user type.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {plans.map((plan) => (
              <motion.div
                key={plan.title}
                whileHover={{ y: -4 }}
                className={`glass-card p-8 relative ${plan.popular ? 'ring-2 ring-blue-500' : ''}`}
              >
                {plan.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-xs font-bold px-4 py-1 rounded-full">
                    MOST POPULAR
                  </span>
                )}
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${plan.color} flex items-center justify-center mb-4 shadow-lg`}>
                  {plan.title === 'Patient' ? <Heart size={24} className="text-white" /> : <Users size={24} className="text-white" />}
                </div>
                <h3 className="font-display text-2xl font-bold text-gray-900 dark:text-white mb-1">{plan.title}</h3>
                <p className="text-primary-500 font-semibold mb-6">{plan.price}</p>
                <ul className="space-y-3 mb-8">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                      <Check size={16} className="text-primary-500 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link to="/register" className="btn-primary w-full text-center block">
                  Get Started as {plan.title}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="glass-card p-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-teal-500/10" />
            <div className="relative">
              <Heart size={48} className="text-primary-500 mx-auto mb-6" />
              <h2 className="font-display text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Start Your Health Journey Today
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-lg mb-8">
                Join thousands of patients and doctors using NutriTrack to achieve better health outcomes.
              </p>
              <Link to="/register" className="btn-primary inline-flex items-center gap-2 text-base px-8 py-4">
                Create Free Account <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-primary-500 to-teal-500 flex items-center justify-center">
              <Heart size={12} className="text-white" />
            </div>
            <span className="font-display font-bold text-gradient">NutriTrack</span>
          </div>
          <p className="text-sm text-gray-500">© {new Date().getFullYear()} NutriTrack. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
