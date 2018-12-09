-- phpMyAdmin SQL Dump
-- version 4.7.9
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1:3306
-- Tiempo de generación: 09-12-2018 a las 03:51:42
-- Versión del servidor: 5.7.21
-- Versión de PHP: 5.6.35

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `todolist-bot`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `activity`
--

DROP TABLE IF EXISTS `activity`;
CREATE TABLE IF NOT EXISTS `activity` (
  `id_activity` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(350) NOT NULL,
  `description` varchar(350) DEFAULT NULL,
  `date` varchar(15) NOT NULL,
  `id_user` varchar(20) NOT NULL,
  `completed` int(1) DEFAULT NULL,
  `date_completion` varchar(15) DEFAULT NULL,
  `id_message` varchar(30) DEFAULT NULL,
  `id_channel` varchar(30) DEFAULT NULL,
  `id_server` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`id_activity`)
) ENGINE=MyISAM AUTO_INCREMENT=17 DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `activity`
--

INSERT INTO `activity` (`id_activity`, `title`, `description`, `date`, `id_user`, `completed`, `date_completion`, `id_message`, `id_channel`, `id_server`) VALUES
(16, 'Sample activity title', NULL, '1544323371424', '162355874570960896', NULL, NULL, '521154713908150282', '509053465549340672', '509053465016795147');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `activity_requires`
--

DROP TABLE IF EXISTS `activity_requires`;
CREATE TABLE IF NOT EXISTS `activity_requires` (
  `id_activity` int(11) NOT NULL,
  `requires_activity` int(11) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `task`
--

DROP TABLE IF EXISTS `task`;
CREATE TABLE IF NOT EXISTS `task` (
  `id_task` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(350) NOT NULL,
  `description` varchar(350) DEFAULT NULL,
  `completed` int(1) DEFAULT NULL,
  `id_activity` int(11) NOT NULL,
  `date_completion` varchar(15) DEFAULT NULL,
  `id_user` varchar(20) DEFAULT NULL,
  `number` int(11) NOT NULL,
  PRIMARY KEY (`id_task`)
) ENGINE=MyISAM AUTO_INCREMENT=8 DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `task_requires`
--

DROP TABLE IF EXISTS `task_requires`;
CREATE TABLE IF NOT EXISTS `task_requires` (
  `id_task` int(11) NOT NULL,
  `requires_task` int(11) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `user`
--

DROP TABLE IF EXISTS `user`;
CREATE TABLE IF NOT EXISTS `user` (
  `id_user` varchar(20) NOT NULL,
  `permission` int(11) NOT NULL,
  PRIMARY KEY (`id_user`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `user`
--

INSERT INTO `user` (`id_user`, `permission`) VALUES
('162355874570960896', 1);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
