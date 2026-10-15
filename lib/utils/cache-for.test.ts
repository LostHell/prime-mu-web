import { cacheFor } from "./cache-for";

let now = 0;

beforeEach(() => {
  now = 1_000;
  jest.spyOn(Date, "now").mockReturnValue(now);
});

afterEach(() => {
  jest.restoreAllMocks();
});

test("reuses a value until the ttl passes", async () => {
  const load = jest.fn().mockResolvedValue("online");
  const read = cacheFor(5_000, load);

  await expect(read()).resolves.toBe("online");
  jest.spyOn(Date, "now").mockReturnValue(now + 4_999);
  await expect(read()).resolves.toBe("online");

  expect(load).toHaveBeenCalledTimes(1);
});

test("loads again once the ttl has passed", async () => {
  const load = jest
    .fn()
    .mockResolvedValueOnce("online")
    .mockResolvedValueOnce("offline");
  const read = cacheFor(5_000, load);

  await read();
  jest.spyOn(Date, "now").mockReturnValue(now + 5_000);

  await expect(read()).resolves.toBe("offline");
  expect(load).toHaveBeenCalledTimes(2);
});

test("shares one load across overlapping callers", async () => {
  let resolveLoad: (value: string) => void = () => {};
  const load = jest.fn(
    () =>
      new Promise<string>((resolve) => {
        resolveLoad = resolve;
      }),
  );
  const read = cacheFor(5_000, load);

  const first = read();
  const second = read();
  resolveLoad("online");

  await expect(Promise.all([first, second])).resolves.toEqual([
    "online",
    "online",
  ]);
  expect(load).toHaveBeenCalledTimes(1);
});

test("tries again after a load fails", async () => {
  const load = jest
    .fn()
    .mockRejectedValueOnce(new Error("down"))
    .mockResolvedValueOnce("online");
  const read = cacheFor(5_000, load);

  await expect(read()).rejects.toThrow("down");
  await expect(read()).resolves.toBe("online");
  expect(load).toHaveBeenCalledTimes(2);
});
