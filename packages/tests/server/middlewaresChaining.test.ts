import { createProcedureExtension } from '@trpc/server/core/middleware';
import { TRPCError, initTRPC } from '@trpc/server/src';
import { z } from 'zod';

test('middleware', () => {
  const t = initTRPC.context<{ userId: string }>().create();

  const experimentalExtension = createProcedureExtension((proc) => {
    return proc.input(z.object({ orgId: z.number() })).use(({ next }) => {
      return next({
        ctx: {
          orgPermitted: true,
        },
      });
    });
  });

  t.procedure
    .input(z.object({ name: z.string() }))
    .extend(experimentalExtension)
    .input(z.object({ name2: z.string() }))
    .query((opts) => {
      opts.input.name;
      // @ts-expect-error string can't be a boolean
      const name = opts.input.name as boolean;

      opts.input.orgId;
      // @ts-expect-error number can't be a boolean
      const orgId = opts.input.orgId as boolean;

      opts.input.name2;
      // @ts-expect-error string can't be a boolean
      const name2 = opts.input.name2 as boolean;

      opts.ctx.orgPermitted;
      // @ts-expect-error boolean can't be a string
      const orgOk = opts.ctx.orgPermitted as string;

      opts.ctx.userId;
      // @ts-expect-error number can't be a boolean
      const userId = opts.ctx.userId as boolean;

      if (!orgOk) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: `User ${userId} does not have access to ${orgId}`,
        });
      }

      return `Hello, ${name} from org ${orgId}`;
    });

  t.procedure
    .input(z.object({ name: z.string() }))
    .extend((proc) => {
      return proc.input(z.object({ orgId: z.number() })).use(({ next }) => {
        return next({
          ctx: {
            orgPermitted: true,
          },
        });
      });
    })
    .input(z.object({ name2: z.string() }))
    .query((opts) => {
      opts.input.name;
      // @ts-expect-error string can't be a boolean
      const name = opts.input.name as boolean;

      opts.input.orgId;
      // @ts-expect-error number can't be a boolean
      const orgId = opts.input.orgId as boolean;

      opts.input.name2;
      // @ts-expect-error string can't be a boolean
      const name2 = opts.input.name2 as boolean;

      opts.ctx.orgPermitted;
      // @ts-expect-error boolean can't be a string
      const orgOk = opts.ctx.orgPermitted as string;

      opts.ctx.userId;
      // @ts-expect-error number can't be a boolean
      const userId = opts.ctx.userId as boolean;

      if (!orgOk) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: `User ${userId} does not have access to ${orgId}`,
        });
      }

      return `Hello, ${name} from org ${orgId}`;
    });
});