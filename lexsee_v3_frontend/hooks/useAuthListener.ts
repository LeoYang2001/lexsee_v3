// hooks/useAuthListener.ts
import { useEffect, useState, useRef, useCallback } from "react";
import { useDispatch } from "react-redux";
import { fetchUserAttributes, getCurrentUser } from "aws-amplify/auth"; // Import getCurrentUser
import { Hub } from "aws-amplify/utils";
import { clearUser, setUser, userLogIn } from "../redux/slices/userSlice"; // Adjust path to your slice

interface AuthState {
  isAuthLoaded: boolean;
  isSignedIn: boolean | null; // null indicates auth status is still unknown
  userAttributes: Record<string, string> | null; // Store user attributes directly
}

export default function useAuthListener(): AuthState {
  const dispatch = useDispatch(); // This will only work if the component calling useAuthListener is inside Redux Provider
  const [authState, setAuthState] = useState<AuthState>({
    isAuthLoaded: false,
    isSignedIn: null,
    userAttributes: null,
  });

  // Use a ref to track if Redux dispatch has been performed for the current user state
  // This helps prevent redundant dispatches if the Hub listener fires multiple times for the same state
  const lastDispatchedUserEmail = useRef<string | null | undefined>(undefined);

  // Helper to update Redux (will be called only when safe to dispatch)
  const dispatchUserToRedux = useCallback(
    (attrs: Record<string, string> | null) => {
      if (attrs && attrs.email) {
        if (lastDispatchedUserEmail.current !== attrs.email) {
          dispatch(userLogIn(attrs.email)); // Assuming userLogIn takes email
          // Or if you want to set more attributes:
          // dispatch(setUser({ email: attrs.email, ...attrs }));
          console.log(
            "useAuthListener: Redux dispatched - User Logged In:",
            attrs.email
          );
          lastDispatchedUserEmail.current = attrs.email;
        }
      } else {
        if (lastDispatchedUserEmail.current !== null) {
          // Only dispatch if previously signed in
          dispatch(clearUser());
          console.log("useAuthListener: Redux dispatched - User Cleared.");
          lastDispatchedUserEmail.current = null;
        }
      }
    },
    [dispatch]
  );

  useEffect(() => {
    let isMounted = true; // Flag to prevent state updates on unmounted component

    // Function to get current user status from Amplify Auth
    // This will be called on initial load and after auth events
    const checkCurrentUser = async () => {
      try {
        const user = await getCurrentUser(); // Gen 2 way to get current user
        if (isMounted) {
          // Only update state if component is still mounted
          const attrs = await fetchUserAttributes(); // Fetch attributes if user exists
          setAuthState({
            isAuthLoaded: true,
            isSignedIn: true,
            userAttributes: attrs,
          });
          dispatchUserToRedux(attrs); // Dispatch to Redux
        }
      } catch (error) {
        if (isMounted) {
          console.log(
            "useAuthListener: No current user or error fetching attributes:",
            error
          );
          setAuthState({
            isAuthLoaded: true,
            isSignedIn: false,
            userAttributes: null,
          });
          dispatchUserToRedux(null); // Dispatch to Redux
        }
      }
    };

    // --- Initial Check on Mount ---
    checkCurrentUser();

    // --- Hub Listener for Auth Events ---
    const listener = (data: any) => {
      console.log("useAuthListener: Amplify Hub Event:", data.payload.event);
      switch (data.payload.event) {
        case "signedIn":
          // When signed in, re-check current user to get fresh attributes
          checkCurrentUser();
          break;
        case "signedOut":
          // When signed out, explicitly set state and dispatch clear
          if (isMounted) {
            setAuthState({
              isAuthLoaded: true,
              isSignedIn: false,
              userAttributes: null,
            });
            dispatchUserToRedux(null);
          }
          break;
        case "tokenRefresh":
          // Token refreshed, user is still signed in, re-check to get fresh info if needed
          checkCurrentUser();
          break;
        case "tokenRefresh_failure":
          console.error(
            "useAuthListener: Failure while refreshing auth tokens."
          );
          // Optionally, treat this as signed out if it implies session invalidity
          // setAuthState({ isAuthLoaded: true, isSignedIn: false, userAttributes: null });
          // dispatchUserToRedux(null);
          break;
        // For other events like signInWithRedirect, signInWithRedirect_failure, signOut_failure,
        // you might want to call checkCurrentUser() or handle errors specifically.
        // For signOut_failure, it means the sign out operation failed, user might still be logged in.
        case "signOut_failure":
          console.error("useAuthListener: Sign out unsuccessful.");
          // User might still be signed in if signOut failed, so re-check current status
          checkCurrentUser();
          break;
      }
    };

    const unsubscribe = Hub.listen("auth", listener);

    return () => {
      isMounted = false; // Cleanup flag
      unsubscribe(); // Unsubscribe from Hub listener
    };
  }, [dispatchUserToRedux]); // Include dispatchUserToRedux in dependencies since it's a memoized function

  return authState;
}
