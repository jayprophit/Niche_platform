/**
 * Enhanced E-commerce Product Components
 * Implements interactive product features, media previews, and technical specifications
 */

import React, { useState, useRef, useEffect } from 'react';

/**
 * Interactive product viewer component
 */
export function InteractiveProductViewer({ product }) {
  const [activeTab, setActiveTab] = useState('gallery');
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const viewerRef = useRef(null);
  const mediaRef = useRef(null);
  
  // Handle fullscreen toggle
  const toggleFullscreen = () => {
    if (!isFullscreen) {
      if (viewerRef.current.requestFullscreen) {
        viewerRef.current.requestFullscreen();
      } else if (viewerRef.current.webkitRequestFullscreen) {
        viewerRef.current.webkitRequestFullscreen();
      } else if (viewerRef.current.msRequestFullscreen) {
        viewerRef.current.msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
  };
  
  // Listen for fullscreen change
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(
        document.fullscreenElement || 
        document.webkitFullscreenElement || 
        document.msFullscreenElement
      );
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('msfullscreenchange', handleFullscreenChange);
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('msfullscreenchange', handleFullscreenChange);
    };
  }, []);
  
  // Handle zoom controls
  const handleZoom = (direction) => {
    if (direction === 'in' && zoomLevel < 3) {
      setZoomLevel(prevZoom => prevZoom + 0.5);
    } else if (direction === 'out' && zoomLevel > 1) {
      setZoomLevel(prevZoom => prevZoom - 0.5);
    } else if (direction === 'reset') {
      setZoomLevel(1);
    }
  };
  
  // Handle rotation controls
  const handleRotate = (direction) => {
    if (direction === 'left') {
      setRotation(prevRotation => prevRotation - 90);
    } else if (direction === 'right') {
      setRotation(prevRotation => prevRotation + 90);
    } else if (direction === 'reset') {
      setRotation(0);
    }
  };
  
  // Handle media playback for video/audio
  const togglePlayback = () => {
    if (mediaRef.current) {
      if (isPlaying) {
        mediaRef.current.pause();
      } else {
        mediaRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };
  
  // Get current media item
  const getCurrentMedia = () => {
    if (!product || !product.media || product.media.length === 0) {
      return null;
    }
    
    if (activeTab === 'gallery') {
      return product.media[activeMediaIndex];
    } else if (activeTab === '3d' && product.model3d) {
      return product.model3d;
    } else if (activeTab === 'cad' && product.cadFiles && product.cadFiles.length > 0) {
      return product.cadFiles[0];
    } else if (activeTab === 'video' && product.videos && product.videos.length > 0) {
      return product.videos[0];
    } else if (activeTab === 'audio' && product.audio && product.audio.length > 0) {
      return product.audio[0];
    }
    
    return null;
  };
  
  const currentMedia = getCurrentMedia();
  
  // Determine if media is image, video, audio, 3D model, or CAD file
  const getMediaType = (media) => {
    if (!media) return null;
    
    if (media.type) return media.type;
    
    const url = media.url || media;
    const extension = url.split('.').pop().toLowerCase();
    
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(extension)) {
      return 'image';
    } else if (['mp4', 'webm', 'ogg', 'mov'].includes(extension)) {
      return 'video';
    } else if (['mp3', 'wav', 'ogg', 'aac'].includes(extension)) {
      return 'audio';
    } else if (['gltf', 'glb', 'obj'].includes(extension)) {
      return '3d';
    } else if (['dwg', 'dxf', 'step', 'stp', 'stl', 'iges', 'igs'].includes(extension)) {
      return 'cad';
    }
    
    return 'unknown';
  };
  
  // Render media based on type
  const renderMedia = () => {
    if (!currentMedia) {
      return <div className="bb-product-no-media">No media available</div>;
    }
    
    const mediaType = getMediaType(currentMedia);
    const mediaUrl = currentMedia.url || currentMedia;
    
    switch (mediaType) {
      case 'image':
        return (
          <div 
            className="bb-product-image-container"
            style={{ 
              transform: `scale(${zoomLevel}) rotate(${rotation}deg)`,
              transition: 'transform 0.3s ease'
            }}
          >
            <img 
              src={mediaUrl} 
              alt={currentMedia.alt || `Product image ${activeMediaIndex + 1}`} 
              className="bb-product-image"
            />
          </div>
        );
        
      case 'video':
        return (
          <div className="bb-product-video-container">
            <video
              ref={mediaRef}
              src={mediaUrl}
              className="bb-product-video"
              controls={false}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onEnded={() => setIsPlaying(false)}
            />
            <div className="bb-product-video-controls">
              <button 
                className="bb-video-control-button"
                onClick={togglePlayback}
              >
                {isPlaying ? (
                  <span className="bb-icon-pause"></span>
                ) : (
                  <span className="bb-icon-play"></span>
                )}
              </button>
            </div>
          </div>
        );
        
      case 'audio':
        return (
          <div className="bb-product-audio-container">
            <div className="bb-product-audio-artwork">
              <img 
                src={product.media[0]?.url || '/default-audio-artwork.jpg'} 
                alt="Audio artwork" 
              />
            </div>
            <audio
              ref={mediaRef}
              src={mediaUrl}
              className="bb-product-audio"
              controls={false}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onEnded={() => setIsPlaying(false)}
            />
            <div className="bb-product-audio-controls">
              <button 
                className="bb-audio-control-button"
                onClick={togglePlayback}
              >
                {isPlaying ? (
                  <span className="bb-icon-pause"></span>
                ) : (
                  <span className="bb-icon-play"></span>
                )}
              </button>
              <div className="bb-audio-info">
                <div className="bb-audio-title">{currentMedia.title || 'Audio Preview'}</div>
                <div className="bb-audio-artist">{product.name}</div>
              </div>
            </div>
          </div>
        );
        
      case '3d':
        return (
          <div className="bb-product-3d-container">
            <iframe
              src={`/3d-viewer?model=${encodeURIComponent(mediaUrl)}`}
              className="bb-product-3d-viewer"
              title="3D Model Viewer"
            />
          </div>
        );
        
      case 'cad':
        return (
          <div className="bb-product-cad-container">
            <iframe
              src={`/cad-viewer?file=${encodeURIComponent(mediaUrl)}`}
              className="bb-product-cad-viewer"
              title="CAD File Viewer"
            />
            <div className="bb-cad-info">
              <div className="bb-cad-filename">{currentMedia.filename || mediaUrl.split('/').pop()}</div>
              <div className="bb-cad-filesize">{currentMedia.filesize || 'Unknown size'}</div>
            </div>
          </div>
        );
        
      default:
        return <div className="bb-product-no-media">Unsupported media type</div>;
    }
  };
  
  // Determine available tabs based on product media
  const getAvailableTabs = () => {
    const tabs = [];
    
    if (product.media && product.media.length > 0) {
      tabs.push({ id: 'gallery', label: 'Gallery', icon: 'image' });
    }
    
    if (product.videos && product.videos.length > 0) {
      tabs.push({ id: 'video', label: 'Video', icon: 'video' });
    }
    
    if (product.audio && product.audio.length > 0) {
      tabs.push({ id: 'audio', label: 'Audio', icon: 'music' });
    }
    
    if (product.model3d) {
      tabs.push({ id: '3d', label: '3D Model', icon: 'cube' });
    }
    
    if (product.cadFiles && product.cadFiles.length > 0) {
      tabs.push({ id: 'cad', label: 'CAD Files', icon: 'file-cad' });
    }
    
    return tabs;
  };
  
  const availableTabs = getAvailableTabs();
  
  return (
    <div 
      className={`bb-product-viewer ${isFullscreen ? 'bb-fullscreen' : ''}`}
      ref={viewerRef}
    >
      <div className="bb-product-viewer-tabs">
        {availableTabs.map(tab => (
          <button
            key={tab.id}
            className={`bb-product-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className={`bb-icon-${tab.icon}`}></span>
            <span className="bb-tab-label">{tab.label}</span>
          </button>
        ))}
      </div>
      
      <div className="bb-product-viewer-content">
        {renderMedia()}
      </div>
      
      {activeTab === 'gallery' && product.media && product.media.length > 1 && (
        <div className="bb-product-thumbnails">
          {product.media.map((media, index) => (
            <button
              key={index}
              className={`bb-product-thumbnail ${activeMediaIndex === index ? 'active' : ''}`}
              onClick={() => setActiveMediaIndex(index)}
            >
              <img 
                src={media.thumbnail || media.url} 
                alt={`Thumbnail ${index + 1}`} 
              />
            </button>
          ))}
        </div>
      )}
      
      <div className="bb-product-viewer-controls">
        {(activeTab === 'gallery' || getMediaType(currentMedia) === 'image') && (
          <>
            <div className="bb-control-group">
              <button 
                className="bb-control-button"
                onClick={() => handleZoom('in')}
                disabled={zoomLevel >= 3}
              >
                <span className="bb-icon-zoom-in"></span>
              </button>
              <button 
                className="bb-control-button"
                onClick={() => handleZoom('out')}
                disabled={zoomLevel <= 1}
              >
                <span className="bb-icon-zoom-out"></span>
              </button>
              <button 
                className="bb-control-button"
                onClick={() => handleZoom('reset')}
                disabled={zoomLevel === 1}
              >
                <span className="bb-icon-zoom-reset"></span>
              </button>
            </div>
            
            <div className="bb-control-group">
              <button 
                className="bb-control-button"
                onClick={() => handleRotate('left')}
              >
                <span className="bb-icon-rotate-left"></span>
              </button>
              <button 
                className="bb-control-button"
                onClick={() => handleRotate('right')}
              >
                <span className="bb-icon-rotate-right"></span>
              </button>
              <button 
                className="bb-control-button"
                onClick={() => handleRotate('reset')}
                disabled={rotation === 0}
              >
                <span className="bb-icon-rotate-reset"></span>
              </button>
            </div>
          </>
        )}
        
        <div className="bb-control-group">
          <button 
            className="bb-control-button"
            onClick={toggleFullscreen}
          >
            {isFullscreen ? (
              <span className="bb-icon-fullscreen-exit"></span>
            ) : (
              <span className="bb-icon-fullscreen"></span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Product technical specifications component
 */
export function ProductTechnicalSpecs({ product }) {
  const [expandedSection, setExpandedSection] = useState(null);
  
  const toggleSection = (section) => {
    if (expandedSection === section) {
      setExpandedSection(null);
    } else {
      setExpandedSection(section);
    }
  };
  
  // Group specifications by category
  const groupedSpecs = product.specifications?.reduce((groups, spec) => {
    const category = spec.category || 'General';
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(spec);
    return groups;
  }, {}) || {};
  
  return (
    <div className="bb-product-technical-specs">
      <h3>Technical Specifications</h3>
      
      {Object.keys(groupedSpecs).length > 0 ? (
        <div className="bb-specs-accordion">
          {Object.entries(groupedSpecs).map(([category, specs]) => (
            <div 
              key={category} 
              className={`bb-specs-section ${expandedSection === category ? 'expanded' : ''}`}
            >
              <div 
                className="bb-specs-header"
                onClick={() => toggleSection(category)}
              >
                <h4>{category}</h4>
                <span className={`bb-icon-chevron-${expandedSection === category ? 'up' : 'down'}`}></span>
              </div>
              
              {expandedSection === category && (
                <div className="bb-specs-content">
                  <table className="bb-specs-table">
                    <tbody>
                      {specs.map((spec, index) => (
                        <tr key={index}>
                          <th>{spec.name}</th>
                          <td>{spec.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="bb-specs-empty">
          <p>No technical specifications available for this product.</p>
        </div>
      )}
      
      {product.technicalDocuments && product.technicalDocuments.length > 0 && (
        <div className="bb-technical-documents">
          <h4>Technical Documents</h4>
          <ul className="bb-document-list">
            {product.technicalDocuments.map((doc, index) => (
              <li key={index} className="bb-document-item">
                <a 
                  href={doc.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bb-document-link"
                >
                  <span className={`bb-icon-file-${getFileIconType(doc.url)}`}></span>
                  <span className="bb-document-name">{doc.name || doc.url.split('/').pop()}</span>
                  {doc.filesize && <span className="bb-document-size">{doc.filesize}</span>}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div<response clipped><NOTE>To save on context only part of this file has been shown to you. You should retry this tool after you have searched inside the file with `grep -n` in order to find the line numbers of what you are looking for.</NOTE>