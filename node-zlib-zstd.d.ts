import "zlib";

// Node 24 (.nvmrc) has zstd in zlib; @types/node 20 does not describe it yet. Only what the
// launcher's release upload uses (lib/launcher/release-store.ts). Remove once @types/node has it.
declare module "zlib" {
  interface ZstdOptions {
    maxOutputLength?: number;
  }

  function zstdCompressSync(
    buffer: NodeJS.ArrayBufferView,
    options?: ZstdOptions,
  ): Buffer;
  function zstdDecompressSync(
    buffer: NodeJS.ArrayBufferView,
    options?: ZstdOptions,
  ): Buffer;
}
