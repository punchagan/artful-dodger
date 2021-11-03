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

const Entries = ({ data }) => {
  const { user, isAuthenticated, isLoading } = useAuth0();

  console.log(user, isLoading, isAuthenticated);

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
        <img src={`https://drive.google.com/uc?id=${row.thumbnail}&export=view`} />
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
    <Auth0Provider domain="XXX" clientId="XXX" redirectUri={`${config.hostname}/list`}>
      {children}
    </Auth0Provider>
  );
};

export default function Home({ config }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    // FIXME: Make the document URL configurable
    fetch("https://opensheet.vercel.app/XXX/metadata")
      .then((res) => res.json())
      .then((data) => {
        setData(data);
      });
  }, []);

  return (
    <AuthProvider config={config}>
      <LoginButton />
      <LogoutButton />
      <Profile />
      <Entries data={data} />
    </AuthProvider>
  );
}

export async function getStaticProps() {
  const config = {
    hostname:
      process.env.NODE_ENV === "production"
        ? "https://artful-dodger.muse-amuse.in"
        : "http://localhost:3000",
  };
  return {
    props: {
      config,
    },
  };
}
