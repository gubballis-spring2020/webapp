DROP TABLE IF EXISTS `users`;
DROP TABLE IF EXISTS `bills`;

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


CREATE TABLE `bills` (
  `id` varchar(50) NOT NULL,
  `created_ts` timestamp(6) NULL DEFAULT NULL,
  `updated_ts` timestamp(6) NULL DEFAULT NULL,
  `owner_id` varchar(50) DEFAULT NULL,
  `vendor` varchar(45) DEFAULT NULL,
  `bill_date` date DEFAULT NULL,
  `due_date` date DEFAULT NULL,
  `amount_due` decimal(10,2) DEFAULT NULL,
  `paymentStatus` enum('paid','due',' past_due','no_payment_required') DEFAULT NULL,
  `categories` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `MyUniqueConstraint` CHECK ((`amount_due` >= 0.01))
) ENGINE=InnoDB;