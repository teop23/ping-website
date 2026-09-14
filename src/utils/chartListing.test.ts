import { describe, expect, it, vi } from "vitest";
import { fetchChartListed } from "./chartListing";

const ADDRESS = "0x" + "ab12".repeat(10);
const answering = (body: unknown, ok = true) =>
  vi.fn(async () => ({ ok, json: async () => body }) as Response);

describe("fetchChartListed", () => {
  it("asks Dexscreener for the token's pairs on Robinhood Chain", async () => {
    const fetchFn = answering([{ dexId: "uniswap" }]);
    expect(await fetchChartListed(ADDRESS, fetchFn)).toBe(true);
    expect(fetchFn).toHaveBeenCalledWith(`https://api.dexscreener.com/token-pairs/v1/robinhood/${ADDRESS}`);
  });

  it("is false before graduation, when there is no pair", async () => {
    expect(await fetchChartListed(ADDRESS, answering([]))).toBe(false);
  });

  it("is false without an address, on errors and on odd answers", async () => {
    const fetchFn = answering([{}]);
    expect(await fetchChartListed("", fetchFn)).toBe(false);
    expect(fetchFn).not.toHaveBeenCalled();
    expect(await fetchChartListed(ADDRESS, answering([{}], false))).toBe(false);
    expect(await fetchChartListed(ADDRESS, answering({ pairs: null }))).toBe(false);
    expect(await fetchChartListed(ADDRESS, vi.fn(async () => { throw new Error("offline"); }))).toBe(false);
  });
});
