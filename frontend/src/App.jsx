import { useState, useEffect } from 'react';

function App() {
  const [email, setEmail] = useState('');
  const [folio, setFolio] = useState('');
  const [estatus, setEstatus] = useState('idle');
  const [mensajeError, setMensajeError] = useState('');
  
  // NUEVO: Estado para controlar si se muestra el aviso flotante (Toast)
  const [mostrarAviso, setMostrarAviso] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensajeError('');
    
    try {
      const response = await fetch('http://localhost:4000/api/solicitar-acceso', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, folio })
      });

      if (response.ok) {
        setEstatus('Procesando');
      } else {
        const data = await response.json();
        setMensajeError(data.error || 'Error al procesar la solicitud');
      }
    } catch (error) {
      setMensajeError('Error de conexión con el servidor.');
    }
  };

  useEffect(() => {
    let intervalId;

    if (estatus === 'Procesando') {
      intervalId = setInterval(async () => {
        try {
          // LA SOLUCIÓN AL CACHÉ (PASO 2):
          // Agregamos { cache: 'no-store' } para que el navegador no recicle respuestas viejas
          const response = await fetch(`http://localhost:4000/api/verificar-estatus/${email}`, {
            cache: 'no-store' 
          });
          
          if (response.ok) {
            const data = await response.json();
            
            if (data.estatus === 'Aceptado' || data.estatus === 'Rechazado') {
              setEstatus(data.estatus);
              clearInterval(intervalId);
              
              // Disparamos el aviso por 3 segundos
              setMostrarAviso(true);
              setTimeout(() => setMostrarAviso(false), 3000);
            }
          }
        } catch (error) {
          console.error("Error consultando el estatus:", error);
        }
      }, 5000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [estatus, email]);

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
      
      {/* AVISOS FLOTANTES (TOASTS) */}
      {mostrarAviso && (
        <div className="toast toast-top toast-end z-50">
          {estatus === 'Aceptado' ? (
            <div className="alert alert-success shadow-lg text-white">
              <span>¡Felicidades! Tu acceso ha sido aprobado.</span>
            </div>
          ) : (
            <div className="alert alert-error shadow-lg text-white">
              <span>Atención: Tu acceso ha sido denegado.</span>
            </div>
          )}
        </div>
      )}

      {/* CONTENEDOR PRINCIPAL */}
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body items-center text-center">
          <h1 className="card-title text-3xl font-bold text-primary mb-4">Gatekeeper System</h1>
          
          {/* VISTA 1: Formulario */}
          {estatus === 'idle' && (
            <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text font-semibold">Correo Institucional:</span>
                </label>
                <input 
                  type="email" 
                  placeholder="ejemplo@itses.edu.mx"
                  className="input input-bordered w-full"
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                />
              </div>
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text font-semibold">Folio de Pago:</span>
                </label>
                <input 
                  type="text" 
                  placeholder="FOLIO-XXXX"
                  className="input input-bordered w-full"
                  value={folio} 
                  onChange={(e) => setFolio(e.target.value)} 
                  required 
                />
              </div>
              
              {mensajeError && (
                <div className="alert alert-error shadow-sm mt-2 p-2">
                  <span className="text-sm text-white">{mensajeError}</span>
                </div>
              )}

              <button type="submit" className="btn btn-primary w-full mt-4">
                Solicitar Acceso
              </button>
            </form>
          )}

          {/* VISTA 2: Procesando */}
          {estatus === 'Procesando' && (
            <div className="flex flex-col items-center gap-4 py-8">
              <span className="loading loading-spinner text-primary w-16"></span>
              <h2 className="text-xl font-bold">Validando tu pago...</h2>
              <p className="text-gray-500 text-sm">Por favor espera, estamos confirmando tu folio en el sistema a través de n8n.</p>
            </div>
          )}

          {/* VISTA 3: Aceptado */}
          {estatus === 'Aceptado' && (
            <div className="w-full">
              <div className="alert alert-success shadow-lg mb-6 text-white flex justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span>¡Acceso Concedido!</span>
              </div>
              
              <div className="card border-2 border-dashed border-success bg-base-50 p-6 rounded-box">
                <h3 className="font-bold text-lg mb-2">🎫 Gafete Digital 🎫</h3>
                <div className="text-left bg-base-200 p-4 rounded-lg mb-4">
                  <p><strong>Alumno:</strong> <span className="text-gray-600">{email}</span></p>
                  <p><strong>Folio verificado:</strong> <span className="text-gray-600">{folio}</span></p>
                </div>
                <button className="btn btn-success text-white w-full" onClick={() => alert("Descargando archivo...")}>
                  📥 Descargar Material
                </button>
              </div>
            </div>
          )}

          {/* VISTA 4: Rechazado */}
          {estatus === 'Rechazado' && (
            <div className="w-full py-4">
              <div className="alert alert-error shadow-lg mb-4 text-white flex justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span>Acceso Denegado</span>
              </div>
              <p className="text-gray-500 mb-6">El folio ingresado no es válido, ya fue utilizado o no ha sido procesado.</p>
              <button className="btn btn-outline btn-error w-full" onClick={() => setEstatus('idle')}>
                Intentar de nuevo
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default App;