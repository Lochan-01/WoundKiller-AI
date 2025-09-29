import React from 'react';
import ChatInterface from '../components/ChatInterface';
import { motion } from 'framer-motion';

const AskDoctor = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="h-screen overflow-hidden"
    >
      <ChatInterface />
    </motion.div>
  );
};

export default AskDoctor;