import { walk } from "@std/fs";

async function parsePlugin(filePath: string): Promise<{ id: string; name: string; description: string } | undefined> {
    try {
        const jsonData = JSON.parse(await Deno.readTextFile(filePath));
        return {
            id: jsonData.id,
            name: jsonData?.metadata?.plugin?.name,
            description: jsonData?.metadata?.plugin?.description,
        };
    } catch (error: any) {
        console.error(`Error processing ${filePath}`);
    }
}

async function main() {
    // collect all plugin.json files
    const pluginFiles = (await Array.fromAsync(
        walk(".", { maxDepth: 3, includeDirs: false, match: [/plugin\.json$/] }),
    )).map((entry) => entry.path);

    // parse them in //
    const plugins = (await Promise.all(pluginFiles.map(parsePlugin))).filter(Boolean);

    // write plugins json file
    await Deno.writeTextFile("plugins.json", JSON.stringify(plugins, null, 2));
}

await main();
