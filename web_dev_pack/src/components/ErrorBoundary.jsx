import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          background: '#060e1c',
          color: '#e8eaf0',
          fontFamily: "'Rajdhani', sans-serif",
          textAlign: 'center',
          padding: '40px',
        }}>
          <h2 style={{ color: '#E74C3C', marginBottom: 16, fontSize: 24, fontWeight: 700 }}>
            Something went wrong 😞
          </h2>
          <p style={{ marginBottom: 24, fontSize: 14, opacity: 0.8 }}>
            {this.state.error?.message || 'An unexpected error occurred in a component.'}
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            style={{
              padding: '12px 24px',
              background: 'linear-gradient(135deg, #2ECC71, #27ae60)',
              border: 'none',
              borderRadius: 24,
              color: '#060e1c',
              fontWeight: 700,
              fontSize: 14,
              cursor: 'pointer',
              boxShadow: '0 4px 20px rgba(46,204,113,0.4)',
            }}
          >
            Try Again
          </button>
          <div style={{ marginTop: 32, fontSize: 12, opacity: 0.6 }}>
            Check console for details. Reload page if issue persists.
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

