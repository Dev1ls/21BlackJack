import { Component, type ReactNode } from 'react';
import { clearState } from '../lib/storage';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  private handleReset = () => {
    clearState();
    window.location.reload();
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div role="alert" className="mx-auto max-w-lg px-4 py-10 text-center">
        <h1 className="text-xl font-bold text-white">No se pudo mostrar la práctica</h1>
        <p className="mt-2 text-sm text-gray-200">
          The practice screen hit a problem. You can erase the data stored on this device and start
          again.
        </p>
        <button
          type="button"
          onClick={this.handleReset}
          className="mt-4 rounded-xl bg-emerald-700 px-4 py-3 text-sm font-bold text-white"
        >
          Borrar datos locales y reiniciar
        </button>
      </div>
    );
  }
}
