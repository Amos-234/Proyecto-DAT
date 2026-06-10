-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 10-06-2026 a las 19:05:08
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `telecom_db`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detalles_pedido`
--

CREATE TABLE `detalles_pedido` (
  `id` int(11) NOT NULL,
  `pedido_id` int(11) NOT NULL,
  `producto_id` int(11) NOT NULL,
  `cantidad` int(11) NOT NULL,
  `precio_unitario` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

--
-- Volcado de datos para la tabla `detalles_pedido`
--

INSERT INTO `detalles_pedido` (`id`, `pedido_id`, `producto_id`, `cantidad`, `precio_unitario`) VALUES
(1, 1, 3, 1, 150.00),
(2, 2, 7, 2, 4500.00),
(3, 2, 9, 3, 199.00),
(4, 2, 10, 2, 45.00),
(5, 2, 3, 1, 150.00),
(6, 3, 3, 1, 150.00),
(7, 3, 4, 1, 120.00),
(8, 4, 2, 1, 379.99),
(9, 5, 4, 1, 120.00),
(10, 5, 3, 1, 150.00),
(11, 6, 3, 1, 150.00),
(12, 7, 4, 1, 120.00),
(13, 8, 3, 1, 150.00),
(14, 9, 4, 1, 120.00),
(15, 10, 3, 1, 150.00),
(16, 10, 4, 1, 120.00),
(17, 10, 6, 1, 45.00),
(18, 11, 3, 1, 150.00),
(19, 11, 4, 2, 120.00),
(20, 12, 2, 2, 379.99),
(21, 13, 3, 1, 150.00),
(22, 13, 2, 1, 379.99),
(23, 13, 1, 1, 390.00),
(24, 13, 8, 1, 110.00),
(25, 13, 9, 1, 199.00),
(31, 17, 3, 1, 150.00),
(32, 17, 4, 3, 120.00),
(33, 17, 7, 1, 4500.00),
(34, 17, 8, 1, 110.00),
(35, 18, 10, 1, 45.00),
(36, 18, 8, 1, 110.00),
(37, 18, 5, 1, 450.00),
(38, 19, 4, 3, 120.00),
(39, 19, 3, 1, 150.00),
(40, 20, 3, 2, 150.00),
(41, 21, 3, 2, 150.00),
(42, 22, 2, 2, 379.99),
(43, 23, 6, 1, 45.00),
(44, 24, 2, 1, 379.99),
(45, 25, 1, 3, 390.00),
(46, 26, 4, 1, 120.00),
(47, 26, 7, 1, 4500.00),
(48, 26, 8, 1, 110.00),
(49, 27, 7, 1, 4500.00),
(50, 28, 4, 1, 120.00),
(51, 28, 6, 1, 45.00),
(52, 29, 9, 1, 199.00),
(53, 30, 2, 1, 379.99),
(54, 31, 3, 2, 150.00),
(55, 31, 6, 3, 45.00),
(56, 32, 3, 1, 150.00),
(57, 32, 6, 1, 45.00),
(58, 33, 4, 1, 120.00);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `lista_deseos`
--

CREATE TABLE `lista_deseos` (
  `usuario_id` int(11) NOT NULL,
  `producto_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

--
-- Volcado de datos para la tabla `lista_deseos`
--

