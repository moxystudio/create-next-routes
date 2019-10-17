const hasSubRoutes = (element) => !!element.children;
const hasSource = (element) => !!element.src;

/**
 * Builds an URL based on the element path name and prefixes its parent name.
 *
 * @param {string} element - The name of the element to be included in the url.
 * @param {string} parentElement - The name of the element's parent to be prefixed into the url.
 * @returns {string} - The url built.
 */
const buildUrl = (element, parentElement) => {
    if (parentElement) {
        return `/${parentElement}/${element}`;
    }

    return `/${element}`;
};

const buildRoute = (element, { src }, parent) => ({
    [buildUrl(element, parent)]: src,
});

/**
 * Generates recursively a list of routes with the route and entry point.
 *
 * @param {Array<Object>} previousRoutes - The routes that were previously built.
 * @param {string} routeKey - The key to build the route (usually the directory name).
 * @param {Object} topLevelRoutes - Object that contains the previous original routes.
 * @param {string} currentParent - Route string indicating to what parent should this sub-route belong.
 * @returns {Array<Object>} - Returns a list of objects containing keys with the route string and
 * their routing properties (e.g. `children` or `src`).
 */
export default function buildRoutes(previousRoutes, routeKey, topLevelRoutes, currentParent) {
    const route = topLevelRoutes[routeKey];

    if (currentParent) {
        previousRoutes = [...previousRoutes, buildRoute(routeKey, route, currentParent)];

        if (!hasSubRoutes(route)) {
            return previousRoutes;
        }
    }

    if (hasSource(route)) {
        previousRoutes = [...previousRoutes, buildRoute(routeKey, route, currentParent)];
    }

    if (hasSubRoutes(route)) {
        const parent = `${currentParent ? `${currentParent}/` : ''}${routeKey}`;

        const childRoutes = route.children.map((_route) => Object.keys(_route).reduce((prev, curr) =>
            buildRoutes(prev, curr, _route, parent), [])
        ).flat();

        return [...previousRoutes, ...childRoutes];
    }

    return previousRoutes;
}
