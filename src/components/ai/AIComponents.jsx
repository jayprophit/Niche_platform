import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { ResponsiveLayout } from '../../lib/responsive/ResponsiveLayout';

// AI Assistant Component
export const AIAssistant = ({ user, settings }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [assistantMode, setAssistantMode] = useState(settings?.defaultMode || 'conversational');
  const messagesEndRef = useRef(null);
  
  useEffect(() => {
    // Scroll to bottom of messages
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;
    
    // Add user message
    const newMessages = [...messages, {
      id: Date.now(),
      sender: 'user',
      content: inputMessage,
      timestamp: new Date().toISOString()
    }];
    
    setMessages(newMessages);
    setInputMessage('');
    setIsTyping(true);
    
    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: Date.now() + 1,
        sender: 'assistant',
        content: `This is a simulated response to "${inputMessage}"`,
        timestamp: new Date().toISOString()
      };
      
      setMessages([...newMessages, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };
  
  return (
    <ResponsiveLayout>
      <div className="ai-assistant">
        <div className="assistant-header">
          <div className="assistant-info">
            <div className="assistant-avatar">
              <img src="/images/ai-assistant-avatar.png" alt="AI Assistant" />
            </div>
            <div className="assistant-details">
              <h1>AI Assistant</h1>
              <p className="assistant-status">
                {isTyping ? 'Typing...' : 'Online'}
              </p>
            </div>
          </div>
          
          <div className="assistant-modes">
            <button 
              className={`mode-btn ${assistantMode === 'conversational' ? 'active' : ''}`}
              onClick={() => setAssistantMode('conversational')}
            >
              <i className="chat-icon"></i>
              <span>Chat</span>
            </button>
            <button 
              className={`mode-btn ${assistantMode === 'search' ? 'active' : ''}`}
              onClick={() => setAssistantMode('search')}
            >
              <i className="search-icon"></i>
              <span>Search</span>
            </button>
            <button 
              className={`mode-btn ${assistantMode === 'create' ? 'active' : ''}`}
              onClick={() => setAssistantMode('create')}
            >
              <i className="create-icon"></i>
              <span>Create</span>
            </button>
            <button 
              className={`mode-btn ${assistantMode === 'analyze' ? 'active' : ''}`}
              onClick={() => setAssistantMode('analyze')}
            >
              <i className="analyze-icon"></i>
              <span>Analyze</span>
            </button>
          </div>
          
          <div className="assistant-settings">
            <button className="settings-btn">
              <i className="settings-icon"></i>
            </button>
          </div>
        </div>
        
        <div className="assistant-content">
          <div className="messages-container">
            {messages.length === 0 ? (
              <div className="welcome-message">
                <div className="welcome-icon">
                  <img src="/images/ai-welcome-icon.png" alt="Welcome" />
                </div>
                <h2>How can I help you today?</h2>
                <p>
                  I can assist with finding information, creating content, analyzing data,
                  or just having a conversation. Feel free to ask me anything!
                </p>
                <div className="suggestion-chips">
                  <button 
                    className="suggestion-chip"
                    onClick={() => {
                      setInputMessage('How do I create a course?');
                      handleSendMessage();
                    }}
                  >
                    How do I create a course?
                  </button>
                  <button 
                    className="suggestion-chip"
                    onClick={() => {
                      setInputMessage('Find products related to web development');
                      handleSendMessage();
                    }}
                  >
                    Find web development products
                  </button>
                  <button 
                    className="suggestion-chip"
                    onClick={() => {
                      setInputMessage('Write a blog post about AI');
                      handleSendMessage();
                    }}
                  >
                    Write a blog post about AI
                  </button>
                  <button 
                    className="suggestion-chip"
                    onClick={() => {
                      setInputMessage('Analyze my recent sales data');
                      handleSendMessage();
                    }}
                  >
                    Analyze my sales data
                  </button>
                </div>
              </div>
            ) : (
              <div className="messages-list">
                {messages.map(message => (
                  <div 
                    key={message.id} 
                    className={`message ${message.sender === 'user' ? 'user-message' : 'assistant-message'}`}
                  >
                    <div className="message-avatar">
                      {message.sender === 'user' ? (
                        <img src={user.avatar} alt={user.firstName} />
                      ) : (
                        <img src="/images/ai-assistant-avatar.png" alt="AI Assistant" />
                      )}
                    </div>
                    <div className="message-content">
                      <div className="message-bubble">
                        <p>{message.content}</p>
                      </div>
                      <div className="message-info">
                        <span className="message-time">
                          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        {message.sender === 'assistant' && (
                          <div className="message-actions">
                            <button className="action-btn copy-btn">
                              <i className="copy-icon"></i>
                            </button>
                            <button className="action-btn like-btn">
                              <i className="like-icon"></i>
                            </button>
                            <button className="action-btn dislike-btn">
                              <i className="dislike-icon"></i>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="message assistant-message typing">
                    <div className="message-avatar">
                      <img src="/images/ai-assistant-avatar.png" alt="AI Assistant" />
                    </div>
                    <div className="message-content">
                      <div className="typing-indicator">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
          
          <div className="input-container">
            <div className="input-wrapper">
              <textarea 
                value={inputMessage} 
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Type your message..."
                rows={1}
              />
              <div className="input-actions">
                <button className="action-btn upload-btn">
                  <i className="upload-icon"></i>
                </button>
                <button 
                  className="action-btn send-btn"
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim()}
                >
                  <i className="send-icon"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ResponsiveLayout>
  );
};

// AI Content Generator Component
export const AIContentGenerator = ({ user, templates }) => {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [generationParams, setGenerationParams] = useState({});
  const [generatedContent, setGeneratedContent] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const handleGenerate = () => {
    if (!selectedTemplate) return;
    
    setIsGenerating(true);
    
    // Simulate content generation
    setTimeout(() => {
      setGeneratedContent({
        title: `Generated ${selectedTemplate.name}`,
        content: `This is a simulated ${selectedTemplate.name} generated based on the provided parameters.`,
        timestamp: new Date().toISOString()
      });
      
      setIsGenerating(false);
    }, 2000);
  };
  
  const handleSaveContent = () => {
    // Save content logic
    console.log('Saving content:', generatedContent);
    // Show success message or redirect
  };
  
  return (
    <ResponsiveLayout>
      <div className="ai-content-generator">
        <div className="generator-header">
          <h1>AI Content Generator</h1>
          <p>Create high-quality content for your blog, social media, or courses</p>
        </div>
        
        <div className="generator-content">
          <div className="templates-panel">
            <h2>Content Templates</h2>
            <div className="templates-list">
              {templates.map(template => (
                <div 
                  key={template.id} 
                  className={`template-item ${selectedTemplate?.id === template.id ? 'selected' : ''}`}
                  onClick={() => {
                    setSelectedTemplate(template);
                    setGenerationParams({});
                    setGeneratedContent(null);
                  }}
                >
                  <div className="template-icon">
                    <i className={`${template.icon}-icon`}></i>
                  </div>
                  <div className="template-details">
                    <h3 className="template-name">{template.name}</h3>
                    <p className="template-description">{template.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="generator-panel">
            {selectedTemplate ? (
              <>
                <div className="panel-header">
                  <h2>{selectedTemplate.name} Generator</h2>
                  <p>{selectedTemplate.fullDescription}</p>
                </div>
                
                <div className="panel-content">
                  <div className="parameters-form">
                    <h3>Parameters</h3>
                    {selectedTemplate.parameters.map(param => (
                      <div key={param.id} className="parameter-input">
                        <label>{param.label}</label>
                        {param.type === 'text' ? (
                          <input 
                            type="text" 
                            value={generationParams[param.id] || ''} 
                            onChange={(e) => setGenerationParams({
                              ...generationParams, 
                              [param.id]: e.target.value
                            })}
                            placeholder={param.placeholder}
                          />
                        ) : param.type === 'textarea' ? (
                          <textarea 
                            value={generationParams[param.id] || ''} 
                            onChange={(e) => setGenerationParams({
                              ...generationParams, 
                              [param.id]: e.target.value
                            })}
                            placeholder={param.placeholder}
                            rows={4}
                          />
                        ) : param.type === 'select' ? (
                          <select 
                            value={generationParams[param.id] || ''} 
                            onChange={(e) => setGenerationParams({
                              ...generationParams, 
                              [param.id]: e.target.value
                            })}
                          >
                            <option value="">Select an option</option>
                            {param.options.map(option => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        ) : param.type === 'number' ? (
                          <input 
                            type="number" 
                            value={generationParams[param.id] || ''} 
                            onChange={(e) => setGenerationParams({
                              ...generationParams, 
                              [param.id]: parseInt(e.target.value)
                            })}
                            placeholder={param.placeholder}
                            min={param.min}
                            max={param.max}
                          />
                        ) : null}
                        {param.description && (
                          <p className="parameter-description">{param.description}</p>
                        )}
                      </div>
                    ))}
                    
                    <div className="generation-actions">
                      <button 
                        className="generate-btn"
                        onClick={handleGenerate}
                        disabled={isGenerating}
                      >
                        {isGenerating ? 'Generating...' : 'Generate Content'}
                      </button>
                    </div>
                  </div>
                  
                  {isGenerating && (
                    <div className="generating-indicator">
                      <div className="spinner"></div>
                      <p>Generating your content...</p>
                    </div>
                  )}
                  
                  {generatedContent && (
                    <div className="generated-content">
                      <div className="content-header">
                        <h3>{generatedContent.title}</h3>
                        <p className="generation-time">
                          Generated on {new Date(generatedContent.timestamp).toLocaleString()}
                        </p>
                      </div>
                      
                      <div className="content-preview">
                        <div dangerouslySetInnerHTML={{ __html: generatedConte<response clipped><NOTE>To save on context only part of this file has been shown to you. You should retry this tool after you have searched inside the file with `grep -n` in order to find the line numbers of what you are looking for.</NOTE>