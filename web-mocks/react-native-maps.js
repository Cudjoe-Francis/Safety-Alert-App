// Mock implementation of react-native-maps for web platform
import React from 'react';

// Mock MapView component
export const MapView = ({ children, ...props }) => {
  return React.createElement('div', {
    style: {
      width: '100%',
      height: '100%',
      backgroundColor: '#e0e0e0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: '1px solid #ccc',
      borderRadius: '8px',
      ...props.style
    }
  }, [
    React.createElement('div', {
      key: 'map-placeholder',
      style: {
        textAlign: 'center',
        color: '#666',
        fontSize: '14px'
      }
    }, 'Map View (Web Preview)'),
    children
  ]);
};

// Mock Marker component
export const Marker = ({ children, coordinate, title, description, ...props }) => {
  return React.createElement('div', {
    style: {
      position: 'absolute',
      width: '20px',
      height: '20px',
      backgroundColor: '#ff5330',
      borderRadius: '50%',
      border: '2px solid white',
      boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
      cursor: 'pointer',
      ...props.style
    },
    title: title || 'Marker'
  }, children);
};

// Mock Callout component
export const Callout = ({ children, ...props }) => {
  return React.createElement('div', {
    style: {
      backgroundColor: 'white',
      padding: '8px',
      borderRadius: '4px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
      minWidth: '100px',
      ...props.style
    }
  }, children);
};

// Mock Circle component
export const Circle = (props) => {
  return React.createElement('div', {
    style: {
      position: 'absolute',
      borderRadius: '50%',
      border: `2px solid ${props.strokeColor || '#007AFF'}`,
      backgroundColor: props.fillColor || 'rgba(0,122,255,0.1)',
      width: '40px',
      height: '40px',
      ...props.style
    }
  });
};

// Mock Polyline component
export const Polyline = (props) => {
  return React.createElement('div', {
    style: {
      position: 'absolute',
      border: `1px solid ${props.strokeColor || '#007AFF'}`,
      width: '100px',
      height: '2px',
      ...props.style
    }
  });
};

// Mock Polygon component
export const Polygon = (props) => {
  return React.createElement('div', {
    style: {
      position: 'absolute',
      border: `2px solid ${props.strokeColor || '#007AFF'}`,
      backgroundColor: props.fillColor || 'rgba(0,122,255,0.1)',
      width: '60px',
      height: '60px',
      ...props.style
    }
  });
};

// Mock constants
export const PROVIDER_GOOGLE = 'google';
export const PROVIDER_DEFAULT = 'default';

// Default export
export default MapView;
