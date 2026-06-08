"use client";

import * as React from "react";
import { motion, useInView } from "framer-motion";
import { Target, Lightbulb, Users, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface MissionValue {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface MissionStatementProps {
  title?: string;
  mission?: string;
  vision?: string;
  values?: MissionValue[];
  className?: string;
}

const defaultValues: MissionValue[] = [
  {
    icon: <Target className="w-6 h-6" />,
    title: "Purpose-Driven",
    description: "We exist to create meaningful impact through innovative solutions that solve real-world problems.",
  },
  {
    icon: <Lightbulb className="w-6 h-6" />,
    title: "Innovation First",
    description: "We embrace creativity and cutting-edge technology to push boundaries and exceed expectations.",
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: "People-Centered",
    description: "Our success is built on empowering our team and delivering exceptional value to our customers.",
  },
  {
    icon: <TrendingUp className="w-6 h-6" />,
    title: "Continuous Growth",
    description: "We believe in constant learning, adaptation, and improvement in everything we do.",
  },
];

export function MissionStatement({
  title = "Our Mission",
  mission = "To empower businesses and individuals with innovative technology solutions that transform challenges into opportunities, creating lasting value and positive impact in the digital age.",
  vision = "We envision a future where technology seamlessly enhances human potential, enabling organizations to thrive and communities to flourish through accessible, sustainable, and transformative digital experiences.",
  values = defaultValues,
  className,
}: MissionStatementProps) {
  const sectionRef = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <section
      ref={sectionRef}
      className={cn(
        "relative w-full py-24 px-4 bg-gradient-to-b from-background via-muted/20 to-background overflow-hidden",
        className
      )}
    >
      {/* Decorative background elements */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20" />
      
      <motion.div
        className="absolute top-20 left-10 w-72 h-72 rounded-full bg-primary/5 blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      <motion.div
        className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-primary/5 blur-3xl"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.5, 0.3, 0.5],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="container mx-auto max-w-6xl relative z-10"
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={containerVariants}
      >
        {/* Header */}
        <motion.div className="text-center mb-16" variants={itemVariants}>
          <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-4">
            {title}
          </h2>
          
          <motion.div
            className="w-24 h-1 bg-primary mx-auto rounded-full"
            initial={{ width: 0 }}
            animate={isInView ? { width: 96 } : { width: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          />
        </motion.div>

        {/* Mission & Vision Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-20">
          <motion.div
            variants={itemVariants}
            className="group relative overflow-hidden rounded-2xl border border-border bg-card p-8 shadow-lg hover:shadow-xl transition-all duration-300"
            whileHover={{ y: -5 }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-xl bg-primary/10 text-primary">
                  <Target className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-semibold text-foreground">Our Mission</h3>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                {mission}
              </p>
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="group relative overflow-hidden rounded-2xl border border-border bg-card p-8 shadow-lg hover:shadow-xl transition-all duration-300"
            whileHover={{ y: -5 }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-xl bg-primary/10 text-primary">
                  <Lightbulb className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-semibold text-foreground">Our Vision</h3>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                {vision}
              </p>
            </div>
          </motion.div>
        </div>

        {/* Core Values */}
        <motion.div variants={itemVariants} className="text-center mb-12">
          <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Our Core Values
          </h3>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            The principles that guide our decisions and define our culture
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group relative overflow-hidden rounded-xl border border-border bg-card p-6 hover:border-primary/50 transition-all duration-300"
              whileHover={{ y: -8, scale: 1.02 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative">
                <motion.div
                  className="inline-flex p-3 rounded-xl bg-primary/10 text-primary mb-4 group-hover:bg-primary/20 transition-colors"
                  whileHover={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  {value.icon}
                </motion.div>
                <h4 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {value.title}
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {value.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
