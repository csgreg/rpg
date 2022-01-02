import React from "react";

export function DropDownMenu({ submenus }) {
  console.log(submenus);
  function DropDownItem(props) {
    return (
      <a href="#" className="menu-item">
        {props.children}
      </a>
    );
  }
  return (
    <div className="dropdown">
      {submenus.map((e) => (
        <DropDownItem>{e}</DropDownItem>
      ))}
    </div>
  );
}
