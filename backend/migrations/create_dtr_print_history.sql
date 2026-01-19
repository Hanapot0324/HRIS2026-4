-- DTR Print History Table
-- This table tracks which employee DTRs have been printed for each month
-- to prevent accidental duplicate printing

CREATE TABLE IF NOT EXISTS dtr_print_history (
  id INT AUTO_INCREMENT PRIMARY KEY,
  employee_number VARCHAR(50) NOT NULL,
  year INT NOT NULL,
  month INT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  printed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  printed_by VARCHAR(50) NOT NULL,
  UNIQUE KEY unique_employee_month (employee_number, year, month),
  INDEX idx_employee (employee_number),
  INDEX idx_year_month (year, month)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
