import "server-only";

import net from "node:net";

const DATA_SERVER_PORT = Number(process.env.DATA_SERVER_PORT ?? 55960);
const DATA_SERVER_HOST = process.env.DATA_SERVER_HOST ?? "";

/** How long the DataServer has to send the notice back before it counts as not sent. */
const NOTICE_TIMEOUT_MS = 3000;

/**
 * The kind of a global notice, as the game client shows it: gold in the middle of the screen, or
 * a blue line in the chat.
 */
export const NOTICE_GOLD = 0;
export const NOTICE_BLUE = 1;

/** The notice text, without its closing zero: the packet's message field is 128 bytes. */
export const MAX_NOTICE_LENGTH = 127;

// The DataServer's global notice, C1:05:00 (SDHP_GLOBAL_NOTICE_RECV): the header (C1, size, head,
// subcode), the type, then the message in a zero-padded 128-byte field. The DataServer sends it to
// every server connected to it: the GameServers show it to every player, and this connection gets
// it back as well.
const NOTICE_HEAD = 0x05;
const NOTICE_SUBCODE = 0x00;
const NOTICE_MESSAGE_OFFSET = 5;
const NOTICE_PACKET_SIZE = NOTICE_MESSAGE_OFFSET + MAX_NOTICE_LENGTH + 1;

/** The bytes of a global notice; a message over MAX_NOTICE_LENGTH is cut. */
export const globalNoticePacket = (message: string, type: number): Buffer => {
  const packet = Buffer.alloc(NOTICE_PACKET_SIZE);
  packet[0] = 0xc1;
  packet[1] = NOTICE_PACKET_SIZE;
  packet[2] = NOTICE_HEAD;
  packet[3] = NOTICE_SUBCODE;
  packet[4] = type;
  // The game's text is Latin-1.
  packet.write(
    message.slice(0, MAX_NOTICE_LENGTH),
    NOTICE_MESSAGE_OFFSET,
    "latin1",
  );
  return packet;
};

/**
 * Whether `received`, the DataServer's packets so far, holds `notice` (its echo). C1 packets give
 * their size in one byte, C2 packets in two (big-endian).
 */
export const hasNoticeEcho = (received: Buffer, notice: Buffer): boolean => {
  let offset = 0;
  while (offset + 3 <= received.length) {
    const kind = received[offset];
    if (kind !== 0xc1 && kind !== 0xc2) return false;
    const size =
      kind === 0xc1 ? received[offset + 1] : received.readUInt16BE(offset + 1);
    if (size < 3 || offset + size > received.length) return false;
    if (received.subarray(offset, offset + size).equals(notice)) return true;
    offset += size;
  }
  return false;
};

/**
 * Shows `message` to every player in the game, through the DataServer (DATA_SERVER_HOST and
 * DATA_SERVER_PORT; the DataServer accepts only the addresses in its AllowableIpList.txt). True
 * once the DataServer has sent it on; false when it is not set up, refuses or does not answer.
 */
export const sendGlobalNotice = (
  message: string,
  type: number,
): Promise<boolean> => {
  if (!DATA_SERVER_HOST) return Promise.resolve(false);
  const notice = globalNoticePacket(message, type);

  return new Promise((resolve) => {
    const socket = new net.Socket();
    let received = Buffer.alloc(0);

    const finish = (sent: boolean) => {
      clearTimeout(deadline);
      socket.destroy();
      resolve(sent);
    };
    const deadline = setTimeout(() => finish(false), NOTICE_TIMEOUT_MS);

    socket.once("connect", () => socket.write(notice));
    socket.on("data", (data) => {
      received = Buffer.concat([received, data]);
      if (hasNoticeEcho(received, notice)) finish(true);
    });
    socket.once("error", () => finish(false));
    socket.once("close", () => finish(false));
    socket.connect(DATA_SERVER_PORT, DATA_SERVER_HOST);
  });
};
