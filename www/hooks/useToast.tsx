import { keyframes } from "@emotion/core";
import styled from "@emotion/styled";
import * as React from "react";
import uuid from "uuid/v4";
import useMounted from "www/hooks/useMounted";
import Portal from "../components/Portal";

type Props = {
  children: React.ReactNode;
};

type Toast = {
  id?: string;
  type: "self-destruct";
  children: React.ReactNode | string;
};

const ToastContext = React.createContext<{ addToast: (toast: Toast) => void }>(
  undefined
);

export default function useToast() {
  return React.useContext(ToastContext);
}

export function ToastProvider(props: Props) {
  const [toasts, setToasts] = React.useState([]);

  const addToast = React.useCallback((toast: Toast) => {
    setToasts((toasts) => [uniqueId(toast), ...toasts]);
  }, []);

  const removeToast = React.useCallback((id: string) => {
    setToasts((toasts) => toasts.filter((toast) => toast.id !== id));
  }, []);

  const value = React.useMemo(
    () => ({
      addToast,
    }),
    [addToast]
  );

  const mounted = useMounted();

  return (
    <ToastContext.Provider value={value}>
      {props.children}

      {mounted.current && (
        <Portal>
          {toasts.length ? (
            <ToastsList>
              {toasts.map((toast: Toast) => {
                return (
                  <li key={toast.id}>
                    <ToastItem toast={toast} removeToast={removeToast} />
                  </li>
                );
              })}
            </ToastsList>
          ) : null}
        </Portal>
      )}
    </ToastContext.Provider>
  );
}

function ToastItem({
  toast,
  removeToast,
}: {
  toast: Toast;
  removeToast: (id: string) => void;
}) {
  const timeout = React.useRef(null);

  React.useEffect(() => {
    if (toast.type === "self-destruct") {
      timeout.current = setTimeout(() => {
        removeToast(toast.id);
      }, 8000);
    }

    return () => {
      clearTimeout(timeout.current);
    };
  }, [removeToast, toast.id, toast.type]);
  return <ToastItemContainer>{toast.children}</ToastItemContainer>;
}

function uniqueId(toast: Toast) {
  return {
    id: toast.id || uuid(),
    ...toast,
  };
}

const ToastsList = styled.ul`
  position: fixed;
  bottom: calc(var(--unit) * 2);
  left: calc(var(--unit) * 2);
  list-style: none;
  margin: 0;
  padding: 0;
  z-index: var(--depth3);
  max-width: 250px;
`;

const scaleIn = keyframes`
  to {
    transform: scale(1);
  }
`;

const ToastItemContainer = styled.div`
  padding: var(--unit);
  box-shadow: 0 0 0 1px var(--gridColor);
  background: var(--contentBackground);
  margin-top: var(--unit);
  transform: scale(0.95);
  animation: ${scaleIn} 150ms var(--ease);
  animation-fill-mode: forwards;
`;
