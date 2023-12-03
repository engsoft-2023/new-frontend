import { System } from "@common/system";
import { SystemView } from "./SystemView";
import { SystemService } from "@services/system";
import { CharM } from "@common/metrics";
import * as SystemViewContextHooks from "@contexts/SystemViewContext/hook";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { useRouter } from "next/router";
import * as GraphHooks from "@components/Graph/hook";
import React from "react";

jest.mock("next/router");

describe(SystemView, () => {
  const system: System = {
    id: "1",
    name: "InterSCity",
    description: "Platform for smart cities",
    modules: [],
    services: [],
    databases: [],
    databasesUsages: [],
    syncOperations: [],
    asyncOperations: [],
  };
  const charM: CharM = {} as CharM;

  beforeEach(() => {
    const reference = { current: null };
    Object.defineProperty(reference, "current", {
      get: jest.fn(() => null),
      set: jest.fn(() => null),
    });

    (useRouter as jest.Mock).mockReturnValue({
      query: {
        id: "InterSCity",
      },
      back: jest.fn(),
    });
    jest.spyOn(SystemService, "getSystemById").mockResolvedValue(system);
    jest.spyOn(SystemService, "getSystemMetrics").mockResolvedValue(charM);
    jest.spyOn(React, "useRef").mockReturnValue(reference);
    jest.spyOn(GraphHooks, "useGraph").mockReturnValue(reference);
    jest.spyOn(SystemViewContextHooks, "useSystemViewContext").mockReturnValue({
      data: { nodes: [], links: [] },
      depthLevel: 1,
      showModules: false,
      filteredData: { nodes: [], links: [] },
      showOperations: false,
      focusedElement: { id: "", type: "service", name: "" },
      selectedElement: { id: "", type: "service", name: "" },
      selectedDimensions: [],
      allCombinationsOfData: {},
      setData: jest.fn(),
      setDepthLevel: jest.fn(),
      setShowModules: jest.fn(),
      setFilteredData: jest.fn(),
      setShowOperations: jest.fn(),
      setFocusedElement: jest.fn(),
      setSelectedElement: jest.fn(),
      setSelectedDimensions: jest.fn(),
      setAllCombinationsOfData: jest.fn(),
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  const renderPage = async () => {
    render(<SystemView />);

    await act(() => new Promise((resolve) => setTimeout(resolve, 500)));
  };

  it("should not get data when id is invalid", async () => {
    (useRouter as jest.Mock).mockReturnValue({
      query: { id: null },
    });

    await renderPage();

    expect(SystemService.getSystemById).not.toHaveBeenCalled();
    expect(SystemService.getSystemMetrics).not.toHaveBeenCalled();
  });

  it("should get system data and its metrics", async () => {
    await renderPage();

    expect(SystemService.getSystemById).toHaveBeenCalledWith(system.name);
    expect(SystemService.getSystemMetrics).toHaveBeenCalledWith(system.name);
  });

  it("should set all data when rendered", async () => {
    const { setAllCombinationsOfData } =
      SystemViewContextHooks.useSystemViewContext();

    await renderPage();

    expect(setAllCombinationsOfData).toHaveBeenCalledWith(system);
  });

  it("should change depth level", async () => {
    const { setDepthLevel } = SystemViewContextHooks.useSystemViewContext();

    await renderPage();

    fireEvent.input(screen.getByTestId("depth-level-input"), {
      target: { value: 2 },
    });

    expect(setDepthLevel).toHaveBeenCalledWith(2);
  });

  it("should set show operations", async () => {
    const { setShowOperations } = SystemViewContextHooks.useSystemViewContext();

    await renderPage();

    fireEvent.click(screen.getByTestId("show-operations"));

    expect(setShowOperations).toHaveBeenCalledWith(true);
  });

  it("should set show modules", async () => {
    const { setShowModules } = SystemViewContextHooks.useSystemViewContext();

    await renderPage();

    fireEvent.click(screen.getByTestId("show-modules"));

    expect(setShowModules).toHaveBeenCalledWith(true);
  });

  it("show go back to previous page", async () => {
    const router = useRouter();

    await renderPage();

    fireEvent.click(screen.getByTestId("back-button"));

    expect(router.back).toHaveBeenCalled();
  });
});
