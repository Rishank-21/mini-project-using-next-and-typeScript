import { Connection } from "mongoose";

// CSS Module declarations
declare module "*.css";

declare global {
  var mongoose: {
    conn: Connection | null;
    promise: Promise<Connection> | null;
  };
}

export {};