INSERT INTO `lista_deseos` (`usuario_id`, `producto_id`) VALUES
(2, 1),
(2, 2),
(18, 3),
(18, 6),
(18, 8),
(18, 10),
(18, 12);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pedidos`
--

CREATE TABLE `pedidos` (
  `id` int(11) NOT NULL,
  `usuario_id` int(11) DEFAULT NULL,
  `total` decimal(10,2) NOT NULL,
  `estado` varchar(50) DEFAULT 'Procesando',
  `fecha_pedido` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

--
-- Volcado de datos para la tabla `pedidos`
--

INSERT INTO `pedidos` (`id`, `usuario_id`, `total`, `estado`, `fecha_pedido`) VALUES
(1, 3, 181.50, 'Completado', '2026-05-20 14:25:23'),
(2, 3, 11902.77, 'Completado', '2026-05-20 14:28:15'),
(3, 3, 326.70, 'Completado', '2026-05-20 14:47:33'),
(4, 3, 459.79, 'Completado', '2026-05-20 14:50:55'),
(5, 3, 326.70, 'Completado', '2026-05-20 16:35:43'),
(6, 5, 181.50, 'Completado', '2026-05-20 19:21:21'),
(7, 5, 145.20, 'Completado', '2026-05-20 19:24:15'),
(8, 5, 181.50, 'Completado', '2026-05-20 19:50:25'),
(9, 5, 145.20, 'Completado', '2026-05-20 20:00:44'),
(10, 6, 381.15, 'Completado', '2026-05-20 22:08:56'),
(11, 2, 471.90, 'Completado', '2026-05-21 11:32:22'),
(12, 5, 919.58, 'Completado', '2026-05-21 13:23:57'),
(13, 5, 1487.08, 'Completado', '2026-05-21 13:24:29'),
(17, NULL, 6195.20, 'Completado', '2026-05-21 14:57:56'),
(18, NULL, 732.05, 'Completado', '2026-05-21 14:58:13'),
(19, NULL, 617.10, 'Completado', '2026-05-21 15:08:58'),
(20, NULL, 363.00, 'Completado', '2026-05-21 15:10:01'),
(21, 5, 363.00, 'Completado', '2026-05-21 15:21:41'),
(22, 5, 919.58, 'Completado', '2026-05-21 15:32:55'),
(23, NULL, 54.45, 'Completado', '2026-05-21 16:20:20'),
(24, 5, 459.79, 'Completado', '2026-05-21 17:35:47'),
(25, 5, 1415.70, 'Completado', '2026-05-21 17:40:44'),
(26, NULL, 5723.30, 'Completado', '2026-05-21 18:51:07'),
(27, 2, 5445.00, 'Completado', '2026-05-22 10:04:00'),
(28, NULL, 199.65, 'Completado', '2026-05-22 11:45:58'),
(29, NULL, 240.79, 'Completado', '2026-05-22 11:46:23'),
(30, 18, 459.79, 'Completado', '2026-06-09 17:01:39'),
(31, 18, 526.35, 'Completado', '2026-06-10 16:07:14'),
(32, 18, 235.95, 'Completado', '2026-06-10 17:01:19'),
(33, 5, 145.20, 'Completado', '2026-06-10 17:02:16');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `productos`
--

CREATE TABLE `productos` (
  `id` int(11) NOT NULL,
  `nombre` varchar(150) NOT NULL,
  `marca` varchar(50) NOT NULL,
  `categoria` varchar(50) NOT NULL,
  `stock` int(11) NOT NULL DEFAULT 10,
  `precio` decimal(10,2) NOT NULL,
  `precio_original` decimal(10,2) DEFAULT NULL,
  `imagen` varchar(255) NOT NULL,
  `descripcion` text NOT NULL,
  `descripcion_detallada` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

--
-- Volcado de datos para la tabla `productos`
--

INSERT INTO `productos` (`id`, `nombre`, `marca`, `categoria`, `stock`, `precio`, `precio_original`, `imagen`, `descripcion`, `descripcion_detallada`) VALUES
(1, 'Switch Cisco Catalyst 2960-X 24 GigE', 'Cisco', 'Switches', 2, 390.00, 450.00, '/Proyecto-DAT/frontend/assets/img/products/Switch Cisco Catalyst 2960-X 24 GigE.jpg', 'Switch gestionable de 24 puertos Gigabit con 4 enlaces ascendentes SFP. Ideal para acceso empresarial.', 'El Cisco Catalyst 2960-X es un switch de acceso de clase empresarial que combina rendimiento y eficiencia energética excepcional. Dispone de 24 puertos Gigabit Ethernet 10/100/1000 y 4 ranuras de enlace ascendente SFP de 1G para conectividad de fibra. Es compatible con el apilamiento FlexStack-Plus, permitiendo gestionar hasta 8 switches bajo una única IP con un ancho de banda de apilamiento de 80 Gbps. Integra el sistema operativo Cisco IOS LAN Base, ofreciendo capacidades avanzadas de administración de tráfico, calidad de servicio (QoS) y seguridad perimetral de capa 2.'),
(2, 'Ubiquiti UniFi Switch 24 PoE', 'Ubiquiti', 'Switches', 2, 379.99, NULL, '/Proyecto-DAT/frontend/assets/img/products/Ubiquiti UniFi Switch 24 PoE.jpg', 'Switch PoE+ de 24 puertos con refrigeración silenciosa y gestión centralizada UniFi.', 'Switch gestionable de alto rendimiento perteneciente al ecosistema Ubiquiti UniFi. Cuenta con un total de 24 puertos Gigabit RJ45, de los cuales 16 integran tecnología PoE+ con detección automática (IEEE 802.3at) para alimentar cámaras IP, puntos de acceso y teléfonos VoIP. Dispone de 2 puertos SFP de 1G dedicados para enlaces troncales de fibra óptica. Su chasis metálico sin ventilador garantiza un funcionamiento 100% silencioso, ideal para oficinas. Incluye una pantalla táctil LCM de 1.3 pulgadas que muestra información de estado en tiempo real.'),
(3, 'MikroTik Cloud Router Switch 326', 'MikroTik', 'Switches', 0, 150.00, 185.50, '/Proyecto-DAT/frontend/assets/img/products/MikroTik Cloud Router Switch 326.jpg', 'Switch de 24 puertos Gigabit Ethernet y 2 puertos SFP+ para conectividad 10G.', 'El MikroTik CRS326-24G-2S+RM es un switch router de alto rendimiento con capacidad de arranque dual (Dual Boot), lo que permite al administrador elegir entre el sistema simplificado SwOS o el avanzado RouterOS de nivel 5. Está equipado con 24 puertos Gigabit Ethernet y 2 jaulas SFP+ dedicadas para transceptores de 10 Gbps, eliminando cuellos de botella en redes de almacenamiento o enlaces troncales. Su diseño en rack de 1U de perfil frío gestiona eficientemente el consumo eléctrico, procesando tramas de velocidad de línea sin bloqueos.'),
(4, 'TP-Link JetStream 16-Port Gigabit', 'TP-Link', 'Switches', 6, 120.00, NULL, '/Proyecto-DAT/frontend/assets/img/products/TP-Link JetStream 16-Port Gigabit.jpg', 'Switch Smart Managed ideal para pymes con opciones avanzadas de VLAN y QoS.', 'Switch Gigabit inteligente (Smart Managed) idóneo para pequeñas y medianas empresas que buscan un control granular sin la complejidad de la gama alta corporativa. Ofrece 16 puertos Gigabit Ethernet autonegociables y se integra en la plataforma Omada SDN para una gestión centralizada en la nube. Cuenta con potentes funciones de capa 2 y capa 2+ como enrutamiento estático, inspección IGMP, listas de control de acceso (ACL), seguridad de puerto estricta y priorización de tráfico de voz y vídeo (QoS).'),
(5, 'Switch Aruba Instant On 1930 48G', 'Aruba', 'Switches', 12, 450.00, 510.00, '/Proyecto-DAT/frontend/assets/img/products/Switch Aruba Instant On 1930 48G.jpg', 'Switch de 48 puertos Gigabit gestionado por nube para pequeñas empresas.', 'Switch gestionado desde la nube diseñado para pymes de alta densidad. Cuenta con 48 puertos Gigabit Ethernet de cobre y 4 ranuras SFP+ que ofrecen enlaces ascendentes de alta velocidad a 10 Gbps para servidores de almacenamiento o agregación. Su administración se realiza de forma gratuita a través del portal Instant On o la aplicación móvil de Aruba, ofreciendo funciones de seguridad avanzadas como prevención de ataques DoS, autenticación de doble factor y segmentación de red mediante VLANs configurables en segundos.'),
(6, 'Netgear ProSAFE 8-Port Gigabit', 'Netgear', 'Switches', 0, 45.00, NULL, '/Proyecto-DAT/frontend/assets/img/products/Netgear ProSAFE 8-Port Gigabit.jpg', 'Switch no gestionable Plug-and-Play de carcasa metálica.', 'El Netgear GS108 es el switch no gestionado por excelencia para despliegues rápidos en escritorios corporativos, salas de juntas o sistemas domésticos exigentes. Alberga 8 puertos Gigabit en un chasis metálico robusto de alta disipación térmica pasiva sin ventilador. Soporta priorización de tráfico 802.1p automática por hardware (QoS) para asegurar llamadas fluidas e incorpora tecnología Green Ethernet para un consumo optimizado y un ahorro energético inteligente.'),
(7, 'Cisco Nexus 93180YC-EX', 'Cisco', 'Switches', 3, 4500.00, NULL, '/Proyecto-DAT/frontend/assets/img/products/Cisco Nexus 93180YC-EX.jpg', 'Switch de centro de datos de ultra baja latencia con 48 puertos 10/25G.', 'Switch de alto rendimiento diseñado específicamente para entornos de centros de datos, computación en la nube y redes corporativas troncales de ultra baja latencia. Ofrece 48 puertos SFP+ con soporte para velocidades de 1G, 10G y 25G, complementado con 6 puertos QSFP+ capaces de operar a 40G y 100G de velocidad nativa. Puede desplegarse utilizando el sistema operativo estándar industrial Cisco NX-OS o en modo de infraestructura centrada en aplicaciones (ACI) para arquitecturas de SDN avanzadas.'),
(8, 'Ubiquiti EdgeSwitch 10XP', 'Ubiquiti', 'Switches', 2, 110.00, 135.00, '/Proyecto-DAT/frontend/assets/img/products/Ubiquiti EdgeSwitch 10XP.jpg', 'Switch PoE de 8 puertos Gigabit diseñado para implementaciones WISP.', 'Switch inteligente optimizado para proveedores de servicios inalámbricos (WISP) o infraestructuras locales medianas. Integra 8 puertos Gigabit RJ45 con salida de PoE pasivo configurable de 24V a través de su interfaz gráfica avanzada de EdgeOS, eliminando la necesidad de inyectores individuales para tus antenas inalámbricas. Incluye 2 puertos SFP para enlaces ascendentes de fibra óptica, protección contra descargas electrostáticas (ESD) y un potente software de monitorización de consumo.'),
(9, 'Router Ubiquiti EdgeRouter 4', 'Ubiquiti', 'Routers', 7, 199.00, NULL, '/Proyecto-DAT/frontend/assets/img/products/Router Ubiquiti EdgeRouter 4.jpg', 'Router avanzado con capacidad de enrutamiento de 3.4 millones de paquetes por segundo.', 'Router empresarial avanzado equipado con un procesador de 4 núcleos a 1 GHz y 1 GB de memoria RAM DDR3, ofreciendo un rendimiento asombroso de hasta 3.4 millones de paquetes por segundo (pps). Dispone de 3 puertos Gigabit RJ45 independientes y 1 ranura SFP dedicada para fibra óptica. Su sistema EdgeOS permite configuraciones complejas de enrutamiento estático, OSPF, BGP, cortafuegos basado en zonas (Zone-Based Firewall) y avanzadas políticas de calidad de servicio (QoS).'),
(10, 'MikroTik hEX RB750Gr3', 'MikroTik', 'Routers', 0, 45.00, 59.90, '/Proyecto-DAT/frontend/assets/img/products/MikroTik hEX RB750Gr3.jpg', 'Pequeño router de 5 puertos Gigabit con cifrado IPsec por hardware.', 'El MikroTik hEX (RB750Gr3) es un potente router Gigabit de cinco puertos diseñado para ubicaciones donde no se requiere conectividad inalámbrica. Cuenta con un potente procesador de doble núcleo a 880 MHz y soporte completo para aceleración de cifrado por hardware IPsec (~470 Mbps). Incluye una ranura para tarjetas microSD optimizada para almacenamiento de bases de datos de red, un puerto USB estándar y el robusto sistema operativo RouterOS con licencia de nivel 4.'),
(11, 'Cisco ISR 4321', 'Cisco', 'Routers', 19, 850.00, NULL, '/Proyecto-DAT/frontend/assets/img/products/Cisco ISR 4321.jpg', 'Router de servicios integrados para sucursales corporativas.', 'Router de servicios integrados (ISR) diseñado para sucursales corporativas medianas que exigen un entorno seguro, escalable y modular. Ofrece un rendimiento de reenvío escalable por software de 50 Mbps a 100 Mbps. Cuenta con 2 puertos WAN/LAN integrados en combo fibra/cobre y ranuras NIM para tarjetas de expansión. Incorpora de fábrica Cisco IOS-XE, proporcionando capacidades de SD-WAN inteligente, inspección profunda de paquetes y cortafuegos avanzado.'),
(12, 'TP-Link Omada ER605', 'TP-Link', 'Routers', 1, 55.00, 65.00, '/Proyecto-DAT/frontend/assets/img/products/TP-Link Omada ER605.jpg', 'Router VPN Gigabit Multi-WAN seguro y gestionable por software.', 'Router VPN Gigabit profesional con capacidades Multi-WAN que permite equilibrar la carga de hasta 3 conexiones de internet independientes de forma simultánea. Soporta múltiples protocolos VPN de alta velocidad como IPsec, PPTP, L2TP y OpenVPN, garantizando túneles de teletrabajo seguros y encriptados. Se integra al 100% en la plataforma Omada SDN, facilitando su monitorización y aprovisionamiento remoto desde un panel centralizado.'),
(13, 'Ubiquiti UniFi Dream Machine Pro', 'Ubiquiti', 'Routers', 3, 410.00, NULL, '/Proyecto-DAT/frontend/assets/img/products/Ubiquiti UniFi Dream Machine Pro.jpg', 'Gateway de seguridad empresarial todo en uno y controlador de red.', 'Consola de seguridad y puerta de enlace empresarial todo en uno que unifica un firewall de última generación con inspección IPS/IDS de 3.5 Gbps, un switch gestionado de 8 puertos Gigabit y un controlador UniFi integrado. Incluye una bahía de expansión interna para discos duros de 3.5 pulgadas, permitiendo almacenar grabaciones de vídeo del sistema de CCTV UniFi Protect. Dispone de un puerto WAN SFP+ de 10G y un puerto LAN SFP+ de 10G para máxima velocidad troncal.'),
(14, 'MikroTik CCR1009-7G-1C', 'MikroTik', 'Routers', 19, 380.00, 450.00, '/Proyecto-DAT/frontend/assets/img/products/MikroTik CCR1009-7G-1C.jpg', 'Cloud Core Router de grado industrial con CPU de 9 núcleos.', 'Router industrial de grado operador equipado con una CPU TILERA de 9 núcleos a 1.2 GHz. Incorpora 7 puertos Gigabit Ethernet, 1 puerto Combo (configurable por software como SFP o RJ45) y 1 jaula SFP+ para transceptores de 10 Gbps. Su arquitectura cuenta con canales independientes conectados directamente a la CPU, garantizando un reenvío de tramas a velocidad de línea pura con un rendimiento masivo de hasta 8 Gbps reales de filtrado.'),
(15, 'Cisco Meraki MX64', 'Cisco', 'Routers', 0, 520.00, NULL, '/Proyecto-DAT/frontend/assets/img/products/Cisco Meraki MX64.jpg', 'Appliance de seguridad y SD-WAN gestionado en la nube al 100%.', 'Appliance de seguridad perimetral SD-WAN administrado de forma 100% centralizada a través de la interfaz web de Cisco Meraki. Cuenta con un rendimiento de cortafuegos de inspección de estado de 250 Mbps y capacidad para hasta 50 clientes simultáneos de forma estable. Ofrece aprovisionamiento automático de VPN (Auto VPN) entre sedes, filtrado de contenido web, prevención de intrusiones mediante el motor Cisco Snort y actualizaciones automáticas de firmware desde la nube.'),
(16, 'Fortinet FortiGate 40F', 'Fortinet', 'Firewalls', 7, 480.00, NULL, '/Proyecto-DAT/frontend/assets/img/products/Fortinet FortiGate 40F.jpg', 'Appliance NGFW (Next-Generation Firewall) ideal para oficinas remotas.', 'Next-Generation Firewall (NGFW) compacto diseñado para oficinas remotas o delegaciones comerciales medianas. Ofrece un rendimiento de firewall excepcional de 5 Gbps y una protección contra amenazas avanzada de hasta 600 Mbps gracias a su coprocesador dedicado SOC4 de Fortinet. Proporciona capacidades de SD-WAN segura para optimizar costes de red y un filtrado profundo que detiene el malware, exploits y conexiones web maliciosas en tiempo real.'),
(17, 'Palo Alto Networks PA-410', 'Palo Alto', 'Firewalls', 11, 850.00, 950.00, '/Proyecto-DAT/frontend/assets/img/products/Palo Alto Networks PA-410.jpg', 'Firewall con machine learning integrado para prevenir amenazas de día cero.', 'Firewall de próxima generación (NGFW) basado en Machine Learning integrado de forma nativa en el hardware para detener amenazas de día cero antes de que infecten la red. Dispone de un rendimiento de cortafuegos de 1 Gbps y una arquitectura patentada de procesamiento en un solo paso (SP3), la cual analiza el tráfico de aplicaciones (App-ID), usuarios (User-ID) y contenido (Content-ID) de forma simultánea sin degradar la latencia de la red.'),
(18, 'Sophos XGS 116', 'Sophos', 'Firewalls', 8, 580.00, 620.00, '/Proyecto-DAT/frontend/assets/img/products/Sophos XGS 116.jpg', 'Protección perimetral avanzada con arquitectura Xstream.', 'Appliance de seguridad perimetral avanzado con arquitectura de doble procesador Xstream, que incorpora un motor dedicado a la aceleración de aplicaciones críticas y al descifrado profundo de tráfico TLS 1.3 sin sacrificar velocidad. Cuenta con un rendimiento de firewall de 7.7 Gbps y una tasa de protección de amenazas avanzada de 685 Mbps, ideal para proteger redes frente al ransomware y ataques dirigidos.'),
(19, 'Cisco Firepower 1010', 'Cisco', 'Firewalls', 4, 780.00, NULL, '/Proyecto-DAT/frontend/assets/img/products/Cisco Firepower 1010.jpg', 'Defensa contra amenazas superior orientada a Pymes.', 'Cisco Firepower 1010 es un cortafuegos de próxima generación (NGFW) orientado a Pymes y comercios que buscan seguridad de nivel corporativo. Ofrece un rendimiento de inspección de malware y control de aplicaciones de 650 Mbps. Destaca por incorporar un switch interno de 8 puertos Gigabit Ethernet, de los cuales dos puertos ofrecen soporte PoE+ para alimentar dispositivos externos, unificando red LAN y seguridad en un único dispositivo.'),
(20, 'Fortinet FortiGate 60F', 'Fortinet', 'Firewalls', 0, 750.00, NULL, '/Proyecto-DAT/frontend/assets/img/products/Fortinet FortiGate 60F.jpg', 'Firewall de alto rendimiento con SD-WAN segura.', 'Firewall de próxima generación de alto rendimiento para sedes empresariales medianas. Con un rendimiento de filtrado de cortafuegos de 10 Gbps y 700 Mbps con todos los servicios de protección contra amenazas activados (IPS, Antivirus, Control de Aplicaciones). Su procesador de red patentado FortiASIC permite un descifrado SSL ultra veloz y proporciona funciones avanzadas de SD-WAN segura para proteger enlaces MPLS o de banda ancha directa.'),
(21, 'WatchGuard Firebox T20', 'Genérico', 'Firewalls', 8, 290.00, 340.00, '/Proyecto-DAT/frontend/assets/img/products/WatchGuard Firebox T20.jpg', 'Seguridad de red de nivel empresarial para pequeñas oficinas.', 'El WatchGuard Firebox T20 es un appliance de seguridad compacto de sobremesa diseñado para proteger redes de pequeñas oficinas, comercios y entornos de teletrabajadores de alta responsabilidad. Ofrece un rendimiento de firewall base de 1.7 Gbps. Al activarse la suscripción Total Security Suite, proporciona servicios robustos de antivirus en la nube, prevención de intrusiones (IPS), bloqueo de spam y sandboxing de archivos sospechosos.'),
(22, 'Ubiquiti UniFi AP AC Pro', 'Ubiquiti', 'Access Points', 110, 145.00, NULL, '/Proyecto-DAT/frontend/assets/img/products/Ubiquiti UniFi AP AC Pro.jpg', 'Punto de acceso dual-band 802.11ac para interiores y exteriores.', 'Punto de acceso Wi-Fi 5 (802.11ac) de alta gama diseñado para despliegues empresariales de densidad media-alta tanto en interiores como en exteriores protegidos. Cuenta con tecnología MIMO 3x3 en ambas bandas, alcanzando velocidades combinadas de hasta 1750 Mbps (1300 Mbps en 5GHz y 450 Mbps en 2.4GHz). Alberga dos puertos Gigabit Ethernet (con soporte de agregación) y se alimenta mediante PoE estándar 802.3af o 802.3at.'),
(23, 'Aruba Instant On AP22', 'Aruba', 'Access Points', 12, 165.00, NULL, '/Proyecto-DAT/frontend/assets/img/products/Aruba Instant On AP22.jpg', 'Access Point Wi-Fi 6 (802.11ax) de alto rendimiento.', 'Access Point Wi-Fi 6 (802.11ax) certificado que ofrece velocidades de transferencia ultra rápidas y menor latencia en entornos corporativos o comerciales saturados de dispositivos. Su antena interna MIMO 2x2 ofrece transmisiones de hasta 1.2 Gbps en la banda de 5 GHz. Cuenta con soporte nativo de Smart Mesh para extender la red de forma inalámbrica y se gestiona al 100% de forma remota a través de la nube gratuita de Aruba Instant On.'),
(24, 'Cisco Meraki MR46', 'Cisco', 'Access Points', 4, 790.00, 890.00, '/Proyecto-DAT/frontend/assets/img/products/Cisco Meraki MR46.jpg', 'AP Wi-Fi 6 gestionado en la nube, optimizado para alta densidad.', 'Punto de acceso empresarial Wi-Fi 6 de la gama más alta de Cisco Meraki, diseñado para entornos de altísima densidad como universidades, hospitales u oficinas masivas. Dispone de una arquitectura de antenas 4x4:4 MU-MIMO y una cuarta radio dedicada por completo a la seguridad inalámbrica (WIDS/WIPS en tiempo real) y optimización de radiofrecuencia. Incorpora un puerto Multi-Gigabit de 2.5 Gbps para evitar cuellos de botella.'),
(25, 'TP-Link Omada EAP225', 'TP-Link', 'Access Points', 8, 65.00, NULL, '/Proyecto-DAT/frontend/assets/img/products/TP-Link Omada EAP225.jpg', 'Punto de acceso de montaje en techo Gigabit Inalámbrico MU-MIMO.', 'Punto de acceso Wi-Fi 5 para montaje en techo o pared que proporciona conectividad inalámbrica estable a un coste muy competitivo para empresas. Ofrece velocidades de hasta 1350 Mbps gracias a su tecnología inalámbrica MU-MIMO de doble banda. Es compatible con alimentación PoE estándar 802.3af y PoE pasivo de 24V. Se gestiona de forma unificada en la nube de Omada para configuraciones automatizadas de portales cautivos.'),
(26, 'Ubiquiti UniFi U6 Lite', 'Ubiquiti', 'Access Points', 0, 99.00, 110.00, '/Proyecto-DAT/frontend/assets/img/products/Ubiquiti UniFi U6 Lite.jpg', 'Punto de acceso Wi-Fi 6 compacto para despliegues masivos.', 'Punto de acceso inalámbrico Wi-Fi 6 de formato ultracompacto y perfil bajo, ideal para despliegues masivos estéticos en hogares inteligentes o pequeñas oficinas corporativas. Su tecnología 2x2 MU-MIMO de alta eficiencia le permite procesar flujos de datos agregados de hasta 1.5 Gbps de forma concurrente. Se alimenta exclusivamente por PoE (802.3af) y es compatible con el catálogo de carcasas decorativas UniFi nanoHD.'),
(27, 'MikroTik cAP ac', 'MikroTik', 'Access Points', 11, 75.00, NULL, '/Proyecto-DAT/frontend/assets/img/products/MikroTik cAP ac.jpg', 'AP de doble banda que pasa desapercibido en el techo.', 'El cAP ac de MikroTik es un punto de acceso de techo inalámbrico potente y discreto que se mimetiza con el entorno urbano de oficinas. Soporta doble banda concurrente Wi-Fi 5 (802.11ac) y cuenta con una CPU de cuatro núcleos a 716 MHz. Destaca por incorporar dos puertos Gigabit Ethernet independientes; el segundo puerto ofrece salida de PoE pasivo para encadenar y alimentar un segundo dispositivo (como una cámara IP) sin cables extra.'),
(28, 'Aruba AP-515', 'Aruba', 'Access Points', 6, 450.00, NULL, '/Proyecto-DAT/frontend/assets/img/products/Aruba AP-515.jpg', 'AP de campus de alto rendimiento para entornos móviles e IoT.', 'Punto de acceso Wi-Fi 6 corporativo diseñado para entornos universitarios y de grandes corporaciones que hacen un uso intensivo de dispositivos móviles y elementos de IoT. Incorpora radios de hardware integradas de Bluetooth 5 y Zigbee para servicios de localización en interiores y domótica avanzada. Cuenta con el algoritmo inteligente ClientMatch de Aruba para redirigir automáticamente los clientes al AP con mejor señal.'),
(29, 'Netgear WAX610', 'Netgear', 'Access Points', 12, 125.00, 155.00, '/Proyecto-DAT/frontend/assets/img/products/Netgear WAX610.jpg', 'Punto de acceso Insight Managed WiFi 6 AX1800.', 'Punto de acceso profesional Wi-Fi 6 AX1800 gestionable de forma local o remota a través de la aplicación en la nube Netgear Insight (incluye un año de suscripción de prueba). Cuenta con un puerto de red de alta velocidad a 2.5 Gbps (Multi-Gigabit), lo que permite aprovechar al máximo la velocidad del estándar inalámbrico Wi-Fi 6, soportando hasta 8 redes inalámbricas independientes (SSID) protegidas con WPA3.'),
(30, 'Ubiquiti LiteBeam 5AC Gen2', 'Ubiquiti', 'Antenas', 7, 65.00, NULL, '/Proyecto-DAT/frontend/assets/img/products/Ubiquiti LiteBeam 5AC Gen2.jpg', 'CPE airMAX ac ultra ligero de largo alcance y alta directividad.', 'El LiteBeam 5AC Gen2 es un dispositivo CPE de exterior diseñado para enlaces troncales inalámbricos de larga distancia (PtP) o conexiones de abonado (PtMP) en la banda de 5 GHz. Combina una directividad de antena excepcional de 23 dBi con la avanzada tecnología propietaria airMAX ac para mitigar el ruido ambiental. Incluye una radio Wi-Fi secundaria de 2.4 GHz dedicada exclusivamente a la gestión y configuración móvil desde la app UISP.'),
(31, 'MikroTik SXTsq Lite5', 'MikroTik', 'Antenas', 3, 39.00, 49.00, '/Proyecto-DAT/frontend/assets/img/products/MikroTik SXTsq Lite5.jpg', 'Dispositivo inalámbrico compacto para enlaces punto a punto o como CPE.', 'Dispositivo inalámbrico compacto y ligero para exteriores de la serie SXT de MikroTik, equipado con una antena de panel integrada de 16 dBi que opera en la frecuencia de 5 GHz. Es ideal para enlaces inalámbricos punto a punto de corta-media distancia (hasta 4-5 km en línea de vista limpia) o como unidad receptora CPE para clientes de proveedores de internet inalámbricos (WISP), todo gestionado por RouterOS.'),
(32, 'Ubiquiti NanoStation Loco M5', 'Ubiquiti', 'Antenas', 0, 55.00, NULL, '/Proyecto-DAT/frontend/assets/img/products/Ubiquiti NanoStation Loco M5.jpg', 'CPE versátil y de bajo coste para redes ISP inalámbricas.', 'Un clásico de la conectividad inalámbrica exterior de Ubiquiti de bajo coste y alta robustez industrial. Cuenta con una antena integrada de doble polarización de 13 dBi en la banda de 5 GHz con un aislamiento de polarización cruzada optimizado. Su factor de forma plano es ideal para montajes rápidos en mástiles de clientes residenciales o comerciales dentro de celdas de distribución inalámbrica Multi-Punto.'),
(33, 'Ubiquiti airFiber 5XHD', 'Ubiquiti', 'Antenas', 2, 420.00, NULL, '/Proyecto-DAT/frontend/assets/img/products/Ubiquiti airFiber 5XHD.jpg', 'Radio de backhaul de 5 GHz diseñada específicamente para WISP.', 'Radio de backhaul inalámbrico punto a punto puro de grado operador (Carrier Class). Diseñada específicamente para enlaces troncales de larga distancia (superiores a 100 km con antenas parabólicas externas), ofrece una eficiencia espectral asombrosa de hasta 21.2 bps/Hz y procesa más de 2 millones de paquetes por segundo. Basado en el chip propietario LTU de Ubiquiti, ofrece filtrado activo frente a interferencias extremas.'),
(34, 'MikroTik LDF 5', 'MikroTik', 'Antenas', 12, 45.00, NULL, '/Proyecto-DAT/frontend/assets/img/products/MikroTik LDF 5.jpg', 'Sistema inalámbrico con antena parabólica para enlaces extremadamente largos.', 'El Lite Dish Feed (LDF) es un ingenioso sistema inalámbrico de exterior diseñado para ser acoplado directamente en el brazo o foco de soporte de cualquier antena parabólica de televisión por satélite común (tipo offset). La parábola actúa como un amplificador natural gigante, multiplicando la potencia de su antena interna de 9 dBi hasta alcanzar ganancias superiores a los 30 dBi para realizar enlaces transprovinciales.'),
(35, 'TP-Link CPE510', 'TP-Link', 'Antenas', 23, 40.00, 48.00, '/Proyecto-DAT/frontend/assets/img/products/TP-Link CPE510.jpg', 'CPE Inalámbrico de Exterior a 5GHz 300Mbps 13dBi.', 'Estación base inalámbrica para exteriores de TP-Link que opera a 5 GHz y ofrece velocidades estables de hasta 300 Mbps. Integra una antena direccional bipolarizada de alta ganancia de 13 dBi. Su software de control Pharos incorpora la tecnología propietaria MAXtream TDMA (Acceso Múltiple por División de Tiempo), la cual optimiza el rendimiento y minimiza las colisiones de paquetes cuando se conectan múltiples abonados lejanos.'),
(36, 'Bobina Cable UTP Cat6 305m', 'Genérico', 'Cableado', 8, 75.00, 95.00, '/Proyecto-DAT/frontend/assets/img/products/Bobina Cable UTP Cat6 305m.jpg', 'Cable de par trenzado sin apantallar de cobre 100% puro.', 'Bobina de cable de red de categoría 6 sin apantallar (UTP - Unshielded Twisted Pair) en formato rígido (Solid Wire) con una longitud total de 305 metros. Los conductores están fabricados en cobre puro al 100% con un calibre de 24 AWG, separados internamente por una cruceta de polietileno para reducir la diafonía (crosstalk). Certificado para transmisiones estables de Gigabit Ethernet en tramos de hasta 90 metros continuos.'),
(37, 'Bobina Cable FTP Cat6a 305m', 'Genérico', 'Cableado', 5, 145.00, NULL, '/Proyecto-DAT/frontend/assets/img/products/Bobina Cable FTP Cat6a 305m.jpg', 'Cable apantallado para redes de 10 Gigabit, alta resistencia a interferencias.', 'Bobina de cable de par trenzado apantallado (FTP) categoría 6A de cobre sólido de alta calidad para infraestructuras exigentes. Cuenta con una lámina de aluminio global que envuelve los pares trenzados para proporcionar un blindaje total contra interferencias electromagnéticas externas y diafonía exógena (Alien Crosstalk). Diseñado para soportar transferencias de datos masivas de hasta 10 Gbps a frecuencias de 500 MHz.'),
(38, 'Latiguillo Fibra Óptica LC-LC 5m', 'Genérico', 'Cableado', 0, 15.50, NULL, '/Proyecto-DAT/frontend/assets/img/products/Latiguillo Fibra Óptica LC-LC 5m.jpg', 'Latiguillo de fibra multimodo dúplex 50/125 OM3.', 'Cable de parcheo o latiguillo de fibra óptica dúplex multimodo de categoría OM3 con conectores de clip LC-LC pulidos en ambos extremos. Los núcleos de fibra de 50/125 micras están optimizados para transmisiones láser de corto alcance, soportando anchos de banda masivos de 10 Gigabit, 40 Gigabit y 100 Gigabit en centros de datos. Su cubierta exterior es libre de halógenos (LSZH) para una seguridad total contra incendios.'),
(39, 'Latiguillo Fibra SC-APC 10m', 'Genérico', 'Cableado', 0, 9.00, 12.00, '/Proyecto-DAT/frontend/assets/img/products/Latiguillo Fibra SC-APC 10m.jpg', 'Latiguillo monomodo ideal para instalaciones de fibra óptica hasta el hogar (FTTH).', 'Latiguillo de fibra óptica monomodo (OS2) simplex de 10 metros de longitud equipado con conectores SC en ambos extremos, pulidos bajo el estándar APC (Angled Physical Contact) a 8 grados en color verde. Este pulido inclinado reduce drásticamente las pérdidas por retorno de señal, haciendo que este cable sea la solución ideal para acometidas domésticas de fibra óptica hasta el hogar (FTTH) o redes de distribución GPON.'),
(40, 'Cable DAC SFP+ 10G 1m', 'Cisco', 'Cableado', 12, 35.00, NULL, '/Proyecto-DAT/frontend/assets/img/products/Cable DAC SFP+ 10G 1m.jpg', 'Cable Twinax de conexión directa (DAC) para enlaces de cortísima distancia.', 'Cable de cobre de conexión directa pasivo (DAC - Direct Attach Copper) de 1 metro de longitud con conectores SFP+ soldados integrados en ambos extremos. Ofrece una tasa de transferencia de datos pura de 10 Gbps con un consumo eléctrico prácticamente nulo y latencias ultra bajas. Es el estándar industrial idóneo para interconectar servidores, cabezales de almacenamiento y switches adyacentes ubicados en el mismo armario rack.'),
(41, 'Pack 10 Latiguillos UTP Cat6 1m', 'Genérico', 'Cableado', 6, 18.00, NULL, '/Proyecto-DAT/frontend/assets/img/products/Pack 10 Latiguillos UTP Cat6 1m.jpg', 'Latiguillos de red RJ45 en varios colores para parcheo de armarios.', 'Conjunto profesional de 10 cables de parcheo flexibles multifilamento de categoría 6 UTP con una longitud de 1 metro cada uno. Los conectores RJ45 incorporan pines chapados en oro para garantizar la mejor conectividad y botas moldeadas con protectores de pestaña anti-enganche. El pack incluye un surtido cromático variado (azul, rojo, verde, amarillo, negro) para facilitar la organización visual de armarios de conexiones.'),
(42, 'Armario Rack Mural 19\" 9U', 'Genérico', 'Racks', 12, 85.00, NULL, '/Proyecto-DAT/frontend/assets/img/products/Armario Rack Mural 19_ 9U.jpg', 'Armario de pared perfecto para pequeñas instalaciones de red o CCTV.', 'Armario rack metálico de 19 pulgadas optimizado para anclaje mural en pared, con una altura útil de 9 unidades (9U) y una profundidad de 450 mm. Su puerta frontal está fabricada en cristal templado de seguridad con cerradura de llave integrada. Cuenta con paneles laterales desmontables mediante clips rápidos para facilitar el acceso técnico, perfiles de montaje con numeración grabada y ranuras preparadas para instalar ventiladores.'),
(43, 'Armario Rack Suelo 19\" 42U', 'Genérico', 'Racks', 1, 390.00, 450.00, '/Proyecto-DAT/frontend/assets/img/products/Armario Rack Suelo 19_ 42U.jpg', 'Armario de pie para servidores y equipamiento de red pesado, con ventilación.', 'Rack de suelo estándar industrial de 42 unidades de altura (42U), diseñado para albergar servidores pesados, sistemas de almacenamiento masivo y equipamiento de redes troncales de gran envergadura. Sus dimensiones de base son de 600 mm de ancho por 1000 mm de fondo. Su chasis de acero laminado en frío soporta hasta 800 kg de peso estático, y cuenta con puertas delantera y trasera microperforadas al 75% para maximizar el flujo de aire.'),
(44, 'Bandeja Fija Rack 19\" 1U', 'Genérico', 'Racks', 0, 22.00, NULL, '/Proyecto-DAT/frontend/assets/img/products/Bandeja Fija Rack 19_ 1U.jpg', 'Bandeja perforada para soportar routers no enrackables o monitores.', 'Bandeja metálica fija perforada de 1 unidad de altura (1U) para montaje en armarios rack estándar de 19 pulgadas. Tiene una profundidad universal de 350 mm y cuenta con un sistema de anclaje frontal rígido mediante 4 puntos de fijación con tornillería de rack estándar. Está construida en chapa de acero de alta resistencia con acabado en pintura texturizada negra antiarañazos, ideal para soportar routers u otros accesorios no enrackables.'),
(45, 'Regleta PDU 8 Tomas Rack 19\"', 'Genérico', 'Racks', 13, 35.00, NULL, '/Proyecto-DAT/frontend/assets/img/products/Regleta PDU 8 Tomas Rack 19_.jpg', 'Unidad de distribución de energía con interruptor para armarios.', 'Unidad de distribución de energía eléctrica (PDU) de formato horizontal de 1U para montaje en perfiles de rack de 19 pulgadas. Incorpora un total de 8 tomas de corriente tipo Schuko estándar alemán dispuestas a 45 grados para facilitar la inserción de fuentes de alimentación. Incluye un interruptor general luminoso de seguridad protegido contra pulsaciones accidentales, un cable de alimentación resistente de 2 metros y chasis de aluminio.'),
(46, 'Panel de Parcheo 24 Puertos Cat6', 'Genérico', 'Racks', 15, 30.00, 45.00, '/Proyecto-DAT/frontend/assets/img/products/Panel de Parcheo 24 Puertos Cat6.jpg', 'Patch panel vacío para inserción de módulos Keystone (Jack).', 'Panel de parcheo (Patch Panel) de 24 puertos RJ45 de categoría 6 diseñado para montaje horizontal en racks de 1U de altura. Los bloques de impacto traseros son compatibles con herramientas tipo Krone o 110 e incorporan códigos de color estándar T568A y T568B para evitar fallos de crimpado. Incluye una robusta barra de gestión metálica trasera desmontable que soporta el peso de los cables individuales mediante bridas para evitar tensiones.'),
(47, 'GuíaCables 1U con Tapa', 'Genérico', 'Racks', 26, 15.00, NULL, '/Proyecto-DAT/frontend/assets/img/products/GuíaCables 1U con Tapa.jpg', 'Organizador de cables frontal para un armario rack más ordenado.', 'Organizador de cableado pasacables horizontal de 1 unidad de altura (1U) con diseño frontal de ranuras tipo peine en plástico flexible de alta durabilidad y una tapa metálica frontal extraíble a presión. Oculta de forma elegante el excedente de longitud de los latiguillos de red que van desde los switches hacia los paneles de parcheo, protegiendo los radios de curvatura de los cables y confiriendo un acabado impecable al armario rack.'),
(48, 'Módulo SFP 1G Base-T Cobre', 'Ubiquiti', 'Accesorios', 22, 25.00, NULL, '/Proyecto-DAT/frontend/assets/img/products/Módulo SFP 1G Base-T Cobre.jpg', 'Transceptor SFP a RJ45 para distancias de hasta 100m.', 'Transceptor modular enchufable de factor de forma pequeño (SFP) que convierte una ranura de interfaz óptica SFP libre en un puerto de red de cobre RJ45 Gigabit Ethernet tradicional (10/100/1000 Mbps). Soporta enlaces de red de cobre con una longitud máxima de hasta 100 metros utilizando cable de par trenzado estándar Cat6. Dispone de un mecanismo de extracción de clip metálico seguro y es compatible con conexión en caliente (Hot-Pluggable).'),
(49, 'Módulo SFP+ 10G SR Multimodo', 'Cisco', 'Accesorios', 7, 75.00, 95.00, '/Proyecto-DAT/frontend/assets/img/products/Módulo SFP+ 10G SR Multimodo.jpg', 'Transceptor óptico para cortas distancias (hasta 300m sobre fibra OM3).', 'Módulo transceptor óptico SFP+ de corto alcance (SR - Short Reach) capaz de operar a una velocidad nativa de transferencia de datos de 10 Gbps. Emite a una longitud de onda de 850 nm sobre infraestructura de cableado de fibra óptica multimodo, logrando distancias de enlace de hasta 300 metros sobre fibra OM3 dúplex estándar. Cuenta con un conector LC dúplex y soporte de monitorización de diagnóstico digital (DDM) en tiempo real.'),
(50, 'Inyector PoE+ 30W Gigabit', 'TP-Link', 'Accesorios', 36, 22.00, NULL, '/Proyecto-DAT/frontend/assets/img/products/Inyector PoE+ 30W Gigabit.jpg', 'Inyector de energía a través de Ethernet para alimentar APs y cámaras.', 'Dispositivo inyector de corriente sobre Ethernet (PoE+) de alta potencia capaz de inyectar hasta 30 vatios de energía eléctrica sobre un cable de red Cat6 sin degradar la velocidad de datos Gigabit de línea. Cumple con los estándares internacionales IEEE 802.3af e IEEE 802.3at, lo que le permite alimentar de forma segura dispositivos remotos tales como cámaras PTZ de vigilancia, puntos de acceso Wi-Fi 6 de alta gama o pantallas multimedia.');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `resenas`
--

CREATE TABLE `resenas` (
  `id` int(11) NOT NULL,
  `usuario_id` int(11) NOT NULL,
  `producto_id` int(11) NOT NULL,
  `puntuacion` tinyint(1) NOT NULL CHECK (`puntuacion` >= 1 and `puntuacion` <= 5),
  `comentario` text DEFAULT NULL,
  `fecha_resena` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

--
-- Volcado de datos para la tabla `resenas`
--

INSERT INTO `resenas` (`id`, `usuario_id`, `producto_id`, `puntuacion`, `comentario`, `fecha_resena`) VALUES
(1, 5, 3, 5, 'esto es la mayor mierda que me he comprado en mi vida.\nMuy descontento. \n:(', '2026-05-21 16:53:34'),
(2, 2, 1, 1, 'No  vuelvo a comprar nada de xisco. Menuda estafa!!!', '2026-05-22 08:59:20'),
(3, 2, 3, 1, 'Concuerdo Con amos, este producto es una ruina. Horrible experiencia', '2026-05-22 09:00:12'),
(4, 18, 3, 5, 'Encantadísima con el Cloud Router Switch 326 de Microtik, muy buen trabajo por parte de la empresa!!', '2026-05-22 09:02:59'),
(6, 18, 8, 3, 'Decent, però amb marge de millora. Els ports estaven bruts', '2026-06-09 16:57:32');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `fecha_registro` timestamp NOT NULL DEFAULT current_timestamp(),
  `rol` varchar(20) DEFAULT NULL,
  `telefono` varchar(20) DEFAULT NULL COMMENT 'Teléfono de contacto',
  `direccion` varchar(255) DEFAULT NULL COMMENT 'Calle, número, piso...',
  `codigo_postal` varchar(10) DEFAULT NULL COMMENT 'CP (4-5 dígitos)',
  `ciudad` varchar(100) DEFAULT NULL COMMENT 'Ciudad de envío'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `nombre`, `email`, `password`, `fecha_registro`, `rol`, `telefono`, `direccion`, `codigo_postal`, `ciudad`) VALUES
(2, 'Julia González Bestard', 'juliagbes@gmail.com', '$2y$10$RKFXSwqMkUqtoY86X8pNGeA9sxEy/S3H22ETJgwLaCc2T2lQvBWei', '2026-05-20 13:54:32', 'usuario', NULL, NULL, NULL, NULL),
(3, 'Pau Brunet Garcia', 'paubrunetgarcia@gmail.com', '$2y$10$Bg/ojIZFKsyUhrxWPfbaFulz8Cl2Ws7nD8/hnMxe.OvOQbDR8pSDO', '2026-05-20 13:56:14', 'admin', NULL, NULL, NULL, NULL),
(5, 'Amos Ciocan', 'amos@gmail.com', '$2y$10$Gl6cVkJpy9mGdvbhKeU86uI3XeoVDoKVPnDiyk./T3coPth/.iph2', '2026-05-20 19:20:58', 'admin', NULL, NULL, NULL, NULL),
(6, 'Carlos Ruíz García', 'carlitos2001@gmail.com', '$2y$10$USW3oMHf9VQ.AqImSH9DR.Y.MleoU.HD7E6u0EvkNZYNqG6T2uoya', '2026-05-20 22:08:04', 'usuario', '600 600 600', 'c/Gabriel Alomar n15', '07111', 'Palma'),
(8, 'Juanjo González', 'juango@gmail.com', '$2y$10$f/F8Gqrda70xEW7SJp8Zw.oamvTCvftf3dJLwq2Q.th6QGlGcZXVq', '2026-05-21 14:27:17', 'usuario', '+41 898989898', NULL, NULL, NULL),
(10, 'Six Seven', 'skibidi@toilet.com', '$2y$10$eY8PHmN7j5a8U/YHt9Ytvu6QHDnvdJsA0YMeb1seHDuH9H9srzM3q', '2026-05-21 14:55:46', 'usuario', '676767777', NULL, NULL, NULL),
(15, 'ams', 'ams@gmail.com', '$2y$10$4YOHQpv4muzMiM4cZN5HVOyrK5MU0meEye9gGPjPsSTzRvBXBOEhm', '2026-05-21 17:33:35', 'usuario', NULL, NULL, NULL, NULL),
(16, 'amos234', 'amos234@gmail.com', '$2y$10$7g27NlcEGwaQPyzBwX9oT.tdunMReVGNFC1hZxbFr4nK6FLBxBeQu', '2026-05-21 17:33:58', 'usuario', NULL, NULL, NULL, NULL),
(18, 'Rosa Pericàs', 'rosa@gmail.com', '$2y$10$UT6qlGPpeLcriUX9V3C1fuiRttTwywY7QwaQhfndoq3xOGrxp/F4S', '2026-05-22 09:01:35', 'usuario', '676767676', 'Carrer Estacio', '07110', 'Bunyola');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `detalles_pedido`
--
ALTER TABLE `detalles_pedido`
  ADD PRIMARY KEY (`id`),
  ADD KEY `pedido_id` (`pedido_id`),
  ADD KEY `producto_id` (`producto_id`);

--
-- Indices de la tabla `lista_deseos`
--
ALTER TABLE `lista_deseos`
  ADD PRIMARY KEY (`usuario_id`,`producto_id`),
  ADD KEY `producto_id` (`producto_id`);

--
-- Indices de la tabla `pedidos`
--
ALTER TABLE `pedidos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `usuario_id` (`usuario_id`);

