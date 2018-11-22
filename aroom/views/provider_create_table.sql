CREATE TABLE `provider` (
  `id` int(50) NOT NULL AUTO_INCREMENT,
  `operator_id` int(11) DEFAULT NULL,
  `item` varchar(30) NOT NULL,
  `title` varchar(50) NOT NULL,
  `address` varchar(100) NOT NULL,
  `phone` int(20) DEFAULT NULL,
  `price_min` int(5) NOT NULL,
  `price_max` int(5) NOT NULL,
  `description` text,
  `created` datetime NOT NULL,
  PRIMARY KEY (`id`)
);