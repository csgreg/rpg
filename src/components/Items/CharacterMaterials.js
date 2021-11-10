import React from "react";

export default function CharacterMaterials({ imageName, count, width }) {
  return (
    <div className="mb-4">
      <img
        style={{ width }}
        className="materialImage"
        src={"https://photographydgk.com/images/" + imageName}
      />
      <br />
      {count && <span>x{count}</span>}
    </div>
  );
}
