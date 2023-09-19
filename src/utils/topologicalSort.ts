import type { Dict, Package } from '@types';

/**
 * This is used to sort the packages into the order they need to be released.
 * This is entirely based upon their usages in the other packages.json files.
 */

// export const topologicalSort = (packages: Dict<Package>): Dict<Package> => {
//     const visited: Set<string> = new Set();
//     const stack: string[] = [];

//     const graph: Map<string, Set<string>> = new Map();

//     Object.keys(packages).forEach(packageName => {
//         graph.set(packageName, new Set());
//     });

//     Object.values(packages).forEach((pkg) => {
//         pkg.dependenciesList.forEach((dependency: string) => {
//             if (graph.has(dependency)) {
//                 graph.get(pkg.name)?.add(dependency);
//             }
//         });
//     })

//     const visit = (packageName: string) => {
//         if (!visited.has(packageName)) {
//             visited.add(packageName);
//             graph.get(packageName)?.forEach(visit);
//             stack.push(packageName);
//         }
//     };

//     [...graph.keys()].forEach(visit);
//     return stack.reverse().reduce((curr: Dict<Package>, packageName: string) => ({ ...curr, [packageName]: packages[packageName] }), {});
// }

export const topologicalSort = (packages: Dict<Package>): Dict<Package> => {
    const visited: Set<string> = new Set();

    const graph: Map<string, Set<string>> = new Map();

    Object.keys(packages).forEach(packageName => {
        graph.set(packageName, new Set());
    });

    for (const [pkgName, pkg] of Object.entries(packages)) {
        for (const dependency of pkg.dependenciesList) {
            if (graph.has(dependency)) {
                graph.get(pkgName)?.add(dependency);
            }
        }
    }

    // Now for every item in the graph, we will update its corresponding package
    // to include the packages that depend on it.
    for (const [pkgName, pkg] of Object.entries(packages)) {
        for (const [depName, dep] of Object.entries(packages)) {
            if (dep.dependenciesList.includes(pkgName)) {
                pkg.dependents.push(depName);
            }
        }
    }

    return packages
}