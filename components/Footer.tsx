import React from "react";

const Footer = () => {
  return (
    <div className="py-6">
      <p className="text-center font-bold text-base text-secondary-foreground">
        Copyright &copy; {new Date().getFullYear()} Skillable
      </p>
    </div>
  );
};

export default Footer;
