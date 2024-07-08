import * as neo4j from "neo4j-driver";
import type { Driver } from "neo4j-driver";

const URI = process.env.NEO4J_URI;
const USER = process.env.NEO4J_USER;
const PASSWORD = process.env.NEO4J_PASSWORD;

export async function getDriver() {
  let driver: Driver | null = null;

  if (!URI || !USER || !PASSWORD) {
    throw new Error("Missing NEO4J_URI, NEO4J_USER or NEO4J_PASSWORD env.");
  }

  //if running in browser, throw error
  if (typeof window !== "undefined") {
    throw new Error("This function is not available in the browser.");
  }

  try {
    driver = neo4j.driver(URI, neo4j.auth.basic(USER, PASSWORD));
    console.log("Connection estabilished");
    return driver;
  } catch (err) {
    console.log(`Connection error\n${err}\nCause: ${JSON.stringify(err)}`);
    throw err;
  } finally {
    console.log("Closing connection ❌");
    driver && (await driver.close());
  }
}
