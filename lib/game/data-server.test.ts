/**
 * @jest-environment node
 */
import net from "node:net";
import type { AddressInfo } from "node:net";

type DataServerModule = typeof import("./data-server");

/** The module with DATA_SERVER_HOST / DATA_SERVER_PORT set as given (they are read on import). */
const loadDataServer = (host: string, port: number): DataServerModule => {
  process.env.DATA_SERVER_HOST = host;
  process.env.DATA_SERVER_PORT = String(port);
  let loaded: DataServerModule | undefined;
  jest.isolateModules(() => {
    loaded = jest.requireActual<DataServerModule>("./data-server");
  });
  return loaded!;
};

/** A stand-in DataServer: `reply` decides what it sends back for the bytes it gets. */
const startDataServer = async (reply: (packet: Buffer) => Buffer | null) => {
  const received: Buffer[] = [];
  const server = net.createServer((socket) => {
    socket.on("data", (data) => {
      received.push(data);
      const answer = reply(data);
      if (answer) socket.write(answer);
    });
  });
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  return {
    port: (server.address() as AddressInfo).port,
    received,
    close: () => new Promise<void>((resolve) => server.close(() => resolve())),
  };
};

afterEach(() => {
  delete process.env.DATA_SERVER_HOST;
  delete process.env.DATA_SERVER_PORT;
});

test("builds the DataServer's global notice, C1:05:00, with a 128-byte message", () => {
  const { globalNoticePacket, NOTICE_BLUE } = loadDataServer("", 0);
  const packet = globalNoticePacket("[Market] CRY sells Kris +9", NOTICE_BLUE);

  expect(packet).toHaveLength(133);
  expect([...packet.subarray(0, 5)]).toEqual([0xc1, 133, 0x05, 0x00, 1]);
  expect(packet.toString("latin1", 5, 5 + 26)).toBe(
    "[Market] CRY sells Kris +9",
  );
  expect(packet.subarray(5 + 26).every((byte) => byte === 0)).toBe(true);
});

test("cuts a message to 127 characters, keeping its closing zero", () => {
  const { globalNoticePacket, NOTICE_BLUE } = loadDataServer("", 0);
  const packet = globalNoticePacket("x".repeat(200), NOTICE_BLUE);

  expect(packet).toHaveLength(133);
  expect(packet.toString("latin1", 5, 132)).toBe("x".repeat(127));
  expect(packet[132]).toBe(0);
});

test("finds the notice's echo among other C1 and C2 packets", () => {
  const { globalNoticePacket, hasNoticeEcho, NOTICE_BLUE } = loadDataServer(
    "",
    0,
  );
  const notice = globalNoticePacket("[Market] CRY sells Kris +9", NOTICE_BLUE);
  const otherC1 = Buffer.from([0xc1, 4, 0x05, 0x01]);
  const otherC2 = Buffer.from([0xc2, 0x00, 5, 0x10, 0x00]);
  const otherNotice = globalNoticePacket("someone else", NOTICE_BLUE);

  expect(hasNoticeEcho(Buffer.concat([otherC1, otherC2, notice]), notice)).toBe(
    true,
  );
  expect(hasNoticeEcho(Buffer.concat([otherC1, otherNotice]), notice)).toBe(
    false,
  );
  // Half a packet so far.
  expect(hasNoticeEcho(notice.subarray(0, 60), notice)).toBe(false);
});

test("sends the notice and waits until the DataServer sends it on", async () => {
  const dataServer = await startDataServer((packet) => packet);
  const { sendGlobalNotice, NOTICE_BLUE } = loadDataServer(
    "127.0.0.1",
    dataServer.port,
  );

  await expect(
    sendGlobalNotice("[Market] CRY sells Kris +9", NOTICE_BLUE),
  ).resolves.toBe(true);
  expect(Buffer.concat(dataServer.received).toString("latin1", 5, 31)).toBe(
    "[Market] CRY sells Kris +9",
  );
  await dataServer.close();
});

test("is not sent when the DataServer does not send it on", async () => {
  const dataServer = await startDataServer(() =>
    Buffer.from([0xc1, 4, 0x05, 0x01]),
  );
  const { sendGlobalNotice, NOTICE_BLUE } = loadDataServer(
    "127.0.0.1",
    dataServer.port,
  );

  await expect(sendGlobalNotice("hello", NOTICE_BLUE)).resolves.toBe(false);
  await dataServer.close();
});

test("is not sent when the DataServer is not set up or not running", async () => {
  const notSetUp = loadDataServer("", 55960);
  await expect(
    notSetUp.sendGlobalNotice("hello", notSetUp.NOTICE_BLUE),
  ).resolves.toBe(false);

  const dataServer = await startDataServer(() => null);
  const port = dataServer.port;
  await dataServer.close();
  const stopped = loadDataServer("127.0.0.1", port);
  await expect(
    stopped.sendGlobalNotice("hello", stopped.NOTICE_BLUE),
  ).resolves.toBe(false);
});
