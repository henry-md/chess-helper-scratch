import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

const withAuth = (WrappedComponent) => {
  const WithAuthComponent = (props) => {
    const navigate = useNavigate();
    const [cookies] = useCookies(["token"]);

    useEffect(() => {
      console.log('here from withAuth', cookies.token);
      if (cookies.token && cookies.token !== "undefined") {
        navigate("/dashboard");
        return;
      }
    }, [cookies.token, navigate]);

    return <WrappedComponent {...props} />;
  };

  // Add display name for debugging
  WithAuthComponent.displayName = `WithAuth(${getDisplayName(WrappedComponent)})`;
  return WithAuthComponent;
};

// Helper function to get the display name
function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

export default withAuth;