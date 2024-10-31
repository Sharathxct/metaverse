import { describe, it, expect, vitest } from "vitest";
import { log } from "..";

vitest.spyOn(global.console, "log");

describe("@repo/logger", () => {
  it("prints a message", () => {
    log("hello");
    expect(console.log).toHaveBeenCalled();
  });
});
