/**
 * KRYPHIX SECURITY ENTROPY SCRIPT (security-entropy.js)
 * First-Party Stealth Device Fingerprinting & Entropy Harvester
 * Ekstraksi sidik jari perangkat keras tanpa melanggar privasi pengguna publik.
 */

(function () {
    'use strict';

    function getCanvasFingerprint() {
        try {
            var canvas = document.createElement('canvas');
            canvas.width = 200;
            canvas.height = 50;
            var ctx = canvas.getContext('2d');
            if (!ctx) return 'no-canvas';
            ctx.textBaseline = 'top';
            ctx.font = '14px Arial';
            ctx.fillStyle = '#f60';
            ctx.fillRect(125, 1, 62, 20);
            ctx.fillStyle = '#069';
            ctx.fillText('KRYPHIX_SEC_2026', 2, 15);
            ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
            ctx.fillText('KRYPHIX_SEC_2026', 4, 17);
            return hashString(canvas.toDataURL());
        } catch (e) {
            return 'canvas-err';
        }
    }

    function getWebGLFingerprint() {
        try {
            var canvas = document.createElement('canvas');
            var gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
            if (!gl) return 'no-webgl';
            var debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
            if (!debugInfo) return 'no-webgl-debug';
            var vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) || '';
            var renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || '';
            return hashString(vendor + '~~~' + renderer);
        } catch (e) {
            return 'webgl-err';
        }
    }

    function hashString(str) {
        var hash = 0;
        if (str.length === 0) return '0';
        for (var i = 0; i < str.length; i++) {
            var char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return Math.abs(hash).toString(16);
    }

    function harvestAndSend() {
        var screenRes = window.screen.width + 'x' + window.screen.height + 'x' + window.screen.colorDepth;
        var canvasFp = getCanvasFingerprint();
        var webglFp = getWebGLFingerprint();
        var cpuCores = navigator.hardwareConcurrency || 2;
        var deviceMemory = navigator.deviceMemory || 4;
        var timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
        var combinedFp = hashString(screenRes + '|' + canvasFp + '|' + webglFp + '|' + cpuCores + '|' + timezone);

        var payload = {
            fingerprintHash: combinedFp,
            canvasHash: canvasFp,
            webglHash: webglFp,
            screenResolution: screenRes,
            cpuCores: cpuCores,
            deviceMemory: deviceMemory,
            timezone: timezone,
            pageUrl: window.location.href,
            referrerUrl: document.referrer || null,
            timestamp: new Date().toISOString()
        };

        // Kirim via sendBeacon (tidak memblokir rendering halaman)
        if (navigator.sendBeacon) {
            navigator.sendBeacon('/api/v1/telemetry/heartbeat', JSON.stringify(payload));
        } else {
            fetch('/api/v1/telemetry/heartbeat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
                keepalive: true
            }).catch(function () {});
        }
    }

    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        setTimeout(harvestAndSend, 500);
    } else {
        window.addEventListener('DOMContentLoaded', function () {
            setTimeout(harvestAndSend, 500);
        });
    }
})();

