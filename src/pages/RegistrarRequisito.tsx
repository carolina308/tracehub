import { useState } from "react";

interface RequirementForm {
  title: string;
  description: string;
  priority: string;
  acceptance: string;
}

const RegistrarRequisito = () => {
  const [formData, setFormData] = useState<RequirementForm>({
    title: "",
    description: "",
    priority: "",
    acceptance: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (
      !formData.title ||
      !formData.description ||
      !formData.priority
    ) {
      setError("Error en los campos ingresados");
      return;
    }

    const newRequirement = {
      id: crypto.randomUUID(),
      code: `TH-${Math.floor(Math.random() * 900 + 100)}`,
      title: formData.title,
      description: formData.description,
      priority: formData.priority,
      acceptance: formData.acceptance,
      assignee: "Unassigned",
      tags: ["new"],
      points: 0,
      status: "backlog",
      createdAt: new Date(),
    };

    const existing =
      JSON.parse(localStorage.getItem("tracehub_tasks") || "[]");

    localStorage.setItem(
      "tracehub_tasks",
      JSON.stringify([...existing, newRequirement])
    );

    setSuccess("Requisito creado exitosamente");

    setFormData({
      title: "",
      description: "",
      priority: "",
      acceptance: "",
    });
  };

  return (
    <div className="min-h-screen bg-[#f4f7fb] p-10">
      {/* HEADER */}
      <div className="mb-10">
        <p className="text-sm text-gray-400 mb-2">
          Requisitos {" > "} Nueva Entrada
        </p>

        <h1 className="text-5xl font-bold text-[#2563eb]">
          Crear Requisito
        </h1>

        <p className="text-gray-500 mt-4">
          Define un nuevo requisito funcional o técnico para el proyecto.
        </p>
      </div>

      {/* ALERTAS */}
      {success && (
        <div className="bg-green-100 border border-green-300 text-green-700 p-4 rounded-2xl mb-5">
          {success}
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-300 text-red-700 p-4 rounded-2xl mb-5">
          {error}
        </div>
      )}

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-3 gap-8"
      >
        {/* LEFT */}
        <div className="col-span-2 bg-white rounded-3xl p-8 shadow-sm">
          {/* TITLE */}
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-3 text-gray-700">
              NOMBRE DEL REQUISITO *
            </label>

            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Ej: Autenticación con SAML"
              className="w-full border border-gray-200 rounded-2xl p-4 outline-none focus:border-[#2563eb]"
            />
          </div>

          {/* DESCRIPTION */}
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-3 text-gray-700">
              DESCRIPCIÓN DETALLADA *
            </label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={6}
              placeholder="Detalle técnico del requisito..."
              className="w-full border border-gray-200 rounded-2xl p-4 outline-none focus:border-[#2563eb]"
            />
          </div>

          {/* ACCEPTANCE */}
          <div>
            <label className="block text-sm font-semibold mb-3 text-gray-700">
              CRITERIOS DE ACEPTACIÓN
            </label>

            <textarea
              name="acceptance"
              value={formData.acceptance}
              onChange={handleChange}
              rows={5}
              placeholder="Defina cuándo este requisito se considera completado..."
              className="w-full border border-gray-200 rounded-2xl p-4 outline-none focus:border-[#2563eb]"
            />
          </div>
        </div>

        {/* RIGHT */}
        <div className="space-y-6">
          {/* PRIORITY */}
          <div className="bg-white rounded-3xl p-6 shadow-sm">
            <label className="block text-sm font-semibold mb-3 text-gray-700">
              PRIORIDAD *
            </label>

            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-2xl p-4 outline-none focus:border-[#2563eb]"
            >
              <option value="">Seleccionar prioridad</option>
              <option value="high">Alta</option>
              <option value="medium">Media</option>
              <option value="low">Baja</option>
            </select>
          </div>

          {/* INFO */}
          <div className="bg-[#1e3a8a] text-white rounded-3xl p-6">
            <h3 className="font-bold text-xl mb-4">
              Sugerencia
            </h3>

            <p className="text-sm text-blue-100 leading-7">
              Según la capacidad actual del sprint, este requisito
              puede ser priorizado para desarrollo inmediato.
            </p>
          </div>

          {/* BUTTONS */}
          <div className="space-y-4">
            <button
              type="submit"
              className="w-full bg-[#2563eb] hover:bg-[#1d4ed8] text-white py-4 rounded-2xl font-semibold transition"
            >
              Registrar
            </button>

            <button
              type="button"
              className="w-full bg-white border border-gray-200 py-4 rounded-2xl font-semibold"
            >
              Guardar como borrador
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default RegistrarRequisito;