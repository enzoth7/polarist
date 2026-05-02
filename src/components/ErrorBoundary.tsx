import { Component, type ReactNode } from "react";

type Props = { children: ReactNode };
type State = { hasError: boolean };

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: { componentStack: string }) {
    console.error("[ErrorBoundary]", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#010101] px-6 text-center">
          <p
            className="text-[1.1rem] text-[#F6F6F6]"
            style={{ fontFamily: "var(--font-sequel, sans-serif)", fontWeight: 700 }}
          >
            Algo salió mal.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="rounded-full bg-[#CAFE5B] px-6 py-2.5 text-sm font-bold text-[#010101] transition-transform hover:scale-[1.03]"
            style={{ fontFamily: "var(--font-sequel, sans-serif)", fontWeight: 700 }}
          >
            Recargar página
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
