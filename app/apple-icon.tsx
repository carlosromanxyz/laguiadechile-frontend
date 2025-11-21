import { ImageResponse } from "next/og";

/**
 * Apple Touch Icon for La Guía de Chile
 *
 * This creates a high-resolution version of the isotipo
 * for iOS home screens and bookmarks.
 *
 * Standard size: 180x180px
 *
 * Note: Using simplified approach compatible with Satori (ImageResponse engine)
 * Satori doesn't support blur filters, so we use solid circles with opacity
 */

export const size = {
  width: 180,
  height: 180,
};

export const contentType = "image/png";

export default function AppleIcon() {
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
          borderRadius: "22.5%", // iOS app icon style
          overflow: "hidden",
          // Pink background
          background: "#ff006e",
        }}
      >
        {/* Orange decorative circles - creating lava lamp effect */}
        <div
          style={{
            position: "absolute",
            width: "110px",
            height: "110px",
            borderRadius: "50%",
            background: "#fd9809",
            top: "10px",
            left: "10px",
            opacity: 0.4,
            display: "flex",
          }}
        />

        <div
          style={{
            position: "absolute",
            width: "130px",
            height: "130px",
            borderRadius: "50%",
            background: "#fd9809",
            bottom: "10px",
            right: "10px",
            opacity: 0.3,
            display: "flex",
          }}
        />

        <div
          style={{
            position: "absolute",
            width: "90px",
            height: "90px",
            borderRadius: "50%",
            background: "#fd9809",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            opacity: 0.25,
            display: "flex",
          }}
        />

        {/* Map Pin Icon */}
        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "120px",
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
