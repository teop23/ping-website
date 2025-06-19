import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, Circle, Zap, Target, Rocket } from 'lucide-react';
import { ROADMAP_STEPS, type RoadmapStatus } from '../utils/constants';
import { Card, CardContent } from './ui/card';

// Additional greyed out phases for future anticipation
const FUTURE_PHASES = [
  {
    id: "phase-5",
    title: "",
    description: "",
    status: "future" as const
  },
  {
    id: "phase-6", 
    title: "",
    description: "",
    status: "future" as const
  },
  {
    id: "phase-7",
    title: "",
    description: "",
    status: "future" as const
  }
];

// Extended status type to include future phases
type ExtendedRoadmapStatus = RoadmapStatus | "future";

const Roadmap: React.FC = () => {
  const getStatusIcon = (status: ExtendedRoadmapStatus) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case 'in-progress':
        return <Clock className="w-6 h-6 text-blue-500" />;
      case 'upcoming':
        return <Circle className="w-6 h-6 text-gray-400" />;
      case 'future':
        return <Circle className="w-6 h-6 text-gray-300" />;
    }
  };

  const getStatusColor = (status: ExtendedRoadmapStatus) => {
    switch (status) {
      case 'completed':
        return 'from-green-500/20 to-emerald-500/20 border-green-500/30';
      case 'in-progress':
        return 'from-blue-500/20 to-indigo-500/20 border-blue-500/30';
      case 'upcoming':
        return 'from-gray-500/10 to-gray-500/10 border-gray-500/20';
      case 'future':
        return 'from-gray-700 to-gray-800 border-gray-600';
    }
  };

  const getConnectorColor = (status: ExtendedRoadmapStatus) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'in-progress':
        return 'bg-gradient-to-b from-green-500 to-blue-500';
      case 'upcoming':
        return 'bg-gray-300';
      case 'future':
        return 'bg-gray-200';
    }
  };

  // Combine all roadmap steps
  const allSteps = [...ROADMAP_STEPS, ...FUTURE_PHASES];

  return (
    <section id="roadmap" className="relative py-16 sm:py-20 md:py-24 bg-gradient-to-b from-background to-muted/20">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-40 h-40 bg-gradient-to-br from-indigo-400/10 to-purple-400/10 rounded-full blur-3xl"
          animate={{
            y: [0, -30, 0],
            x: [0, 20, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-32 h-32 bg-gradient-to-br from-pink-400/10 to-rose-400/10 rounded-full blur-3xl"
          animate={{
            y: [0, 25, 0],
            x: [0, -15, 0],
            scale: [1, 0.8, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 sm:mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
              <Rocket className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
              Roadmap
            </h2>
          </div>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Our journey to build the ultimate PING ecosystem and community
          </p>
        </motion.div>

        {/* Roadmap Timeline */}
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-4 sm:left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-green-500 via-blue-500 via-gray-300 to-gray-200"></div>

          {/* Roadmap Steps */}
          <div className="space-y-8 sm:space-y-12">
            {allSteps.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="relative flex items-start gap-6 sm:gap-8"
              >
                {/* Timeline Node */}
                <div className="relative z-10 flex-shrink-0">
                  <motion.div
                    className="w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-background border-4 border-background shadow-lg flex items-center justify-center"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                      {getStatusIcon(step.status)}
                    </div>
                  </motion.div>
                  
                  {/* Connector to next step */}
                  {index < allSteps.length - 1 && (
                    <div className={`absolute top-8 sm:top-12 left-1/2 transform -translate-x-1/2 w-0.5 h-8 sm:h-12 ${getConnectorColor(step.status)}`}></div>
                  )}
                </div>

                {/* Content Card */}
                <motion.div
                  className="flex-1 pb-4"
                  whileHover={{ y: -2 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className={`bg-gradient-to-br ${getStatusColor(step.status)} backdrop-blur-sm shadow-xl border-2 overflow-hidden ${step.status === 'future' ? 'blur-sm' : ''}`}>
                  <Card className={`bg-gradient-to-br ${getStatusColor(step.status)} backdrop-blur-sm shadow-xl border-2 overflow-hidden ${step.status === 'future' ? 'blur-[1px]' : ''}`}>
                    <CardContent className="p-4 sm:p-6">
                      {step.status === 'future' ? (
                        // Future phase layout with rectangle outlines
                        <>
                          <div className="flex items-start justify-between gap-4 mb-3">
                            <div className="h-6 sm:h-7 w-32 sm:w-40 bg-transparent border-2 border-gray-500 rounded"></div>
                            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-gray-600/50 backdrop-blur-sm border border-gray-500/50">
                              {getStatusIcon(step.status)}
                              <span className="text-xs sm:text-sm font-medium capitalize text-gray-300">
                                {step.status.replace('-', ' ')}
                              </span>
                            </div>
                          </div>
                          <div className="h-16 sm:h-20 w-full bg-transparent border-2 border-gray-500 rounded"></div>
                        </>
                      ) : (
                        // Regular phase layout
                        <>
                          <div className="flex items-start justify-between gap-4 mb-3">
                            <h3 className="text-lg sm:text-xl font-bold text-foreground">
                              {step.title}
                            </h3>
                            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-background/50 backdrop-blur-sm border border-border/50">
                              {getStatusIcon(step.status)}
                              <span className="text-xs sm:text-sm font-medium capitalize">
                                {step.status.replace('-', ' ')}
                              </span>
                            </div>
                          </div>
                          <p className="text-sm sm:text-base leading-relaxed text-muted-foreground">
                            {step.description}
                          </p>
                        </>
                      )}

                      {/* Progress indicator for in-progress items */}
                      {step.status === 'in-progress' && (
                        <div className="mt-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Zap className="w-4 h-4 text-blue-500" />
                            <span className="text-sm font-medium text-blue-600">In Progress</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <motion.div
                              className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full"
                              initial={{ width: 0 }}
                              whileInView={{ width: "70%" }}
                              viewport={{ once: true }}
                              transition={{ duration: 1, delay: 0.5 }}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground mt-1 block">In Progress</span>
                        </div>
                      )}

                      {/* Completion indicator */}
                      {step.status === 'completed' && (
                        <div className="mt-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Target className="w-4 h-4 text-green-500" />
                            <span className="text-sm font-medium text-green-600">Completed</span>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default Roadmap;