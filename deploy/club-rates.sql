-- Update the initial studio rates without overwriting any admin edits.
UPDATE settings
SET data = jsonb_set(
  data,
  '{rates}',
  '{"resident":{"3":160000,"6":300000,"12":420000},"guest":{"3":200000,"6":350000,"12":500000}}'::jsonb
)
WHERE id = 1
  AND data->'rates' = '{"resident":{"3":150000,"6":250000,"12":400000},"guest":{"3":200000,"6":320000,"12":500000}}'::jsonb;
