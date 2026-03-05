const { z } = require('zod');

const updateInventorySchema = z.object({
  body: z.object({
    quantity: z.int(),
    expiration_date: z.coerce.date().optional(),
    item_id: z.uuid(),
    foster_user: z.uuid().optional(),
    staff_user: z.uuid(),
    type: z.enum(['INTAKE', 'DISTRIBUTION', 'LOAN']),
    status: z.enum(['COMPLETE', 'ACTIVE']),
    notes: z.string().optional(),
  }),
  params: z.strictObject({ id: z.uuid() }),
  query: z.object({}).optional(),
});

module.exports = updateInventorySchema;
