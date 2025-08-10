import { render, screen } from "@testing-library/react";
import React from "react";
import AdSignalHijackPage from "../../src/pages/AdSignalHijack";

vi.mock("../../src/hooks/useAds", () => ({
  useAds: () => ({ data: { pages: [{ items: [] }] }, isLoading: false, error: null, fetchNextPage: () => {}, hasNextPage: false, isFetchingNextPage: false }),
}));

describe("AdSignalHijack page", () => {
  it("shows empty state when no ads", () => {
    render(<AdSignalHijackPage />);
    expect(screen.getByText(/No ads found/)).toBeInTheDocument();
  });
});

