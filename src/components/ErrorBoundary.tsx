import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  /** Scope label shown in the error UI (e.g. "assessment step", "application") */
  scope?: string;
  /** If true, shows a restart button instead of a back/retry button */
  global?: boolean;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(`[ErrorBoundary:${this.props.scope ?? 'unknown'}]`, error, info.componentStack);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  handleRestart = () => {
    window.location.reload();
  };

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    const { scope = 'this section', global: isGlobal = false } = this.props;

    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-8">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg border border-red-100 p-8 text-center">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            </svg>
          </div>

          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Something went wrong
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            An unexpected error occurred in {scope}. Your progress up to this point is preserved.
          </p>

          {this.state.error && (
            <p className="text-xs text-gray-400 font-mono bg-gray-50 rounded p-2 mb-6 text-left break-all">
              {this.state.error.message}
            </p>
          )}

          <div className="flex gap-3 justify-center">
            {!isGlobal && (
              <button
                onClick={this.handleRetry}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Try again
              </button>
            )}
            <button
              onClick={this.handleRestart}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
            >
              Restart application
            </button>
          </div>
        </div>
      </div>
    );
  }
}