--
-- Indices de la tabla `productos`
--
ALTER TABLE `productos`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `resenas`
--
ALTER TABLE `resenas`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unica_resena` (`usuario_id`,`producto_id`),
  ADD KEY `resenas_ibfk_2` (`producto_id`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `detalles_pedido`
--
ALTER TABLE `detalles_pedido`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=59;

--
-- AUTO_INCREMENT de la tabla `pedidos`
--
ALTER TABLE `pedidos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT de la tabla `productos`
--
ALTER TABLE `productos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=57;

--
-- AUTO_INCREMENT de la tabla `resenas`
--
ALTER TABLE `resenas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `detalles_pedido`
--
ALTER TABLE `detalles_pedido`
  ADD CONSTRAINT `detalles_pedido_ibfk_1` FOREIGN KEY (`pedido_id`) REFERENCES `pedidos` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `detalles_pedido_ibfk_2` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id`);

--
-- Filtros para la tabla `lista_deseos`
--
ALTER TABLE `lista_deseos`
  ADD CONSTRAINT `lista_deseos_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `lista_deseos_ibfk_2` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `pedidos`
--
ALTER TABLE `pedidos`
  ADD CONSTRAINT `pedidos_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL;

--
-- Filtros para la tabla `resenas`
--
ALTER TABLE `resenas`
  ADD CONSTRAINT `resenas_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `resenas_ibfk_2` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
