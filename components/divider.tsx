const Divider = ({ className = "" }: { className?: string }) => {
  return (
    <div className={`divider ${className}`}>
      <div className="divider-diamond" />
    </div>
  );
};

export default Divider;
