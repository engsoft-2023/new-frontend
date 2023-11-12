export interface Module {
  id: string;
  name: string;
}

export interface Service {
  id: string;
  name: string;
  responsibility: string;
  operations: string[];
  moduleId: string;
}

export interface Database {
  id: string;
  model: string;
}

export interface DatabaseUsage {
  databaseId: string;
  serviceId: string;
  namespace: string;
  accessType: string;
}

export enum DatabaseAccessType {
  READ = "Read",
  WRITE = "Write",
  READ_AND_WRITE = "ReadWrite",
}

export interface Operation {
  from: string;
  to: string;
  label: string;
}

export interface System {
  id: string;
  name: string;
  description: string;
  modules: Module[];
  services: Service[];
  databases: Database[];
  databasesUsages: DatabaseUsage[];
  syncOperations: Operation[];
  asyncOperations: Operation[];
  error?: string;
}
