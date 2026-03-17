import React from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { TrendingUp } from "lucide-react";

interface ModuleDashboardProps {
  moduleName: string;
  description: string;
  stats: {
    label: string;
    value: string;
    color: string;
    icon: React.ReactNode;
  }[];
}

const ModuleDashboard: React.FC<ModuleDashboardProps> = ({
  moduleName,
  description,
  stats,
}) => {
  return (
    <DashboardLayout>
      <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
        {/* Header Section */}
        <div
          className="mb-10 animate-fade-in"
          style={{ paddingBottom: "10px" }}
        >
          <h1
            style={{
              fontSize: "32px",
              fontWeight: "700",
              color: "#272b60",
              letterSpacing: "-0.02em",
              marginBottom: "8px",
              lineHeight: "1.2",
            }}
          >
            Dashboard de {moduleName}
          </h1>
          <p
            style={{
              fontSize: "16px",
              color: "#64748b",
              fontWeight: "500",
              margin: 0,
            }}
          >
            {description}
          </p>
        </div>

        {/* Stats Grid */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in"
          style={{ animationDelay: "200ms" }}
        >
          {stats.map((stat, i) => (
            <div
              key={i}
              className="bg-white p-6 animate-slide-in shadow-sm border border-gray-100/60"
              style={{
                borderRadius: "20px",
                animationDelay: `${i * 100}ms`,
                padding: "1rem",
              }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center "
                style={{
                  marginBottom: "1rem",
                  backgroundColor: `${stat.color}15`,
                  color: stat.color,
                }}
              >
                {stat.icon}
              </div>
              <p
                style={{
                  fontSize: "12px",
                  fontWeight: "600",
                  color: "#94a3b8",
                  textTransform: "uppercase",
                  letterSpacing: "0.02em",
                  marginBottom: "4px",
                }}
              >
                {stat.label}
              </p>
              <p
                style={{
                  fontSize: "24px",
                  fontWeight: "700",
                  color: "#272b60",
                  margin: 0,
                }}
              >
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Main Content Area (Work in Progress Card) */}
        <div
          className="mt-8 bg-white p-12 text-center border border-gray-100 shadow-sm"
          style={{ borderRadius: "24px", padding: "1rem" }}
        >
          <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-gray-400">
            <TrendingUp size={32} />
          </div>
          <h2
            style={{
              fontSize: "20px",
              fontWeight: "600",
              color: "#272b60",
              marginBottom: "12px",
            }}
          >
            Panel Principal de {moduleName}
          </h2>
          <p
            style={{
              fontSize: "15px",
              color: "#64748b",
              maxWidth: "450px",
              margin: "0 auto",
              lineHeight: "1.6",
              paddingY: "1rem",
            }}
          >
            Este espacio está siendo configurado para mostrar las métricas
            críticas del sistema de {moduleName}. Explore los submódulos en el
            menú lateral para gestionar la información.
          </p>

          <div
            className=" flex gap-3 justify-center"
            style={{ marginTop: "1rem" }}
          >
            <button
              className="bg-[#272b60] text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:shadow-lg transition-all active:scale-95"
              style={{ padding: "0.6rem" }}
            >
              Nuevo Registro
            </button>
            <button
              className="bg-white border border-gray-200 text-[#272b60] px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-gray-50 transition-all active:scale-95"
              style={{ padding: "0.6rem" }}
            >
              Configuración
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ModuleDashboard;
