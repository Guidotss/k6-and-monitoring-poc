# K6 Observability Stack

Un stack completo de observabilidad para pruebas de carga usando K6, InfluxDB y Grafana.

## 🚀 Descripción

Esta aplicación proporciona una solución completa para realizar pruebas de carga y monitorear el rendimiento en tiempo real. La stack incluye:

- **K6**: Generador de carga que ejecuta pruebas de rendimiento
- **InfluxDB**: Base de datos de series temporales para almacenar métricas
- **Grafana**: Dashboard para visualizar métricas en tiempo real

## 🛠️ Componentes

### K6 (Load Generator)
- **Puerto**: 8081
- **Configuración**: 5 usuarios virtuales durante 60 segundos
- **Target**: https://test.k6.io
- **Funcionalidad**: Ejecuta pruebas de carga y envía métricas a InfluxDB

### InfluxDB (Time Series Database)
- **Puerto**: 8086
- **Base de datos**: <tu_base_de_datos>
- **Funcionalidad**: Almacena métricas de rendimiento en tiempo real

### Grafana (Dashboard)
- **Puerto**: 3001
- **Funcionalidad**: Visualización de métricas y dashboards en tiempo real
- **Credenciales**: Configuradas mediante variables de entorno

## 📋 Prerrequisitos

- Docker
- Docker Compose
- Variables de entorno configuradas

## ⚙️ Configuración

### 1. Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```bash
# Grafana Configuration
GF_SECURITY_ADMIN_USER=admin
GF_SECURITY_ADMIN_PASSWORD=admin123

# InfluxDB Configuration
INFLUXDB_DB=grafana
INFLUXDB_USER=admin
INFLUXDB_PASSWORD=admin123
```

### 2. Estructura del Proyecto

```
k6-observability-stack/
├── docker-compose.yml
├── k6/
│   └── test.js
├── architecture_diagram.svg
└── README.md
```

## 🚀 Instalación y Uso

### 1. Clonar el repositorio

```bash
git clone <repository-url>
cd k6-observability-stack
```

### 2. Configurar variables de entorno

```bash
cp .env.example .env
# Editar .env con tus credenciales
```

### 3. Ejecutar la aplicación

```bash
docker-compose up -d
```

### 4. Acceder a los servicios

- **Grafana Dashboard**: http://localhost:3001
  - Usuario: admin
  - Contraseña: admin123 (o la configurada en .env)

- **InfluxDB**: http://localhost:8086
  - Base de datos: grafana

## 📈 Configuración de Grafana

### 1. Configurar fuente de datos InfluxDB

1. Accede a Grafana en http://localhost:3001
2. Ve a **Configuration** → **Data Sources**
3. Agrega una nueva fuente de datos **InfluxDB**
4. Configuración:
   - **URL**: http://influxdb:8086
   - **Database**: grafana
   - **User**: admin
   - **Password**: admin123

### 2. Importar dashboards

Puedes importar dashboards predefinidos para K6 o crear los tuyos propios.

## 🧪 Ejecutar Pruebas de Carga

### Modificar el script de prueba

Edita `k6/test.js` para personalizar tus pruebas:

```javascript
import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  vus: 5,        // Número de usuarios virtuales
  duration: '60s', // Duración de la prueba
};

export default function () {
  let res = http.get('https://test.k6.io'); // Tu endpoint
  check(res, {
    'status is 200': (r) => r.status === 200,
  });
  sleep(1);
}
```

### Ejecutar pruebas

```bash
# Ejecutar con Docker Compose
docker-compose up k6

# O ejecutar K6 directamente
docker run -i --rm -v $(pwd)/k6:/scripts grafana/k6 run /scripts/test.js
```

## 📊 Métricas Disponibles

Las siguientes métricas se recopilan automáticamente:

- **Tiempo de respuesta** (p50, p90, p95, p99)
- **Throughput** (requests por segundo)
- **Error rate** (porcentaje de errores)
- **Virtual users** (usuarios concurrentes)
- **Data transfer** (bytes enviados/recibidos)

## 🔧 Personalización

### Cambiar el endpoint de prueba

Edita `k6/test.js` y modifica la URL:

```javascript
// Cambiar de:
let res = http.get('https://test.k6.io');

// A tu endpoint:
let res = http.get('http://tu-aplicacion.com/api');
```

### Ajustar parámetros de carga

```javascript
export let options = {
  vus: 10,           // Más usuarios virtuales
  duration: '5m',    // Prueba más larga
  stages: [          // Prueba por etapas
    { duration: '2m', target: 10 },
    { duration: '5m', target: 10 },
    { duration: '2m', target: 0 },
  ],
};
```

## 🐛 Troubleshooting

### Problemas comunes

1. **Grafana no puede conectar a InfluxDB**
   - Verifica que InfluxDB esté corriendo: `docker-compose ps`
   - Revisa los logs: `docker-compose logs influxdb`

2. **K6 no envía métricas**
   - Verifica la configuración de salida en `docker-compose.yml`
   - Revisa los logs: `docker-compose logs k6`

3. **Puertos ocupados**
   - Cambia los puertos en `docker-compose.yml`
   - Verifica qué servicios usan los puertos: `lsof -i :3001`

### Logs útiles

```bash
# Ver logs de todos los servicios
docker-compose logs

# Ver logs de un servicio específico
docker-compose logs grafana
docker-compose logs influxdb
docker-compose logs k6
```

## 📚 Recursos Adicionales

- [K6 Documentation](https://k6.io/docs/)
- [InfluxDB Documentation](https://docs.influxdata.com/)
- [Grafana Documentation](https://grafana.com/docs/)
