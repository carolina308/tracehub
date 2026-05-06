const MetricsRow = () => {
  return (
    <div className="grid grid-cols-4 gap-5">
      <MetricCard
        title="Total Requirements"
        value="124"
      />

      <MetricCard
        title="Velocity"
        value="42 pts/week"
        color="blue"
      />

      <MetricCard
        title="Open Blockers"
        value="3"
        color="red"
      />

      <MetricCard
        title="Quality Score"
        value="98.2%"
        color="green"
      />
    </div>
  );
};

const MetricCard = ({
  title,
  value,
  color,
}: any) => {
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
      <p className="text-sm text-gray-400 mb-2">
        {title}
      </p>

      <h2
        className={`text-2xl font-bold
        ${color === "blue" && "text-blue-600"}
        ${color === "red" && "text-red-500"}
        ${color === "green" && "text-green-500"}
      `}
      >
        {value}
      </h2>
    </div>
  );
};

export default MetricsRow;