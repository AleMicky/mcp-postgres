CREATE OR REPLACE FUNCTION registrar_venta(items JSONB)
    RETURNS TABLE
            (
                venta_id INTEGER,
                total    NUMERIC
            )
    LANGUAGE plpgsql
AS
$$
DECLARE
    item       JSONB;
    v_venta_id INTEGER;
    v_total    NUMERIC := 0;
    v_producto RECORD;
    v_cantidad INTEGER;
    v_subtotal NUMERIC;
BEGIN
    IF jsonb_array_length(items) = 0 THEN
        RAISE EXCEPTION 'La venta no tiene items';
    END IF;

    INSERT INTO ventas (fecha, total)
    VALUES (NOW(), 0)
    RETURNING id INTO v_venta_id;

    FOR item IN
        SELECT * FROM jsonb_array_elements(items)
        LOOP
            v_cantidad := (item ->> 'cantidad')::INTEGER;

            SELECT id, nombre, stock, precio
            INTO v_producto
            FROM productos
            WHERE id = (item ->> 'producto_id')::INTEGER;

            IF NOT FOUND THEN
                RAISE EXCEPTION 'Producto no encontrado con id %', item ->> 'producto_id';
            END IF;

            IF v_cantidad <= 0 THEN
                RAISE EXCEPTION 'Cantidad inválida para producto %', v_producto.nombre;
            END IF;

            IF v_producto.stock < v_cantidad THEN
                RAISE EXCEPTION 'Stock insuficiente para producto %', v_producto.nombre;
            END IF;

            v_subtotal := v_producto.precio * v_cantidad;
            v_total := v_total + v_subtotal;

            INSERT INTO detalle_venta (venta_id,
                                       producto_id,
                                       cantidad,
                                       precio_unitario,
                                       subtotal)
            VALUES (v_venta_id,
                    v_producto.id,
                    v_cantidad,
                    v_producto.precio,
                    v_subtotal);

            UPDATE productos
            SET stock = stock - v_cantidad
            WHERE id = v_producto.id;
        END LOOP;

    UPDATE ventas
    SET total = v_total
    WHERE id = v_venta_id;

    RETURN QUERY
        SELECT v_venta_id, v_total;
END;
$$;