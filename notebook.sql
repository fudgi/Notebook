-- phpMyAdmin SQL Dump
-- version 4.0.10deb1
-- http://www.phpmyadmin.net
--
-- Хост: localhost
-- Время создания: Фев 26 2019 г., 06:39
-- Версия сервера: 5.5.49-0ubuntu0.14.04.1
-- Версия PHP: 5.5.9-1ubuntu4.16

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- База данных: `notebook`
--

-- --------------------------------------------------------

--
-- Структура таблицы `note_data`
--

CREATE TABLE IF NOT EXISTS `note_data` (
  `note_id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `note_name` varchar(20) NOT NULL,
  `note_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `note_content` text,
  `user_id` bigint(20) unsigned DEFAULT NULL,
  PRIMARY KEY (`note_id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=50 ;

--
-- Дамп данных таблицы `note_data`
--

INSERT INTO `note_data` (`note_id`, `note_name`, `note_date`, `note_content`, `user_id`) VALUES
(4, 'Chapter 23', '2018-11-03 06:52:39', 'He wake up early21', 1),
(8, 'Everything', '2018-11-03 06:54:25', 'All of Regrets ', 2),
(9, 'Money', '2018-11-03 06:57:03', 'WHAT IS IT', 4),
(10, 'Привет!', '2018-11-03 06:58:46', 'Доброе утро!', 4),
(11, 'Значения', '2018-11-05 20:16:08', 'Ты чувствуешь приближение зимы', 1),
(13, 'Мысли', '2018-11-05 20:17:39', 'Ты не работа', 1),
(14, 'Мысли о доме', '2018-11-05 20:17:39', 'Купить новый стол', 1),
(16, 'Деньги', '2018-11-05 20:18:29', 'Бизнес для каждого свой', 1),
(26, 'Время', '2018-11-11 07:31:47', 'Все движется', 1),
(27, '1233', '2018-11-15 15:26:54', 'Text of the Note', 1),
(30, 'привет!', '2018-11-19 02:56:21', 'Text of the Note', 1),
(31, 'Name of the Note', '2018-11-19 03:11:52', 'Text of the Note', 1),
(39, 'Name of the Note', '2018-11-19 03:54:46', 'Text of the Note', 1),
(46, 'Name of the vc', '2018-11-19 04:09:13', 'Text of the Note', 1),
(49, '132344', '2018-11-19 17:41:30', 'dsf', 1);

-- --------------------------------------------------------

--
-- Структура таблицы `user_data`
--

CREATE TABLE IF NOT EXISTS `user_data` (
  `user_id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(25) NOT NULL,
  `password` varchar(25) NOT NULL,
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `user_id` (`user_id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=30 ;

--
-- Дамп данных таблицы `user_data`
--

INSERT INTO `user_data` (`user_id`, `username`, `password`, `date`) VALUES
(1, 'JackWhite', 'whoopse', '2018-11-03 06:32:23'),
(2, 'Jim Morrison', 'Alabama', '2018-11-03 06:41:51'),
(4, 'Handshake Tom', 'marry', '2018-11-03 06:42:39'),
(5, 'Mad Joe', 'Bored', '2018-11-03 06:42:39'),
(6, 'not so', 'big', '0000-00-00 00:00:00'),
(8, 'ds', '3424', '2018-11-05 16:42:14'),
(9, 'maxima', 'kool', '2018-11-05 16:42:24'),
(16, 'jimmy', 'got', '2018-11-05 17:06:03'),
(22, 'hello', 'max', '2018-11-05 17:36:35'),
(23, 'oleg', 'test', '2018-11-06 08:24:38'),
(24, 'who', '456', '2018-12-21 15:32:26'),
(26, 'who2', '22', '2018-12-21 15:33:54'),
(27, 'adds', 'sad', '2018-12-23 07:23:10'),
(29, 's', 'SAd', '2018-12-23 07:25:08');

-- --------------------------------------------------------

--
-- Структура таблицы `user_datf`
--

CREATE TABLE IF NOT EXISTS `user_datf` (
  `user_id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_name` varchar(32) DEFAULT NULL,
  `password` varchar(32) NOT NULL,
  `email` varchar(32) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `avatar` text,
  `address` varchar(150) DEFAULT NULL,
  `timeStamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `user_id` (`user_id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `phone` (`phone`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

--
-- Ограничения внешнего ключа сохраненных таблиц
--

--
-- Ограничения внешнего ключа таблицы `note_data`
--
ALTER TABLE `note_data`
  ADD CONSTRAINT `note_data_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user_data` (`user_id`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
