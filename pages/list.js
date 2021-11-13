import Head from "next/head";
import { useState, useEffect } from "react";

import { Auth0Provider } from "@auth0/auth0-react";

import { useAuth0 } from "@auth0/auth0-react";

const Profile = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return <div>Loading ...</div>;
  }

  return (
    isAuthenticated && (
      <div>
        <img src={user.picture} alt={user.name} />
        <h2>{user.name}</h2>
        <p>{user.email}</p>
      </div>
    )
  );
};

const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();

  return <button onClick={() => loginWithRedirect()}>Log In</button>;
};

const LogoutButton = () => {
  const { logout } = useAuth0();

  return <button onClick={() => logout({ returnTo: window.location.origin })}>Log Out</button>;
};

const Entries = ({ metadataUrl }) => {
  const [data, setData] = useState([]);
  const { user, isAuthenticated, isLoading } = useAuth0();

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }
    fetch(metadataUrl)
      .then((res) => res.json())
      .then((data) => {
        setData(data);
      });
  }, [isAuthenticated]);

  if (isLoading) {
    return <div>Loading ...</div>;
  }
  if (!isAuthenticated) {
    return <div>Please login!</div>;
  }

  return (
    isAuthenticated &&
    data.map((row, idx) => (
      <div key={idx}>
        {row.title}
        <img src={`https://drive.google.com/thumbnail?id=${row.thumbnail}`} />
        {/* <img src={`https://lh3.googleusercontent.com/d/${row.thumbnail}=s1980`} /> */}
        {row.description}
      </div>
    ))
  );
};

const AuthProvider = ({ children, config }) => {
  const [url, setUrl] = useState("");

  useEffect(() => {
    setUrl(window.location.origin + "/list");
  });

  return (
    <Auth0Provider
      domain={config.auth0Domain}
      clientId={config.auth0ClientId}
      redirectUri={`${config.hostname}/list`}
    >
      {children}
    </Auth0Provider>
  );
};

export default function Home({ config }) {
  return (
    <AuthProvider config={config}>
      <LoginButton />
      <LogoutButton />
      <Profile />
      <Entries metadataUrl={config.metadataUrl} />
    </AuthProvider>
  );
}

export async function getStaticProps() {
  const config = {
    hostname:
      process.env.NODE_ENV === "production"
        ? "https://artful-dodger.muse-amuse.in"
        : "http://localhost:3000",
    metadataUrl: process.env.METADATA_URL || "",
    auth0Domain: process.env.AUTH0_DOMAIN || "",
    auth0ClientId: process.env.AUTH0_CLIENT_ID || "",
  };
  return {
    props: {
      config,
    },
  };
}
