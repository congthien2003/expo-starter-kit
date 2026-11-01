import React from 'react';
import { ErrorState } from './ui/error-state';
export class AppErrorBoundary extends React.Component<React.PropsWithChildren, { failed: boolean; attempt: number }> {
  state = { failed: false, attempt: 0 };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    if (this.state.failed) return <ErrorState title="Unable to display this screen" description="Try reopening the screen. Your last action may not have completed." onRetry={() => this.setState(state => ({ failed: false, attempt: state.attempt + 1 }))} />;
    return <React.Fragment key={this.state.attempt}>{this.props.children}</React.Fragment>;
  }
}
