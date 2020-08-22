import React from "react";
import Link from "next/link";
import Container from "../components/Container";

export default function ConfirmPage() {
  return (
    <Container>
      <p>Check the Monzo app to approve access</p>
      <Link href="/">
        <a style={{ textDecoration: "underline" }}>Done</a>
      </Link>
    </Container>
  );
}
