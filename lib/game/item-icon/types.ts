export type ItemIconPathOptions = {
  /** In-game +level when the sprite depends on it (e.g. Box of Luck). */
  level?: number;
  /** GIF trailing two digits; overrides level-based behavior when set. */
  variantSuffix?: string;
};
