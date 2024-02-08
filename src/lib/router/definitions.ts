import type { HomeRoute, HomeLoadedRoute } from "@app/views/home/router";
import type {
  ResponseParseError,
  ResponseError,
} from "@httpd-client/lib/fetcher";
import type {
  ProjectLoadedRoute,
  ProjectRoute,
} from "@app/views/projects/router";
import type { NodesRoute, NodesLoadedRoute } from "@app/views/nodes/router";

import { loadHomeRoute } from "@app/views/home/router";
import { loadProjectRoute } from "@app/views/projects/router";
import { loadNodeRoute } from "@app/views/nodes/router";

interface BootingRoute {
  resource: "booting";
}

export interface NotFoundRoute {
  resource: "notFound";
  params: { title: string };
}

interface SessionRoute {
  resource: "session";
  params: {
    id: string;
    signature: string;
    publicKey: string;
    apiAddr: string;
    path?: string;
  };
}

export interface ErrorRoute {
  resource: "error";
  params: {
    title: string;
    description: string;
    error: Error | ResponseError | ResponseParseError;
  };
}

export type Route =
  | BootingRoute
  | HomeRoute
  | ErrorRoute
  | NotFoundRoute
  | ProjectRoute
  | NodesRoute
  | SessionRoute;

export type LoadedRoute =
  | BootingRoute
  | HomeLoadedRoute
  | ErrorRoute
  | NotFoundRoute
  | ProjectLoadedRoute
  | NodesLoadedRoute
  | SessionRoute;

export async function loadRoute(route: Route): Promise<LoadedRoute> {
  if (route.resource === "nodes") {
    return await loadNodeRoute(route.params);
  } else if (route.resource === "home") {
    return await loadHomeRoute();
  } else if (
    route.resource === "project.source" ||
    route.resource === "project.history" ||
    route.resource === "project.commit" ||
    route.resource === "project.issues" ||
    route.resource === "project.newIssue" ||
    route.resource === "project.issue" ||
    route.resource === "project.patches" ||
    route.resource === "project.patch"
  ) {
    return await loadProjectRoute(route);
  } else {
    return route;
  }
}
