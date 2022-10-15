/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {

    'GET /api/v1/vpn': { action: "vpn/read-vpn" },

    'POST /api/v1/findFile': { action: "files-handle/receive-file" },

    'POST /api/v1/uploadFile': {
        action: "files-handle/upload-file",
        // cors: {
        //     allRoutes: true,
        //     allowOrigins: '*',
        //     allowCredentials: false
        // }
    }

};
