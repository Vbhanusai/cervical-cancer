import React from 'react';

const Header = () => {
  return (
    <header className="w-full">
      <div className="container mx-auto text-center">
        <h1 className="text-2xl md:text-3xl font-bold text-medical-darkPurple mb-2">
          Cervical Cancer Detection
        </h1>
        {/* <p className="text-sm text-gray-600 max-w-xl mx-auto">
          Upload cervical cell images for instant AI analysis and cancer risk assessment. 
          Our advanced algorithms provide quick and reliable cell classification.
        </p> */}
      </div>
    </header>
  );
};

export default Header;