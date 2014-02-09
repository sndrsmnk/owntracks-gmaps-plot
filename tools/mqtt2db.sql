DROP TABLE IF EXISTS `owntracks`;

CREATE TABLE `owntracks` (
    `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
    `device` varchar(20) NOT NULL,
    `lat` float NOT NULL,
    `lon` float NOT NULL,
    `acc` float NOT NULL,
    `batt` int(1) NOT NULL,
    `tst` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `id` (`id`),
    KEY `device` (`device`)
) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET=utf8;
