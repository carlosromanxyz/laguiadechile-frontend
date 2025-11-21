import { ImageResponse } from "next/og";

/**
 * Favicon icon generator for La Guía de Chile
 *
 * This creates a static version of the LDCLogo isotipo:
 * - Pink background (brand color)
 * - Orange decorative circles (simplified, non-animated)
 * - White map pin icon
 *
 * Generated at build time and cached for optimal performance
 *
 * Note: Using simplified approach compatible with Satori (ImageResponse engine)
 * Satori doesn't support blur filters, so we use solid circles with opacity
 */

// Icon dimensions - standard favicon size
export const size = {
  width: 32,
  height: 32,
};

export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          borderRadius: "20%",
          overflow: "hidden",
          // Pink background
          background: "#ff006e",
        }}
      >
        {/* Orange decorative circles - creating lava lamp effect */}
        <div
          style={{
            position: "absolute",
            width: "20px",
            height: "20px",
            borderRadius: "50%",
            background: "#fd9809",
            top: "2px",
            left: "2px",
            opacity: 0.4,
            display: "flex",
          }}
        />

        <div
          style={{
            position: "absolute",
            width: "24px",
            height: "24px",
            borderRadius: "50%",
            background: "#fd9809",
            bottom: "0px",
            right: "0px",
            opacity: 0.3,
            display: "flex",
          }}
        />

        <div
          style={{
            position: "absolute",
            width: "16px",
            height: "16px",
            borderRadius: "50%",
            background: "#fd9809",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            opacity: 0.25,
            display: "flex",
          }}
        />

        {/* Map Pin Icon - Simplified */}
        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "24px",
            color: "white",
          }}
        >
          📍
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
