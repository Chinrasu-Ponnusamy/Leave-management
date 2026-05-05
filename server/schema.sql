-- ============================================================
-- Employee Leave Management System — MySQL Schema Dump
-- Generated: 2026-04-14
-- ============================================================

SET FOREIGN_KEY_CHECKS = 0;
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

CREATE DATABASE IF NOT EXISTS `leave_mgmt_db`
  DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `leave_mgmt_db`;

-- -----------------------------------------------------------
-- users
-- -----------------------------------------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id`            INT          NOT NULL AUTO_INCREMENT,
  `name`          VARCHAR(100) NOT NULL,
  `email`         VARCHAR(100) NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `role`          ENUM('employee','manager','admin') NOT NULL DEFAULT 'employee',
  `dept`          VARCHAR(100) DEFAULT NULL,
  `created_at`    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_users_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------------
-- leave_types
-- -----------------------------------------------------------
DROP TABLE IF EXISTS `leave_types`;
CREATE TABLE `leave_types` (
  `id`                INT         NOT NULL AUTO_INCREMENT,
  `type_name`         VARCHAR(50) NOT NULL,
  `max_days_per_year` INT         NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_leave_types_name` (`type_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------------
-- leave_requests
-- -----------------------------------------------------------
DROP TABLE IF EXISTS `leave_requests`;
CREATE TABLE `leave_requests` (
  `id`            INT  NOT NULL AUTO_INCREMENT,
  `employee_id`   INT  NOT NULL,
  `leave_type_id` INT  NOT NULL,
  `from_date`     DATE NOT NULL,
  `to_date`       DATE NOT NULL,
  `reason`        TEXT,
  `status`        ENUM('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  `approved_by`   INT  DEFAULT NULL,
  `created_at`    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_lr_employee`   (`employee_id`),
  KEY `idx_lr_leave_type` (`leave_type_id`),
  KEY `idx_lr_status`     (`status`),
  CONSTRAINT `fk_lr_employee`    FOREIGN KEY (`employee_id`)  REFERENCES `users`(`id`)       ON DELETE CASCADE,
  CONSTRAINT `fk_lr_leave_type`  FOREIGN KEY (`leave_type_id`) REFERENCES `leave_types`(`id`) ON DELETE RESTRICT,
  CONSTRAINT `fk_lr_approved_by` FOREIGN KEY (`approved_by`) REFERENCES `users`(`id`)         ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------------
-- leave_balances
-- -----------------------------------------------------------
DROP TABLE IF EXISTS `leave_balances`;
CREATE TABLE `leave_balances` (
  `id`            INT  NOT NULL AUTO_INCREMENT,
  `employee_id`   INT  NOT NULL,
  `leave_type_id` INT  NOT NULL,
  `year`          YEAR NOT NULL,
  `total_days`    INT  NOT NULL DEFAULT 0,
  `used_days`     INT  NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_balance` (`employee_id`,`leave_type_id`,`year`),
  CONSTRAINT `fk_lb_employee`   FOREIGN KEY (`employee_id`)   REFERENCES `users`(`id`)       ON DELETE CASCADE,
  CONSTRAINT `fk_lb_leave_type` FOREIGN KEY (`leave_type_id`) REFERENCES `leave_types`(`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

SET FOREIGN_KEY_CHECKS = 1;

-- -----------------------------------------------------------
-- Seed Data
-- -----------------------------------------------------------
INSERT INTO `leave_types` (`type_name`,`max_days_per_year`) VALUES
  ('Casual',12),('Sick',10),('Earned',15);

-- Passwords are bcrypt of "password123"
INSERT INTO `users` (`name`,`email`,`password_hash`,`role`,`dept`) VALUES
  ('Alice Admin',   'admin@company.com',   '$2b$12$KIXaH1I3L9l2yRdpfKbMSe3tG5Gm1UQpABCDEFGHIJKLMNOPQRSTUV','admin',   'HR'),
  ('Mark Manager',  'manager@company.com', '$2b$12$KIXaH1I3L9l2yRdpfKbMSe3tG5Gm1UQpABCDEFGHIJKLMNOPQRSTUV','manager', 'Engineering'),
  ('Eve Employee',  'employee@company.com','$2b$12$KIXaH1I3L9l2yRdpfKbMSe3tG5Gm1UQpABCDEFGHIJKLMNOPQRSTUV','employee','Engineering');

INSERT INTO `leave_balances` (`employee_id`,`leave_type_id`,`year`,`total_days`,`used_days`) VALUES
  (3,1,2026,12,2),(3,2,2026,10,0),(3,3,2026,15,5);

INSERT INTO `leave_requests` (`employee_id`,`leave_type_id`,`from_date`,`to_date`,`reason`,`status`,`approved_by`) VALUES
  (3,1,'2026-03-10','2026-03-11','Personal work','approved',2),
  (3,3,'2026-02-01','2026-02-05','Vacation','approved',2),
  (3,1,'2026-04-20','2026-04-21','Family event','pending',NULL);

-- -----------------------------------------------------------
-- Stored Procedure: sp_approve_leave
-- -----------------------------------------------------------
DELIMITER $$
DROP PROCEDURE IF EXISTS `sp_approve_leave`$$
CREATE PROCEDURE `sp_approve_leave`(
  IN  p_request_id INT,
  IN  p_manager_id INT,
  OUT p_result     VARCHAR(100)
)
BEGIN
  DECLARE v_emp_id    INT;
  DECLARE v_type_id   INT;
  DECLARE v_from_date DATE;
  DECLARE v_to_date   DATE;
  DECLARE v_days      INT;
  DECLARE v_used      INT;
  DECLARE v_total     INT;
  DECLARE v_year      YEAR;
  DECLARE v_status    VARCHAR(20);

  SELECT employee_id,leave_type_id,from_date,to_date,status
    INTO v_emp_id,v_type_id,v_from_date,v_to_date,v_status
    FROM leave_requests WHERE id=p_request_id;

  IF v_status != 'pending' THEN
    SET p_result = 'ERROR: Request is not pending';
  ELSE
    SET v_days = DATEDIFF(v_to_date,v_from_date)+1;
    SET v_year = YEAR(v_from_date);
    SELECT used_days,total_days INTO v_used,v_total
      FROM leave_balances
     WHERE employee_id=v_emp_id AND leave_type_id=v_type_id AND year=v_year;
    IF (v_used+v_days) > v_total THEN
      SET p_result = 'ERROR: Insufficient leave balance';
    ELSE
      UPDATE leave_requests SET status='approved',approved_by=p_manager_id WHERE id=p_request_id;
      UPDATE leave_balances SET used_days=used_days+v_days
       WHERE employee_id=v_emp_id AND leave_type_id=v_type_id AND year=v_year;
      SET p_result = 'SUCCESS';
    END IF;
  END IF;
END$$
DELIMITER ;

-- -----------------------------------------------------------
-- View: v_leave_summary
-- -----------------------------------------------------------
CREATE OR REPLACE VIEW `v_leave_summary` AS
SELECT lr.id AS request_id, u.name AS employee_name, u.dept,
       lt.type_name AS leave_type, lr.from_date, lr.to_date,
       DATEDIFF(lr.to_date,lr.from_date)+1 AS days_requested,
       lr.reason, lr.status, mgr.name AS approved_by_name, lr.created_at
FROM leave_requests lr
JOIN users       u   ON u.id   = lr.employee_id
JOIN leave_types lt  ON lt.id  = lr.leave_type_id
LEFT JOIN users  mgr ON mgr.id = lr.approved_by
ORDER BY lr.created_at DESC;
