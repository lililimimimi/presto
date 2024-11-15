import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ErrorModal from "../components/ErrorModal";

describe("ErrorModal", () => {
  it("renders modal content and handles actions", () => {
    // Mock functions
    const onClose = vi.fn();
    const onConfirm = vi.fn();

    // Render modal
    render(
      <ErrorModal
        open={true}
        onClose={onClose}
        onConfirm={onConfirm}
        title="Delete Confirmation"
        content="Are you sure to delete?"
      />
    );

    // Check content
    expect(screen.getByText("Delete Confirmation")).toBeInTheDocument();
    expect(screen.getByText("Are you sure to delete?")).toBeInTheDocument();

    // Test buttons
    fireEvent.click(screen.getByText("Cancel"));
    expect(onClose).toHaveBeenCalled();

    fireEvent.click(screen.getByText("Delete"));
    expect(onConfirm).toHaveBeenCalled();
  });

  // test default props
  it("renders with default props", () => {
    render(<ErrorModal open={true} onClose={() => {}} onConfirm={() => {}} />);

    expect(screen.getByText("Confirm")).toBeInTheDocument();
    expect(
      screen.getByText("Are you sure to delete this slide?")
    ).toBeInTheDocument();
  });
});
