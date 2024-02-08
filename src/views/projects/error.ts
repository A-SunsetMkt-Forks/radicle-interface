import type { ErrorRoute, NotFoundRoute } from "@app/lib/router/definitions";
import type { ProjectRoute } from "@app/views/projects/router";

import { baseUrlToUrl } from "@app/lib/utils";
import { ResponseParseError, ResponseError } from "@httpd-client/lib/fetcher";

export function handleError(
  error: Error | ResponseParseError | ResponseError,
  route: ProjectRoute,
): NotFoundRoute | ErrorRoute {
  const url = baseUrlToUrl(route.node);
  if (error instanceof ResponseError && error.status === 404) {
    let subject;

    if (route.resource === "project.commit") {
      subject = "Commit";
    } else if (route.resource === "project.issue") {
      subject = "Issue";
    } else if (route.resource === "project.patch") {
      subject = "Patch";
    } else {
      subject = "Project";
    }

    return {
      resource: "notFound",
      params: { title: `${subject} not found` },
    };
  } else if (error instanceof ResponseError) {
    return {
      resource: "error",
      params: {
        error,
        title: "Could not load this project",
        description: `Make sure you are able to connect to the seed <a href="${url}">${url}</a>.`,
      },
    };
  } else if (error instanceof ResponseParseError) {
    return {
      resource: "error",
      params: {
        error,
        title: "Could not parse the request",
        description:
          "The response received from the seed does not match the expected schema, this is usually due to a version mismatch between the seed and the web interface.",
      },
    };
  } else {
    return {
      resource: "error",
      params: {
        error,
        title: "Could not load this project",
        description:
          "You stumbled on an unknown error, we aren't exactly sure what happened.",
      },
    };
  }
}
