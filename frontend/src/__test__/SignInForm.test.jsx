import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { BrowserRouter } from "react-router-dom";
import SignInForm from "../components/SigninForm";

describe("SignInForm Tests", () => {
  const mockSetToken = vi.fn();

  beforeEach(() => {
    // Mock window.alert to prevent actual alerts during tests
    vi.spyOn(window, "alert").mockImplementation(() => {});

    render(
      <BrowserRouter>
        <SignInForm setToken={mockSetToken} />
      </BrowserRouter>
    );
  });

  afterEach(() => {
    vi.restoreAllMocks(); // Restore all mocked functions
  });
  
  // Define a test case to validate empty fields
  it("validates empty fields", async () => {
    const loginButton = screen.getByRole("button", { name: /login/i });
    await fireEvent.click(loginButton);
    expect(window.alert).toHaveBeenCalledWith("Please enter email or password");
  });
});
