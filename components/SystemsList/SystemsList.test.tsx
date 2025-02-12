import { render, screen } from "@testing-library/react";
import { System } from "@common/system";
import { SystemsList } from "./SystemsList";

describe("SystemsList", () => {
  it("should render a message when there are no systems", () => {
    render(<SystemsList systems={[]} />);

    expect(screen.getAllByText("There are no systems.")).toHaveLength(1);
  });

  it("should render all systems", () => {
    const systems: System[] = [
      {
        id: "1",
        name: "InterSCity",
        description: "Platform for smart cities",
        modules: [],
        services: [],
        databases: [],
        databasesUsages: [],
        syncOperations: [],
        asyncOperations: [],
      },
      {
        id: "2",
        name: "TrainTicket",
        description: "Benchmark",
        modules: [],
        services: [],
        databases: [],
        databasesUsages: [],
        syncOperations: [],
        asyncOperations: [],
      },
    ];

    render(<SystemsList systems={systems} />);

    const cards = screen.getAllByRole("article");
    const titles = screen.getAllByRole("heading");

    expect(cards).toHaveLength(2);
    expect(titles).toHaveLength(2);
    expect(titles[0]).toHaveTextContent(/^InterSCity.*$/);
    expect(titles[1]).toHaveTextContent(/^TrainTicket.*$/);
    expect(screen.getByText("Platform for smart cities")).toBeInTheDocument();
    expect(screen.getByText("Benchmark")).toBeInTheDocument();
  });
});
