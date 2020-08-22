import React from "react";

export default function Container({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        padding: "10em",
      }}
    >
      {children}
    </div>
  );
}
