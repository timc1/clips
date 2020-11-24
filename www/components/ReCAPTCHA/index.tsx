import * as React from "react";
import { client } from "www/lib/ApiClient";

const RECAPTCHA_CLIENT_KEY =
  process.env.NODE_ENV === "production"
    ? "6LfGEf0UAAAAAB1p-C5hPVIrCqokoty6-Dw783Yb"
    : "6LecFv0UAAAAABKsB-8hExuYI8eD4daiJD-IyPG-";

declare global {
  interface Window {
    grecaptcha: any;
  }
}

type ProviderProps = {
  children: React.ReactNode;
};

type ContextProps = {
  isReady: boolean;
  withRecaptcha: (
    callback: (params?: any) => void,
    onError: (params?: any) => void
  ) => void;
};

type State = {
  isReady: boolean;
};

const ReCAPTCHAContext = React.createContext<ContextProps>(undefined);

const reducer = (state: State, action) => {
  switch (action.type) {
    case "LOADED":
      return {
        ...state,
        isReady: true,
      };
  }
};

const initialState: State = {
  isReady: false,
};

function Provider(props: ProviderProps) {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  React.useEffect(() => {
    const script = document.createElement("script");

    if (typeof window.grecaptcha === "undefined") {
      script.setAttribute(
        "src",
        `https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_CLIENT_KEY}`
      );
      document.body.appendChild(script);

      script.onload = () =>
        dispatch({
          type: "LOADED",
        });
    }
  }, []);

  const withRecaptcha = React.useCallback(
    (callback: (params?: any) => void, onError: (params?: any) => void) => {
      window.grecaptcha.ready(function () {
        window.grecaptcha
          .execute(RECAPTCHA_CLIENT_KEY, { action: "submit" })
          .then(async function (token: string) {
            const data = await client.post("/api/validations/recaptcha", {
              token,
            });

            if (data.ok) {
              callback();
            } else {
              if (data.suspiciousRequestError) {
                console.log(
                  "Toast --> Can't process because of suspicious activity"
                );
              }
              onError();
            }
          });
      });
    },
    []
  );

  const value = React.useMemo(
    () => ({
      isReady: state.isReady,
      withRecaptcha,
    }),
    [state.isReady, withRecaptcha]
  );

  return (
    <ReCAPTCHAContext.Provider value={value}>
      {props.children}
    </ReCAPTCHAContext.Provider>
  );
}

const useRecaptcha = () => React.useContext(ReCAPTCHAContext);

export default {
  Provider,
  useRecaptcha,
};
