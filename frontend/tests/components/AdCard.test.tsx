import { render, screen } from "@testing-library/react";
import React from "react";
import { AdCard } from "../../src/components/AdCard";

describe("AdCard", () => {
  it("renders copy and CTA", () => {
    const ad = {
      id: "a1",
      platform: "meta" as const,
      copy: "Great offer",
      creativeUrls: ["https://img"],
      cta: "Shop Now",
      snapshotUrl: undefined,
      fetchedAt: new Date().toISOString(),
      competitorId: "c1",
    };
    render(<AdCard ad={ad} onClick={() => {}} />);
    expect(screen.getByText(/Great offer/)).toBeInTheDocument();
    expect(screen.getByText(/Shop Now/)).toBeInTheDocument();
  });
});

