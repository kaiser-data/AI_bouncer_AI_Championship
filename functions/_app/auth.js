"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = exports.verify = void 0;
const auth_1 = require("@liquidmetal-ai/raindrop-framework/core/auth");
/**
 * verify is the application-wide JWT verification hook.
 * @param request The incoming request object.
 * @param env The handler environment object.
 *  **Note**: adds `jwt` property to `env` if verification is successful.
 * @returns true to allow request to continue.
 */
exports.verify = auth_1.verifyIssuer;
/**
 * authorize is the application-wide authorization hook.
 * @param request The incoming request object.
 * @param env The handler environment object with env.jwt set by verify.
 * @returns true if authorized, false otherwise.
 */
exports.authorize = auth_1.requireAuthenticated;
