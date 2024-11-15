import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import MediaCard from "../components/MediaCard";

// Mock useNavigate from react-router-dom
const mockedUsedNavigate = vi.fn();
vi.mock("react-router-dom", () => ({
  ...vi.importActual("react-router-dom"), 
  useNavigate: () => mockedUsedNavigate, 
}));

describe("MediaCard Tests", () => {
  // Mock props for MediaCard
  const mockProps = {
    id: "123",
    title: "Test Presentation",
    description: "Test Description",
    slideCount: 5,
    thumbnailUrl: "test-url.jpg",
  };

  beforeEach(() => {
    mockedUsedNavigate.mockReset(); // Reset mock navigation
    render(<MediaCard {...mockProps} />);
  });

  // Check title, description, and slide count are displayed
  it("renders presentation details", () => {
    expect(screen.getByText(mockProps.title)).toBeInTheDocument();
    expect(screen.getByText(mockProps.description)).toBeInTheDocument();
    expect(
      screen.getByText(`Slides: ${mockProps.slideCount}`)
    ).toBeInTheDocument();
  });
  
  // Check if the thumbnail is set
  it("displays thumbnail background if provided", () => {
    const card = screen.getByTestId("thumbnail-box");
    expect(card).toHaveStyle(
      `background-image: url(${mockProps.thumbnailUrl})`
    );
  });

  // clicking the edit button
  it("navigates to correct presentation on edit click", async () => {
    const editButton = screen.getByRole("button", { name: /edit/i });
    await fireEvent.click(editButton);
    expect(mockedUsedNavigate).toHaveBeenCalledWith(
      `/presentation/${mockProps.id}`
    );
  });
});
