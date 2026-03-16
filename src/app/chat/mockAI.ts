export async function mockAIResponse(message: string): Promise<string> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Simple rule-based responses for demonstration
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
    return 'Hello! How can I assist you today?';
  }
  
  if (lowerMessage.includes('how are you')) {
    return 'I am an AI assistant, so I am always functioning optimally! How can I help you?';
  }
  
  if (lowerMessage.includes('bye') || lowerMessage.includes('goodbye')) {
    return 'Goodbye! Have a great day!';
  }
  
  if (lowerMessage.includes('weather')) {
    return 'I cannot access real-time weather data, but you can check a weather website or app for current conditions.';
  }
  
  if (lowerMessage.includes('name')) {
    return 'I am an AI chat assistant created for demonstration purposes.';
  }
  
  // Default response
  return 'That\'s interesting! Tell me more about what you\'re thinking.';
}