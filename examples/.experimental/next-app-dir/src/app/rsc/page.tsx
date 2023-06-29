import { Button } from '~/components/button';
import { JsonPreTag } from '~/components/json-pretag';
import { api } from '~/trpc/server-invoker';
import { Suspense } from 'react';
import { ServerHttpGreeting } from './ServerHttpGreeting';
import { ServerInvokedGreeting } from './ServerInvokedGreeting';

async function AuthThing() {
  const me = await api.me.query();

  return (
    <div>
      <h3 className="text-lg font-semibold">Session</h3>
      <p>
        This session comes from a tRPC query. No context provider is necessary
        to authenticate your users on the server.
      </p>
      <JsonPreTag object={me} />
    </div>
  );
}

export default async function Home() {
  return (
    <div className="space-y-4">
      <div className="prose">
        <h2>React Server Components</h2>
        <p>
          Below you can see 2 examples of different ways to fetch data in server
          components with tRPC. Both are using the new Next.js Cache to cache
          the response on the server. Try refreshing the page (CMD+R) and you
          should get a cached response. Force a refresh (CMD+SHIFT+R) and you
          should get a fresh response from the server.
        </p>
        <p>
          We&apos;re using <code>{`<Suspense>`}</code>, meaning responses are
          streamed in after the initial HTML, and using the built-in `fallback`
          prop to render the loading state while the queries are fetching.
        </p>
      </div>

      <AuthThing />

      <div className="space-y-2">
        <h3 className="text-lg font-semibold">
          HTTP request from server component
        </h3>
        <p>
          You can use our new <code>{`experiemental_nextHttpLink`}</code> to
          call your procedures over HTTP, just like you normally would in the
          old model. We&apos;ll automatically handle the cache tags for you.
          Fetching over HTTP can be useful if you have multiple clients and
          still need the API exposed, or you may want to render your components
          on an edge runtime, but your server functions requires Node
          primitives.
        </p>
        <Suspense
          fallback={
            <JsonPreTag object={{ loading: true, requester: 'http client' }} />
          }
        >
          <ServerHttpGreeting />
        </Suspense>
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-semibold">
          Direct procedure invocation from server component
        </h3>
        <p>
          Alternatively, you can call your procedures directly from the server
          using the new <code>{`experiemental_nextCacheLink`}</code>. This
          let&apos;s you still write tRPC procedures and take advantage of the
          powerful middleware and procedure builders that tRPC provides, but
          skip the HTTP layer for even faster query times.
        </p>
        <Suspense
          fallback={
            <JsonPreTag
              object={{
                loading: true,
                requester: 'direct procedure invocation',
              }}
            />
          }
        >
          <ServerInvokedGreeting />
        </Suspense>
      </div>
      <form
        action={async () => {
          'use server';
          await api.greeting.revalidate({
            text: 'i never hit an api endpoint',
          });
        }}
      >
        <Button type="submit">Revalidate all</Button>
      </form>
    </div>
  );
}