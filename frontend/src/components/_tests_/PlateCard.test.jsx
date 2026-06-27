import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import PlateCard from "../platesCard/platesCard";

describe("PlateCard Component", () => {
  const mockPlate = {
    _id: "1",
    name: "Pasta Carbonara",
    price: 25.5,
    imgUrl: "/imgs/pasta.jpg",
    available: true,
  };

  it("should render plate name and price", () => {
    render(<PlateCard plateData={mockPlate} />);

    expect(screen.getByText("Pasta Carbonara")).toBeInTheDocument();
    expect(screen.getByText("$ 25.5")).toBeInTheDocument();
  });

  it("should render plate image with correct src", () => {
    const { container } = render(<PlateCard plateData={mockPlate} />);

    const image = container.querySelector("img");
    expect(image).toBeTruthy();
    expect(image.src).toContain("pasta.jpg");
  });

  it("should render different plates correctly", () => {
    const pizzaPlate = {
      _id: "2",
      name: "Pizza Margherita",
      price: 20,
      imgUrl: "/imgs/pizza.jpg",
      available: true,
    };

    render(<PlateCard plateData={pizzaPlate} />);

    expect(screen.getByText("Pizza Margherita")).toBeInTheDocument();
    expect(screen.getByText("$ 20")).toBeInTheDocument();
  });
});
