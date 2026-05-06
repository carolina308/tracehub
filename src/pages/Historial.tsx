const Historial = () => {
  const history =
    JSON.parse(
      localStorage.getItem("tracehub_history") || "[]"
    );

  return (
    <div className="min-h-screen bg-[#f4f7fb] p-10">
      {/* HEADER */}
      <div className="mb-10">
        <p className="text-sm text-gray-400 mb-2">
          TRACEHUB {" > "} Historial
        </p>

        <h1 className="text-5xl font-bold text-[#2563eb]">
          Historial de Cambios
        </h1>

        <p className="text-gray-500 mt-4">
          Seguimiento completo de movimientos y cambios
          realizados en los requisitos.
        </p>
      </div>

      {/* EMPTY */}
      {history.length === 0 && (
        <div className="bg-white rounded-3xl p-10 text-center shadow-sm">
          <h3 className="text-2xl font-semibold text-gray-700 mb-3">
            No hay movimientos registrados
          </h3>

          <p className="text-gray-500">
            Los cambios realizados en el tablero aparecerán
            aquí.
          </p>
        </div>
      )}

      {/* HISTORY */}
      <div className="space-y-5">
        {history
          .slice()
          .reverse()
          .map((item: any, index: number) => (
            <div
              key={index}
              className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100"
            >
              {/* TOP */}
              <div className="flex items-center justify-between mb-5">
                <div>
                  <p className="text-sm text-[#2563eb] font-bold">
                    {item.code}
                  </p>

                  <h3 className="text-xl font-semibold mt-1">
                    {item.title}
                  </h3>
                </div>

                <span className="text-sm text-gray-400">
                  {item.date}
                </span>
              </div>

              {/* MOVEMENT */}
              <div className="flex items-center gap-3 mb-5">
                <span className="bg-gray-100 px-3 py-2 rounded-xl text-sm">
                  {item.from.toUpperCase()}
                </span>

                <span className="text-gray-400">
                  →
                </span>

                <span className="bg-[#2563eb] text-white px-3 py-2 rounded-xl text-sm">
                  {item.to.toUpperCase()}
                </span>
              </div>

              {/* COMMENT */}
              {item.comment && (
                <div className="mb-4">
                  <p className="text-sm text-gray-400 mb-1">
                    Comentario
                  </p>

                  <p className="text-gray-700">
                    {item.comment}
                  </p>
                </div>
              )}

              {/* EVIDENCE */}
              {item.evidence && (
                <div>
                  <p className="text-sm text-gray-400 mb-1">
                    Evidencia
                  </p>

                  <p className="text-blue-600 text-sm">
                    📎 {item.evidence}
                  </p>
                </div>
              )}
            </div>
          ))}
      </div>
    </div>
  );
};

export default Historial;