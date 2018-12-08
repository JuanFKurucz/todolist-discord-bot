-- phpMyAdmin SQL Dump
-- version 4.7.9
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Dec 08, 2018 at 02:12 AM
-- Server version: 5.7.21
-- PHP Version: 7.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `todolist-bot`
--

-- --------------------------------------------------------

--
-- Table structure for table `activity`
--

DROP TABLE IF EXISTS `activity`;
CREATE TABLE IF NOT EXISTS `activity` (
  `id_activity` int(11) NOT NULL AUTO_INCREMENT,
  `description` varchar(350) NOT NULL,
  `date` varchar(15) NOT NULL,
  `id_user` varchar(20) NOT NULL,
  `completed` int(1) DEFAULT NULL,
  `date_completion` varchar(15) DEFAULT NULL,
  `id_message` varchar(30) DEFAULT NULL,
  `id_channel` varchar(30) DEFAULT NULL,
  `id_server` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`id_activity`)
) ENGINE=MyISAM AUTO_INCREMENT=12 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `activity`
--

INSERT INTO `activity` (`id_activity`, `description`, `date`, `id_user`, `completed`, `date_completion`, `id_message`, `id_channel`, `id_server`) VALUES
(10, 'sample activity', '1544061309419', '162355874570960896', NULL, NULL, '520056080584409088', '519704135319289856', '509053465016795147'),
(11, 'fucked up activity', '1544061672206', '162355874570960896', NULL, NULL, '520057601996619807', '519704135319289856', '509053465016795147');

-- --------------------------------------------------------

--
-- Table structure for table `activity_requires`
--

DROP TABLE IF EXISTS `activity_requires`;
CREATE TABLE IF NOT EXISTS `activity_requires` (
  `id_activity` int(11) NOT NULL,
  `requires_activity` int(11) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `task`
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
) ENGINE=MyISAM AUTO_INCREMENT=7 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `task`
--

INSERT INTO `task` (`id_task`, `title`, `description`, `completed`, `id_activity`, `date_completion`, `id_user`, `number`) VALUES
(2, '', 'sample task 1', NULL, 10, NULL, NULL, 0),
(3, '', 'sample task 1', NULL, 10, NULL, NULL, 1),
(4, '', 'fucked up task', NULL, 11, NULL, NULL, 0),
(5, '', 'fucked up task twooo', NULL, 11, NULL, NULL, 1),
(6, '', 'fucked up task threeee', NULL, 11, NULL, NULL, 2);

-- --------------------------------------------------------

--
-- Table structure for table `task_requires`
--

DROP TABLE IF EXISTS `task_requires`;
CREATE TABLE IF NOT EXISTS `task_requires` (
  `id_task` int(11) NOT NULL,
  `requires_task` int(11) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
CREATE TABLE IF NOT EXISTS `user` (
  `id_user` varchar(20) NOT NULL,
  `permission` int(11) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id_user`, `permission`) VALUES
('162355874570960896', 1);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
