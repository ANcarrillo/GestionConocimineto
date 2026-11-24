import { useState } from 'react'
import { api } from '../../api'
import { Cargando, MensajeError, Modal, etiqueta, fechaHora, useCarga } from '../../components/ui'
import { t } from '../../i18n'
import FormUsuario from './FormUsuario'

export default function Usuarios() {
  const [modal, setModal] = useState(null)
  const { datos, error, cargando, recargar } = useCarga(() => api.get('/usuarios'))
  const programas = useCarga(() => api.get('/catalogos/programas'))

  return (
    <>
      <div className="titulo-pagina"><h1>{t('Usuarios')}</h1><button className="btn" onClick={() => setModal({})}>+ {t('Nuevo usuario')}</button></div>
      <MensajeError mensaje={error} />
      {cargando && !datos ? <Cargando /> : (
        <div className="tarjeta tabla-scroll">
          <table className="tabla">
            <thead><tr><th>{t('Nombre')}</th><th>{t('Correo')}</th><th>{t('Rol')}</th><th>{t('Programas')}</th><th>{t('Estado')}</th><th>{t('Último acceso')}</th><th></th></tr></thead>
            <tbody>{datos?.map(u => (
              <tr key={u.id}><td>{u.nombres} {u.apellidos}</td><td>{u.email}</td><td>{etiqueta(u.rol.nombre)}</td>
                <td>{u.programas.map(p => p.codigo).join(', ') || t('Todos')}</td>
                <td>{u.activo ? t('Activo') : t('Inactivo')}</td><td>{fechaHora(u.ultimo_acceso)}</td>
                <td><button className="btn btn-sec btn-peq" onClick={() => setModal(u)}>{t('Editar')}</button></td></tr>
            ))}</tbody>
          </table>
        </div>
      )}
      <Modal titulo={modal?.id ? t('Editar usuario') : t('Nuevo usuario')} abierto={!!modal} onCerrar={() => setModal(null)}>
        {modal && <FormUsuario inicial={modal.id ? modal : null} programas={programas.datos || []} onGuardado={() => { setModal(null); recargar() }} />}
      </Modal>
    </>
  )
}
