CREATE OR REPLACE FUNCTION jsonb_diff (old JSONB, new JSONB) RETURNS JSONB AS $$
DECLARE
    diff JSONB;
    v RECORD;
BEGIN
    diff = '{}'::jsonb;
    FOR v IN SELECT * FROM jsonb_each(old) LOOP
        IF new @> jsonb_build_object(v.key,v.value) THEN
            new = new - v.key;
        ELSEIF new ? v.key THEN
            diff = diff || jsonb_build_object(v.key, (v.value)::text || ' -> ' || (new -> v.key)::text );
            new = new - v.key;
        ELSE
            diff = diff || jsonb_build_object(v.key,  '(-)' || (v.value)::text );
        END IF;
    END LOOP;
    FOR v IN SELECT * FROM jsonb_each(new) LOOP
        diff = diff || jsonb_build_object(v.key,  '(+)' || v.value::text );
    END LOOP;
    RETURN diff;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION jsonb_prefix_values (json_in JSONB, prefix text) RETURNS JSONB AS $$
DECLARE
    json_out JSONB;
    v RECORD;
BEGIN
    json_out = '{}'::jsonb;
    FOR v IN SELECT * FROM jsonb_each(json_in) LOOP
        json_out = json_out || jsonb_build_object(v.key,  prefix || v.value::text );
    END LOOP;
    RETURN json_out;
END;
$$ LANGUAGE plpgsql;
