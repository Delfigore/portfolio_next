import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const ProjectsSection: React.FC = () => {
  const projects = [
    { title: "Project 1", description: "A brief description of Project 1" },
    { title: "Project 2", description: "A brief description of Project 2" },
    { title: "Project 3", description: "A brief description of Project 3" },
  ];

  return (
    <motion.div 
      className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.1,
          },
        },
      }}
      initial="hidden"
      animate="visible"
    >
      {projects.map((project, index) => (
        <motion.div 
          key={index}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 },
          }}
        >
          <Card className="bg-white/30 dark:bg-gray-800/30 backdrop-blur-md hover:bg-white/40 dark:hover:bg-gray-700/40 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 border border-gray-200/50 dark:border-gray-700/50">
            <CardHeader>
              <CardTitle className="text-purple-600 dark:text-purple-400 text-center">{project.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400 text-center">{project.description}</p>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button variant="outline" className="border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white dark:border-purple-400 dark:text-purple-400 dark:hover:bg-purple-400 dark:hover:text-gray-900 transition-all duration-200 transform hover:-translate-y-1">View Project</Button>
            </CardFooter>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default ProjectsSection;