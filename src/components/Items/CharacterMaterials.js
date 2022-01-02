import React from "react";

export default function CharacterMaterials({
  imageName,
  count,
  width,
  marginTop,
  margin,
  temporaryImage,
}) {
  return (
    <div className="mb-4">
      {imageName && (
        <img
          style={{ width, marginTop, margin }}
          className="materialImage"
          src={imageName}
        />
      )}
      {!imageName && (
        <div
          className="materialImage"
          style={{
            width,
            height: width,
            marginTop,
            margin,
            backgroundColor: "rgba(52, 52, 52, 0.5)",
          }}
        >
          {temporaryImage && (
            <img style={{ width, opacity: 0.3 }} src={temporaryImage}></img>
          )}
        </div>
      )}
      <br />
      {count && <span>x{count}</span>}
    </div>
  );
}
