import React, { useState, useRef } from 'react';
import './App.css';

const App = () => {
  return (
    <div className="app-container">
      <header className="App-header">
        <button className="button top-button" id="join-bags" onClick={() => window.location.href = 'https://bags.fm/0xdoncarlo'}>
          JOIN BAGS
        </button>
        <img src="/images/BagsOG_Logo_Header.png" alt="BagsOG Logo" className="App-logo" />
        <ShareButton />
      </header>
      <div className="main-content">
        <UploadPFP />
        <DownloadButton />
      </div>
    </div>
  );
};

const UploadPFP = () => {
  const [image, setImage] = useState(null);
  const [showOg, setShowOg] = useState(false);
  const [showSliders, setShowSliders] = useState(false);
  const [ogPosition, setOgPosition] = useState({ x: 0, y: 0, scale: 1 });
  const fileInputRef = useRef(null);

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 400;
        canvas.height = 400;
        context.drawImage(img, 0, 0, 400, 400);
        const resizedImage = canvas.toDataURL('image/png');
        setImage(resizedImage);
        setShowOg(false); // Reset OG overlay when a new image is uploaded
        setShowSliders(false); // Hide sliders if a new image is uploaded
      };
      img.src = URL.createObjectURL(file);
    }
  };

  const handleGetOgClick = () => {
    setShowOg(true);
  };

  const handleSliderChange = (axis, value) => {
    setOgPosition((prev) => ({ ...prev, [axis]: value }));
  };

  const toggleSliders = () => {
    setShowSliders((prev) => !prev);
  };

  return (
    <div className={`upload-pfp ${showSliders ? 'sliders-visible' : showOg ? 'og-visible' : ''}`}>
      <div id="capture" className="image-container">
        <img src={image || '/images/placeholder.png'} alt="Uploaded PFP" className="uploaded-image" id="uploaded-image" />
        <img src="/images/circle_layer.png" alt="Circle Layer" className="circle-layer" id="circle-layer" />
        {showOg && (
          <img
            src="/images/og.png"
            alt="OG Overlay"
            className="og-overlay"
            id="og-overlay"
            style={{
              transform: `translate(${ogPosition.x}%, ${ogPosition.y}%) scale(${ogPosition.scale})`,
              transformOrigin: 'center',
            }}
          />
        )}
      </div>
      <button className="button" onClick={handleButtonClick}>
        UPLOAD PFP
      </button>
      {image && (
        <>
          <button className="button" onClick={handleGetOgClick}>
            GET OG
          </button>
          {showOg && (
            <>
              <button className="button" onClick={toggleSliders}>
                SCALE
              </button>
              {showSliders && (
                <div className="slider-container">
                  <div className="slider">
                    <label>MOVE X</label>
                    <input
                      type="range"
                      min="-100"
                      max="100"
                      value={ogPosition.x}
                      onChange={(e) => handleSliderChange('x', parseInt(e.target.value))}
                    />
                  </div>
                  <div className="slider">
                    <label>MOVE Y</label>
                    <input
                      type="range"
                      min="-100"
                      max="100"
                      value={ogPosition.y}
                      onChange={(e) => handleSliderChange('y', parseInt(e.target.value))}
                    />
                  </div>
                  <div className="slider">
                    <label>MOVE Z</label>
                    <input
                      type="range"
                      min="0.5"
                      max="2"
                      step="0.01"
                      value={ogPosition.scale}
                      onChange={(e) => handleSliderChange('scale', parseFloat(e.target.value))}
                    />
                  </div>
                </div>
              )}
            </>
          )}
        </>
      )}
      <input
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        ref={fileInputRef}
        onChange={handleFileChange}
      />
    </div>
  );
};

const DownloadButton = () => {
  const downloadImage = () => {
    const uploadedImage = document.getElementById('uploaded-image');
    const circleLayer = document.getElementById('circle-layer');
    const ogOverlay = document.getElementById('og-overlay');

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    const imageWidth = uploadedImage.naturalWidth;
    const imageHeight = uploadedImage.naturalHeight;

    canvas.width = imageWidth;
    canvas.height = imageHeight;

    context.drawImage(uploadedImage, 0, 0, imageWidth, imageHeight);
    context.drawImage(circleLayer, 0, 0, imageWidth, imageHeight);

    if (ogOverlay) {
      const ogImage = new Image();
      ogImage.onload = () => {
        const ogRect = ogOverlay.getBoundingClientRect();
        const containerRect = document.getElementById('capture').getBoundingClientRect();

        const scaleX = imageWidth / containerRect.width;
        const scaleY = imageHeight / containerRect.height;

        const ogX = (ogRect.left - containerRect.left) * scaleX;
        const ogY = (ogRect.top - containerRect.top) * scaleY;
        const ogWidth = ogRect.width * scaleX;
        const ogHeight = ogRect.height * scaleY;

        context.drawImage(ogImage, ogX, ogY, ogWidth, ogHeight);

        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = 'profile.png';
        link.click();
      };
      ogImage.src = ogOverlay.src;
    } else {
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = ('profile.png');
      link.click();
    }
  };

  return (
    <button className="button download-button" onClick={downloadImage}>
      DOWNLOAD
    </button>
  );
};

const ShareButton = () => {
  const handleShareClick = () => {
    const uploadedImage = document.getElementById('uploaded-image');
    const circleLayer = document.getElementById('circle-layer');
    const ogOverlay = document.getElementById('og-overlay');

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    const imageWidth = uploadedImage.naturalWidth;
    const imageHeight = uploadedImage.naturalHeight;

    canvas.width = imageWidth;
    canvas.height = imageHeight;

    context.drawImage(uploadedImage, 0, 0, imageWidth, imageHeight);
    context.drawImage(circleLayer, 0, 0, imageWidth, imageHeight);

    if (ogOverlay) {
      const ogImage = new Image();
      ogImage.onload = () => {
        const ogRect = ogOverlay.getBoundingClientRect();
        const containerRect = document.getElementById('capture').getBoundingClientRect();

        const scaleX = imageWidth / containerRect.width;
        const scaleY = imageHeight / containerRect.height;

        const ogX = (ogRect.left - containerRect.left) * scaleX;
        const ogY = (ogRect.top - containerRect.top) * scaleY;
        const ogWidth = ogRect.width * scaleX;
        const ogHeight = ogRect.height * scaleY;

        context.drawImage(ogImage, ogX, ogY, ogWidth, ogHeight);

        const dataUrl = canvas.toDataURL('image/png');

        const tweetText = "Get your @bagsapp OG PFP\nogbags.xyz\n*paste your generated PFP*";
        const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;
        window.open(tweetUrl, '_blank');
      };
      ogImage.src = ogOverlay.src;
    } else {
      const tweetText = "GET YOUR OG PFP NOW ON ogbags.xyz\n*paste your OG PFP*";
      const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;
      window.open(tweetUrl, '_blank');
    }
  };

  return (
    <button className="button top-button" onClick={handleShareClick}>
      SHARE
    </button>
  );
};

export default App;
