import { useSystemViewContext } from "@contexts/SystemViewContext";
import { MetricsWrapper } from "./MetricsWrapper";
import { CharM } from "@common/metrics";
import { fireEvent, render, screen } from "@testing-library/react";

jest.mock("@contexts/SystemViewContext/hook");

describe(MetricsWrapper, () => {
  const charM: CharM = {
    Size: {
      "Number of system components": "2 services and 2 modules",
      "Number of services with deployment dependency": 2,
      "Number of operations per component": {
        services: {
          "user-service": 2,
          "payment-service": 2,
        },
        modules: {
          "my-module": 4,
        },
      },
      "Largest service (2 operations)": ["user-service", "payment-service"],
      "Smallest service (2 operations)": ["user-service", "payment-service"],
    },
    "Data source coupling": {
      "Number of data sources per component": {
        services: {
          "user-service": 1,
          "payment-service": 1,
        },
        modules: {
          "my-module": 2,
        },
      },
      "Number of data sources that each component shares with others": {
        services: {
          "user-service": 0,
          "payment-service": 0,
        },
        modules: {
          "my-module": 0,
        },
      },
      "Number of data sources where each component performs Read operations": {
        services: {
          "user-service": 0,
          "payment-service": 0,
        },
        modules: {
          "my-module": 0,
        },
      },
      "Number of data sources where each component performs Write operations": {
        services: {
          "user-service": 0,
          "payment-service": 0,
        },
        modules: {
          "my-module": 0,
        },
      },
      "Number of data sources where each component performs ReadWrite operations":
        {
          services: {
            "user-service": 1,
            "payment-service": 1,
          },
          modules: {
            "my-module": 2,
          },
        },
    },
    "Synchronous coupling": {
      "Number of clients that invoke the operations of a given component": {
        services: {
          "user-service": 1,
          "payment-service": 1,
        },
        modules: {
          "my-module": 0,
        },
      },
      "Number of components from which a given component invokes operations": {
        services: {
          "user-service": 1,
          "payment-service": 1,
        },
        modules: {
          "my-module": 0,
        },
      },
      "Number of different operations invoked by each depending component": {
        services: {
          "user-service": 1,
          "payment-service": 1,
        },
        modules: {
          "my-module": 0,
        },
      },
      "Number of different operations invoked from other components": {
        services: {
          "user-service": 1,
          "payment-service": 1,
        },
        modules: {
          "my-module": 0,
        },
      },
    },
    "Asynchronous coupling": {
      "Number of clients that consume messages published by a given component":
        {
          services: {
            "user-service": 1,
            "payment-service": 1,
          },
          modules: {
            "my-module": 0,
          },
        },
      "Number of components from which a given component consumes messages": {
        services: {
          "user-service": 1,
          "payment-service": 1,
        },
        modules: {
          "my-module": 0,
        },
      },
      "Number of components that consume messages from the queue": {
        services: 2,
        modules: 0,
      },
      "Number of components that publish messages in the queue": {
        services: 2,
        modules: 0,
      },
      "Number of different types of messages consumed by each depending component":
        {
          services: {
            "user-service": 1,
            "payment-service": 1,
          },
          modules: {
            "my-module": 0,
          },
        },
      "Number of different types of messages consumed from other components": {
        services: {
          "user-service": 1,
          "payment-service": 1,
        },
        modules: {
          "my-module": 0,
        },
      },
    },
  };

  beforeEach(() => {
    (useSystemViewContext as jest.Mock).mockReturnValue({
      selectedElement: {
        id: "1",
        name: "user-service",
        type: "service",
      },
      setFocusedElement: jest.fn(),
    });
  });

  it("should display all metrics", () => {
    const expectedMetricsTitles = [
      "Number of system components",
      "Number of services with deployment dependency",
      "Largest service (2 operations)",
      "Smallest service (2 operations)",
      "Number of components that consume messages from the queue",
      "Number of components that publish messages in the queue",
      "Number of operations",
      "Number of data sources that it shares with others",
      "Number of data sources",
      "Number of data sources where it performs Read operations",
      "Number of data sources where it performs Write operations",
      "Number of data sources where it performs ReadWrite operations",
      "Number of clients that invoke the operations of it",
      "Number of components from which it invokes operations",
      "Number of different operations invoked from other components",
      "Number of different operations invoked by each depending component",
      "Number of clients that consume messages published by it",
      "Number of components from which it consumes messages",
      "Number of different types of messages consumed from other components",
      "Number of different types of messages consumed by each depending component",
    ];
    const nonExpectedTerms = [
      "per component",
      "a given component",
      "each component",
    ];

    render(<MetricsWrapper charM={charM} />);

    expectedMetricsTitles.forEach((expectedTitle) => {
      expect(screen.getByText(expectedTitle)).toBeTruthy();
    });
    nonExpectedTerms.forEach((nonExpected) => {
      expect(() => screen.getByText(nonExpected)).toThrowError();
    });
  });

  it("should set focused element when you click it", () => {
    const { setFocusedElement } = useSystemViewContext();

    render(<MetricsWrapper charM={charM} />);

    fireEvent.click(
      screen.getByTestId("Largest service (2 operations)_user-service")
    );

    expect(setFocusedElement).toHaveBeenCalledWith({ name: "user-service" });
  });
});
