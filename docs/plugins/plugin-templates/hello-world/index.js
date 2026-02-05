// Hello World Plugin - Entry Point

/**
 * Called when plugin is installed
 */
export async function onInstall(context) {
    context.log.info('Hello World plugin installed');
}

/**
 * Called when plugin becomes active
 */
export async function onActivate(context) {
    context.log.info('Hello World plugin activated');
    await context.storage.set('greeting', 'Hello, 3D Commerce!');
}

/**
 * Called when plugin is disabled
 */
export async function onDeactivate(context) {
    context.log.info('Hello World plugin deactivated');
}

/**
 * Called before plugin is removed
 */
export async function onUninstall(context) {
    context.log.info('Hello World plugin uninstalled');
    await context.storage.clear();
}
