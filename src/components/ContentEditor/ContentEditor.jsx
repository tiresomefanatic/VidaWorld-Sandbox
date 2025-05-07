import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useContent } from '../../utils/ContentContext';
import './ContentEditor.scss';

const ContentEditor = ({ isOpen, onClose }) => {
  const { content, updateContent, history, revertToVersion } = useContent();
  const [activeTab, setActiveTab] = useState('editor');
  const [searchTerm, setSearchTerm] = useState('');
  const [editableValue, setEditableValue] = useState({});

  // Function to handle editing a content field
  const handleEdit = (componentName, key, currentValue) => {
    setEditableValue({
      componentName,
      key,
      value: currentValue
    });
  };

  // Function to save an edited field
  const handleSave = () => {
    if (editableValue.componentName && editableValue.key) {
      updateContent(editableValue.componentName, editableValue.key, editableValue.value);
      setEditableValue({});
    }
  };

  // Function to cancel editing
  const handleCancel = () => {
    setEditableValue({});
  };

  // Filter components based on search term
  const filteredComponents = Object.entries(content.components)
    .filter(([componentName]) => 
      componentName.toLowerCase().includes(searchTerm.toLowerCase())
    );

  // Format timestamp for display
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  // Calculate diff between old and new values
  const renderDiff = (oldValue, newValue) => {
    if (typeof oldValue !== 'string' || typeof newValue !== 'string') {
      return <div className="diff-container">Value type changed</div>;
    }

    if (oldValue === newValue) {
      return <div className="diff-container">{oldValue}</div>;
    }

    // Simple character-based diff highlighting
    const diffContainer = document.createElement('div');
    diffContainer.className = 'diff-container';

    let i = 0;
    let j = 0;
    
    while (i < oldValue.length || j < newValue.length) {
      if (i < oldValue.length && j < newValue.length && oldValue[i] === newValue[j]) {
        // Characters match
        const span = document.createElement('span');
        span.textContent = oldValue[i];
        diffContainer.appendChild(span);
        i++;
        j++;
      } else {
        // Find the next matching point
        let nextMatchOld = i;
        let nextMatchNew = j;
        let found = false;
        
        // Look ahead up to 10 characters to find a match
        for (let lookAhead = 1; lookAhead <= 10; lookAhead++) {
          if (i + lookAhead < oldValue.length && 
              j < newValue.length && 
              oldValue[i + lookAhead] === newValue[j]) {
            nextMatchOld = i + lookAhead;
            nextMatchNew = j;
            found = true;
            break;
          }
          
          if (i < oldValue.length && 
              j + lookAhead < newValue.length && 
              oldValue[i] === newValue[j + lookAhead]) {
            nextMatchOld = i;
            nextMatchNew = j + lookAhead;
            found = true;
            break;
          }
        }
        
        if (found) {
          // Remove old content
          if (nextMatchOld > i) {
            const removed = document.createElement('span');
            removed.className = 'diff-removed';
            removed.textContent = oldValue.substring(i, nextMatchOld);
            diffContainer.appendChild(removed);
          }
          
          // Add new content
          if (nextMatchNew > j) {
            const added = document.createElement('span');
            added.className = 'diff-added';
            added.textContent = newValue.substring(j, nextMatchNew);
            diffContainer.appendChild(added);
          }
          
          i = nextMatchOld;
          j = nextMatchNew;
        } else {
          // No match found, treat remaining as different
          if (i < oldValue.length) {
            const removed = document.createElement('span');
            removed.className = 'diff-removed';
            removed.textContent = oldValue.substring(i);
            diffContainer.appendChild(removed);
          }
          
          if (j < newValue.length) {
            const added = document.createElement('span');
            added.className = 'diff-added';
            added.textContent = newValue.substring(j);
            diffContainer.appendChild(added);
          }
          
          break;
        }
      }
    }
    
    return <div className="diff-container" dangerouslySetInnerHTML={{ __html: diffContainer.innerHTML }} />;
  };

  if (!isOpen) return null;

  return (
    <div className="content-editor">
      <div className="content-editor__overlay" onClick={onClose}></div>
      <div className="content-editor__modal">
        <div className="content-editor__header">
          <h2>Content Editor</h2>
          <button className="content-editor__close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="content-editor__tabs">
          <button 
            className={`content-editor__tab ${activeTab === 'editor' ? 'content-editor__tab--active' : ''}`} 
            onClick={() => setActiveTab('editor')}
          >
            Edit Content
          </button>
          <button 
            className={`content-editor__tab ${activeTab === 'history' ? 'content-editor__tab--active' : ''}`} 
            onClick={() => setActiveTab('history')}
          >
            History
          </button>
        </div>
        
        {activeTab === 'editor' && (
          <div className="content-editor__editor">
            <div className="content-editor__search">
              <input
                type="text"
                placeholder="Search components..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="content-editor__components">
              {filteredComponents.map(([componentName, fields]) => (
                <div key={componentName} className="content-editor__component">
                  <h3>{componentName}</h3>
                  <div className="content-editor__fields">
                    {Object.entries(fields).map(([key, value]) => (
                      <div key={`${componentName}-${key}`} className="content-editor__field">
                        <div className="content-editor__field-header">
                          <span className="content-editor__field-key">{key}</span>
                          <button 
                            className="content-editor__edit-btn"
                            onClick={() => handleEdit(componentName, key, value)}
                          >
                            Edit
                          </button>
                        </div>
                        <div className="content-editor__field-value">
                          {editableValue.componentName === componentName && editableValue.key === key ? (
                            <div className="content-editor__field-edit">
                              <textarea
                                value={editableValue.value}
                                onChange={(e) => setEditableValue({
                                  ...editableValue,
                                  value: e.target.value
                                })}
                              />
                              <div className="content-editor__actions">
                                <button onClick={handleSave}>Save</button>
                                <button onClick={handleCancel}>Cancel</button>
                              </div>
                            </div>
                          ) : (
                            <span>{value}</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {activeTab === 'history' && (
          <div className="content-editor__history">
            {history.length === 0 ? (
              <p className="content-editor__no-history">No history available yet.</p>
            ) : (
              <div className="content-editor__history-list">
                {history.map((item, index) => (
                  <div key={index} className="content-editor__history-item">
                    <div className="content-editor__history-header">
                      <span className="content-editor__timestamp">
                        {formatTimestamp(item.timestamp)}
                      </span>
                      <div className="content-editor__history-component">
                        <strong>{item.componentName}</strong> - {item.key}
                      </div>
                      <button 
                        className="content-editor__revert-btn"
                        onClick={() => revertToVersion(index)}
                      >
                        Revert to this version
                      </button>
                    </div>
                    <div className="content-editor__diff">
                      {renderDiff(item.oldValue, item.newValue)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

ContentEditor.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
};

export default ContentEditor; 