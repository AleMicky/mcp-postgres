INSERT INTO productos (nombre, stock, precio)
VALUES
  ('Coca Cola', 20, 10.50),
  ('Pepsi', 15, 9.50),
  ('Agua', 50, 5.00)
ON CONFLICT (nombre) DO NOTHING;