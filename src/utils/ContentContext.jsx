import React, { createContext, useState, useEffect, useContext } from 'react';
import initialContent from './componentContent.json';

// Create context
export const ContentContext = createContext();

// Custom hook for using the content context
export const useContent = () => useContext(ContentContext);

export const ContentProvider = ({ children }) => {
  const [content, setContent] = useState(initialContent);
  const [history, setHistory] = useState([]);

  // Load content from localStorage on initial render
  useEffect(() => {
    const savedContent = localStorage.getItem('componentContent');
    if (savedContent) {
      setContent(JSON.parse(savedContent));
    }
    
    const savedHistory = localStorage.getItem('contentHistory');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Update a component's content
  const updateContent = (componentName, key, value) => {
    // Create a snapshot of the current content before updating
    const previousContent = JSON.parse(JSON.stringify(content));
    
    // Create a new content object with the updated value
    const newContent = {
      ...content,
      components: {
        ...content.components,
        [componentName]: {
          ...content.components[componentName],
          [key]: value
        }
      }
    };
    
    // Store the previous version in history with timestamp
    const historyItem = {
      timestamp: new Date().toISOString(),
      content: previousContent,
      componentName,
      key,
      oldValue: content.components[componentName]?.[key],
      newValue: value
    };
    
    const updatedHistory = [historyItem, ...history].slice(0, 50); // Limit history to 50 items
    
    // Update state
    setContent(newContent);
    setHistory(updatedHistory);
    
    // Save to localStorage
    localStorage.setItem('componentContent', JSON.stringify(newContent));
    localStorage.setItem('contentHistory', JSON.stringify(updatedHistory));
  };

  // Revert to a specific version in history
  const revertToVersion = (index) => {
    const historyItem = history[index];
    if (historyItem) {
      setContent(historyItem.content);
      localStorage.setItem('componentContent', JSON.stringify(historyItem.content));
    }
  };

  // Get content for a specific component and key
  const getContent = (componentName, key, defaultValue = '') => {
    return content.components[componentName]?.[key] || defaultValue;
  };

  return (
    <ContentContext.Provider 
      value={{ 
        content, 
        history,
        updateContent, 
        revertToVersion,
        getContent
      }}
    >
      {children}
    </ContentContext.Provider>
  );
}; 