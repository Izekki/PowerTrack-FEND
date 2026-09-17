import dispositivosIcon from "../../assets/sidebar-icons/dispositivos.png";
import botonMasIcon from "../../assets/sidebar-icons/boton-mas.png";
import graficoIcon from "../../assets/sidebar-icons/grafico.png";
import ajusteIcon from "../../assets/sidebar-icons/ajuste.png";
import avatarIcon from "../../assets/sidebar-icons/avatar.png";
import alertaIcon from "../../assets/sidebar-icons/alerta.png";
import homeIcon from "../../assets/sidebar-icons/home.png";

export const helpMockData = [
  {
    id: "dispositivos",
    title: "Dispositivos",
    items: [
      {
        title: "Cómo agregar un dispositivo nuevo",
        description: "Añade nuevos medidores o dispositivos de consumo a tu cuenta.",
        steps: [
          {
            text: "Dirígete a la sección de **Dispositivos** en el menú de navegación lateral.",
            image: dispositivosIcon
          },
          {
            text: "Haz clic en el botón **Agregar Dispositivo** (+) ubicado en la barra de herramientas.",
            image: botonMasIcon
          },
          "Introduce los detalles obligatorios: nombre, tipo de dispositivo (monofásico o trifásico) y su ubicación física.",
          "Asocia un sensor disponible de la lista y haz clic en **Guardar** para finalizar el registro."
        ]
      },
      {
        title: "Cómo editar un dispositivo",
        description: "Actualiza la información básica o la vinculación de sensores de un dispositivo.",
        steps: [
          {
            text: "Ve a la sección **Dispositivos** en el menú lateral y localiza la tarjeta del equipo que deseas cambiar.",
            image: dispositivosIcon
          },
          "Haz clic en el botón naranja **Editar** (icono de lápiz) en la esquina superior derecha de la tarjeta.",
          "Modifica los campos necesarios como el nombre del dispositivo, la ubicación o reasigna un sensor diferente.",
          "Guarda los cambios haciendo clic en el botón **Guardar cambios**."
        ]
      },
      {
        title: "Cómo eliminar un dispositivo",
        description: "Remueve de forma permanente un dispositivo de tu panel y detén su telemetría.",
        steps: [
          {
            text: "En la vista de **Dispositivos**, identifica el dispositivo que deseas eliminar.",
            image: dispositivosIcon
          },
          "Haz clic en el botón rojo **Eliminar** (icono de papelera) en su tarjeta.",
          "Confirma la acción en la ventana emergente de seguridad. Esta acción no se puede deshacer y borrará los históricos asociados."
        ]
      },
      {
        title: "Cómo asignar un sensor",
        description: "Vincula un sensor físico de telemetría a tu dispositivo virtual para iniciar la lectura de datos.",
        steps: [
          {
            text: "Desde la página de **Dispositivos**, pulsa el botón **Editar** en el dispositivo correspondiente.",
            image: dispositivosIcon
          },
          "Despliega el selector en el campo **Sensor Asociado**.",
          "Selecciona el identificador único de tu sensor físico disponible en la lista.",
          "Guarda los cambios. En unos segundos, el dispositivo comenzará a reflejar el consumo en tiempo real."
        ]
      }
    ]
  },
  {
    id: "grupos",
    title: "Grupos",
    items: [
      {
        title: "Cómo agregar un grupo",
        description: "Crea agrupaciones lógicas de dispositivos para realizar monitoreos conjuntos de áreas de tu hogar o negocio.",
        steps: [
          {
            text: "Ve a la sección **Dispositivos** y baja hasta el bloque de **Grupos**.",
            image: dispositivosIcon
          },
          {
            text: "Haz clic en el botón **Crear Nuevo Grupo**.",
            image: botonMasIcon
          },
          "Asigna un nombre descriptivo al grupo (por ejemplo, 'Primer Piso' o 'Electrodomésticos Cocina').",
          "Marca las casillas de los dispositivos que quieres agrupar y haz clic en **Guardar**."
        ]
      },
      {
        title: "Cómo editar un grupo",
        description: "Modifica el nombre o la lista de dispositivos de un grupo existente.",
        steps: [
          {
            text: "En la sección de **Grupos** de la página de **Dispositivos**, presiona el botón **Editar** (icono de lápiz) en la tarjeta del grupo.",
            image: dispositivosIcon
          },
          "Cambia el nombre si lo deseas o agrega/retira dispositivos marcando o desmarcando sus casillas.",
          "Presiona **Guardar** para confirmar las modificaciones."
        ]
      },
      {
        title: "Cómo eliminar un grupo",
        description: "Elimina un grupo sin afectar los dispositivos que contenía.",
        steps: [
          {
            text: "Ubica el grupo que deseas eliminar en la pantalla de **Dispositivos**.",
            image: dispositivosIcon
          },
          "Haz clic en el botón **Eliminar** (icono de papelera) en su tarjeta.",
          "Confirma que deseas disolver el grupo. Los dispositivos asociados volverán a mostrarse individualmente en la lista general."
        ]
      }
    ]
  },
  {
    id: "inicio",
    title: "Inicio",
    items: [
      {
        title: "Cómo agregar widgets",
        description: "Agrega módulos dinámicos al panel principal para visualizar resúmenes rápidos.",
        steps: [
          {
            text: "En la pantalla de **Inicio** (Dashboard), haz clic en el botón **Personalizar Panel**.",
            image: homeIcon
          },
          "Selecciona un widget disponible (como 'Resumen de Consumo', 'Dispositivos Activos' o 'Gráfico Semanal').",
          "Haz clic en **Añadir al panel** y arrástralo a la posición de tu preferencia."
        ]
      },
      {
        title: "Cómo eliminar widgets",
        description: "Remueve widgets innecesarios de tu pantalla de inicio.",
        steps: [
          {
            text: "En la pantalla de **Inicio**, pulsa el botón de configuración o edición del panel.",
            image: homeIcon
          },
          "Haz clic en la **X** o en el botón de eliminar situado en la esquina superior del widget que deseas quitar.",
          "Confirma los cambios para actualizar tu diseño de panel."
        ]
      }
    ]
  },
  {
    id: "accesibilidad",
    title: "Accesibilidad",
    items: [
      {
        title: "Cómo cambiar opciones de accesibilidad",
        description: "Adapta la visualización de la plataforma para mejorar la legibilidad y contraste.",
        steps: [
          {
            text: "Haz clic en **Configuración** en el menú de navegación lateral.",
            image: ajusteIcon
          },
          "Ingresa al apartado de **Accesibilidad** o **Contraste**.",
          "Selecciona uno de los modos disponibles: Contraste Normal, Alto Contraste o Muy Alto Contraste.",
          "El sistema aplicará los nuevos colores y tamaños de fuente inmediatamente sin necesidad de recargar la página."
        ]
      }
    ]
  },
  {
    id: "consumo",
    title: "Consumo",
    items: [
      {
        title: "Cómo ver detalles de consumo",
        description: "Visualiza gráficos de telemetría de corriente, voltaje y potencia en tiempo real.",
        steps: [
          {
            text: "Ingresa a la sección **Consumo** a través del menú de navegación lateral.",
            image: graficoIcon
          },
          "Elige el dispositivo o el grupo que deseas analizar en el selector superior.",
          "Interactúa con los gráficos y cuadros de estadísticas para ver las curvas de demanda activa."
        ]
      },
      {
        title: "Cómo ver reportes",
        description: "Consulta resúmenes semanales, mensuales o históricos acumulados.",
        steps: [
          {
            text: "Ve a la pestaña de **Consumo**.",
            image: graficoIcon
          },
          "Desplázate hacia abajo hasta la sección de **Historial y Reportes**.",
          "Filtra los datos seleccionando el rango de fechas de interés (ej. 'Este mes', 'Últimos 3 meses')."
        ]
      },
      {
        title: "Cómo generar reportes",
        description: "Exporta un informe de tu consumo eléctrico en formato PDF listo para imprimir o enviar.",
        steps: [
          {
            text: "En la sección de **Consumo**, haz clic en el botón **Generar Reporte**.",
            image: graficoIcon
          },
          "Configura los parámetros del reporte: rango de fechas y dispositivos específicos.",
          "Haz clic en **Descargar PDF** para guardar el documento generado en tu dispositivo local."
        ]
      }
    ]
  },
  {
    id: "perfil",
    title: "Perfil",
    items: [
      {
        title: "Cómo editar correo",
        description: "Cambia el correo electrónico principal utilizado para iniciar sesión y recibir notificaciones.",
        steps: [
          {
            text: "Ve a la sección **Mi Perfil** (icono de Avatar) en la navegación lateral.",
            image: avatarIcon
          },
          "Haz clic en el campo de **Correo Electrónico** o en el botón de edición contiguo.",
          "Digita tu nueva dirección de correo electrónico.",
          "Haz clic en **Guardar**. Se enviará una confirmación a la nueva dirección."
        ]
      },
      {
        title: "Cómo cambiar contraseña",
        description: "Actualiza tu contraseña periódicamente para mantener tu cuenta protegida.",
        steps: [
          {
            text: "Dirígete al apartado de **Mi Perfil**.",
            image: avatarIcon
          },
          "Selecciona la opción **Cambiar Contraseña**.",
          "Escribe tu contraseña actual para validación.",
          "Ingresa la nueva contraseña, repítela en el campo de confirmación y haz clic en **Actualizar Contraseña**."
        ]
      },
      {
        title: "Cómo cambiar proveedor",
        description: "Actualiza tu empresa proveedora de energía para ajustar el cálculo estimado del costo eléctrico.",
        steps: [
          {
            text: "Ingresa a **Mi Perfil**.",
            image: avatarIcon
          },
          "Localiza el campo de **Proveedor de Electricidad**.",
          "Selecciona tu proveedor de la lista desplegable (ej. CNFL, ICE, JASEC, ESPH) o ingresa la tarifa manual por kWh.",
          "Guarda los cambios para recalcular las proyecciones de gasto."
        ]
      },
      {
        title: "Cómo editar nombre",
        description: "Modifica el nombre y apellido del titular que se muestra en el panel de bienvenida.",
        steps: [
          {
            text: "Entra a **Mi Perfil**.",
            image: avatarIcon
          },
          "Edita el campo de texto con tu **Nombre Completo**.",
          "Haz clic en **Guardar cambios** para refrescar la cabecera del portal."
        ]
      }
    ]
  },
  {
    id: "alertas",
    title: "Alertas",
    items: [
      {
        title: "Cómo configurar alertas",
        description: "Configura límites de consumo para recibir notificaciones cuando se detecten excesos.",
        steps: [
          {
            text: "Ve a la sección **Alertas** y haz clic en **Configurar Alertas**.",
            image: alertaIcon
          },
          "Establece un umbral de potencia máxima permitida en kilovatios (kW) o límite de costo diario.",
          "Activa las casillas de notificaciones (por correo o alertas en pantalla).",
          "Haz clic en **Guardar Límites** para iniciar la vigilancia en tiempo real."
        ]
      }
    ]
  },
  {
    id: "cuenta",
    title: "Cuenta",
    items: [
      {
        title: "Cómo registrar un nuevo usuario",
        description: "Crea una nueva cuenta de usuario en la aplicación PowerTrack.",
        steps: [
          "Desde la pantalla de inicio de sesión, haz clic en **¿No tienes una cuenta? Haz clic aquí**.",
          "Completa todos los campos del formulario: Nombre Completo, Correo, Proveedor Eléctrico y Contraseña.",
          "Acepta los términos y haz clic en **Registrarse**. Ahora podrás iniciar sesión con las credenciales creadas."
        ]
      },
      {
        title: "Validaciones básicas en formularios",
        description: "Comprende las reglas de validación necesarias al rellenar campos en la aplicación.",
        steps: [
          "El **correo electrónico** debe incluir un símbolo `@` y un dominio válido (ej. nombre@correo.com).",
          "La **contraseña** de registro exige un mínimo de 8 caracteres, conteniendo al menos un número y letras.",
          "Los **campos numéricos** de telemetría no aceptan letras ni valores negativos.",
          "Los errores de validación se mostrarán en rojo bajo cada campo antes de que puedas enviar la información."
        ]
      }
    ]
  }
];
