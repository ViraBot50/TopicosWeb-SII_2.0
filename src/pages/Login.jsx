
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  GraduationCap,
  LockKeyhole,
  Mail,
  ArrowRight,
  Eye,
  EyeOff,
  ShieldCheck,
  Cpu,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login, loading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Ingresa tu correo institucional y contraseña.");
      return;
    }

    try {
      await login(email.trim(), password);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      console.error("Error de autenticación:", err);

      setError(
        err.response?.data?.message ||
        err.message ||
        "No fue posible iniciar sesión. Verifica tus credenciales."
      );
    }
  };

  return (
    <main className="login-page">
      <div className="login-background">
        <div className="login-glow login-glow-one" />
        <div className="login-glow login-glow-two" />
        <div className="login-grid" />
      </div>

      <section className="login-shell">
        <div className="login-presentation">
          <div className="login-brand">
            <div className="login-brand-icon">
              <GraduationCap size={27} />
            </div>

            <div>
              <strong>SII ITC</strong>
              <span>INSTITUTO TECNOLÓGICO DE CELAYA</span>
            </div>
          </div>

          <div className="login-hero">
            <span className="login-eyebrow">
              <span className="status-dot" />
              SISTEMA ACADÉMICO INTEGRADO
            </span>

            <h1>
              Tu vida
              <br />
              académica,
              <br />
              <span>conectada.</span>
            </h1>

            <p>
              Accede a tu información académica desde un
              solo lugar. Consulta tu progreso, calificaciones,
              historial y horarios.
            </p>

            <div className="login-feature-list">
              <div className="login-feature">
                <div className="login-feature-icon">
                  <Cpu size={19} />
                </div>
                <div>
                  <strong>Información centralizada</strong>
                  <span>Todos tus datos académicos en un lugar.</span>
                </div>
              </div>

              <div className="login-feature">
                <div className="login-feature-icon">
                  <ShieldCheck size={19} />
                </div>
                <div>
                  <strong>Acceso institucional</strong>
                  <span>Autenticación mediante el sistema SII.</span>
                </div>
              </div>
            </div>
          </div>

          <div className="login-presentation-footer">
            <span>TECNOLOGÍA · EDUCACIÓN · INNOVACIÓN</span>
            <span>© 2026 SII ITC</span>
          </div>
        </div>

        <div className="login-form-panel">
          <div className="login-form-content">
            <div className="login-mobile-brand">
              <div className="login-brand-icon">
                <GraduationCap size={25} />
              </div>
              <strong>SII ITC</strong>
            </div>

            <div className="login-heading">
              <span className="form-eyebrow">BIENVENIDO DE NUEVO</span>
              <h2>Iniciar sesión</h2>
              <p>
                Ingresa tus credenciales institucionales
                para continuar.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-field">
                <label htmlFor="email">
                  Correo institucional
                </label>

                <div className="input-wrapper">
                  <Mail size={19} />

                  <input
                    id="email"
                    type="email"
                    placeholder="usuario@celaya.tecnm.mx"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="username"
                    required
                  />
                </div>
              </div>

              <div className="form-field">
                <label htmlFor="password">
                  Contraseña
                </label>

                <div className="input-wrapper">
                  <LockKeyhole size={19} />

                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Ingresa tu contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    required
                  />

                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={
                      showPassword
                        ? "Ocultar contraseña"
                        : "Mostrar contraseña"
                    }
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <div className="login-error">
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="login-submit"
                disabled={loading}
              >
                <span>
                  {loading ? "Verificando..." : "Acceder al portal"}
                </span>

                {!loading && <ArrowRight size={19} />}
              </button>
            </form>

            <div className="login-security">
              <ShieldCheck size={17} />
              <span>
                Acceso protegido por autenticación institucional
              </span>
            </div>

            <div className="login-form-footer">
              <span>Instituto Tecnológico de Celaya</span>
              <span>Portal académico</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
