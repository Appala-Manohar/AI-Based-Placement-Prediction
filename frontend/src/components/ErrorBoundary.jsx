import React from "react";
import { AlertCircle, RotateCcw } from "lucide-react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[400px] flex flex-col items-center justify-center p-6 text-center bg-white/5 border border-white/5 rounded-2xl max-w-lg mx-auto my-12 glass-card">
          <div className="w-12 h-12 bg-red-950/20 border border-red-500/20 text-red-400 rounded-full flex items-center justify-center mb-4">
            <AlertCircle size={24} />
          </div>
          <h2 className="text-lg font-bold text-white mb-2 font-['Outfit',sans-serif]">Something went wrong</h2>
          <p className="text-xs text-gray-400 mb-6 max-w-sm font-['Outfit',sans-serif] leading-relaxed">
            An unexpected error occurred in this section of the portal. Please try reloading the page or reset the component.
          </p>
          <button
            onClick={this.handleReset}
            className="flex items-center gap-1.5 px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-xs font-semibold cursor-pointer transition shadow-lg shadow-violet-500/10 font-['Outfit',sans-serif]"
          >
            <RotateCcw size={12} />
            Reload Portal
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
