DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `id` varchar(45) NOT NULL,
  `email_address` varchar(100) NOT NULL,
  `first_name` varchar(50) DEFAULT NULL,
  `last_name` varchar(50) DEFAULT NULL,
  `account_created` timestamp(6) NULL DEFAULT NULL,
  `account_updated` timestamp(6) NULL DEFAULT NULL,
  `password` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;