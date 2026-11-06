import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

import {
  getAdmins,
  crearAdmin,
  actualizarAdmin,
  eliminarAdmin,
} from "../../services/admins.service";

import {
  ShieldCheck,
  UserPlus,
  Mail,
  Pencil,
  Trash2,
  Power,
  RefreshCw,
  X,
  Check,
  AlertCircle,
  Users,
} from "lucide-react";

import "./Admins.css";

export default function Admins() {
  const { isAdmin } = useAuth();

  const [admins, setAdmins] = useState([]);
  const [email, setEmail] = useState("");
  const [editando, setEditando] = useState(null);
  const [nuevoEmail, setNuevoEmail] = useState("");

  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    if (isAdmin) {
      cargarAdmins();
    }
  }, [isAdmin]);

  const cargarAdmins = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getAdmins();

      setAdmins(response.data || []);
    } catch (err) {
      console.error("Error al consultar administradores:", err);

      setError(
        err.response?.data?.message ||
          "No fue posible cargar la lista de administradores."
      );
    } finally {
      setLoading(false);
    }
  };

  const mostrarMensaje = (texto) => {
    setMensaje(texto);
    setError("");
  };

  const registrarAdmin = async (e) => {
    e.preventDefault();

    const correo = email.trim().toLowerCase();

    if (!correo) {
      setError("Ingresa un correo electrónico.");
      return;
    }

    if (!/^[^\s@]+@celaya\.tecnm\.mx$/i.test(correo)) {
      setError("Ingresa un correo institucional @celaya.tecnm.mx.");
      return;
    }

    try {
      setGuardando(true);
      setError("");
      setMensaje("");

      await crearAdmin(correo);

      setEmail("");
      mostrarMensaje("Administrador registrado correctamente.");

      await cargarAdmins();
    } catch (err) {
      console.error("Error al registrar administrador:", err);

      setError(
        err.response?.data?.message ||
          "No fue posible registrar al administrador."
      );
    } finally {
      setGuardando(false);
    }
  };

  const iniciarEdicion = (admin) => {
    setEditando(admin.id);
    setNuevoEmail(admin.email);
    setError("");
    setMensaje("");
  };

  const cancelarEdicion = () => {
    setEditando(null);
    setNuevoEmail("");
  };

  const guardarEdicion = async (id) => {
    const correo = nuevoEmail.trim().toLowerCase();

    if (!correo) {
      setError("El correo electrónico no puede estar vacío.");
      return;
    }

    if (!/^[^\s@]+@celaya\.tecnm\.mx$/i.test(correo)) {
      setError("Ingresa un correo institucional @celaya.tecnm.mx.");
      return;
    }

    try {
      setGuardando(true);
      setError("");
      setMensaje("");

      await actualizarAdmin(id, { email: correo });

      cancelarEdicion();
      mostrarMensaje("Correo del administrador actualizado correctamente.");

      await cargarAdmins();
    } catch (err) {
      console.error("Error al actualizar administrador:", err);

      setError(
        err.response?.data?.message ||
          "No fue posible actualizar al administrador."
      );
    } finally {
      setGuardando(false);
    }
  };

  const cambiarEstado = async (admin) => {
    const nuevoEstado = !admin.active;

    const accion = nuevoEstado ? "activar" : "desactivar";

    if (
      !window.confirm(
        `¿Estás seguro de que deseas ${accion} a ${admin.email}?`
      )
    ) {
      return;
    }

    try {
      setError("");
      setMensaje("");

      await actualizarAdmin(admin.id, {
        active: nuevoEstado,
      });

      mostrarMensaje(
        nuevoEstado
          ? "Administrador activado correctamente."
          : "Administrador desactivado correctamente."
      );

      await cargarAdmins();
    } catch (err) {
      console.error("Error al cambiar estado:", err);

      setError(
        err.response?.data?.message ||
          "No fue posible modificar el estado del administrador."
      );
    }
  };

  const borrarAdmin = async (admin) => {
    if (
      !window.confirm(
        `¿Estás seguro de que deseas eliminar a ${admin.email}? Esta acción no se puede deshacer.`
      )
    ) {
      return;
    }

    try {
      setError("");
      setMensaje("");

      await eliminarAdmin(admin.id);

      mostrarMensaje("Administrador eliminado correctamente.");

      await cargarAdmins();
    } catch (err) {
      console.error("Error al eliminar administrador:", err);

      setError(
        err.response?.data?.message ||
          "No fue posible eliminar al administrador."
      );
    }
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return "Sin fecha";

    return new Date(fecha).toLocaleDateString("es-MX", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  const activos = admins.filter((admin) => admin.active).length;
  const inactivos = admins.length - activos;

  return (
    <div className="admins-container">
      <div className="admins-header">
        <div>
          <div className="admins-title">
            <ShieldCheck size={27} />
            <h1>Administradores</h1>
          </div>

          <p>
            Gestiona los usuarios que tienen permisos administrativos en el
            portal.
          </p>
        </div>

        <button
          className="admins-refresh"
          onClick={cargarAdmins}
          disabled={loading}
          title="Actualizar lista"
        >
          <RefreshCw size={17} className={loading ? "admins-spinning" : ""} />
          Actualizar
        </button>
      </div>

      <div className="admins-stats">
        <div className="admins-stat-card">
          <div className="admins-stat-icon total">
            <Users size={22} />
          </div>

          <div>
            <span>Total de administradores</span>
            <strong>{admins.length}</strong>
          </div>
        </div>

        <div className="admins-stat-card">
          <div className="admins-stat-icon active">
            <Check size={22} />
          </div>

          <div>
            <span>Administradores activos</span>
            <strong>{activos}</strong>
          </div>
        </div>

        <div className="admins-stat-card">
          <div className="admins-stat-icon inactive">
            <Power size={22} />
          </div>

          <div>
            <span>Administradores inactivos</span>
            <strong>{inactivos}</strong>
          </div>
        </div>
      </div>

      {mensaje && (
        <div className="admins-alert success">
          <Check size={18} />
          <span>{mensaje}</span>

          <button onClick={() => setMensaje("")}>
            <X size={17} />
          </button>
        </div>
      )}

      {error && (
        <div className="admins-alert error">
          <AlertCircle size={18} />
          <span>{error}</span>

          <button onClick={() => setError("")}>
            <X size={17} />
          </button>
        </div>
      )}

      <section className="admins-create-card">
        <div className="admins-section-heading">
          <div className="admins-section-icon">
            <UserPlus size={21} />
          </div>

          <div>
            <h2>Registrar administrador</h2>
            <p>Agrega un nuevo correo institucional con permisos de administrador.</p>
          </div>
        </div>

        <form className="admins-create-form" onSubmit={registrarAdmin}>
          <div className="admins-input-wrapper">
            <Mail size={18} />

            <input
              type="email"
              placeholder="usuario@celaya.tecnm.mx"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button type="submit" disabled={guardando}>
            <UserPlus size={18} />
            {guardando ? "Registrando..." : "Registrar administrador"}
          </button>
        </form>
      </section>

      <section className="admins-table-card">
        <div className="admins-table-heading">
          <div>
            <h2>Administradores registrados</h2>
            <p>Consulta y administra los permisos de acceso.</p>
          </div>

          <span className="admins-count">
            {admins.length} registros
          </span>
        </div>

        {loading ? (
          <div className="admins-state">
            <RefreshCw className="admins-spinning" size={25} />
            <p>Cargando administradores...</p>
          </div>
        ) : admins.length === 0 ? (
          <div className="admins-state">
            <ShieldCheck size={36} />
            <h3>No hay administradores registrados</h3>
            <p>Los administradores registrados aparecerán aquí.</p>
          </div>
        ) : (
          <div className="admins-table-wrapper">
            <table className="admins-table">
              <thead>
                <tr>
                  <th>Correo electrónico</th>
                  <th>Fecha de registro</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {admins.map((admin) => (
                  <tr key={admin.id}>
                    <td>
                      {editando === admin.id ? (
                        <div className="admins-edit-input">
                          <input
                            type="email"
                            value={nuevoEmail}
                            onChange={(e) => setNuevoEmail(e.target.value)}
                            autoFocus
                          />

                          <button
                            className="admins-action save"
                            onClick={() => guardarEdicion(admin.id)}
                            disabled={guardando}
                            title="Guardar cambios"
                          >
                            <Check size={17} />
                          </button>

                          <button
                            className="admins-action cancel"
                            onClick={cancelarEdicion}
                            title="Cancelar"
                          >
                            <X size={17} />
                          </button>
                        </div>
                      ) : (
                        <div className="admins-email">
                          <div className="admins-avatar">
                            <ShieldCheck size={18} />
                          </div>

                          <span>{admin.email}</span>
                        </div>
                      )}
                    </td>

                    <td>{formatearFecha(admin.created_at)}</td>

                    <td>
                      <span
                        className={`admins-status ${
                          admin.active ? "is-active" : "is-inactive"
                        }`}
                      >
                        <span />
                        {admin.active ? "Activo" : "Inactivo"}
                      </span>
                    </td>

                    <td>
                      <div className="admins-actions">
                        {editando !== admin.id && (
                          <button
                            className="admins-action edit"
                            onClick={() => iniciarEdicion(admin)}
                            title="Editar correo"
                          >
                            <Pencil size={17} />
                          </button>
                        )}

                        <button
                          className={`admins-action ${
                            admin.active ? "deactivate" : "activate"
                          }`}
                          onClick={() => cambiarEstado(admin)}
                          title={admin.active ? "Desactivar" : "Activar"}
                          disabled={editando === admin.id}
                        >
                          <Power size={17} />
                        </button>

                        <button
                          className="admins-action delete"
                          onClick={() => borrarAdmin(admin)}
                          title="Eliminar administrador"
                          disabled={editando === admin.id}
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}