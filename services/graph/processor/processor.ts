import {
  DatabaseAccessType,
  DatabaseUsage,
  Operation,
  System,
} from "@common/system";
import { ComponentType, GraphEdge, GraphNode } from "../types";

/* a component is either a service or a module */
interface Component {
  id: string;
  name: string;
  type: string;
  operations?: string[];
}

export class GraphDataProcessor {
  private _nodes: GraphNode[] = [];
  private _edges: GraphEdge[] = [];
  private components: Component[] = [];
  private databasesUsages: DatabaseUsage[] = [];
  private syncOperations: Operation[] = [];
  private asyncOperations: Operation[] = [];

  constructor(system: System, componentType: ComponentType = "service") {
    if (componentType === "module") {
      this.components = this.createComponentsForModules(system);
      this.databasesUsages = this.createDatabaseUsagesForModules(system);
      this.syncOperations = this.createSyncOperationsForModules(system);
      this.asyncOperations = this.createAsyncOperationsForModules(system);
    } else {
      this.components = this.createComponentsForServices(system);
      this.databasesUsages = this.createDatabaseUsagesForServices(system);
      this.syncOperations = this.createSyncOperationsForServices(system);
      this.asyncOperations = this.createAsyncOperationsForServices(system);
    }

    this._nodes = this._nodes.concat(
      this.components.map(({ id, name, type, operations }) => ({
        id,
        label: name,
        type,
        operations,
      }))
    );
  }

  get nodes() {
    return Object.assign([] as GraphNode[], this._nodes);
  }

  get edges() {
    return Object.assign([] as GraphEdge[], this._edges);
  }

  public viewSize() {
    this.components.forEach((comp) => {
      comp?.operations?.forEach((op) => {
        this._nodes.push({
          id: `op_${op}_from_${comp.id}`,
          label: op,
          type: "operation",
        });

        this._edges.push({
          id: `op${op}/${comp.id}`,
          source: comp.id,
          target: `op_${op}_from_${comp.id}`,
          type: "operation",
        });
      });
    });
  }

  public viewDataCoupling() {
    this._nodes = this._nodes.concat(
      this.databasesUsages.map(({ databaseId, namespace }) => ({
        id: `db${databaseId}`,
        label: namespace,
        type: "database",
      }))
    );

    this._edges = this._edges.concat(
      this.databasesUsages.map(({ serviceId, databaseId, accessType }) => {
        const id = `db${databaseId}/${serviceId}`;
        const source = serviceId;
        const target = `db${databaseId}`;
        const label = `${
          accessType === DatabaseAccessType.READ_AND_WRITE
            ? "R/W"
            : accessType === DatabaseAccessType.READ
            ? "R"
            : "W"
        }`;
        const type = "db";

        return {
          id,
          source,
          target,
          label,
          type,
        };
      })
    );
  }

  public viewSyncCoupling() {
    if (this._nodes.every((n) => n.type !== "operation")) {
      this.components.forEach((comp) => {
        comp?.operations?.forEach((op) => {
          if (
            this.syncOperations.find(
              ({ to, label }) => to === comp.id && label === op
            )
          ) {
            this._nodes.push({
              id: `op_${op}_from_${comp.id}`,
              label: op,
              type: "operation",
            });

            this._edges.push({
              id: `op${op}/${comp.id}`,
              source: comp.id,
              target: `op_${op}_from_${comp.id}`,
              type: "operation",
            });
          }
        });
      });
    }

    this._edges = this._edges.concat(
      this.syncOperations.map(({ from, to, label }) => ({
        id: `sync-op_${label}_from_${to}/${from}`,
        source: `op_${label}_from_${to}`,
        target: from,
        type: "sync",
        label,
      }))
    );
  }

  public viewSyncWithoutOperations() {
    this._edges = this._edges.concat(
      this.syncOperations
        .reduce(
          (acc, op) =>
            acc.find(({ from, to }) => op.from === from && op.to === to)
              ? acc
              : [...acc, op],
          [] as Operation[]
        )
        .map(({ from, to, label }) => ({
          id: `sync-${to}/${from}`,
          source: to,
          target: from,
          type: "sync",
          label,
        }))
    );
  }

  public viewAsyncCoupling() {
    this._edges = this._edges.concat(
      this.asyncOperations.map(({ from, to, label }) => ({
        id: `async-${from}/${to}`,
        source: from,
        target: to,
        type: "async",
        label,
      }))
    );
  }

  private createComponentsForModules(system: System): Component[] {
    return system.modules.map((m) => ({
      ...m,
      id: `m${m.id}`,
      type: "module",
      operations: system.services
        .filter((s) => s.moduleId === m.id)
        .reduce(
          (acc, { operations }) => [...acc, ...operations],
          [] as string[]
        ),
    }));
  }

  private createComponentsForServices(system: System): Component[] {
    return system.services.map((s) => ({
      ...s,
      id: `s${s.id}`,
      type: "service",
    }));
  }

  private createDatabaseUsagesForModules(system: System): DatabaseUsage[] {
    return system.databasesUsages.map((usage) => ({
      ...usage,
      serviceId: `m${
        system.services.find((s) => s.id === usage.serviceId)?.moduleId
      }`,
    }));
  }

  private createDatabaseUsagesForServices(system: System): DatabaseUsage[] {
    return system.databasesUsages.map((usage) => ({
      ...usage,
      serviceId: `s${usage.serviceId}`,
    }));
  }

  private createSyncOperationsForModules(system: System): Operation[] {
    return system.syncOperations.map(({ from, to, label }) => ({
      from: `m${system.services.find((s) => s.id === from)?.moduleId}`,
      to: `m${system.services.find((s) => s.id === to)?.moduleId}`,
      label,
    }));
  }

  private createSyncOperationsForServices(system: System): Operation[] {
    return system.syncOperations.map(({ from, to, label }) => ({
      from: `s${from}`,
      to: `s${to}`,
      label,
    }));
  }

  private createAsyncOperationsForModules(system: System): Operation[] {
    return system.asyncOperations.map(({ from, to, label }) => ({
      from: `m${system.services.find((s) => s.id === from)?.moduleId}`,
      to: `m${system.services.find((s) => s.id === to)?.moduleId}`,
      label,
    }));
  }

  private createAsyncOperationsForServices(system: System): Operation[] {
    return system.asyncOperations.map(({ from, to, label }) => ({
      from: `s${from}`,
      to: `s${to}`,
      label,
    }));
  }
}
