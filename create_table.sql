# CREATE SCHEMA `words` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin;

CREATE TABLE `words`.`words` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `ja` NVARCHAR(200) NOT NULL,
  `en` NVARCHAR(200) NOT NULL,
  `es` NVARCHAR(200) NOT NULL,
  `fr` NVARCHAR(200) NOT NULL,
  `done` TINYINT NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`));


INSERT INTO `words`.`words` (`ja`, `en`, `es`, `fr`, `done`) VALUES 
	(`今日`, `today`, `hoy`, `aujourd'hui`, 1);
INSERT INTO `words`.`words` (`ja`, `en`, `es`, `fr`, `done`) VALUES 
	('明日', 'tomorrow', 'mañana', "demain", 0);
INSERT INTO `words`.`words` (`ja`, `en`, `es`, `fr`, `done`) VALUES 
	('自転車', 'bicycle', 'bicicleta', "vélo", 0);

