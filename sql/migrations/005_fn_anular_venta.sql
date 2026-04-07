CREATE OR REPLACE FUNCTION anular_venta(p_venta_id INTEGER)
    RETURNS TABLE
            (
                ok      BOOLEAN,
                mensaje TEXT
            )
    LANGUAGE plpgsql
AS
$$
DECLARE
    v_existe INTEGER;
BEGIN
    SELECT COUNT(*)
    INTO v_existe
    FROM ventas
    WHERE id = p_venta_id;

    IF v_existe = 0 THEN
        RETURN QUERY
            SELECT FALSE, 'La venta no existe';
        RETURN;
    END IF;

    -- devolver stock
    UPDATE productos p
    SET stock = p.stock + dv.cantidad
    FROM detalle_venta dv
    WHERE dv.producto_id = p.id
      AND dv.venta_id = p_venta_id;

    -- eliminar detalle
    DELETE
    FROM detalle_venta
    WHERE venta_id = p_venta_id;

    -- eliminar venta
    DELETE
    FROM ventas
    WHERE id = p_venta_id;

    RETURN QUERY
        SELECT TRUE, 'Venta anulada correctamente';
END;
$$;