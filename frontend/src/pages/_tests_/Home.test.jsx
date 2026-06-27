import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Home from "../home/page";

describe("Home Page", () => {
  it("should render welcome section", () => {
    render(<Home />);

    expect(screen.getByText(/welcome to my gastronomy/i)).toBeInTheDocument();
  });

  it("should render main description", () => {
    render(<Home />);

    expect(screen.getByText(/hello and welcome/i)).toBeInTheDocument();
  });

  it("should render food section with three items", () => {
    render(<Home />);

    expect(screen.getByText(/excellence in everiday life/i)).toBeInTheDocument();
    expect(screen.getByText(/first choice ingredients/i)).toBeInTheDocument();
    expect(screen.getByText(/taste for everyone/i)).toBeInTheDocument();
  });

  it("should render contact section", () => {
    render(<Home />);

    expect(screen.getByText(/stay updated/i)).toBeInTheDocument();
  });

  it("should render social media buttons", () => {
    render(<Home />);

    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBeGreaterThan(0);
  });

  it("should contain correct social media button text", () => {
    render(<Home />);

    expect(screen.getByText("Instagram")).toBeInTheDocument();
    expect(screen.getByText("Facebook")).toBeInTheDocument();
    expect(screen.getByText("Whatsapp")).toBeInTheDocument();
    expect(screen.getByText("Location")).toBeInTheDocument();
  });
});
