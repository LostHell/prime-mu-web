interface FeedbackProps {
  type: "success" | "error";
  message: string;
}

const Feedback = ({ type, message }: FeedbackProps) => {
  return (
    <div
      className="rounded border px-4 py-3 text-sm font-semibold"
      style={{
        color: type === "success" ? "hsl(130 60% 50%)" : "hsl(var(--crimson))",
        borderColor:
          type === "success"
            ? "hsl(130 60% 50% / 0.4)"
            : "hsl(var(--crimson) / 0.4)",
        backgroundColor:
          type === "success"
            ? "hsl(130 60% 50% / 0.08)"
            : "hsl(var(--crimson) / 0.08)",
      }}
    >
      {message}
    </div>
  );
};

export default Feedback;
