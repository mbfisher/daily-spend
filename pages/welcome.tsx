import React from "react";
import Container from "../components/Container";
import { useRouter } from "next/router";

export default function WelcomePage() {
  const { query } = useRouter();
  return (
    <Container>
      <h1>Welcome!</h1>
      <a href={`/api/auth/callback?code=${query.code}`}>Get Started</a>
    </Container>
  );
}
